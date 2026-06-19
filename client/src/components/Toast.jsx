import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

let toastId = 0;
let addToastFn = null;

// Global function to show toast from anywhere
export const toast = {
  success: (message) => addToastFn?.({ type: 'success', message }),
  error: (message) => addToastFn?.({ type: 'error', message }),
  info: (message) => addToastFn?.({ type: 'info', message }),
};

const icons = {
  success: <FiCheckCircle />,
  error: <FiAlertCircle />,
  info: <FiInfo />,
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = ({ type, message }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message }]);

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    return () => { addToastFn = null; };
  }, []);

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{icons[t.type]}</span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => dismiss(t.id)}>
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
