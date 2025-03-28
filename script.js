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
   * Agrega un mensaje al chat. Esta versión renderiza todas las imágenes en formato Markdown.
   */
  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular global para detectar imágenes en Markdown: ![Texto](URL)
    const regex = /!\[(.*?)\]\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif|webp))\)/gi;
    let lastIndex = 0;
    let match;

    // Procesa cada coincidencia en el texto
    while ((match = regex.exec(text)) !== null) {
      // Agrega el texto que aparezca antes de la imagen
      if (match.index > lastIndex) {
        const textFragment = text.substring(lastIndex, match.index).trim();
        if (textFragment) {
          const p = document.createElement("p");
          p.innerHTML = textFragment;
          messageElement.appendChild(p);
        }
      }

      // Crea y configura el elemento de imagen con la URL extraída
      const img = document.createElement("img");
      img.src = match[2]; // match[2] contiene la URL de la imagen
      img.alt = match[1] || "Imagen";
      img.style.maxWidth = "200px";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";
      messageElement.appendChild(img);

      lastIndex = regex.lastIndex; // Actualiza el índice para continuar la búsqueda
    }

    // Agrega cualquier texto restante después de la última imagen
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex).trim();
      if (remainingText) {
        const p = document.createElement("p");
        p.innerHTML = remainingText;
        messageElement.appendChild(p);
      }
    }

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /**
   * Envía el mensaje al webhook y muestra la respuesta.
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

  // Eventos para el botón Enviar y la tecla Enter en el input
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
  });
});







