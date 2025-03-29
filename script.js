function addMessage(text, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", type);

  // Expresión regular mejorada para detectar imágenes en formato Markdown
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/gi;
  let lastIndex = 0;
  let match;

  while ((match = markdownImageRegex.exec(text)) !== null) {
    // Agregar el texto que aparece antes de la imagen
    if (match.index > lastIndex) {
      const textFragment = text.substring(lastIndex, match.index).trim();
      if (textFragment) {
        const textElement = document.createElement("p");
        textElement.innerHTML = textFragment;
        messageElement.appendChild(textElement);
      }
    }

    // Extraer y limpiar la URL
    const imageUrl = match[2].trim();
    console.log("URL extraída:", imageUrl);

    // Crear la imagen
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Imagen";
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

  // Agregar el texto restante después de la última imagen
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






