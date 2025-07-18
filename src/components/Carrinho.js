import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { IMaskInput } from 'react-imask';
import ConfirmacaoEnderecoModal from './ConfirmacaoEndrecoModal';
import ConfirmacaoPagamentoModal from './ConfirmacaoPagamentoModal';
import ModalHeader from './ModalHeader';

function Carrinho({
    produtos,
    setProdutosNoCarrinho,
    subtotal,
    total,
    cpfNota, // será substituído por nome
    formaPagamento,
    setCpfNota, // será substituído por setNome
    setFormaPagamento,
    onFechar,
    onFinalizar,
}) {
    const [nome, setNome] = React.useState(() => localStorage.getItem('carrinho_nome') || "");
    const [telefone, setTelefone] = React.useState(() => localStorage.getItem('carrinho_telefone') || "");
    const [mostrarConfirmacao, setMostrarConfirmacao] = React.useState(false);
    const [mostrarPagamento, setMostrarPagamento] = React.useState(false);
    const [dadosEntrega, setDadosEntrega] = React.useState(null);
    // Função para finalizar pedido incluindo nome, telefone e pagamento
    const handleFinalizar = (pagamentoInfo) => {
        if (!nome.trim() || telefone.replace(/\D/g, "").length < 11) {
            alert("Por favor, preencha nome e telefone corretamente.");
            return;
        }
        // Chama o onFinalizar com todos os dados
        onFinalizar({ nome, telefone, ...dadosEntrega, ...pagamentoInfo });
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
    // Quando confirmar entrega/retirada, abre o modal de pagamento
    const handleConfirmacaoEntrega = (dados) => {
        setDadosEntrega(dados || {});
        setMostrarConfirmacao(false);
        setMostrarPagamento(true);
    };
    // Quando confirmar pagamento, finaliza o pedido
    const handleConfirmacaoPagamento = (pagamentoInfo) => {
        setMostrarPagamento(false);
        // Repassa aba e outros dados de entrega junto com pagamento
        handleFinalizar({ ...dadosEntrega, ...pagamentoInfo });
    };
    // Função para remover item do carrinho
    const handleRemoverItem = (index) => {
        const novosProdutos = produtos.filter((_, i) => i !== index);
        // Atualiza o estado do carrinho no componente pai, se existir
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            // Gatilho para atualização externa, se necessário
            window.dispatchEvent(new Event('carrinhoAtualizado'));
        }
        // Se houver setProdutosNoCarrinho no pai, idealmente passar por props
        if (typeof setProdutosNoCarrinho === 'function') {
            setProdutosNoCarrinho(novosProdutos);
        }
        // Caso contrário, pode ser necessário atualizar via callback do pai
        // Aqui, apenas alerta se não for possível
    };
    // Atualizar localStorage ao digitar nome
    const handleNomeChange = (e) => {
        setNome(e.target.value);
        localStorage.setItem('carrinho_nome', e.target.value);
    };
    // Atualizar localStorage ao digitar telefone
    const handleTelefoneChange = (value) => {
        setTelefone(value);
        localStorage.setItem('carrinho_telefone', value);
    };
    return (
        <div style={styles.overlay} onClick={handleOverlayClick}>
            <div style={styles.modal}>
                <ModalHeader
                    onBack={onFechar}
                    onClose={onFechar}
                    icon={<FaShoppingCart style={{ marginRight: 8, verticalAlign: 'middle' }} />}
                    label="Seu carrinho"
                />
                <hr style={styles.divisor} />
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
                                        <button
                                            style={styles.btnRemoverItem}
                                            onClick={() => handleRemoverItem(index)}
                                            aria-label="Remover item"
                                        >
                                            &#10005;
                                        </button>
                                    </div>
                                    {item.adicionais && item.adicionais.length > 0 && (
                                        <div style={styles.adicionaisContainerFullWidth}>
                                            {item.adicionais
                                                .filter((ad) => ad.quantidade > 0)
                                                .map((adicional, idx) => (
                                                    <div key={idx} style={styles.adicionalItem}>
                                                        <span>
                                                            + {adicional.quantidade}x {adicional.nome}
                                                        </span>
                                                        <span style={styles.adicionalValor}>
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
                            onChange={handleNomeChange}
                            placeholder="Digite seu nome"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Telefone:</label>
                        <IMaskInput
                            mask="(00) 00000-0000"
                            value={telefone}
                            onAccept={handleTelefoneChange}
                            style={styles.input}
                            placeholder="(99) 99999-9999"
                        />
                    </div>
                </div>
                {/* Resumo e botão Continuar juntos no footer */}
                <div style={styles.modalFooterResumo}>
                    <div style={styles.resumo}>
                        <div style={styles.linhaResumo}>
                            <span>Subtotal:</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ ...styles.linhaResumo, ...styles.total }}>
                            <span>Total:</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button style={{ ...styles.btnFinalizar, marginTop: 8 }} onClick={handleContinuar}>
                        Continuar
                    </button>
                </div>
            </div>
            {/* Modal de confirmação sobreposto */}
            {mostrarConfirmacao && (
                <ConfirmacaoEnderecoModal
                    nome={nome}
                    telefone={telefone}
                    total={total} // Garantir que o total é passado
                    onConfirmar={handleConfirmacaoEntrega}
                    onFechar={() => setMostrarConfirmacao(false)}
                />
            )}
            {/* Modal de pagamento sobreposto */}
            {mostrarPagamento && (
                <ConfirmacaoPagamentoModal
                    total={
                        dadosEntrega && dadosEntrega.aba === 'entrega'
                            ? total + 5
                            : total
                    }
                    onConfirmar={handleConfirmacaoPagamento}
                    onFechar={() => setMostrarPagamento(false)}
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
    modalFooterResumo: {
        borderTop: "1px solid #eee",
        padding: "12px 24px 16px 24px",
        background: "#fff",
        position: "sticky",
        bottom: 0,
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
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
        background: "none",
        border: "none",
        fontSize: "28px",
        cursor: "pointer",
        color: "#888",
        transition: "color 0.2s",
        zIndex: 10,
        padding: 0,
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        position: 'relative',
        minHeight: '36px',
        display: 'flex',
        flexDirection: 'column', // <-- empilha linha principal e adicionais
        alignItems: 'stretch',
    },
    itemTopo: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "6px",
        width: "100%",
    },
    quantidade: {
        fontWeight: "700",
        color: "#444",
        marginRight: "8px",
        minWidth: "24px",
        fontSize: "15px",
    },
    nomeProduto: {
        flex: 2,
        fontWeight: "600",
        color: "#222",
        fontSize: "15px",
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        textAlign: 'left',
    },
    valorUnitario: {
        fontWeight: "600",
        color: "#222",
        fontSize: "15px",
        marginLeft: "8px",
        textAlign: 'left',
    },
    adicionaisContainer: {
        marginTop: "6px",
        paddingLeft: "28px",
        fontSize: "13px",
        color: "#555",
        wordBreak: 'break-word',
    },
    adicionalItem: {
        display: "flex",
        justifyContent: "flex-start",
        marginTop: "4px",
        fontSize: "13px",
        gap: "12px",
        color: undefined, // reset cor padrão
    },
    adicionalValor: {
        color: "#222",
        fontWeight: 600,
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
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
        maxWidth: "340px",
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
        color: "#28a745",
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
    btnRemoverItem: {
        background: 'none',
        border: 'none',
        color: '#d32f2f',
        cursor: 'pointer',
        fontSize: '18px',
        padding: 0,
        outline: 'none',
        marginLeft: '12px',
        alignSelf: 'center',
        flexShrink: 0,
    },
    // Novo estilo para adicionais ocuparem toda a largura
    adicionaisContainerFullWidth: {
        width: '100%',
        paddingLeft: '28px',
        fontSize: '13px',
        color: '#555',
        wordBreak: 'break-word',
        marginTop: '2px',
    },
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
    divisor: {
        border: 0,
        borderTop: '2px solid #eee',
        margin: '10px 0 18px 0',
        width: '100%',
    },
};

// Adicionar responsividade globalmente
const mediaQuery = `@media (max-width: 480px)`;
const responsiveStyles = {
    item: {
        minHeight: '32px',
        paddingBottom: '8px',
        marginBottom: '8px',
    },
    nomeProduto: {
        fontSize: '13px',
    },
    valorUnitario: {
        fontSize: '13px',
        minWidth: '56px',
    },
    quantidade: {
        fontSize: '13px',
    },
    adicionaisContainer: {
        fontSize: '12px',
    },
    adicionalItem: {
        fontSize: '12px',
    },
    btnRemoverItem: {
        fontSize: '16px',
        marginLeft: '6px',
    },
};
// Mesclar responsividade ao exportar styles
Object.keys(responsiveStyles).forEach(key => {
    styles[key] = { ...styles[key], [mediaQuery]: responsiveStyles[key] };
});

export default Carrinho;
