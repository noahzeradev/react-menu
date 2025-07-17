import { useMemo, useState } from "react";
import { FaHome, FaShoppingCart } from 'react-icons/fa';
import Carrinho from "../components/Carrinho";
import DetalhesItem from "../components/DetalhesItem";
import HorarioLoja from "../components/HorarioLoja";
import ListaProdutos from "../components/ListaProdutos";

function Cardapio() {
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    // Remover os estados globais de adicionais e quantidadeProduto
    // const [adicionais, setAdicionais] = useState([]);
    // const [quantidadeProduto, setQuantidadeProduto] = useState(1);

    const [carrinhoAberto, setCarrinhoAberto] = useState(false);
    const [produtosNoCarrinho, setProdutosNoCarrinho] = useState([]);

    const [cpfNota, setCpfNota] = useState("");
    const [formaPagamento, setFormaPagamento] = useState("");

    const TAXA_ENTREGA = 5.0;

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

    const total = subtotal + TAXA_ENTREGA;

    const finalizarPedido = () => {
        alert(
            `Pedido finalizado!\nCPF: ${cpfNota || "Não informado"}\nPagamento: ${formaPagamento || "Não selecionado"
            }\nItens: ${produtosNoCarrinho.length}\nTotal: R$ ${total.toFixed(2)}`
        );
        setProdutosNoCarrinho([]);
        setCpfNota("");
        setFormaPagamento("");
        fecharCarrinho();
    };

    const voltarHome = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <HorarioLoja />
                <h2 style={{ marginBottom: "16px" }}>Produtos</h2>
                <ListaProdutos onAdicionarClick={abrirModal} />
            </div>

            {produtoSelecionado && (
                <div style={styles.modalOverlay} onClick={fecharModal}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button style={styles.closeButton} onClick={fecharModal}>
                            &times;
                        </button>
                        <DetalhesItem
                            produto={produtoSelecionado}
                            onAdicionar={onAdicionar}
                        />
                    </div>
                </div>
            )}

            {carrinhoAberto && (
                <Carrinho
                    produtos={produtosNoCarrinho}
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

            <footer style={styles.footer}>
                <button style={styles.footerButton} onClick={voltarHome}>
                    <FaHome style={{ marginRight: 8, verticalAlign: 'middle' }} /> Home
                </button>
                <button style={styles.footerButton} onClick={abrirCarrinho}>
                    <FaShoppingCart style={{ marginRight: 8, verticalAlign: 'middle' }} /> Carrinho
                </button>
            </footer>
        </div>
    );
}

const styles = {
    pageWrapper: {
        display: "flex",
        justifyContent: "center",
        paddingBottom: "80px",
    },
    container: {
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
        maxWidth: "90%",
        maxHeight: "90%",
        overflowY: "auto",
        position: "relative",
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
};

export default Cardapio;