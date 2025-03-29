document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  // Botón "Volver" que redirige al usuario a la página principal
  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  // ============================================
  // Aquí se debe obtener la data de la base de datos de forma dinámica.
  // Por ejemplo, mediante un nodo de Google Sheets o una API.
  // El formato esperado de cada registro es:
  // {
  //   producto: "Nombre del Producto",
  //   presentacion: "Detalle de presentación",
  //   palabrasClave: "palabra1, palabra2, ...",
  //   precio: "Precio",
  //   imagenUrl: "URL de la imagen"
  // }
  // Para propósitos de ejemplo, este bloque de datos está comentado:
  //
  // const databaseData = [
  //   {
  //     producto: "Berry Coffee",
  //     presentacion: "250g x 12 sachets",
  //     palabrasClave: "berry coffee, café, arándano",
  //     precio: "$50.00",
  //     imagenUrl: "https://example.com/images/berry_coffee.jpg"
  //   },
  //   {
  //     producto: "Ganoderma Soluble Coffee",
  //     presentacion: "15gr x 12 sachets",
  //     palabrasClave: "ganoderma coffee, soluble, café",
  //     precio: "$87.40",
  //     imagenUrl: "https://example.com/images/ganoderma_coffee.jpg"
  //   },
  //   {
  //     producto: "Smart Watch",
  //     presentacion: "1 unidad",
  //     palabrasClave: "smart watch, reloj inteligente",
  //     precio: "$120.00",
  //     imagenUrl: "https://example.com/images/smart_watch.jpg"
  //   }
  // ];
  // ============================================

  /**
   * Función que construye automáticamente el mapeo de palabras clave a URL.
   * Aquí se utiliza la data obtenida de la base de datos.
   */
  function buildKeywordMapping(data) {
    const mapping = {};
    data.forEach(item => {
      // Separa las palabras clave y las normaliza a minúsculas
      const keywords = item.palabrasClave.split(",").map(kw => kw.trim().toLowerCase());
      keywords.forEach(keyword => {
        mapping[keyword] = item.imagenUrl;
      });
    });
    return mapping;
  }

  // En producción, reemplaza el siguiente mapeo hardcodeado con la data real obtenida.
  // Para propósitos de ejemplo, se simula el mapeo:
  const keywordToUrlMapping = {
    "berry coffee": "https://example.com/images/berry_coffee.jpg",
    "ganoderma coffee": "https://example.com/images/ganoderma_coffee.jpg",
    "smart watch": "https://example.com/images/smart_watch.jpg"
  };

  console.log("Mapping de palabras clave a URL:", keywordToUrlMapping);

  /**
   * Transforma en el texto las palabras clave detectadas en formato Markdown de imagen.
   * Por ejemplo, si el usuario escribe "berry coffee", se reemplaza por:
   * ![berry coffee](https://example.com/images/berry_coffee.jpg)
   */
  function transformKeywordsToUrls(text) {
    let transformedText = text;
    for (const keyword in keywordToUrlMapping) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      transformedText = transformedText.replace(regex, (match) => {
        return `![${match}](${keywordToUrlMapping[keyword]})`;
      });
    }
    return transformedText;
  }

  /**
   * Agrega un mensaje al chat.
   * Primero transforma las palabras clave en formato Markdown, luego procesa el texto
   * para detectar y mostrar imágenes.
   */
  function addMessage(text, type) {
    // Transforma el texto usando la función anterior.
    text = transformKeywordsToUrls(text);

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar imágenes en formato Markdown
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

    while ((match = markdownImageRegex.exec(text)) !== null) {
      // Agrega el texto que aparece antes de la imagen (si existe)
      if (match.index > lastIndex) {
        const textFragment = text.substring(lastIndex, match.index).trim();
        if (textFragment) {
          const textElement = document.createElement("p");
          textElement.innerHTML = textFragment;
          messageElement.appendChild(textElement);
        }
      }

      // Extrae y limpia la URL de la imagen
      const imageUrl = match[2].trim();
      console.log("URL extraída:", imageUrl);

      // Crea el elemento de imagen
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
      lastIndex = markdownImageRegex.lastIndex;
    }

    // Agrega el texto restante después de la última imagen (si existe)
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

  /**
   * Envía el mensaje al servidor y muestra la respuesta.
   */
  async function sendMessage() {
    const msg = msgInput.value.trim();
    if (!msg) return;

    // Muestra el mensaje enviado
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

  // Eventos para enviar mensajes
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});






