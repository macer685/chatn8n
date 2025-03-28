document.addEventListener("DOMContentLoaded", () => {
    const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
    const messagesDiv = document.getElementById("messages");
    const msgInput = document.getElementById("msgInput");
    const sendBtn = document.getElementById("sendBtn");

    document.getElementById("backBtn").addEventListener("click", function() {
        window.location.href = "https://www.macer.digital/";
    });

    // Función para cargar una imagen con reintentos usando la URL original (sin timestamp)
    function loadImageWithRetry(url, retries = 3) {
        return new Promise((resolve, reject) => {
            let attempt = 0;
            const img = new Image();

            function tryLoad() {
                console.log("Intento de carga de la imagen, intento:", attempt + 1, " URL:", url);
                img.src = url;
            }

            img.onload = () => {
                console.log("Imagen cargada correctamente.");
                resolve(img);
            };

            img.onerror = () => {
                attempt++;
                console.warn("Error al cargar la imagen, intento:", attempt);
                if (attempt < retries) {
                    tryLoad();
                } else {
                    reject(new Error('Error al cargar la imagen tras varios intentos.'));
                }
            };

            tryLoad();
        });
    }

    // Función para agregar mensajes al chat (Texto e Imágenes)
    function addMessage(text, type) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", type);

        // Nueva expresión regular para capturar la URL de la imagen (incluyendo parámetros, si existen)
        const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^\)]+\.(?:png|jpg|jpeg|gif|webp)(?:\?[^\)]+)?)\)/i;
        const match = text.match(markdownImageRegex);

        if (match) {
            console.log("Markdown detectado. URL extraída:", match[1]);

            // Extraer el texto sin la imagen
            const textWithoutImage = text.replace(markdownImageRegex, "").trim();
            if (textWithoutImage) {
                const textElement = document.createElement("p");
                textElement.innerHTML = textWithoutImage; // Permite formato HTML (como negritas)
                messageElement.appendChild(textElement);
            }

            // Crear un contenedor para la imagen
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("chat-image");
            messageElement.appendChild(imageContainer);

            // Cargar la imagen usando la función con reintentos
            loadImageWithRetry(match[1])
                .then(img => {
                    img.alt = "Imagen del producto";
                    img.style.maxWidth = "200px";
                    img.style.borderRadius = "8px";
                    img.style.marginTop = "5px";
                    imageContainer.appendChild(img);
                })
                .catch(err => {
                    imageContainer.innerHTML = "<em>No se pudo cargar la imagen</em>";
                    console.error(err);
                });
        } else {
            console.log("No se detectó formato markdown de imagen.");
            // Si no hay imagen en formato Markdown, solo muestra el texto
            messageElement.innerHTML = text;
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





