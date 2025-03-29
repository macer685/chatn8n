document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";

  // Selección de elementos del DOM
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  // Botón "Volver": redirige a la página principal
  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  // Objeto que mapea cada palabra clave a su URL de imagen
  const keywordToUrlMapping = {
    "cafe soluble de ganoderma": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "jabon de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "jabon de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg"
  };

  // URL de respaldo en caso de error al cargar una imagen
  const fallbackImageUrl = "https://tu-dominio.com/imagenes/fallback.jpg";

  // Función que reemplaza las palabras clave por el Markdown de la imagen
  function transformKeywordsToUrls(text) {
    for (const [keyword, url] of Object.entries(keywordToUrlMapping)) {
      // Se usa \b para delimitar la palabra completa
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      text = text.replace(regex, `![${keyword}](${url})`);
    }
    return text;
  }

  // Función que agrega un mensaje al chat, procesando el texto para mostrar imágenes
  function addMessage(text, type) {
    text = transformKeywordsToUrls(text);

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar el formato Markdown de imagen
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

    // Se recorre el texto y se crean elementos según se encuentren imágenes o texto normal
    while ((match = markdownImageRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textFragment = text.substring(lastIndex, match.index).trim();
        if (textFragment) {
          const textElement = document.createElement("p");
          textElement.textContent = textFragment;
          messageElement.appendChild(textElement);
        }
      }

      const img = document.createElement("img");
      img.src = match[2].trim();
      img.alt = match[1];
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";










