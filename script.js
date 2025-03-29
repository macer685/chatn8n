document.addEventListener("DOMContentLoaded", () => {
  // URL del webhook (n8n) para el agente de ventas
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

  // ============================================================
  // PROMPT de Tatiana Bustos - Ejecutiva de HGW:
  // "Hola, soy Tatiana Bustos, ejecutiva de HGW. Mi misión es ayudarte a encontrar
  // el producto ideal que mejore tu salud e integre a tu canasta familiar. Cada vez
  // que menciones un producto, se mostrará al menos una imagen extraída de la base de datos.
  // Si usas palabras clave (por ejemplo, 'ganoderma coffee'), se transformarán automáticamente
  // para mostrar la imagen correspondiente."
  // ============================================================

  // ============================================================
  // OBTENCIÓN DE DATOS DE LA BASE DE DATOS:
  // En producción, deberás obtener los datos de productos (Google Sheets u otra fuente)
  // con el siguiente formato:
  // {
  //   producto: "Nombre del Producto",
  //   presentacion: "Detalle de presentación",
  //   palabrasClave: "palabra1, palabra2, ...",
  //   precio: "Precio",
  //   imagenUrl: "URL de la imagen"
  // }
  // ============================================================
  // Para este ejemplo, se usa un mapeo simulado:
  const keywordToUrlMapping = {
    "ganoderma coffee": "https://example.com/images/ganoderma_coffee.jpg",
    "berry coffee": "https://example.com/images/berry_coffee.jpg",
    "smart watch": "https://example.com/images/smart_watch.jpg"
  };

  console.log("Mapping de palabras clave a URL:", keywordToUrlMapping);

  /**
   * Transforma en el texto las palabras clave detectadas en formato Markdown de imagen,
   * priorizando las coincidencias más específicas (ordenadas de mayor a menor longitud).
   * Ejemplo: "ganoderma coffee" se convierte en:
   *   ![ganoderma coffee](https://example.com/images/ganoderma_coffee.jpg)
   */
  function transformKeywordsToUrls(text) {
    let transformedText = text;
    // Ordenar las claves de mayor a menor longitud para priorizar coincidencias específicas
    const keywords = Object.keys(keywordToUrlMapping).sort((a, b) => b.length - a.length);
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      transformedText = transformedText.replace(regex, (match) => {
        return `![${match}](${keywordToUrlMapping[keyword]})`;
      });
    });
    return transformedText;
  }

  /**
   * Agrega un mensaje al chat.
   * Primero transforma el mensaje para reemplazar las palabras clave por Markdown de imagen.
   * Luego, detecta las imágenes en formato Markdown y crea elementos <img> para mostrarlas.
   */
  function addMessage(text, type) {
    // Transformar palabras clave en Markdown (si no se han ingresado ya como URL)
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

      // Si ocurre un error al cargar la imagen, muestra un mensaje de error
      img.onerror = () => {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "No se pudo cargar la imagen.";
        errorMsg.style.color = "red";
        messageElement.appendChild(errorMsg);
      };

      messageElement.appendChild(img);
      lastIndex = markdownImageRegex.lastIndex;
    }

    // Agrega cualquier texto restante después de la última imagen
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

    // Muestra el mensaje del usuario
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
        // Muestra la respuesta del servidor
        addMessage(data.respuesta || "Sin respuesta", "received");
      } else {
        addMessage("Error en la respuesta del servidor.", "received");
      }
    } catch (error) {
      addMessage("No se pudo conectar con el servidor.", "received");
    }
  }

  // Eventos: al hacer clic en el botón "Enviar" o presionar Enter en el input se llama a sendMessage
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});







