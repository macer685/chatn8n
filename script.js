document.addEventListener("DOMContentLoaded", () => {
    const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
    const messagesDiv = document.getElementById("messages");
    const msgInput = document.getElementById("msgInput");
    const sendBtn = document.getElementById("sendBtn");
    const backBtn = document.getElementById("backBtn");

    // Redirigir al usuario al sitio principal
    backBtn.addEventListener("click", () => {
        window.location.href = "https://www.macer.digital/";
    });

    // Función para agregar mensajes al chat
    function addMessage(text, type) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", type);
        messageElement.textContent = text;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Función para enviar mensaje
    async function sendMessage() {
        const msg = msgInput.value.trim();
        if (!msg) return;
        addMessage(msg, "sent");
        msgInput.value = "";

        try {
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mensaje: msg })
            });

            if (response.ok) {
                const data = await response.json();
                addMessage(data.respuesta || "Sin respuesta", "received");
            } else {
                addMessage("Error en la respuesta del servidor.", "received");
            }
        } catch (error) {
            addMessage("No se pudo conectar con el servidor.", "received");
        }
    }

    sendBtn.addEventListener("click", sendMessage);
    msgInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") sendMessage();
    });
});






