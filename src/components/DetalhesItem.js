import { useEffect, useState } from "react";
import { FaInfoCircle } from 'react-icons/fa';
import ModalHeader from './ModalHeader';

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

export default function DetalhesItem({ produto, onAdicionar, onFechar }) {
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
        <>
            <ModalHeader
                onBack={onFechar}
                onClose={onFechar}
                icon={<FaInfoCircle style={{ marginRight: 8, verticalAlign: 'middle' }} />}
                label="Detalhes do item"
            />
            <hr style={styles.divisor} />
            <div style={styles.content}>
                <p style={styles.produtoNome}>{produto.nome}</p>
                <p style={styles.produtoDesc}>{produto.descricao}</p>
                <p>Valor base: R$ {produto.valor.toFixed(2)}</p>
                <hr style={styles.divisor} />
                {adicionais.length > 0 && (
                    <>
                        <h4 style={styles.subheader}>Adicionais:</h4>
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
                                                        minWidth: "28px",
                                                        height: "28px",
                                                        display: "inline-flex",
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
                                                        minWidth: "28px",
                                                        height: "28px",
                                                        display: "inline-flex",
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
                    </>
                )}
            </div>
            <div style={styles.footerResumo}>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <div style={styles.quantidadeFooter}>
                        <button onClick={diminuirProduto} disabled={quantidadeProduto <= 1}>-</button>
                        <span style={{ margin: "0 10px" }}>{quantidadeProduto}</span>
                        <button onClick={aumentarProduto}>+</button>
                    </div>
                    <button onClick={handleAdicionar} style={styles.btnFinalizar}>
                        Adicionar R$ {totalGeral.toFixed(2).replace(".", ",")}
                    </button>
                </div>
            </div>
        </>
    );
}

const styles = {
    wrapper: {
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        maxHeight: "600px",
        padding: "16px 20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontSize: "14px",
        overflowX: "auto",
        margin: "0 auto",
        '@media (max-width: 480px)': {
            padding: '8px 4px',
            maxWidth: '98vw',
        },
    },
    // header removido, usar styles.titulo
    titulo: {
        margin: 0,
        marginBottom: "16px",
        fontSize: "24px",
        fontWeight: "700",
        textAlign: "center",
        color: "#222",
    },
    content: {
        overflowY: "auto",
        paddingRight: "6px",
        flex: 1,
        width: "100%",
        maxWidth: "600px",
        boxSizing: "border-box",
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
        width: "100%",
        maxWidth: "600px",
        boxSizing: "border-box",
    },
    table: {
        width: "100%",
        minWidth: "220px",
        maxWidth: "100%",
        borderCollapse: "collapse",
        boxSizing: "border-box",
        // Responsividade para telas pequenas
        '@media (max-width: 480px)': {
            minWidth: '220px',
        },
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
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
    },
    quantidadeFooter: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
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
        marginTop: 12,
        marginBottom: 0,
        display: 'block',
    },
    innerContent: {
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    divisor: {
        border: 0,
        borderTop: '2px solid #eee',
        margin: '18px 0 10px 0',
        width: '100%',
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
    footerResumo: {
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
};

