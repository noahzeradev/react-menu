import React from 'react';
import { FaClipboardList } from 'react-icons/fa';
import ModalHeader from './ModalHeader';

export default function StatusPedidoModal({ onFechar, pedido }) {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', zIndex: 20000, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
            onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
            <div style={{
                background: '#fff', borderRadius: 10, maxWidth: '100%', width: '100%', minWidth: 320, minHeight: '260px', maxHeight: '90vh',
                padding: 0, textAlign: 'center', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%'
            }}>
                <ModalHeader
                    onBack={onFechar}
                    onClose={onFechar}
                    icon={<FaClipboardList style={{ marginRight: 8, verticalAlign: 'middle' }} />}
                    label="Pedidos"
                />
                <hr style={{ border: 0, borderTop: '2px solid #eee', margin: '10px 0 18px 0', width: '100%' }} />
                <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                    {!pedido ? (
                        <div style={{ color: '#888', fontSize: 18, marginTop: 40 }}>Nenhum pedido realizado ainda.</div>
                    ) : (
                        <>
                            <div style={{ textAlign: 'left', margin: '0 auto', maxWidth: 420 }}>
                                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Resumo do Pedido</div>
                                <div style={{ marginBottom: 12 }}>
                                    <span style={{ fontWeight: 600 }}>Nome:</span> {pedido.nome}<br />
                                    <span style={{ fontWeight: 600 }}>Telefone:</span> {pedido.telefone}
                                    <br />
                                    <span style={{ fontWeight: 600 }}>Tipo de entrega:</span> {pedido.aba ? (pedido.aba === 'entrega' ? 'Entrega' : 'Retirada') : 'Não informado'}<br />
                                    <span style={{ fontWeight: 600 }}>Pagamento:</span> {pedido.formaPagamento ? formatarFormaPagamento(pedido.formaPagamento) : 'Não informado'}
                                </div>
                                <div style={{ fontWeight: 600, marginBottom: 6 }}>Itens:</div>
                                {pedido.produtos && pedido.produtos.length > 0 ? pedido.produtos.map((item, idx) => (
                                    <div key={idx} style={{ borderBottom: '1px solid #eee', padding: '6px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontWeight: 600 }}>{item.quantidade}x</span>
                                            <span style={{ flex: 1 }}>{item.produto.nome}</span>
                                            <span style={{ fontWeight: 600 }}>R$ {(item.produto.valor || 0).toFixed(2)}</span>
                                        </div>
                                        {item.adicionais && item.adicionais.length > 0 && (
                                            <div style={{ paddingLeft: 24, fontSize: 13, color: '#555' }}>
                                                {item.adicionais.filter(ad => ad.quantidade > 0).map((ad, j) => (
                                                    <div key={j} style={{ display: 'flex', gap: 8 }}>
                                                        <span>+ {ad.quantidade}x {ad.nome}</span>
                                                        <span style={{ fontWeight: 600, color: '#222' }}>R$ {(ad.valor * ad.quantidade).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )) : <div style={{ color: '#888', fontSize: 15 }}>Nenhum item no pedido.</div>}
                                <div style={{ borderTop: '1px solid #eee', marginTop: 16, paddingTop: 10, fontWeight: 700, fontSize: 18, color: '#28a745', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Total:</span>
                                    <span>R$ {pedido.total ? pedido.total.toFixed(2) : '0,00'}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Função utilitária para exibir o nome do pagamento de forma amigável
function formatarFormaPagamento(forma) {
    switch (forma) {
        case 'dinheiro': return 'Dinheiro';
        case 'credito': return 'Cartão de Crédito';
        case 'debito': return 'Cartão de Débito';
        case 'pix': return 'Pix';
        default: return forma;
    }
} 