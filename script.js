// Webhook de n8n
const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// Agregar mensajes en el chat
function addMessage(text, sender) {
    const msgElement = document.createElement("div");
    msgElement.classList.add("chat-message");
    msgElement.classList.add(sender === "Usuario" ? "sent" : "received");
    msgElement.textContent = text;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Enviar mensaje a n8n y obtener respuesta
async function sendMessage() {
    const msg = msgInput.value.trim();
    if (!msg) return;

    addMessage(msg, "Usuario");
    msgInput.value = "";

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensaje: msg })
        });

        const data = await response.json();
        addMessage(data.respuesta || "Sin respuesta", "Tatiana");
    } catch (error) {
        console.error("Error al enviar:", error);
        addMessage("Error al comunicarse con el bot.", "Tatiana");
    }
}

// Evento para botón y tecla "Enter"
sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
});

// Botón volver
function goBack() {
    window.location.href = "https://www.macer.digital/";
}

