
function HorarioLoja() {
    const horarioAtual = new Date();
    const diaSemana = horarioAtual.getDay(); // 0 = domingo, 6 = sábado
    const hora = horarioAtual.getHours();
    const minutos = horarioAtual.getMinutes();

    // Horários fixos por dia da semana
    const horarios = {
        0: { abre: "14:30", fecha: "22:00" }, // domingo
        1: { abre: "11:00", fecha: "22:00" },
        2: { abre: "11:00", fecha: "22:00" },
        3: { abre: "11:00", fecha: "22:00" },
        4: { abre: "11:00", fecha: "22:00" },
        5: { abre: "11:00", fecha: "23:00" },
        6: { abre: "14:00", fecha: "23:00" }, // sábado
    };

    const diasDaSemana = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
    ];

    const [abreHora, abreMinuto] = horarios[diaSemana].abre.split(":").map(Number);
    const [fechaHora, fechaMinuto] = horarios[diaSemana].fecha.split(":").map(Number);

    const horaAtualMinutos = hora * 60 + minutos;
    const abreMinutos = abreHora * 60 + abreMinuto;
    const fechaMinutos = fechaHora * 60 + fechaMinuto;

    const estaAberto = horaAtualMinutos >= abreMinutos && horaAtualMinutos < fechaMinutos;

    let status = "";
    let detalhe = "";

    if (estaAberto) {
        status = "Aberto agora";
        detalhe = `Fecha hoje às ${horarios[diaSemana].fecha}`;
    } else {
        // Descobrir o próximo dia com horário válido
        let proximoDia = diaSemana;
        let diasProcurados = 0;

        while (diasProcurados < 7) {
            proximoDia = (proximoDia + 1) % 7;
            diasProcurados++;
            if (horarios[proximoDia]) break;
        }

        status = "Fechado agora";
        detalhe = `Abre ${diasDaSemana[proximoDia]} às ${horarios[proximoDia].abre}`;
    }

    return (
        <div style={styles.container}>
            <div style={estaAberto ? styles.aberto : styles.fechado}>{status}</div>
            <div style={styles.detalhe}>{detalhe}</div>
        </div>
    );
}

const styles = {
    container: {
        textAlign: "center",
        marginBottom: "20px",
    },
    aberto: {
        color: "green",
        fontWeight: "bold",
        fontSize: "1.2rem",
    },
    fechado: {
        color: "red",
        fontWeight: "bold",
        fontSize: "1.2rem",
    },
    detalhe: {
        fontSize: "0.95rem",
        color: "#555",
        marginTop: "4px",
    },
};

export default HorarioLoja;
