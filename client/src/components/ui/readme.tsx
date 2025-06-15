// components/ToastButton.tsx
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastButton: React.FC = () => {
  const showToast = () => {
    toast.info("This is a popup notification!", {
      position: "bottom-right", // Position of the popup
      autoClose: 5000, // Auto close after 5 seconds
      hideProgressBar: false, // Show progress bar
      closeOnClick: true, // Close on click
      pauseOnHover: true, // Pause on hover
      draggable: true, // Draggable
      progress: undefined,
    });
  };

  return (
    <>
      <button 
        onClick={showToast} 
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#0070f3', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer'
        }}
      >
        Show Popup
      </button>
      <ToastContainer />
    </>
  );
};

export default ToastButton;
