function ProdutoItem({ produto, onAdicionarClick }) {
    return (
        <tr style={styles.row}>
            <td style={styles.cell}>
                <div>
                    <strong>{produto.nome}</strong>
                    <br />
                    <small>{produto.descricao}</small>
                    <br />
                    <span>R$ {produto.valor.toFixed(2)}</span>
                </div>
            </td>
            <td style={styles.cell}>
                <button
                    style={styles.button}
                    onClick={() => onAdicionarClick(produto)}
                >
                    +
                </button>
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
};

export default ProdutoItem;
