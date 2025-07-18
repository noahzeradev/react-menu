import { useEffect, useState } from "react";
import ProdutoItem from "./ProdutoItem";

function ListaProdutos({ onAdicionarClick }) {
    const [produtos, setProdutos] = useState([]);
    const [catalogos, setCatalogos] = useState([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function fetchDados() {
            try {
                // 1. Buscar catálogos
                const resCatalogo = await fetch("https://renderproject-deploy.onrender.com/api/catalogo/catalogonoauth");
                if (!resCatalogo.ok) throw new Error("Erro ao buscar catálogos");
                const catalogosData = await resCatalogo.json();

                // 2. Buscar produtos
                const resProdutos = await fetch("https://renderproject-deploy.onrender.com/api/produtos/produtosnoauth");
                if (!resProdutos.ok) throw new Error("Erro ao buscar produtos");
                const produtosData = await resProdutos.json();

                setCatalogos(catalogosData);
                setProdutos(produtosData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                setCatalogos([{ id_catalogo: 0, nome: "Sem Categoria" }]);
                setProdutos([
                    {
                        id: 1,
                        nome: "Pizza Margherita",
                        descricao: "Pizza com molho de tomate, mussarela e manjericão fresco.",
                        valor: 35.5,
                        catalogo_temp: 0,
                    },
                    {
                        id: 2,
                        nome: "Coca-Cola 350ml",
                        descricao: "Refrigerante gelado para acompanhar sua refeição.",
                        valor: 7.0,
                        catalogo_temp: 0,
                    },
                    {
                        id: 3,
                        nome: "Pasta Alfredo",
                        descricao: "Massa com molho branco cremoso e queijo parmesão.",
                        valor: 29.9,
                        catalogo_temp: 0,
                    },
                ]);
            } finally {
                setCarregando(false);
            }
        }

        fetchDados();
    }, []);

    if (carregando) {
        return <p>Carregando produtos...</p>;
    }

    if (produtos.length === 0) {
        return <p>Nenhum produto encontrado.</p>;
    }

    return (
        <div style={styles.tableWrapper}>
            {catalogos.map((catalogo) => {
                const produtosDoCatalogo = produtos.filter(
                    (p) => p.catalogo_temp === catalogo.id_catalogo
                );

                if (produtosDoCatalogo.length === 0) return null;

                return (
                    <div key={catalogo.id_catalogo} style={{ marginBottom: "2rem" }}>
                        <h2 style={styles.catalogoTitulo}>{catalogo.nome}</h2>
                        <div style={styles.responsiveTable}>
                            <div style={styles.headerFlexRow}>
                                <span style={styles.headerProduto}>Produto</span>
                                <span style={styles.headerAcao}>Ação</span>
                            </div>
                            <table style={styles.table}>
                                <tbody>
                                    {produtosDoCatalogo.map((produto) => (
                                        <ProdutoItem
                                            key={produto.id_produto || produto.id}
                                            produto={produto}
                                            onAdicionarClick={onAdicionarClick}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    headerRow: {
        backgroundColor: "#f0f0f0",
        textAlign: "left",
    },
    cell: {
        padding: "10px",
        borderBottom: "1px solid #ddd",
    },
    catalogoTitulo: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "0.5rem",
        borderBottom: "2px solid #ddd",
        paddingBottom: "4px",
    },
    responsiveTable: {
        width: '100%',
        minWidth: 0,
        overflowX: 'auto',
        boxSizing: 'border-box',
    },
    headerFlexRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px 4px 10px',
        fontWeight: 600,
        fontSize: '15px',
        color: '#444',
    },
    headerProduto: {
        flex: 1,
        minWidth: 0,
        textAlign: 'left',
    },
    headerAcao: {
        minWidth: '60px',
        textAlign: 'right',
    },
};

export default ListaProdutos;