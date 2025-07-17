
export default function Modal({ children, onClose }) {
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div
                style={styles.modal}
                onClick={(e) => e.stopPropagation()} // pra não fechar quando clicar dentro do modal
            >
                <button style={styles.closeBtn} onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "90%",
        position: "relative",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    closeBtn: {
        position: "absolute",
        top: "8px",
        right: "12px",
        background: "transparent",
        border: "none",
        fontSize: "1.5rem",
        cursor: "pointer",
    },
};
