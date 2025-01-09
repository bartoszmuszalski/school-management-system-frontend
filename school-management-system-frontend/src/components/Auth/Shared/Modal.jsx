import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    font-size: 1.5rem;
    float: right;
    cursor: pointer;
`;

function Modal({ children, onClose }) {
    return (
        <Overlay>
            <ModalContainer>
                <CloseButton onClick={onClose}>&times;</CloseButton>
                {children}
            </ModalContainer>
        </Overlay>
    );
}

export default Modal;