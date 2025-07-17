import { useEffect, useState } from "react";

const MOCK_ADICIONAIS = [
    { id_adicional: 1, nome: "Queijo Extra", valor: 2.5 },
    { id_adicional: 2, nome: "Bacon", valor: 3.0 },
    { id_adicional: 3, nome: "Ovo", valor: 1.5 },
    { id_adicional: 4, nome: "Cebola", valor: 1.0 },
    { id_adicional: 5, nome: "Tomate", valor: 1.0 },
    { id_adicional: 6, nome: "Azeitona", valor: 1.5 },
    { id_adicional: 7, nome: "Milho", valor: 1.0 },
    { id_adicional: 8, nome: "Pimenta", valor: 0.5 },
    { id_adicional: 9, nome: "Orégano", valor: 0.5 },
    { id_adicional: 10, nome: "Molho Especial", valor: 3.5 },
];

export default function DetalhesItem({ produto, onAdicionar }) {
    const [adicionais, setAdicionais] = useState([]);
    const [quantidadeProduto, setQuantidadeProduto] = useState(1);

    useEffect(() => {
        async function fetchAdicionais() {
            if (!produto.catalogo_temp) {
                // Caso não tenha catalogo_temp definido, usa mock ou vazio
                setAdicionais(MOCK_ADICIONAIS.map(item => ({ ...item, quantidade: 0 })));
                return;
            }
            try {
                const res = await fetch(`https://renderproject-deploy.onrender.com/api/adicional/catalogo/${produto.catalogo_temp}`);
                if (!res.ok) throw new Error("Erro ao buscar adicionais");
                const data = await res.json();
                const comQuantidade = data.map(item => ({ ...item, quantidade: 0 }));
                setAdicionais(comQuantidade);
            } catch (err) {
                console.error("Erro ao buscar adicionais filtrados. Usando mock.", err);
                setAdicionais(MOCK_ADICIONAIS.map(item => ({ ...item, quantidade: 0 })));
            }
        }

        fetchAdicionais();
    }, [produto.catalogo_temp]);

    const aumentar = (id) => {
        setAdicionais(old =>
            old.map(item =>
                item.id_adicional === id ? { ...item, quantidade: item.quantidade + 1 } : item
            )
        );
    };

    const diminuir = (id) => {
        setAdicionais(old =>
            old.map(item =>
                item.id_adicional === id && item.quantidade > 0
                    ? { ...item, quantidade: item.quantidade - 1 }
                    : item
            )
        );
    };

    const aumentarProduto = () => setQuantidadeProduto(q => q + 1);
    const diminuirProduto = () => setQuantidadeProduto(q => (q > 1 ? q - 1 : 1));

    const totalAdicionais = adicionais.reduce((acc, item) => acc + item.valor * item.quantidade, 0);
    const totalUnitario = produto.valor + totalAdicionais;
    const totalGeral = totalUnitario * quantidadeProduto;

    const handleAdicionar = () => {
        if (onAdicionar) {
            const adicionaisSelecionados = adicionais
                .filter(a => a.quantidade > 0)
                .map(a => ({
                    id_adicional: a.id_adicional,
                    nome: a.nome,
                    valor: a.valor,
                    quantidade: a.quantidade
                }));

            // console.log("DEBUG - Enviando ao carrinho:", {
            //     produto,
            //     quantidadeProduto,
            //     adicionaisSelecionados,
            // });

            onAdicionar({
                produto,
                quantidade: quantidadeProduto, // Corrigido aqui!
                adicionais: adicionaisSelecionados,
            });
        }
    };

    return (
        <div style={styles.wrapper}>
            <h3 style={styles.header}>Detalhes do item:</h3>

            <div style={styles.content}>
                <p style={styles.produtoNome}>{produto.nome}</p>
                <p style={styles.produtoDesc}>{produto.descricao}</p>
                <p>Valor base: R$ {produto.valor.toFixed(2)}</p>

                <h4 style={styles.subheader}>Adicionais:</h4>

                {adicionais.length === 0 ? (
                    <p>Carregando adicionais...</p>
                ) : (
                    <div style={styles.scrollArea}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.theadNome}>ADICIONAL</th>
                                    <th style={styles.theadValor}>VALOR</th>
                                    <th style={styles.theadQtd}>QTD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adicionais.map(({ id_adicional, nome, valor, quantidade }) => (
                                    <tr key={id_adicional}>
                                        <td style={styles.nomeCell}>{nome.toUpperCase()}</td>
                                        <td style={styles.valorCell}>R$ {valor.toFixed(2).replace(".", ",")}</td>
                                        <td style={styles.qtdCell}>
                                            <button
                                                onClick={() => diminuir(id_adicional)}
                                                disabled={quantidade === 0}
                                                style={{
                                                    marginRight: "8px",
                                                    cursor: quantidade === 0 ? "not-allowed" : "pointer",
                                                    minWidth: "28px",      // largura mínima
                                                    height: "28px",        // altura fixa
                                                    display: "inline-flex", // garantir alinhamento
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                -
                                            </button>
                                            {quantidade}
                                            <button
                                                onClick={() => aumentar(id_adicional)}
                                                style={{
                                                    marginLeft: "8px",
                                                    cursor: "pointer",
                                                    minWidth: "28px",      // largura mínima
                                                    height: "28px",        // altura fixa
                                                    display: "inline-flex", // garantir alinhamento
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                +
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={styles.footer}>
                <div style={styles.quantidadeFooter}>
                    <button onClick={diminuirProduto} disabled={quantidadeProduto <= 1}>-</button>
                    <span style={{ margin: "0 10px" }}>{quantidadeProduto}</span>
                    <button onClick={aumentarProduto}>+</button>
                </div>

                <button onClick={handleAdicionar} style={styles.addButton}>
                    Adicionar R$ {totalGeral.toFixed(2).replace(".", ",")}
                </button>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        position: "relative",
        width: "100%",
        maxWidth: "960px",
        maxHeight: "600px",
        padding: "16px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontSize: "14px",
    },
    header: {
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        paddingBottom: "6px",
        borderBottom: "1px solid #ddd",
        margin: 0,
        fontSize: "16px",
        zIndex: 10,
    },
    content: {
        overflowY: "auto",
        paddingRight: "6px",
        flex: 1,
    },
    produtoNome: {
        fontWeight: "bold",
        fontSize: "16px",
        marginTop: "10px",
        marginBottom: "5px",
    },
    produtoDesc: {
        fontStyle: "italic",
        marginBottom: "15px",
        fontSize: "13px",
    },
    subheader: {
        marginBottom: "10px",
        fontSize: "15px",
    },
    scrollArea: {
        maxHeight: "260px",
        overflowY: "auto",
        border: "1px solid #eee",
        borderRadius: "4px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    theadNome: {
        textAlign: "left",
        padding: "8px",
        borderBottom: "1px solid #ccc",
        width: "60%",
        fontSize: "14px",
    },
    theadValor: {
        textAlign: "center",
        padding: "8px",
        borderBottom: "1px solid #ccc",
        width: "20%",
        fontSize: "14px",
    },
    theadQtd: {
        textAlign: "center",
        padding: "8px",
        borderBottom: "1px solid #ccc",
        width: "20%",
        fontSize: "14px",
    },
    nomeCell: {
        padding: "8px",
        borderBottom: "1px solid #eee",
        verticalAlign: "middle",
        fontSize: "14px",
    },
    valorCell: {
        padding: "8px",
        borderBottom: "1px solid #eee",
        textAlign: "center",
        color: "#007bff",
        fontWeight: "bold",
        verticalAlign: "middle",
        fontSize: "14px",
    },
    qtdCell: {
        padding: "8px",
        borderBottom: "1px solid #eee",
        textAlign: "center",
        verticalAlign: "middle",
        fontSize: "14px",
        display: "flex",           // alinhamento horizontal
        alignItems: "center",      // centralizar verticalmente
        justifyContent: "center",  // centralizar horizontalmente
        gap: "8px",                // espaço entre botões e número
    },
    footer: {
        position: "sticky",
        bottom: 0,
        backgroundColor: "#fff",
        padding: "12px 0 0 0",
        marginTop: "auto",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
        fontSize: "15px",
    },
    quantidadeFooter: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
    },
    addButton: {
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "15px",
        padding: "10px 18px",
        borderRadius: "4px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        userSelect: "none",
    },
};

