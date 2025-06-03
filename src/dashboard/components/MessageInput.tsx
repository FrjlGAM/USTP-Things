import React from 'react';

interface MessageInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  disabled: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  message, 
  onMessageChange, 
  onSend, 
  disabled 
}) => (
  <form onSubmit={onSend} className="p-4 border-t bg-white">
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={onMessageChange}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-[#F88379]"
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message.trim()) {
              // Create a form event to match the expected type
              const formEvent = {
                ...e,
                currentTarget: e.currentTarget.form,
                preventDefault: () => e.preventDefault()
              } as unknown as React.FormEvent<HTMLFormElement>;
              onSend(formEvent);
            }
          }
        }}
      />
      <button
        type="submit"
        disabled={disabled}
        className={`px-4 py-2 rounded-lg transition ${
          !disabled
            ? 'bg-[#F88379] text-white hover:bg-[#f96d62]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Send
      </button>
    </div>
  </form>
);
