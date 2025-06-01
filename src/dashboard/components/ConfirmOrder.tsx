import { memo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmOrderProps {
  /** Controls the visibility of the modal */
  isOpen: boolean;
  /** Function to call when confirming */
  onConfirm: () => void;
  /** Function to call when canceling */
  onCancel: () => void;
  /** Title of the modal */
  title?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Show loading state on confirm button */
  isLoading?: boolean;
  /** Disable the confirm button */
  isDisabled?: boolean;
  /** Custom class names for the modal container */
  className?: string;
  /** Custom class names for the content */
  contentClassName?: string;
  /** Custom class names for the confirm button */
  confirmButtonClassName?: string;
  /** Custom class names for the cancel button */
  cancelButtonClassName?: string;
  /** Show backdrop */
  showBackdrop?: boolean;
  /** Click on backdrop to close */
  closeOnBackdropClick?: boolean;
  /** Close on pressing escape key */
  closeOnEscape?: boolean;
}

const ConfirmOrder: React.FC<ConfirmOrderProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Confirm Order',
  confirmText = 'Place Order',
  cancelText = 'Cancel',
  isLoading = false,
  isDisabled = false,
  className = '',
  contentClassName = '',
  confirmButtonClassName = '',
  cancelButtonClassName = '',
  showBackdrop = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Handle escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onCancel();
      }
    };

    // Save the last focused element before opening the modal
    lastFocusedElement.current = document.activeElement as HTMLElement;
    
    // Focus the modal when it opens
    modalRef.current?.focus();
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the last focused element when modal closes
      lastFocusedElement.current?.focus();
    };
  }, [isOpen, onCancel, closeOnEscape]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      {showBackdrop !== false && (
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}
      
      <div 
        ref={modalRef}
        tabIndex={-1}
        className={`relative bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center w-full max-w-md ${contentClassName}`}
      >
        <h2 
          id="modal-title"
          className="text-2xl md:text-3xl font-bold text-[#F88379] mb-6 text-center"
        >
          {title}
        </h2>
        
        <div className="w-full flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDisabled || isLoading}
            className={`flex-1 bg-white border-2 border-[#4CAF50] text-[#4CAF50] font-bold py-3 px-6 rounded-xl hover:bg-[#4CAF50] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmButtonClassName}`}
            aria-busy={isLoading}
            aria-disabled={isDisabled || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></span>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`flex-1 border-2 border-[#FF4444] text-[#FF4444] font-bold py-3 px-6 rounded-xl hover:bg-[#FF4444] hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4444] focus:ring-offset-2 disabled:opacity-50 ${cancelButtonClassName}`}
            aria-disabled={isLoading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(modalContent, document.body);
};

export default memo(ConfirmOrder);