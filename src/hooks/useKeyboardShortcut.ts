import { useEffect, useCallback, useRef } from 'react';

type KeyCombo = string | string[];
type Handler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  /**
   * Whether the shortcut is enabled (default: true)
   */
  enabled?: boolean;
  
  /**
   * Whether to prevent default behavior (default: true)
   */
  preventDefault?: boolean;
  
  /**
   * Whether to stop event propagation (default: false)
   */
  stopPropagation?: boolean;
  
  /**
   * The target element to attach the event listener to (default: document)
   */
  target?: HTMLElement | Document | Window | null;
  
  /**
   * The event type to listen for (default: 'keydown')
   */
  event?: 'keydown' | 'keyup' | 'keypress';
  
  /**
   * Whether the shortcut requires the exact key combination (default: false)
   * If true, the handler will only be called if no other modifier keys are pressed
   */
  exact?: boolean;
}

/**
 * A map of key names to their corresponding key codes
 */
const KEY_ALIASES: Record<string, string> = {
  esc: 'Escape',
  enter: 'Enter',
  space: ' ',
  spacebar: ' ',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  tab: 'Tab',
  caps: 'CapsLock',
  ctrl: 'Control',
  control: 'Control',
  alt: 'Alt',
  shift: 'Shift',
  meta: 'Meta',
  cmd: 'Meta',
  command: 'Meta',
  option: 'Alt',
  backspace: 'Backspace',
  delete: 'Delete',
  insert: 'Insert',
  home: 'Home',
  end: 'End',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  plus: '+',
  minus: '-',
  ' ': ' ',
};

/**
 * Normalize a key name
 */
function normalizeKey(key: string): string {
  // Convert to lowercase and trim whitespace
  const normalized = key.toLowerCase().trim();
  
  // Check for aliases
  return KEY_ALIASES[normalized] || key;
}

/**
 * Parse a key combination string into its components
 * Example: 'ctrl+shift+a' => { key: 'a', ctrl: true, shift: true, alt: false, meta: false }
 */
function parseKeyCombo(combo: string): {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
} {
  const parts = combo.split('+').map(part => part.trim().toLowerCase());
  
  const result = {
    key: '',
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
  };
  
  for (const part of parts) {
    const normalized = normalizeKey(part);
    
    switch (normalized) {
      case 'ctrl':
      case 'control':
        result.ctrl = true;
        break;
      case 'shift':
        result.shift = true;
        break;
      case 'alt':
      case 'option':
        result.alt = true;
        break;
      case 'meta':
      case 'cmd':
      case 'command':
        result.meta = true;
        break;
      default:
        result.key = normalized;
        break;
    }
  }
  
  return result;
}

/**
 * Check if a keyboard event matches a key combination
 */
function eventMatchesCombo(event: KeyboardEvent, combo: string): boolean {
  const { key, ctrl, shift, alt, meta } = parseKeyCombo(combo);
  
  // Check if the key matches (case-insensitive)
  if (key && normalizeKey(event.key) !== key.toLowerCase()) {
    return false;
  }
  
  // Check modifier keys
  if (ctrl !== event.ctrlKey) return false;
  if (shift !== event.shiftKey) return false;
  if (alt !== event.altKey) return false;
  if (meta !== event.metaKey) return false;
  
  return true;
}

/**
 * A hook to add keyboard shortcuts to your component
 * 
 * @param {KeyCombo} keyCombo - The key combination to listen for (e.g., 'ctrl+s' or ['ctrl+s', 'cmd+s'])
 * @param {Handler} handler - The function to call when the key combination is pressed
 * @param {ShortcutOptions} options - Configuration options
 */
export function useKeyboardShortcut(
  keyCombo: KeyCombo,
  handler: Handler,
  options: ShortcutOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = document,
    event = 'keydown',
    exact = false,
  } = options;
  
  // Store the handler in a ref so we don't need to add it to the dependency array
  const handlerRef = useRef<Handler>(handler);
  
  // Update the handler if it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  
  // Convert keyCombo to an array if it's a string
  const keyCombos = Array.isArray(keyCombo) ? keyCombo : [keyCombo];
  
  // Create the event handler
  const handleKeyEvent = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    // Check if any of the key combos match
    const matches = keyCombos.some(combo => eventMatchesCombo(event, combo));
    
    if (!matches) return;
    
    // If exact is true, make sure no other modifier keys are pressed
    if (exact) {
      const { ctrl, shift, alt, meta } = parseKeyCombo(keyCombos[0]);
      
      if (event.ctrlKey !== ctrl ||
          event.shiftKey !== shift ||
          event.altKey !== alt ||
          event.metaKey !== meta) {
        return;
      }
    }
    
    // Prevent default behavior if needed
    if (preventDefault) {
      event.preventDefault();
    }
    
    // Stop propagation if needed
    if (stopPropagation) {
      event.stopPropagation();
    }
    
    // Call the handler
    handlerRef.current(event);
  }, [enabled, keyCombos, preventDefault, stopPropagation, exact]);
  
  // Add event listener
  useEffect(() => {
    if (!target) return;
    
    const eventTarget = target as EventTarget;
    eventTarget.addEventListener(event, handleKeyEvent as EventListener);
    
    return () => {
      eventTarget.removeEventListener(event, handleKeyEvent as EventListener);
    };
  }, [target, event, handleKeyEvent]);
}

// Example usage:
/*
function MyComponent() {
  // Single key combo
  useKeyboardShortcut('Escape', () => {
    console.log('Escape key pressed');
  });
  
  // Multiple key combos
  useKeyboardShortcut(['ctrl+s', 'cmd+s'], (event) => {
    event.preventDefault(); // Prevent browser save dialog
    console.log('Save shortcut pressed');
  }, {
    preventDefault: true,
    stopPropagation: true,
  });
  
  // With options
  useKeyboardShortcut('?', () => {
    console.log('Show help');
  }, {
    enabled: true,
    target: document.getElementById('my-input'),
    event: 'keyup',
  });
  
  // Exact match (no other modifier keys)
  useKeyboardShortcut('a', () => {
    console.log('Only the "a" key was pressed');
  }, {
    exact: true,
  });
  
  return (
    <div>
      <input id="my-input" type="text" placeholder="Type '?' for help" />
    </div>
  );
}
*/
