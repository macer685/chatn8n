document.addEventListener("DOMContentLoaded", () => {
  // Webhook de n8n para el chat
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";

  // Elementos del DOM
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  // Botón "Volver" redirige a la página principal
  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  // Array de URLs de referencia "buenas" (las que están en la base de datos)
  let goodUrls = [
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg"
  ];

  // Función para extraer el nombre del producto de la URL
  function extractProductName(url) {
    const match = url.match(/v\d+\/([^.]+)[._-]/);
    return match ? match[1].toLowerCase().replace(/[-_]/g, ' ') : null;
  }

  // Función para extraer la versión de la URL (ejemplo: v1742958440)
  function getVersion(url) {
    const match = url.match(/(v\d+)\//);
    return match ? match[1] : null;
  }

  // Función de Levenshtein para calcular la distancia entre dos cadenas
  function levenshtein(a, b) {
    const matrix = [];
    const aLen = a.length, bLen = b.length;
    if (aLen === 0) return bLen;
    if (bLen === 0) return aLen;
    for (let i = 0; i <= bLen; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= aLen; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= bLen; i++) {
      for (let j = 1; j <= aLen; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // sustitución
            matrix[i][j - 1] + 1,     // inserción
            matrix[i - 1][j] + 1      // eliminación
          );
        }
      }
    }
    return matrix[bLen][aLen];
  }

  // Función para calcular la similitud (valor entre 0 y 1) usando la distancia de Levenshtein
  function similarity(a, b) {
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
  }

  // Función para corregir la URL usando las URLs "buenas"
  function fixUrl(newUrl) {
    const newProductName = extractProductName(newUrl);
    const newVersion = getVersion(newUrl);
    let bestMatch = null;
    let bestScore = 0.0;
    for (const goodUrl of goodUrls) {
      const goodProductName = extractProductName(goodUrl);
      const score = similarity(newProductName, goodProductName);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = goodUrl;
      }
    }
    if (bestScore > 0.6 && bestMatch) {
      const correctVersion = getVersion(bestMatch);
      // Reemplaza la versión en la URL nueva por la versión correcta
      return newUrl.replace(newVersion, correctVersion);
    }
    return newUrl;
  }

  // Función para agregar mensajes al chat y procesar Markdown para imágenes
  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar imágenes en formato Markdown: ![alt](url)
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

    while ((match = markdownImageRegex.exec(text)) !== null) {
      // Si hay texto previo, se agrega como párrafo
      if (match.index > lastIndex) {
        const textFragment = text.substring(lastIndex, match.index).trim();
        if (textFragment) {
          const textElement = document.createElement("p");
          textElement.innerHTML = textFragment;
          messageElement.appendChild(textElement);
        }
      }
      // Se procesa la URL de la imagen para corregirla si es necesario
      let imageUrl = fixUrl(match[2].trim());
      console.log("URL procesada:", imageUrl);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = match[1] || "Imagen";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";
      // Fallback en caso de error al cargar la imagen
      img.dataset.errorHandled = "false";
      img.onerror = function() {
        if (this.dataset.errorHandled === "false") {
          this.dataset.errorHandled = "true";
          this.src = "https://tu-dominio.com/imagenes/fallback.jpg";
        }
      };
      messageElement.appendChild(img);
      lastIndex = markdownImageRegex.lastIndex;
    }
    // Si queda texto residual después de procesar imágenes
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

  // Función para enviar el mensaje al webhook de n8n
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
        // Se espera que la respuesta incluya 'respuesta' (puede incluir texto y/o markdown con imágenes)
        addMessage(data.respuesta || "Sin respuesta", "received");
      } else {
        addMessage("Error en la respuesta del servidor.", "received");
      }
    } catch (error) {
      addMessage("No se pudo conectar con el servidor.", "received");
    }
  }
  // NUEVO: Función para mostrar un mensaje de bienvenida animado
function showWelcomeMessage() {
  const messagesDiv = document.getElementById("messages");
  const welcome = document.createElement("div");
  welcome.classList.add("welcome-message");
  welcome.textContent = "¡Bienvenido al Chat! ¿Listo para comenzar?";
  messagesDiv.appendChild(welcome);
  // Se elimina el mensaje después de 4 segundos (duración de la animación)
  setTimeout(() => {
    welcome.remove();
  }, 4000);
}

// Llama a la función de bienvenida al iniciar (después de cargar el DOM y configurar tus listeners)
document.addEventListener("DOMContentLoaded", () => {
  // ... tu código existente ...
  
  // Llama al mensaje de bienvenida
  showWelcomeMessage();
  
  // ... el resto de tu código ...
});


  // Enviar mensaje al hacer clic o presionar Enter
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});













