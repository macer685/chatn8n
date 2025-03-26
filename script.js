document.addEventListener("DOMContentLoaded", () => {
    const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
    const messagesDiv = document.getElementById("messages");
    const msgInput = document.getElementById("msgInput");
    const sendBtn = document.getElementById("sendBtn");

    document.getElementById("backBtn").addEventListener("click", function() {
        window.location.href = "https://www.macer.digital/";
    });

    // Función para agregar mensajes al chat (Texto e Imágenes)
    function addMessage(text, type) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", type);

        // Expresión regular para detectar imágenes en formato Markdown ![Texto](URL)
        const markdownImageRegex = /!\[.*?\]\((https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))\)/i;
        const match = text.match(markdownImageRegex);

        if (match) {
            // Extraer el texto sin la imagen
            const textWithoutImage = text.replace(markdownImageRegex, "").trim();
            if (textWithoutImage) {
                const textElement = document.createElement("p");
                textElement.innerHTML = textWithoutImage; // Permite negritas y formato
                messageElement.appendChild(textElement);
            }

            // Crear la imagen
            const img = document.createElement("img");
            img.src = match[1];
            img.alt = "Imagen del producto";
            img.style.maxWidth = "200px";
            img.style.borderRadius = "8px";
            img.style.marginTop = "5px";
            messageElement.appendChild(img);
        } else {
            // Si no hay imagen en formato Markdown, solo muestra el texto
            messageElement.innerHTML = text; // Permite negritas y saltos de línea
        }

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


