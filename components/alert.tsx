import { useEffect } from 'react';

type AlertProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export default function Alert({ message, type, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full z-50 p-4 rounded shadow-lg flex items-center ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      <span className="flex-grow">{message}</span>
      <button onClick={onClose} className="ml-4">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
}
