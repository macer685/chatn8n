document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";

  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  const keywordToUrlMapping = {
    "cafe soluble de ganoderma": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "jabon de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "jabon de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg"
  };

  const fallbackImageUrl = "https://tu-dominio.com/imagenes/fallback.jpg";

  function transformKeywordsToUrls(text) {
    for (const [keyword, url] of Object.entries(keywordToUrlMapping)) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      text = text.replace(regex, `![${keyword}](${url})`);
    }
    return text;
  }

  function addMessage(text, type) {
    text = transformKeywordsToUrls(text);

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

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
      img.onerror = () => (img.src = fallbackImageUrl);
      messageElement.appendChild(img);

      lastIndex = markdownImageRegex.lastIndex;
    }

    messagesDiv.appendChild(messageElement);
  }
});










