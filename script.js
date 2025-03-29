document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  // Ejemplo simulado de datos obtenidos de la base de datos
  // En producción, esta data se obtendrá dinámicamente del nodo "database"
  const databaseData = [
    {
      producto: "Berry Coffee",
      presentacion: "250g x 12 sachets",
      palabrasClave: "berry coffee, café, arándano",
      precio: "$50.00",
      imagenUrl: "https://example.com/images/berry_coffee.jpg"
    },
    {
      producto: "Ganoderma Soluble Coffee",
      presentacion: "15gr x 12 sachets",
      palabrasClave: "ganoderma coffee, soluble, café",
      precio: "$87.40",
      imagenUrl: "https://example.com/images/ganoderma_coffee.jpg"
    },
    {
      producto: "Smart Watch",
      presentacion: "1 unidad",
      palabrasClave: "smart watch, reloj inteligente",
      precio: "$120.00",
      imagenUrl: "https://example.com/images/smart_watch.jpg"
    }
  ];

  /**
   * Función que construye un mapeo de palabras clave a URL de imagen a partir de la data.
   * Se espera que el campo "palabrasClave" tenga múltiples palabras separadas por comas.
   */
  function buildKeywordMapping(data) {
    const mapping = {};
    data.forEach(item => {
      // Separamos las palabras clave (y se convierten a minúsculas para búsqueda insensible)
      const keywords = item.palabrasClave.split(",").map(kw => kw.trim().toLowerCase());
      keywords.forEach(keyword => {
        mapping[keyword] = item.imagenUrl;
      });
    });
    return mapping;
  }

  // Construimos el mapeo automáticamente a partir de la data de la base de datos.
  const keywordToUrlMapping = buildKeywordMapping(databaseData);
  console.log("Mapping de palabras clave a URL:", keywordToUrlMapping);

  /**
   * Transforma en el texto las palabras clave detectadas en formato Markdown de imagen.
   * Por ejemplo, si el usuario escribe "berry coffee", se reemplaza por:
   * ![berry coffee](https://example.com/images/berry_coffee.jpg)
   */
  function transformKeywordsToUrls(text) {
    // Convertimos el texto a minúsculas para la búsqueda de palabras clave
    // (puedes ajustar esta lógica si deseas preservar el caso original)
    let transformedText = text;
    for (const keyword in keywordToUrlMapping) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      // Reemplazamos la palabra clave por la sintaxis Markdown de imagen
      transformedText = transformedText.replace(
        regex,
        `![${keyword}](${keywordToUrlMapping[keyword]})`
      );
    }
    return transformedText;
  }

  /**
   * Agrega un mensaje al chat.
   * Primero transforma las palabras clave en formato Markdown, luego procesa el texto
   * para detectar imágenes y mostrarlas.
   */
  function addMessage(text, type) {
    // Transformamos el texto usando la función anterior.
    text = transformKeywordsToUrls(text);

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar imágenes en formato Markdown
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

    // Procesamos todas las coincidencias (imágenes) en el texto
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

      // Extraemos y limpiamos la URL de la imagen
      const imageUrl = match[2].trim();
      console.log("URL extraída:", imageUrl);

      // Creamos el elemento de imagen
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

    // Agregar el texto restante después de la última imagen (si existe)
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
   * Envía un mensaje al servidor y muestra la respuesta.
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

  // Eventos para enviar mensaje
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});






