import React, { useEffect, useRef } from 'react';
export default function ClickedOutsideChecker(props: { children: React$Node, onOutsideClick: () => void }) {
    let wrapperRef = useRef();

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return function cleanup() {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    });

    const childrenWithProps = React.Children.map(props.children, child =>
        React.cloneElement(child, { ref: setWrapperRef })
    );

    return childrenWithProps;

    function handleOutsideClick(event: SyntheticMouseEvent<>) {
        if (wrapperRef && !wrapperRef.contains(event.target)) {
            props.onOutsideClick();
        }
    }

    function setWrapperRef(node: React.Node) {
        wrapperRef = node;
    }
}
