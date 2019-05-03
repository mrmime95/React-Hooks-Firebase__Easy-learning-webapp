import React from 'react';
import ReactDOM from 'react-dom';
import ClickedOutsideChecker from '../../shared/ClickedOutsideChecker/ClickedOutsideChecker';
import './Modal.css';

const Modal = React.forwardRef(
    (props: { isOpen: boolean, className: string, children: React$node, handleClickOutside?: () => void }, ref) => {
        if (props.isOpen) {
            return ReactDOM.createPortal(
                <div className={`modal-container ${props.isOpen && 'open'} ${props.className}`}>
                    <ClickedOutsideChecker
                        onOutsideClick={props.handleClickOutside ? props.handleClickOutside : () => {}}
                    >
                        <div className="modal-content" ref={ref}>
                            {props.children}
                        </div>
                    </ClickedOutsideChecker>
                </div>,
                document.getElementById('modal-root')
            );
        }
        return null;
    }
);

export default Modal;
