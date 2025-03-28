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
   * Función para modificar la URL de Cloudinary.
   * Si la URL es de Cloudinary y no tiene transformaciones, inserta "w_300,h_300,c_fill".
   */
  function modifyCloudinaryUrl(url) {
    if (url.includes("res.cloudinary.com")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        const pathAfterUpload = parts[1];
        // Si el segmento después de "/upload/" NO comienza con parámetros (p.ej.: w_ o h_ o c_),
        // se asume que no tiene transformaciones y se le insertan.
        if (!pathAfterUpload.match(/^(w_|h_|c_)/)) {
          return parts[0] + "/upload/w_300,h_300,c_fill/" + pathAfterUpload;
        } else {
          // Ya tiene transformación; se retorna la URL sin modificar.
          return url;
        }
      }
    }
    return url;
  }

  /**
   * Agrega un mensaje al chat.
   * Si detecta una imagen en formato Markdown, la procesa y la muestra.
   */
  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar imágenes en formato Markdown: ![Texto](URL)
    const markdownImageRegex = /!\[.*?\]\((https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))\)/i;
    const match = text.match(markdownImageRegex);

    if (match) {
      // Extrae el texto sin la imagen
      const textWithoutImage = text.replace(markdownImageRegex, "").trim();
      if (textWithoutImage) {
        const textElement = document.createElement("p");
        textElement.innerHTML = textWithoutImage; // Permite formato (negritas, etc.)
        messageElement.appendChild(textElement);
      }

      // Procesa la URL de la imagen
      let imageUrl = match[1];
      imageUrl = modifyCloudinaryUrl(imageUrl);
      
      // Crea y configura el elemento imagen
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "Imagen del producto";
      img.style.maxWidth = "200px";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";
      messageElement.appendChild(img);
    } else {
      // Si no se detecta imagen, muestra el texto directamente
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





