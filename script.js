document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  // Redirige al usuario a la web principal
  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  /**
   * Agrega un mensaje al chat.
   * Detecta imágenes en formato Markdown y las muestra correctamente.
   */
  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular mejorada para detectar imágenes en formato Markdown
    // Captura el texto alternativo y la URL (deteniendo en el primer espacio o ')')
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    const matches = Array.from(text.matchAll(markdownImageRegex));
    let lastIndex = 0;

    if (matches.length > 0) {
      // Iteramos sobre cada coincidencia
      for (const match of matches) {
        // Agregar texto que aparezca antes de la imagen
        if (match.index > lastIndex) {
          const textFragment = text.substring(lastIndex, match.index).trim();
          if (textFragment) {
            const textElement = document.createElement("p");
            textElement.innerHTML = textFragment;
            messageElement.appendChild(textElement);
          }
        }

        // Extraer y limpiar la URL
        let imageUrl = match[2].trim();
        // Decodificar la URL en caso de estar codificada
        imageUrl = decodeURI(imageUrl);
        console.log("URL extraída:", imageUrl);

        // Crear la imagen
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
        // Actualizar el índice para el siguiente fragmento
        lastIndex = match.index + match[0].length;
      }

      // Agregar el texto restante después de la última imagen
      if (lastIndex < text.length) {
        const remainingText = text.substring(lastIndex).trim();
        if (remainingText) {
          const textElement = document.createElement("p");
          textElement.innerHTML = remainingText;
          messageElement.appendChild(textElement);
        }
      }
    } else {
      // Si no se detecta formato Markdown para imagen, muestra el texto completo
      const textElement = document.createElement("p");
      textElement.innerHTML = text;
      messageElement.appendChild(textElement);
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /**
   * Enviar mensaje al servidor y mostrar respuesta.
   */
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
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});






