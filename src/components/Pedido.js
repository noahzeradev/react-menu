import { useState } from "react";
import Carrinho from "./Carrinho";
import DetalhesItem from "./DetalhesItem";

// Exemplo simples de produtos
const PRODUTOS = [
    { id: 1, nome: "Coca Cola 360ml", valor: 7.5, descricao: "Refrigerante gelado" },
    { id: 2, nome: "Pizza Calabresa", valor: 35, descricao: "Deliciosa pizza com calabresa" },
];

export default function Pedido() {
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
    const [pedido, setPedido] = useState(null); // pedido com produto + adicionais + quantidade

    const abrirDetalhes = (produto) => {
        setProdutoSelecionado(produto);
        setMostrarCarrinho(false);
        setPedido(null);
    };

    const fecharDetalhes = () => {
        setProdutoSelecionado(null);
    };

    const abrirCarrinho = (pedido) => {
        setPedido(pedido);
        setMostrarCarrinho(true);
        setProdutoSelecionado(null);
    };

    const voltarCardapio = () => {
        setMostrarCarrinho(false);
        setPedido(null);
        setProdutoSelecionado(null);
    };

    return (
        <div>
            {!produtoSelecionado && !mostrarCarrinho && (
                <div>
                    <h2>Produtos</h2>
                    <ul>
                        {PRODUTOS.map((p) => (
                            <li key={p.id}>
                                {p.nome} - R$ {p.valor.toFixed(2)}{" "}
                                <button onClick={() => abrirDetalhes(p)}>Ver detalhes</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {produtoSelecionado && (
                <DetalhesItem
                    produto={produtoSelecionado}
                    onCancelar={fecharDetalhes}
                    onAdicionarPedido={abrirCarrinho} // recebe o pedido montado para abrir carrinho
                />
            )}

            {mostrarCarrinho && pedido && (
                <Carrinho
                    pedido={pedido}
                    onAdicionarMais={() => voltarCardapio()}
                />
            )}
        </div>
    );
}
