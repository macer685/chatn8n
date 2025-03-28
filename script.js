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
   * Si detecta una imagen en formato Markdown (ejemplo: ![Texto](URL)), la muestra.
   * Se utiliza la URL original de la imagen, ya que comentas que funcionan en el navegador.
   */
  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar imágenes en formato Markdown: ![Texto](URL)
    const markdownImageRegex = /!\[.*?\]\((https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))\)/i;
    const match = text.match(markdownImageRegex);

    if (match) {
      // Si hay texto adicional, se muestra
      const textWithoutImage = text.replace(markdownImageRegex, "").trim();
      if (textWithoutImage) {
        const textElement = document.createElement("p");
        textElement.innerHTML = textWithoutImage;
        messageElement.appendChild(textElement);
      }
      // Se crea y configura el elemento de imagen usando la URL original
      const img = document.createElement("img");
      img.src = match[1];
      img.alt = "Imagen";
      img.style.maxWidth = "200px";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";
      messageElement.appendChild(img);
    } else {
      // Si no se detecta imagen, se muestra el texto completo
      messageElement.innerHTML = text;
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

  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
  });
});






