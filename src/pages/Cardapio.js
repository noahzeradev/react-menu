import { useMemo, useState } from "react";
import { FaClipboardList, FaHome, FaShoppingCart, FaUser } from 'react-icons/fa';
import Carrinho from "../components/Carrinho";
import DetalhesItem from "../components/DetalhesItem";
import HorarioLoja from "../components/HorarioLoja";
import ListaProdutos from "../components/ListaProdutos";
import StatusPedidoModal from '../components/StatusPedidoModal';

function Cardapio() {
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    // Remover os estados globais de adicionais e quantidadeProduto
    // const [adicionais, setAdicionais] = useState([]);
    // const [quantidadeProduto, setQuantidadeProduto] = useState(1);

    const [carrinhoAberto, setCarrinhoAberto] = useState(false);
    const [produtosNoCarrinho, setProdutosNoCarrinho] = useState([]);

    const [cpfNota, setCpfNota] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");
    const [pedidoSalvo, setPedidoSalvo] = useState(null);
    const [statusPedidoAberto, setStatusPedidoAberto] = useState(false);

    // Remover fetchAdicionaisPorCatalogoTemp e o useEffect relacionado

    const abrirModal = (produto) => {
        setProdutoSelecionado(produto);
    };

    const fecharModal = () => {
        setProdutoSelecionado(null);
    };

    const abrirCarrinho = () => {
        setCarrinhoAberto(true);
    };

    const fecharCarrinho = () => {
        setCarrinhoAberto(false);
    };

    // Corrigir onAdicionar para receber o item pronto
    const onAdicionar = (itemParaAdicionar) => {
        setProdutosNoCarrinho((prev) => [...prev, itemParaAdicionar]);
        fecharModal();
        abrirCarrinho();
    };

    const subtotal = useMemo(() => {
        if (!produtosNoCarrinho || produtosNoCarrinho.length === 0) return 0;
        return produtosNoCarrinho.reduce((acc, item) => {
            const adicionaisValor = item.adicionais
                ? item.adicionais.reduce(
                    (accAd, ad) => accAd + (ad.valor || 0) * (ad.quantidade || 0),
                    0
                )
                : 0;
            const totalUnitario = (item.produto.valor || 0) + adicionaisValor;
            return acc + totalUnitario * (item.quantidade || 0);
        }, 0);
    }, [produtosNoCarrinho]);

    const total = subtotal;

    const finalizarPedido = (dadosPedido) => {
        // Salva o pedido em memória
        setPedidoSalvo({
            ...dadosPedido,
            produtos: produtosNoCarrinho,
            total,
        });
        setProdutosNoCarrinho([]);
        setCpfNota("");
        setFormaPagamento("");
        fecharCarrinho();
        setTimeout(() => setStatusPedidoAberto(true), 400); // Abre modal de pedidos após finalizar
    };

    const voltarHome = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Header principal */}
            <div style={styles.header}>
                <div style={styles.profileCircle}>
                    <FaUser size={38} color="#888" />
                </div>
            </div>
            {/* Header menor para o HorarioLoja */}
            <div style={styles.subHeader}>
                <div style={styles.nomeEstabelecimento}>Seu Estabelecimento</div>
                <HorarioLoja />
            </div>
            <div style={styles.container}>
                <h2 style={{ marginBottom: "16px" }}>Produtos</h2>
                <ListaProdutos onAdicionarClick={abrirModal} />
            </div>

            {produtoSelecionado && (
                <div style={styles.overlay} onClick={fecharModal}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <button style={{ ...styles.btnFechar, left: 10, right: 'auto', top: 10 }} onClick={fecharModal} aria-label="Voltar">
                            &#8592;
                        </button>
                        <DetalhesItem
                            produto={produtoSelecionado}
                            onAdicionar={onAdicionar}
                            onFechar={fecharModal}
                        />
                    </div>
                </div>
            )}

            {carrinhoAberto && (
                <Carrinho
                    produtos={produtosNoCarrinho}
                    setProdutosNoCarrinho={setProdutosNoCarrinho}
                    subtotal={subtotal}
                    total={total}
                    cpfNota={cpfNota}
                    formaPagamento={formaPagamento}
                    setCpfNota={setCpfNota}
                    setFormaPagamento={setFormaPagamento}
                    onFechar={fecharCarrinho}
                    onFinalizar={finalizarPedido}
                />
            )}

            {statusPedidoAberto && (
                <StatusPedidoModal
                    onFechar={() => setStatusPedidoAberto(false)}
                    pedido={pedidoSalvo}
                />
            )}

            <footer style={styles.footer}>
                <button style={styles.footerButton} onClick={voltarHome}>
                    <FaHome style={{ marginRight: 8, verticalAlign: 'middle' }} /> Home
                </button>
                <button style={styles.footerButton} onClick={abrirCarrinho}>
                    <FaShoppingCart style={{ marginRight: 8, verticalAlign: 'middle' }} /> Carrinho
                </button>
                <button style={styles.footerButton} onClick={() => setStatusPedidoAberto(true)}>
                    <FaClipboardList style={{ marginRight: 8, verticalAlign: 'middle' }} /> Pedidos
                </button>
            </footer>
        </div>
    );
}

const styles = {
    pageWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: "80px",
        minHeight: "100vh",
        background: "#f7f7f7",
    },
    header: {
        width: "100%",
        height: "120px",
        background: "#e0e0e0",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        marginBottom: "30px", // espaço para a bolinha
        boxSizing: "border-box",
    },
    profileCircle: {
        position: "absolute",
        left: "50%",
        bottom: "-30px",
        transform: "translateX(-50%)",
        width: "60px",
        height: "60px",
        background: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        border: "3px solid #e0e0e0",
        zIndex: 10,
    },
    subHeader: {
        width: "100%",
        minHeight: "54px",
        background: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        zIndex: 5,
    },
    nomeEstabelecimento: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#222",
        marginBottom: "2px",
        textAlign: "center",
    },
    container: {
        width: "100%",
        maxWidth: "100vw",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        overflowX: "auto",
    },
    modalOverlay: {
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
    modalContent: {
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        width: "100%",
        maxWidth: "100vw",
        maxHeight: "90%",
        overflowY: "auto",
        overflowX: "auto",
        position: "relative",
        // Responsividade para telas pequenas
        '@media (max-width: 480px)': {
            padding: '6px',
        },
    },
    closeButton: {
        position: "absolute",
        top: "8px",
        right: "12px",
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
    },
    footer: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 0",
        borderTop: "1px solid #ddd",
        zIndex: 1000,
    },
    footerButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "20px",
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
    },
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
    btnFechar: {
        position: "absolute",
        top: "12px",
        left: 10,
        right: "auto",
        border: "none",
        background: "none",
        fontSize: "28px",
        cursor: "pointer",
        color: "#888",
        transition: "color 0.2s",
        zIndex: 10,
    },
};

export default Cardapio;