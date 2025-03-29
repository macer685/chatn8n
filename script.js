document.addEventListener("DOMContentLoaded", () => {
  // URL del webhook para el agente (n8n)
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
  
  // Selección de elementos del DOM
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  // Botón "Volver" que redirige a la página principal
  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  /**
   * Agrega un mensaje al chat.
   * Este código detecta el formato Markdown de imagen y crea elementos <img>.
   * Para que se muestre la imagen, el usuario debe ingresar la URL en formato Markdown.
   *
   * Ejemplo de formato correcto:
   *   ![Nombre del producto](https://example.com/imagen.jpg)
   */
  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar imágenes en formato Markdown
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

    while ((match = markdownImageRegex.exec(text)) !== null) {
      // Agrega el texto que aparece antes de la imagen (si existe)
      if (match.index > lastIndex) {
        const textFragment = text.substring(lastIndex, match.index).trim();
        if (textFragment) {
          const textElement = document.createElement("p");
          textElement.innerHTML = textFragment;
          messageElement.appendChild(textElement);
        }
      }

      // Extrae la URL de la imagen y la limpia
      const imageUrl = match[2].trim();
      console.log("URL extraída:", imageUrl);

      // Crea el elemento de imagen
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = match[1] || "Imagen";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";

      // Manejo de error en la carga de la imagen
      img.onerror = () => {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "No se pudo cargar la imagen.";
        errorMsg.style.color = "red";
        messageElement.appendChild(errorMsg);
      };

      messageElement.appendChild(img);
      lastIndex = markdownImageRegex.lastIndex;
    }

    // Agrega el texto restante, si existe
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex).trim();
      if (remainingText) {
        const textElement = document.createElement("p");
        textElement.innerHTML = remainingText;
        messageElement.appendChild(textElement);
      }
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /**
   * Envía el mensaje al servidor y muestra la respuesta.
   */
  async function sendMessage() {
    const msg = msgInput.value.trim();
    if (!msg) return;

    // Muestra el mensaje enviado por el usuario
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

  // Eventos para enviar mensajes: botón "Enviar" y tecla "Enter"
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});








