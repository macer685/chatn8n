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

      // Mapeo de palabras clave a URLs de imagen
      const keywordToUrlMapping = {
        "cafe soluble de ganoderma": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
        "jabon de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
        "jabon de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg"
      };

      // URL de respaldo en caso de error al cargar una imagen
      const fallbackImageUrl = "https://tu-dominio.com/imagenes/fallback.jpg";

      // Función que transforma palabras clave en formato Markdown de imagen
      function transformKeywordsToUrls(text) {
        for (const [keyword, url] of Object.entries(keywordToUrlMapping)) {
          const regex = new RegExp(`\\b${keyword}\\b`, "gi");
          text = text.replace(regex, `![${keyword}](${url})`);
        }
        return text;
      }

      // Función para agregar un mensaje al chat
      function addMessage(text, type) {
        text = transformKeywordsToUrls(text);

        const messageElement = document.createElement("div");
        messageElement.classList.add("chat-message", type);

        // Regex para detectar imágenes en formato Markdown: ![Texto](URL)
        const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
        let lastIndex = 0;
        let match;

        while ((match = markdownImageRegex.exec(text)) !== null) {
          // Agregar el texto que no forma parte de la imagen
          if (match.index > lastIndex) {
            const textFragment = text.substring(lastIndex, match.index).trim();
            if (textFragment) {
              const textElement = document.createElement("p");
              textElement.textContent = textFragment;
              messageElement.appendChild(textElement);
            }
          }

          // Crear y configurar el elemento imagen
          const img = document.createElement("img");
          img.src = match[2].trim();
          img.alt = match[1];
          img.style.maxWidth = "100%";
          img.style.borderRadius = "8px";
          img.style.marginTop = "5px";
          img.onerror = () => {
            console.error("Error al cargar la imagen:", img.src, "Usando fallback");
            img.onerror = null; // Evitar bucle infinito
            img.src = fallbackImageUrl;
          };
          messageElement.appendChild(img);

          lastIndex = markdownImageRegex.lastIndex;
        }

        // Agregar el texto restante si lo hubiera
        if (lastIndex < text.length) {
          const remainingText = text.substring(lastIndex).trim();
          if (remainingText) {
            const textElement = document.createElement("p");
            textElement.textContent = remainingText;
            messageElement.appendChild(textElement);
          }
        }

        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

      // Evento para enviar mensaje al hacer clic en "Enviar"
      sendBtn.addEventListener("click", () => {
        const msg = msgInput.value.trim();
        if (msg !== "") {
          addMessage(msg, "sent");
          msgInput.value = "";
        }
      });

      // Enviar mensaje al presionar Enter
      msgInput.addEventListener("keydown", (event) => {









