document.addEventListener("DOMContentLoaded", () => {
  // URL del webhook para el agente (n8n)
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

  // ============================================================
  // NOTA: En producción, debes obtener los datos de la base de datos (por ejemplo, Google Sheets)
  // con el siguiente formato:
  // {
  //   producto: "Nombre del Producto",
  //   presentacion: "Detalle de presentación",
  //   palabrasClave: "palabra1, palabra2, ...",
  //   precio: "Precio",
  //   imagenUrl: "URL de la imagen"
  // }
  // Este objeto simulado se usa solo para pruebas.
  // ============================================================
  // REEMPLAZA las URL de ejemplo por las URL reales de tus productos.
  const keywordToUrlMapping = {
    "ganoderma coffee": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "berry coffee": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "smart watch": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "berry gano coffe":"https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "black tea coffe":"https://res.cloudinary.com/dknm8qct5/image/upload/v1742957809/black-tea_hrbjm3.png",
    "blueberry candy":"https://res.cloudinary.com/dknm8qct5/image/upload/v1742958544/hgw_blueberry_candy_02_sc8kbe.jpg",
    "lactiberry":"https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "blueberry soybean milk drink":"https://res.cloudinary.com/dknm8qct5/image/upload/v1742958245/BLUEBERRY-SOYBEAN-MILK-DRINK-HGW-v001_tr97ph.jpg",
    "blueberry fruit tea (jam)":"https://res.cloudinary.com/dknm8qct5/image/upload/v1743190150/blueberry_fruit_e3jpzc.jpg",
    "toalla sanitaria dia";"https://res.cloudinary.com/dknm8qct5/image/upload/v1743094789/toalla-higienica-dia-600x585_tccg7s.png"
  };

  // URL de respaldo en caso de error (por ejemplo, error 404)
  const fallbackImageUrl = "https://tu-dominio.com/imagenes/fallback.jpg";

  console.log("Mapping de palabras clave a URL:", keywordToUrlMapping);

  /**
   * Transforma en el texto las palabras clave detectadas en formato Markdown de imagen,
   * priorizando las coincidencias más específicas (las de mayor longitud).
   *
   * Ejemplo: "ganoderma coffee" se transforma en:
   *   ![ganoderma coffee](https://tu-dominio.com/imagenes/ganoderma_coffee.jpg)
   */
  function transformKeywordsToUrls(text) {
    let transformedText = text;
    // Ordenar las claves de mayor a menor longitud para priorizar coincidencias específicas
    const keywords = Object.keys(keywordToUrlMapping).sort((a, b) => b.length - a.length);
    keywords.forEach(keyword => {
      // Creamos una expresión regular para buscar la palabra completa, sin importar mayúsculas/minúsculas
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      transformedText = transformedText.replace(regex, (match) => {
        console.log(`Reemplazando "${match}" por: ![${match}](${keywordToUrlMapping[keyword]})`);
        return `![${match}](${keywordToUrlMapping[keyword]})`;
      });
    });
    console.log("Texto transformado:", transformedText);
    return transformedText;
  }

  /**
   * Agrega un mensaje al chat.
   * Primero transforma el texto, reemplazando palabras clave por Markdown de imagen.
   * Luego, procesa el mensaje para detectar y mostrar las imágenes.
   */
  function addMessage(text, type) {
    // Transforma el mensaje: si el usuario ingresa palabras clave, se convierten a formato Markdown.
    text = transformKeywordsToUrls(text);

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // Expresión regular para detectar imágenes en formato Markdown: ![Texto](URL)
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

    // Procesa cada coincidencia (imagen) en el mensaje
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

      // Si la imagen falla (por ejemplo, error 404), se carga la imagen de respaldo
      img.onerror = () => {
        console.error("Error al cargar la imagen:", imageUrl, "Cargando imagen de respaldo.");
        img.src = fallbackImageUrl;
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

  // Eventos: se envía el mensaje al hacer clic en el botón "Enviar" o al presionar Enter.
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});








