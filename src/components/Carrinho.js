import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IMaskInput } from 'react-imask';
import ConfirmacaoModal from './ConfirmacaoModal';

function Carrinho({
    produtos,
    subtotal,
    total,
    cpfNota, // será substituído por nome
    formaPagamento,
    setCpfNota, // será substituído por setNome
    setFormaPagamento,
    onFechar,
    onFinalizar,
}) {
    const [nome, setNome] = React.useState("");
    const [telefone, setTelefone] = React.useState("");
    const [mostrarConfirmacao, setMostrarConfirmacao] = React.useState(false);

    // Função para finalizar pedido incluindo nome e telefone
    const handleFinalizar = () => {
        if (!nome.trim() || telefone.replace(/\D/g, "").length < 11) {
            alert("Por favor, preencha nome e telefone corretamente.");
            return;
        }
        onFinalizar({ nome, telefone });
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onFechar();
        }
    };

    const handleContinuar = () => {
        if (!nome.trim() || telefone.replace(/\D/g, "").length < 11) {
            alert("Por favor, preencha nome e telefone corretamente.");
            return;
        }
        setMostrarConfirmacao(true);
    };

    return (
        <div style={styles.overlay} onClick={handleOverlayClick}>
            <div style={styles.modal}>
                <button style={{ position: 'absolute', top: 10, left: 10, background: 'none', border: 'none', fontSize: 24, color: '#007bff', cursor: 'pointer', zIndex: 10, padding: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onFechar} aria-label="Voltar">
                    &#8592;
                </button>
                <h2 style={styles.titulo}><FaShoppingCart style={{ marginRight: 8, verticalAlign: 'middle' }} />Seu carrinho</h2>
                <button style={styles.btnFechar} onClick={onFechar}>
                    &times;
                </button>
                <div style={styles.modalContent}>
                    {produtos.length === 0 ? (
                        <p style={styles.carrinhoVazio}>Seu carrinho está vazio.</p>
                    ) : (
                        <div style={styles.listaItens}>
                            {produtos.map((item, index) => (
                                <div key={index} style={styles.item}>
                                    <div style={styles.itemTopo}>
                                        <span style={styles.quantidade}>{item.quantidade}x</span>
                                        <span style={styles.nomeProduto}>{item.produto.nome}</span>
                                        <span style={styles.valorUnitario}>
                                            R$ {(item.produto.valor || 0).toFixed(2)}
                                        </span>
                                    </div>
                                    {item.adicionais && item.adicionais.length > 0 && (
                                        <div style={styles.adicionaisContainer}>
                                            {item.adicionais
                                                .filter((ad) => ad.quantidade > 0)
                                                .map((adicional, idx) => (
                                                    <div key={idx} style={styles.adicionalItem}>
                                                        <span>
                                                            + {adicional.quantidade}x {adicional.nome}
                                                        </span>
                                                        <span>
                                                            R$ {(adicional.valor * adicional.quantidade).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <button style={styles.btnAdicionarMais} onClick={onFechar}>
                        Adicionar mais itens
                    </button>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome:</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            placeholder="Digite seu nome"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Telefone:</label>
                        <IMaskInput
                            mask="(00) 00000-0000"
                            value={telefone}
                            onAccept={(value) => setTelefone(value)}
                            style={styles.input}
                            placeholder="(99) 99999-9999"
                        />
                    </div>

                    <div style={styles.resumo}>
                        <div style={styles.linhaResumo}>
                            <span>Subtotal:</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div style={styles.linhaResumo}>
                            <span>Taxa de entrega:</span>
                            <span>R$ 5,00</span>
                        </div>
                        <div style={{ ...styles.linhaResumo, ...styles.total }}>
                            <span>Total:</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div style={styles.modalFooter}>
                    {/* Botão Continuar */}
                    <button style={{ ...styles.btnFinalizar, marginTop: 8 }} onClick={handleContinuar}>
                        Continuar
                    </button>
                </div>
            </div>
            {/* Modal de confirmação sobreposto */}
            {mostrarConfirmacao && (
                <ConfirmacaoModal
                    nome={nome}
                    telefone={telefone}
                    total={total} // Garantir que o total é passado
                    onConfirmar={handleFinalizar}
                    onFechar={() => setMostrarConfirmacao(false)}
                />
            )}
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
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: "100%",
        maxWidth: "100%",
        minHeight: "320px",
        maxHeight: "90vh",
        padding: 0, // Remover padding do modal, aplicar no conteúdo
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    modalContent: {
        flex: 1,
        overflowY: "auto",
        padding: "20px", // Padding igual ao Cardápio
    },
    modalFooter: {
        borderTop: "1px solid #eee",
        padding: "12px 24px 16px 24px",
        background: "#fff",
        position: "sticky",
        bottom: 0,
        zIndex: 2,
    },
    totalResumo: {
        fontSize: "15px",
        color: "#333",
        marginBottom: "8px",
        textAlign: "center",
    },
    titulo: {
        margin: 0,
        marginBottom: "16px",
        fontSize: "24px",
        fontWeight: "700",
        textAlign: "center",
        color: "#222",
    },
    btnFechar: {
        position: "absolute",
        top: "12px",
        right: "16px",
        border: "none",
        background: "none",
        fontSize: "28px",
        cursor: "pointer",
        color: "#888",
        transition: "color 0.2s",
    },
    carrinhoVazio: {
        fontStyle: "italic",
        color: "#666",
        textAlign: "center",
        margin: "24px 0",
    },
    listaItens: {
        marginBottom: "20px",
    },
    item: {
        borderBottom: "1px solid #ddd",
        paddingBottom: "12px",
        marginBottom: "12px",
    },
    itemTopo: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    quantidade: {
        fontWeight: "700",
        color: "#444",
        marginRight: "8px",
        minWidth: "24px",
    },
    nomeProduto: {
        flex: 1,
        fontWeight: "600",
        color: "#222",
    },
    valorUnitario: {
        fontWeight: "600",
        color: "#333",
        minWidth: "70px",
        textAlign: "right",
    },
    adicionaisContainer: {
        marginTop: "6px",
        paddingLeft: "28px",
        fontSize: "14px",
        color: "#555",
    },
    adicionalItem: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "4px",
    },
    btnAdicionarMais: {
        backgroundColor: "#007bff",
        border: "none",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
        marginBottom: "20px",
        width: "100%",
        transition: "background-color 0.3s",
    },
    inputGroup: {
        marginBottom: "12px",
        textAlign: "left", // Alinhar à esquerda
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "600",
        color: "#333",
        textAlign: "left", // Alinhar à esquerda
    },
    input: {
        width: "100%",
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "16px",
        textAlign: "left", // Alinhar à esquerda
    },
    select: {
        width: "100%",
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "16px",
        backgroundColor: "#fff",
    },
    resumo: {
        borderTop: "1px solid #ddd",
        paddingTop: "16px",
        marginBottom: "20px",
    },
    linhaResumo: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "16px",
        marginBottom: "8px",
        color: "#333",
    },
    total: {
        fontWeight: "700",
        fontSize: "18px",
        color: "#007bff",
    },
    btnFinalizar: {
        backgroundColor: "#28a745",
        border: "none",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "18px",
        width: "100%",
        transition: "background-color 0.3s",
    },
};

export default Carrinho;
