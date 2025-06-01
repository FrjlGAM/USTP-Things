import { useState, useCallback, useRef, useEffect } from 'react';

type ModalOptions = {
  onClose?: () => void;
  onConfirm?: () => void | Promise<void>;
  title?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  disableBackdropClick?: boolean;
  disableEscapeKey?: boolean;
};

type ModalState = {
  isOpen: boolean;
  isConfirming: boolean;
  options: ModalOptions;
};

const DEFAULT_OPTIONS: ModalOptions = {
  title: 'Confirm',
  content: 'Are you sure you want to continue?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  size: 'md',
  disableBackdropClick: false,
  disableEscapeKey: false,
};

export function useModal() {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    isConfirming: false,
    options: DEFAULT_OPTIONS,
  });
  
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  // Handle escape key press
  useEffect(() => {
    if (!state.isOpen || state.options.disableEscapeKey) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isOpen, state.options.disableEscapeKey]);

  // Show modal with options
  const showModal = useCallback((options: ModalOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        isOpen: true,
        isConfirming: false,
        options: { ...DEFAULT_OPTIONS, ...options },
      });
    });
  }, []);

  // Confirm action
  const handleConfirm = useCallback(async () => {
    if (state.options.onConfirm) {
      setState(prev => ({ ...prev, isConfirming: true }));
      try {
        await state.options.onConfirm();
        resolveRef.current?.(true);
        setState(prev => ({ ...prev, isOpen: false, isConfirming: false }));
      } catch (error) {
        console.error('Error in modal confirmation:', error);
        setState(prev => ({ ...prev, isConfirming: false }));
      }
    } else {
      resolveRef.current?.(true);
      setState(prev => ({ ...prev, isOpen: false }));
    }
  }, [state.options]);

  // Close modal
  const handleClose = useCallback(() => {
    if (state.isConfirming) return; // Prevent closing while confirming
    
    if (state.options.onClose) {
      state.options.onClose();
    }
    
    resolveRef.current?.(false);
    setState(prev => ({
      ...prev,
      isOpen: false,
      options: { ...prev.options, onClose: undefined },
    }));
  }, [state.isConfirming, state.options]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (state.options.disableBackdropClick) return;
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose, state.options.disableBackdropClick]);

  // Modal component
  const Modal = useCallback(() => {
    if (!state.isOpen) return null;

    const {
      title,
      content,
      confirmText,
      cancelText,
      size = 'md',
    } = state.options;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full',
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div 
            className={`inline-block w-full ${sizeClasses[size]} overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {/* Header */}
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 
                    className="text-lg font-medium leading-6 text-gray-900"
                    id="modal-headline"
                  >
                    {title}
                  </h3>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">
                      {content}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${
                  state.isConfirming ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={handleConfirm}
                disabled={state.isConfirming}
              >
                {state.isConfirming ? 'Processing...' : confirmText}
              </button>
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleClose}
                disabled={state.isConfirming}
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [state, handleConfirm, handleClose, handleBackdropClick]);

  return {
    showModal,
    Modal,
    isOpen: state.isOpen,
    close: handleClose,
    confirm: handleConfirm,
  };
}
