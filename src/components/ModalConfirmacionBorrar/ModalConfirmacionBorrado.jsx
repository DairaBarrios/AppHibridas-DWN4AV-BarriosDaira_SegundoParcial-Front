import React from 'react';
import './ModalConfirmacionBorrar.scss';

const ModalConfirmacionBorrar = ({message, onConfirm, onCancel}) => {
    return (
        <div className="confirm-modal">
            <div className="confirm-modal-content">
                <p>{message}</p>
                <div className="confirm-modal-actions">
                    <button className="confirm" onClick={onConfirm}>Yes</button>
                    <button className="cancel" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmacionBorrar;
