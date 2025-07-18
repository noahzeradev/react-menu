import React, { useState } from 'react';
import { FaBarcode, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import ModalHeader from './ModalHeader';

export default function ConfirmacaoPagamentoModal({ onConfirmar, onFechar, total }) {
    const [formaPagamento, setFormaPagamento] = useState('dinheiro');
    const [troco, setTroco] = useState('');
    const [mensagemSucesso, setMensagemSucesso] = useState("");

    const handleConfirmar = () => {
        if (formaPagamento === 'dinheiro' && (!troco || isNaN(Number(troco)))) {
            alert('Informe o valor para troco ou selecione outra forma de pagamento.');
            return;
        }
        setMensagemSucesso('Pedido enviado com sucesso');
        setTimeout(() => {
            onConfirmar({ formaPagamento, troco: formaPagamento === 'dinheiro' ? troco : null });
        }, 1200);
    };

    const modalStyle = {
        background: "#fff",
        borderRadius: 10,
        maxWidth: '100%',
        width: "100%",
        minHeight: "260px",
        maxHeight: "90vh",
        padding: 0,
        textAlign: "center",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
    };
    const modalContentStyle = {
        flex: 1,
        overflowY: "auto",
        padding: "20px",
    };
    const modalFooterStyle = {
        borderTop: "1px solid #eee",
        padding: "12px 24px 16px 24px",
        background: "#fff",
        position: "sticky",
        bottom: 0,
        zIndex: 2,
    };
    const totalResumoStyle = {
        fontSize: "15px",
        color: "#333",
        marginBottom: "8px",
        textAlign: "center",
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)", zIndex: 20000, display: "flex", justifyContent: "center", alignItems: "center"
        }}
            onClick={e => { if (e.target === e.currentTarget) onFechar(); }}>
            <div style={modalStyle}>
                <ModalHeader
                    onBack={onFechar}
                    onClose={onFechar}
                    icon={<FaCreditCard style={{ marginRight: 8, verticalAlign: 'middle' }} />}
                    label="Pagamento"
                />
                <hr style={{ border: 0, borderTop: '2px solid #eee', margin: '10px 0 18px 0', width: '100%' }} />
                <div style={modalContentStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600 }}>
                            <input type="radio" name="pagamento" value="dinheiro" checked={formaPagamento === 'dinheiro'} onChange={() => setFormaPagamento('dinheiro')} />
                            <FaMoneyBillWave color="#28a745" /> Dinheiro
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600 }}>
                            <input type="radio" name="pagamento" value="credito" checked={formaPagamento === 'credito'} onChange={() => setFormaPagamento('credito')} />
                            <FaCreditCard color="#007bff" /> Cartão de Crédito
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600 }}>
                            <input type="radio" name="pagamento" value="debito" checked={formaPagamento === 'debito'} onChange={() => setFormaPagamento('debito')} />
                            <FaCreditCard color="#007bff" /> Cartão de Débito
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 600 }}>
                            <input type="radio" name="pagamento" value="pix" checked={formaPagamento === 'pix'} onChange={() => setFormaPagamento('pix')} />
                            <FaBarcode color="#8e24aa" /> Pix
                        </label>
                    </div>
                    {formaPagamento === 'dinheiro' && (
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontWeight: 600 }}>Troco para quanto?</label>
                            <input
                                type="number"
                                min="0"
                                value={troco}
                                onChange={e => setTroco(e.target.value)}
                                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
                                placeholder="Digite o valor do troco"
                            />
                        </div>
                    )}
                </div>
                <div style={modalFooterStyle}>
                    <div style={totalResumoStyle}>
                        Total: <strong>R$ {total.toFixed(2)}</strong>
                    </div>
                    {mensagemSucesso && (
                        <div style={{ color: '#28a745', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{mensagemSucesso}</div>
                    )}
                    <button style={{ marginTop: 0, width: "100%", background: "#28a745", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 18, cursor: "pointer" }} onClick={handleConfirmar}>
                        Finalizar
                    </button>
                    <button style={{ marginTop: 12, width: "100%", background: "#ccc", color: "#222", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 16, cursor: "pointer" }} onClick={onFechar}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
} 