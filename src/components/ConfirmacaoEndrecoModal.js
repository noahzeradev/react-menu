import React, { useState } from 'react';
import { MdLocationOn, MdSportsMotorsports } from 'react-icons/md';
import ModalHeader from './ModalHeader';

export default function ConfirmacaoEnderecoModal({ nome, telefone, onConfirmar, onFechar, total }) {
    const [aba, setAba] = useState('entrega');
    const [tipoRetirada, setTipoRetirada] = useState('padrao');
    // Inicializa o endereço a partir do localStorage, se existir
    const [endereco, setEndereco] = useState(() => {
        const salvo = localStorage.getItem('carrinho_endereco');
        return salvo ? JSON.parse(salvo) : { rua: '', numero: '', bairro: '', complemento: '' };
    });

    // Endereço padrão simulado (futuramente pode vir do backend)
    const enderecoPadrao = {
        rua: 'Rua teste nº 22',
        bairro: 'Bairro 1',
    };

    // Taxa de entrega fixa
    const TAXA_ENTREGA = 5.00;

    const handleEnderecoChange = (e) => {
        const novoEndereco = { ...endereco, [e.target.name]: e.target.value };
        setEndereco(novoEndereco);
        // Salva no localStorage apenas se estiver na aba entrega
        if (aba === 'entrega') {
            localStorage.setItem('carrinho_endereco', JSON.stringify(novoEndereco));
        }
    };

    const handleConfirmar = () => {
        if (aba === 'entrega') {
            if (!endereco.rua.trim() || !endereco.numero.trim() || !endereco.bairro.trim()) {
                alert("Preencha todos os campos de endereço obrigatórios.");
                return;
            }
        }
        onConfirmar({
            aba,
            endereco: aba === 'entrega' ? endereco : undefined,
            tipoRetirada: aba === 'retirada' ? tipoRetirada : undefined,
        });
    };

    // Quando trocar para aba retirada, limpa o localStorage de endereço (opcional)
    React.useEffect(() => {
        if (aba !== 'entrega') return;
        // Ao trocar para entrega, carrega do localStorage se existir
        const salvo = localStorage.getItem('carrinho_endereco');
        if (salvo) {
            setEndereco(JSON.parse(salvo));
        }
    }, [aba]);

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
                {/* Botão voltar removido, pois ModalHeader já faz esse papel */}
                <ModalHeader
                    onBack={onFechar}
                    onClose={onFechar}
                    icon={<MdSportsMotorsports style={{ marginRight: 8, verticalAlign: 'middle' }} />}
                    label={aba === 'entrega' ? 'Entrega' : 'Retirada'}
                />
                <hr style={{ border: 0, borderTop: '2px solid #eee', margin: '10px 0 18px 0', width: '100%' }} />
                <div style={modalContentStyle}>
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
                    <div style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 16, textAlign: 'left' }}>
                            <MdLocationOn color="#007bff" size={22} />
                            {aba === 'entrega'
                                ? 'Selecione um Endereço'
                                : 'Endereço padrão'}
                        </div>
                        {aba === 'entrega' && (
                            <div style={{ marginLeft: 32, marginTop: 4, color: '#444', fontWeight: 500, fontSize: 15, whiteSpace: 'pre-line', textAlign: 'left' }}>
                                {`Por favor preencha os campos abaixo
Para continuar ...`}
                            </div>
                        )}
                        {aba === 'retirada' && (
                            <>
                                <div style={{ marginLeft: 32, marginTop: 4, color: '#444', fontWeight: 500, fontSize: 15, whiteSpace: 'pre-line', textAlign: 'left' }}>
                                    {`${enderecoPadrao.rua}
${enderecoPadrao.bairro}`}
                                </div>
                                <hr style={{ border: 0, borderTop: '2px solid #eee', margin: '10px 0 18px 0', width: '100%' }} />
                            </>
                        )}
                    </div>
                    {aba === 'entrega' ? (
                        <>
                            <form style={{ textAlign: 'left', marginBottom: 0 }}>
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
                            <hr style={{ border: 0, borderTop: '2px solid #eee', margin: '10px 0 18px 0', width: '100%' }} />
                            <div style={{ border: '2px solid orange', borderRadius: 8, padding: '12px 16px', background: '#fffbe6', color: '#b26a00', fontWeight: 600, fontSize: 15, marginBottom: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <MdLocationOn color="#ff9800" size={22} style={{ minWidth: 22 }} />
                                Taxa de entrega:
                                <span style={{ color: '#28a745', fontWeight: 700, marginLeft: 4 }}>
                                    R$ {TAXA_ENTREGA.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: 18, textAlign: 'left', display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'center', justifyContent: 'flex-start' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={tipoRetirada === 'padrao'}
                                        onChange={() => setTipoRetirada('padrao')}
                                        style={{ width: 22, height: 22 }}
                                    />
                                    Padrão
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        checked={tipoRetirada === 'agendar'}
                                        onChange={() => setTipoRetirada('agendar')}
                                        style={{ width: 22, height: 22 }}
                                    />
                                    Agendar
                                </label>
                            </div>
                            <hr style={{ border: 0, borderTop: '2px solid #eee', margin: '10px 0 18px 0', width: '100%' }} />
                        </>
                    )}
                </div>
                <div style={modalFooterStyle}>
                    <div style={totalResumoStyle}>
                        Total: <strong>R$ {total.toFixed(2)}</strong>
                    </div>
                    <button style={{ marginTop: 0, width: "100%", background: "#28a745", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 18, cursor: "pointer" }} onClick={handleConfirmar}>
                        Continuar
                    </button>
                    <button style={{ marginTop: 12, width: "100%", background: "#ccc", color: "#222", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 16, cursor: "pointer" }} onClick={onFechar}>
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
} 