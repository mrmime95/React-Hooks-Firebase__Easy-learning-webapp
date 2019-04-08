import React from 'react';
import ReactDOM from 'react-dom';
import ClickedOutsideChecker from '../../shared/ClickedOutsideChecker/ClickedOutsideChecker';
import './Modal.css';

const Modal = React.forwardRef(
    (props: { isOpen: boolean, className: string, children: React$node, handleClickOutside?: () => void }, ref) => {
        return (
            <CreateModal>
                <div className={`modal-container ${props.isOpen && 'open'} ${props.className}`}>
                    {props.isOpen && (
                        <ClickedOutsideChecker
                            onOutsideClick={props.handleClickOutside ? props.handleClickOutside : () => {}}
                        >
                            <div className="modal-content" ref={ref}>
                                {props.children}
                            </div>
                        </ClickedOutsideChecker>
                    )}
                </div>
            </CreateModal>
        );
    }
);

function CreateModal({ children }) {
    return ReactDOM.createPortal(<div>{children}</div>, document.getElementById('modal-root'));
}

export default Modal;
