function ProdutoItem({ produto, onAdicionarClick }) {
    return (
        <tr style={styles.row}>
            <td colSpan={2} style={{ ...styles.cell, padding: 0 }}>
                <div style={styles.produtoFlexRow}>
                    <div style={styles.produtoInfo}>
                        <strong>{produto.nome}</strong>
                        <br />
                        <small>{produto.descricao}</small>
                        <br />
                        <span style={styles.valorVerde}>R$ {produto.valor.toFixed(2)}</span>
                    </div>
                    <button
                        style={styles.button}
                        onClick={() => onAdicionarClick(produto)}
                    >
                        +
                    </button>
                </div>
            </td>
        </tr>
    );
}

const styles = {
    row: {
        borderBottom: "1px solid #ddd",
    },
    cell: {
        padding: "10px",
        verticalAlign: "top",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "6px 12px",
        cursor: "pointer",
        fontSize: "16px",
    },
    valorVerde: {
        color: "#28a745",
        fontWeight: 600,
    },
    produtoFlexRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px',
        gap: '12px',
        boxSizing: 'border-box',
    },
    produtoInfo: {
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        display: 'block',
        maxWidth: 'calc(100vw - 110px)', // Garante espaço para o botão em telas pequenas
    },
};

export default ProdutoItem;
