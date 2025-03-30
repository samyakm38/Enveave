import React, { createContext, useContext, useState } from 'react';
import { Toast } from 'flowbite-react';
import { HiCheck, HiExclamation, HiX, HiInformationCircle } from 'react-icons/hi';

// Create context
const ToastContext = createContext();

// Toast types with appropriate icons and colors
const TOAST_TYPES = {
  SUCCESS: {
    icon: HiCheck,
    color: 'success',
    bgColor: 'bg-green-100 border-green-400',
    textColor: 'text-green-700'
  },
  ERROR: {
    icon: HiX,
    color: 'failure',
    bgColor: 'bg-red-100 border-red-400',
    textColor: 'text-red-700'
  },
  WARNING: {
    icon: HiExclamation,
    color: 'warning',
    bgColor: 'bg-yellow-100 border-yellow-400',
    textColor: 'text-yellow-700'
  },
  INFO: {
    icon: HiInformationCircle,
    color: 'info',
    bgColor: 'bg-blue-100 border-blue-400',
    textColor: 'text-blue-700'
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Add a new toast to the stack
  const showToast = (message, type = 'SUCCESS', duration = 3000) => {
    const id = Date.now();
    const newToast = {
      id,
      message,
      type,
      duration,
    };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto remove toast after duration
    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  // Remove a toast by ID
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const toastType = TOAST_TYPES[toast.type] || TOAST_TYPES.INFO;
          
          return (
            <Toast 
              key={toast.id} 
              className={`my-2 border ${toastType.bgColor}`}
            >
              <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType.bgColor}`}>
                {React.createElement(toastType.icon, {
                  className: `h-5 w-5 ${toastType.textColor}`,
                  'aria-hidden': 'true',
                })}
              </div>
              <div className={`ml-3 text-sm font-normal ${toastType.textColor}`}>
                {toast.message}
              </div>
              <Toast.Toggle onDismiss={() => removeToast(toast.id)} />
            </Toast>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};