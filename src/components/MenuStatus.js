import { useEffect, useState } from "react";

function MenuStatus() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const now = new Date();
        const hour = now.getHours();

        setIsOpen(hour >= 9 && hour < 21);
    }, []);

    return (
        <div style={{ padding: "10px", backgroundColor: isOpen ? "#4CAF50" : "#F44336", color: "white" }}>
            {isOpen ? "Loja Aberta" : "Loja Fechada"}
        </div>
    );
}

export default MenuStatus;
