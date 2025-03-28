function addMessage(text, type) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", type);

  // Expresión regular global para detectar imágenes en Markdown: ![Texto](URL)
  const regex = /!\[(.*?)\]\((https?:\/\/.*?\.(?:png|jpg|jpeg|gif|webp))\)/gi;
  let lastIndex = 0;
  let match;

  // Usamos un bucle para recorrer todas las coincidencias
  while ((match = regex.exec(text)) !== null) {
    // Agregar el texto que haya antes de la imagen
    if (match.index > lastIndex) {
      const textFragment = text.substring(lastIndex, match.index).trim();
      if (textFragment) {
        const p = document.createElement("p");
        p.innerHTML = textFragment;
        messageElement.appendChild(p);
      }
    }

    // Crear y configurar el elemento de imagen con la URL detectada
    const img = document.createElement("img");
    img.src = match[2]; // match[2] contiene la URL de la imagen
    img.alt = match[1] || "Imagen"; // match[1] es el texto alternativo
    img.style.maxWidth = "200px";
    img.style.borderRadius = "8px";
    img.style.marginTop = "5px";
    messageElement.appendChild(img);

    lastIndex = regex.lastIndex; // Actualizamos el índice para seguir buscando
  }

  // Agregar cualquier texto restante después de la última imagen
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







