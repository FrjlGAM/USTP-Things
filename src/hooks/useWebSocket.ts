import { useState, useEffect, useRef, useCallback } from 'react';

type WebSocketMessage = string | ArrayBuffer | Blob | ArrayBufferView;

type WebSocketOptions = {
  /**
   * Whether to automatically connect to the WebSocket (default: true)
   */
  autoConnect?: boolean;
  
  /**
   * Whether to automatically reconnect if the connection is lost (default: true)
   */
  reconnect?: boolean;
  
  /**
   * The number of milliseconds to wait before attempting to reconnect (default: 3000)
   */
  reconnectInterval?: number;
  
  /**
   * The maximum number of reconnect attempts (default: 5)
   */
  maxReconnectAttempts?: number;
  
  /**
   * The WebSocket protocols to use
   */
  protocols?: string | string[];
  
  /**
   * Whether to use binary type 'arraybuffer' instead of 'blob' (default: false)
   */
  binaryType?: 'blob' | 'arraybuffer';
  
  /**
   * Callback when the WebSocket connection is opened
   */
  onOpen?: (event: Event) => void;
  
  /**
   * Callback when a message is received
   */
  onMessage?: (event: MessageEvent) => void;
  
  /**
   * Callback when the WebSocket connection is closed
   */
  onClose?: (event: CloseEvent) => void;
  
  /**
   * Callback when an error occurs
   */
  onError?: (event: Event) => void;
  
  /**
   * Callback when reconnection is attempted
   */
  onReconnect?: (attempt: number) => void;
  
  /**
   * Callback when max reconnection attempts are reached
   */
  onMaxReconnectAttempts?: () => void;
};

/**
 * A hook to manage a WebSocket connection
 * 
 * @param {string | (() => string)} url - The WebSocket URL or a function that returns the URL
 * @param {WebSocketOptions} options - Configuration options
 * @returns {Object} WebSocket state and methods
 */
export function useWebSocket(
  url: string | (() => string),
  options: WebSocketOptions = {}
) {
  const {
    autoConnect = true,
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    protocols,
    binaryType = 'blob',
    onOpen,
    onMessage,
    onClose,
    onError,
    onReconnect,
    onMaxReconnectAttempts,
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [error, setError] = useState<Event | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number>();
  const reconnectAttemptsRef = useRef(0);
  const isMounted = useRef(true);
  
  // Create the WebSocket connection
  const connect = useCallback(() => {
    if (!isMounted.current) return;
    
    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    // Reset reconnect attempts if we're manually connecting
    if (reconnectAttemptsRef.current > 0) {
      reconnectAttemptsRef.current = 0;
      setReconnectAttempts(0);
    }
    
    // Get the URL (handle both string and function)
    const wsUrl = typeof url === 'function' ? url() : url;
    
    try {
      // Create the WebSocket instance
      wsRef.current = protocols 
        ? new WebSocket(wsUrl, protocols)
        : new WebSocket(wsUrl);
      
      // Set binary type
      wsRef.current.binaryType = binaryType;
      
      // Set up event listeners
      wsRef.current.onopen = (event) => {
        if (!isMounted.current) return;
        
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        setReconnectAttempts(0);
        
        if (onOpen) {
          onOpen(event);
        }
      };
      
      wsRef.current.onmessage = (event) => {
        if (!isMounted.current) return;
        
        setLastMessage(event);
        
        if (onMessage) {
          onMessage(event);
        }
      };
      
      wsRef.current.onclose = (event) => {
        if (!isMounted.current) return;
        
        setIsConnected(false);
        
        if (onClose) {
          onClose(event);
        }
        
        // Attempt to reconnect if needed
        if (reconnect && !event.wasClean) {
          const attempts = reconnectAttemptsRef.current + 1;
          
          if (maxReconnectAttempts === 0 || attempts <= maxReconnectAttempts) {
            reconnectAttemptsRef.current = attempts;
            setReconnectAttempts(attempts);
            
            if (onReconnect) {
              onReconnect(attempts);
            }
            
            // Schedule reconnection
            reconnectTimeoutRef.current = window.setTimeout(() => {
              if (isMounted.current) {
                connect();
              }
            }, reconnectInterval);
          } else if (onMaxReconnectAttempts) {
            onMaxReconnectAttempts();
          }
        }
      };
      
      wsRef.current.onerror = (event) => {
        if (!isMounted.current) return;
        
        setError(event);
        
        if (onError) {
          onError(event);
        }
      };
      
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError(err instanceof Event ? err : new Event('error'));
    }
  }, [
    url,
    protocols,
    binaryType,
    reconnect,
    maxReconnectAttempts,
    reconnectInterval,
    onOpen,
    onMessage,
    onClose,
    onError,
    onReconnect,
    onMaxReconnectAttempts,
  ]);
  
  // Close the WebSocket connection
  const disconnect = useCallback((code?: number, reason?: string) => {
    if (wsRef.current) {
      wsRef.current.close(code, reason);
    }
    
    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
    
    // Reset reconnect attempts
    reconnectAttemptsRef.current = 0;
    setReconnectAttempts(0);
  }, []);
  
  // Send a message through the WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
      return true;
    }
    
    console.warn('WebSocket is not connected');
    return false;
  }, []);
  
  // Auto-connect on mount if enabled
  useEffect(() => {
    isMounted.current = true;
    
    if (autoConnect) {
      connect();
    }
    
    // Cleanup on unmount
    return () => {
      isMounted.current = false;
      disconnect(1000, 'Component unmounted');
    };
  }, [autoConnect, connect, disconnect]);
  
  // Reconnect when URL changes
  useEffect(() => {
    if (autoConnect && isMounted.current) {
      connect();
    }
    // We only want to run this when the URL changes, not when connect changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, autoConnect]);
  
  return {
    // State
    isConnected,
    lastMessage,
    error,
    reconnectAttempts,
    
    // Methods
    connect,
    disconnect,
    sendMessage,
    
    // WebSocket instance (use with caution)
    ws: wsRef.current,
  };
}

// Example usage:
/*
function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  
  const { isConnected, sendMessage, lastMessage } = useWebSocket('wss://api.example.com/chat', {
    onOpen: () => {
      console.log('Connected to WebSocket');
    },
    onMessage: (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    },
    onClose: () => {
      console.log('Disconnected from WebSocket');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    },
    reconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  });
  
  const handleSend = () => {
    if (input.trim() && isConnected) {
      sendMessage(JSON.stringify({
        text: input,
        timestamp: new Date().toISOString(),
      }));
      setInput('');
    }
  };
  
  return (
    <div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <p>{msg.text}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button 
          onClick={handleSend}
          disabled={!isConnected || !input.trim()}
        >
          Send
        </button>
      </div>
      
      <div className="status">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
*/
