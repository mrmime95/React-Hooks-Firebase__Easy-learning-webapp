import React from 'react';
import ReactDOM from 'react-dom';
import ClickedOutsideChecker from '../../shared/ClickedOutsideChecker/ClickedOutsideChecker';
import './Modal.css';

const Modal = React.forwardRef(
    (props: { isOpen: boolean, className: string, children: React$node, handleClickOutside?: () => void }, ref) => {
        if (props.isOpen) {
            document.getElementsByTagName('body')[0].setAttribute('style', 'overflow: hidden');
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
        } else {
            document.getElementsByTagName('body')[0].setAttribute('style', 'overflow: auto');
        }
        return null;
    }
);

export default Modal;
