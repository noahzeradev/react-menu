import React from 'react';

export default function ModalHeader({ onBack, onClose, icon, label, showClose = true }) {
    return (
        <div style={styles.headerRow}>
            <button
                style={styles.btnVoltar}
                onClick={onBack}
                aria-label="Voltar"
            >
                &#8592;
            </button>
            <h2 style={styles.titulo}>
                {icon && <span style={{ marginRight: 8, verticalAlign: 'middle' }}>{icon}</span>}
                {label}
            </h2>
            {showClose ? (
                <button
                    style={styles.btnFechar}
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    &times;
                </button>
            ) : (
                <span style={{ width: 36 }} />
            )}
        </div>
    );
}

const styles = {
    headerRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0 12px',
        minHeight: '56px',
        boxSizing: 'border-box',
        gap: '8px',
    },
    btnVoltar: {
        background: 'none',
        border: 'none',
        fontSize: 24,
        color: '#007bff',
        cursor: 'pointer',
        zIndex: 10,
        padding: 0,
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
        textAlign: 'center',
        color: '#222',
        flex: 1,
    },
    btnFechar: {
        background: 'none',
        border: 'none',
        fontSize: 28,
        color: '#888',
        cursor: 'pointer',
        zIndex: 10,
        padding: 0,
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s',
    },
}; 