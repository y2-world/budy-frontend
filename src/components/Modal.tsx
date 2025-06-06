import React from "react";
import "../styles/Modal.css";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean; // 追加（省略時はtrueに設定）
};

function Modal({ onClose, children, showCloseButton = true }: ModalProps) {
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
}

export default Modal;