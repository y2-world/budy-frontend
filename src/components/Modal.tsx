import React from "react";
import "../styles/Modal.css";

type Props = {
  onClose: () => void;
  className?: string; 
  children: React.ReactNode;
  showCloseButton?: boolean;
};

const Modal: React.FC<Props> = ({ onClose, children, showCloseButton = true }) => {
  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showCloseButton && (
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;