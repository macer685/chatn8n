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

  // Objeto que mapea cada palabra clave a su respectiva URL de imagen
  const keywordToUrlMapping = {
    "ganoderma coffee": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "ganoderma soluble": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "café ganoderma": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "café saludable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "berry coffee": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "berry gano coffee": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "café de bayas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "café antioxidante": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "smart watch": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "reloj inteligente": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "wearable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "reloj digital": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "black tea coffee": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742957809/black-tea_hrbjm3.png",
    "té negro con café": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742957809/black-tea_hrbjm3.png",
    "bebida energética": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742957809/black-tea_hrbjm3.png",
    "mezcla de té y café": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742957809/black-tea_hrbjm3.png",
    "blueberry candy": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958544/hgw_blueberry_candy_02_sc8kbe.jpg",
    "caramelo de arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958544/hgw_blueberry_candy_02_sc8kbe.jpg",
    "dulce saludable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958544/hgw_blueberry_candy_02_sc8kbe.jpg",
    "snack antioxidante": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958544/hgw_blueberry_candy_02_sc8kbe.jpg",
    "lactiberry": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "probiótico de arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "digestión saludable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "suplemento antioxidante": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "blueberry soybean milk drink": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958245/BLUEBERRY-SOYBEAN-MILK-DRINK-HGW-v001_tr97ph.jpg",
    "bebida de soja y arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958245/BLUEBERRY-SOYBEAN-MILK-DRINK-HGW-v001_tr97ph.jpg",
    "leche de soja con frutas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958245/BLUEBERRY-SOYBEAN-MILK-DRINK-HGW-v001_tr97ph.jpg",
    "bebida saludable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958245/BLUEBERRY-SOYBEAN-MILK-DRINK-HGW-v001_tr97ph.jpg",
    "blueberry fruit tea (jam)": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743190150/blueberry_fruit_e3jpzc.jpg",
    "té de frutas de arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743190150/blueberry_fruit_e3jpzc.jpg",
    "mermelada de arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743190150/blueberry_fruit_e3jpzc.jpg",
    "infusión de frutas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743190150/blueberry_fruit_e3jpzc.jpg",
    "toalla sanitaria día": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743094789/toalla-higienica-dia-600x585_tccg7s.png",
    "compresa femenina día": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743094789/toalla-higienica-dia-600x585_tccg7s.png",
    // Completa la URL de este producto o elimínalo si no lo usas
    "protección femenina diaria": "https://res.cloudinary.com/dknm8qct5/image/upload/vXXXXXX/proteccion-femenina.jpg"
  };

  // URL de respaldo en caso de error (por ejemplo, error 404)
  const fallbackImageUrl = "https://tu-dominio.com/imagenes/fallback.jpg";

  console.log("Mapping de palabras clave a URL:", keywordToUrlMapping);

  /**
   * Transforma en el texto las palabras clave detectadas en formato Markdown de imagen,
   * evitando transformar partes del texto que ya tienen formato Markdown.
   */
  function transformKeywordsToUrls(text) {
    // RegExp para detectar imágenes en formato Markdown
    const markdownImageRegex = /!\[[^\]]*\]\(https?:\/\/[^\s)]+\)/gi;
    let segments = [];
    let lastIndex = 0;
    let match;

    // Separa el texto en segmentos que sean imágenes y segmentos que no lo sean
    while ((match = markdownImageRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          isImage: false,
          text: text.substring(lastIndex, match.index)
        });
      }
      segments.push({
        isImage: true,
        text: match[0]
      });
      lastIndex = markdownImageRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      segments.push({
        isImage: false,
        text: text.substring(lastIndex)
      });
    }

    // Para cada segmento que NO sea imagen, aplicar la transformación
    const keywords = Object.keys(keywordToUrlMapping).sort((a, b) => b.length - a.length);
    segments = segments.map(segment => {
      if (!segment.isImage) {
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, "gi");
          segment.text = segment.text.replace(regex, (match) => {
            console.log(`Reemplazando "${match}" por: ![${match}](${keywordToUrlMapping[keyword]})`);
            return `![${match}](${keywordToUrlMapping[keyword]})`;
          });
        });
      }
      return segment;
    });
    return segments.map(segment => segment.text).join('');
  }

  /**
   * Agrega un mensaje al chat.
   * Transforma el texto, reemplazando palabras clave por Markdown de imagen,
   * y luego procesa el mensaje para detectar y mostrar las imágenes.
   */
  function addMessage(text, type) {
    // Aplica la transformación solo a los segmentos que no son ya imágenes
    text = transformKeywordsToUrls(text);

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // RegExp para detectar imágenes en formato Markdown: ![Texto](URL)
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;

    // Procesa cada coincidencia de imagen en el mensaje
    while ((match = markdownImageRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textFragment = text.substring(lastIndex, match.index).trim();
        if (textFragment) {
          const textElement = document.createElement("p");
          textElement.innerHTML = textFragment;
          messageElement.appendChild(textElement);
        }
      }
      const imageUrl = match[2].trim();
      console.log("URL extraída:", imageUrl);

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = match[1] || "Imagen";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";

      // Si falla la carga de la imagen, se usa la imagen de respaldo
      img.onerror = () => {
        console.error("Error al cargar la imagen:", imageUrl, "Cargando imagen de respaldo.");
        img.src = fallbackImageUrl;
      };

      messageElement.appendChild(img);
      lastIndex = markdownImageRegex.lastIndex;
    }

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









