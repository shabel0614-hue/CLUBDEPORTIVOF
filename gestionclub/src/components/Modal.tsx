import type { ReactNode } from "react";
import "../App.css";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, title, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" aria-label="Cerrar" onClick={onClose}>
          ✕
        </button>
        {title && <h3 style={{ marginBottom: 16, paddingRight: 32 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}