import React, { useState } from 'react';
import { MdSportsMotorsports } from 'react-icons/md';

export default function ConfirmacaoModal({ nome, telefone, onConfirmar, onFechar, total }) {
    const [aba, setAba] = useState('entrega');
    const [tipoRetirada, setTipoRetirada] = useState('padrao');
    const [endereco, setEndereco] = useState({ rua: '', numero: '', bairro: '', complemento: '' });

    const handleEnderecoChange = (e) => {
        setEndereco({ ...endereco, [e.target.name]: e.target.value });
    };

    const handleConfirmar = () => {
        if (aba === 'entrega') {
            if (!endereco.rua.trim() || !endereco.numero.trim() || !endereco.bairro.trim()) {
                alert("Preencha todos os campos de endereço obrigatórios.");
                return;
            }
        }
        onConfirmar();
    };

    // Estilos do modal
    const modalStyle = {
        background: "#fff",
        borderRadius: 10,
        maxWidth: '100%',
        width: "100%",
        minHeight: "320px",
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
        padding: "20px", // Padding igual ao Cardápio
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
                <button style={{ position: 'absolute', top: 10, left: 10, background: 'none', border: 'none', fontSize: 24, color: '#007bff', cursor: 'pointer', zIndex: 10, padding: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onFechar} aria-label="Voltar">
                    &#8592;
                </button>
                <div style={modalContentStyle}>
                    <h2 style={{
                        margin: 0,
                        marginBottom: 20,
                        fontSize: 24,
                        fontWeight: 700,
                        textAlign: "center",
                        color: "#222"
                    }}>
                        <MdSportsMotorsports style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        Entrega
                    </h2>
                    {/* Abas */}
                    <div style={{ display: 'flex', marginBottom: 20, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #eee' }}>
                        <button
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                background: aba === 'entrega' ? '#007bff' : '#f0f0f0',
                                color: aba === 'entrega' ? '#fff' : '#333',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: 16,
                                transition: 'background 0.2s',
                            }}
                            onClick={() => setAba('entrega')}
                        >
                            Entrega
                        </button>
                        <button
                            style={{
                                flex: 1,
                                padding: '10px 0',
                                background: aba === 'retirada' ? '#007bff' : '#f0f0f0',
                                color: aba === 'retirada' ? '#fff' : '#333',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: 16,
                                transition: 'background 0.2s',
                            }}
                            onClick={() => setAba('retirada')}
                        >
                            Retirada
                        </button>
                    </div>
                    {/* Conteúdo das abas */}
                    {aba === 'entrega' ? (
                        <form style={{ textAlign: 'left', marginBottom: 20 }}>
                            <div style={{ marginBottom: 10 }}>
                                <label style={{ fontWeight: 600 }}>Rua</label>
                                <input
                                    name="rua"
                                    value={endereco.rua}
                                    onChange={handleEnderecoChange}
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
                                    placeholder="Digite a rua"
                                />
                            </div>
                            <div style={{ marginBottom: 10, display: 'flex', gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600 }}>Número</label>
                                    <input
                                        name="numero"
                                        value={endereco.numero}
                                        onChange={handleEnderecoChange}
                                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
                                        placeholder="Nº"
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <label style={{ fontWeight: 600 }}>Bairro</label>
                                    <input
                                        name="bairro"
                                        value={endereco.bairro}
                                        onChange={handleEnderecoChange}
                                        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
                                        placeholder="Bairro"
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: 10 }}>
                                <label style={{ fontWeight: 600 }}>Complemento</label>
                                <input
                                    name="complemento"
                                    value={endereco.complemento}
                                    onChange={handleEnderecoChange}
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
                                    placeholder="Complemento (opcional)"
                                />
                            </div>
                        </form>
                    ) : (
                        <div style={{ marginBottom: 20, textAlign: 'left' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                <input
                                    type="radio"
                                    checked={tipoRetirada === 'padrao'}
                                    onChange={() => setTipoRetirada('padrao')}
                                />
                                Padrão
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="radio"
                                    checked={tipoRetirada === 'agendar'}
                                    onChange={() => setTipoRetirada('agendar')}
                                />
                                Agendar
                            </label>
                        </div>
                    )}
                </div>
                <div style={modalFooterStyle}>
                    <div style={totalResumoStyle}>
                        Total: <strong>R$ {total.toFixed(2)}</strong>
                    </div>
                    <button style={{ marginTop: 0, width: "100%", background: "#28a745", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 18, cursor: "pointer" }} onClick={handleConfirmar}>
                        Confirmar Pedido
                    </button>
                    <button style={{ marginTop: 12, width: "100%", background: "#ccc", color: "#222", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 16, cursor: "pointer" }} onClick={onFechar}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
} 