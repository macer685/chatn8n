document.addEventListener("DOMContentLoaded", () => {
  // Función para generar un ID único para el usuario
  function generateUserId() {
    return 'user-' + Math.random().toString(36).substr(2, 9);
  }
  // Obtener el user id guardado o generarlo si no existe
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem("userId", userId);
  }
 
  // Webhook de n8n para enviar mensajes del chat
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
  
  // URL del webhook de n8n para recuperar chats desde Google Sheets
  /* ============================ */
  /* INICIO: Recuperar chats desde Google Sheets */
  const recuperarChatsUrl = "https://macercreative.app.n8n.cloud/webhook/recuperar-chats";

  async function recuperarChats() {
    try {
      const response = await fetch(recuperarChatsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: userId })
      });
      if (!response.ok) {
        throw new Error(`Error al recuperar chats: ${response.statusText}`);
      }
      const chats = await response.json();
      // Se asume que 'chats' es un array de objetos con la propiedad 'texto'
      chats.forEach(mensaje => {
        addMessage(mensaje.texto || mensaje, "received");
      });
    } catch (error) {
      console.error("Error en recuperarChats:", error);
    }
  }
  /* FIN: Recuperar chats desde Google Sheets */
  /* ============================ */
 
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
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743375214/cafe_con_antioxidantes_o71ukh.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743375038/cafe_con_te_negro_gpzgsr.png",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743374862/dulces_de_arandano_cpu5wx.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743374645/bebida_de_leche_de_soja_y_arandanos_emoqt1.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743374425/mermelada_de_arandanos_xxxafu.jpgg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743374041/toalla_sanitaria_dia_dhmima.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743374199/toalla_sanitaria_noche_p1lk3u.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958957/PROTECTOR-DE-USO-DIARIO-HGW-v.001-final-_q0tglu.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958366/crema_dental_umniaj.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959103/shower_gel_mc43eu.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959047/Shampoo-de-Keratina_xzv3uk.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743373491/Gel_de_esencia_de_disparo_Mingdeshijia_HGW_ngqahb.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743373326/Crema_de_manos_de_miel_y_arandanos_Smilife_iaq9qt.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743364495/collar_de_tourmalina_version_ltda_xymuvc.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743364495/collar_de_tourmalina_version_ltda_xymuvc.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743364054/pulsera_de_tourmalina_ltda_k5qdnx.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743372976/pulsera_de_tourmalina_jbcyts.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743107137/u%C3%B1as_rqdbae.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743372589/colgante_piedra_energetica_amvbyd.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743364331/u%C3%B1as_postizas_93-105_h9ks2r.avif",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743372138/plantillas_de_tourmalina_qcnty6.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743371956/protector_cuello_autocalentable_t6ufof.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743371825/protector_cintura_autocalentable_kesjr5.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743371524/Kit_smilife_arandano_kit_cosmeticos_smilife_rkpk0i.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743370994/smilife_blueberry_limpieza_facial_vrucx4.png",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743370487/locion_de_arandanos_smilee_humectante_n7zmt5.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111001/humectante-facial-crema_t67rgx.png",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743366222/Tonico_facial_de_arandanos_Smilife_zq4jfz.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743366021/crema_arandanos_smilee_contorno_de_ojos_uzwyrb.webp",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743366896/esencia_de_arandanos_smilee_facial_gw4qdq.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743365760/turmalina_termica_Whaterson_qeciuw.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743367402/aerosol_desinfectante_portatil_yrqgr0.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743364825/generador_de_ozono_digital_para_uso_domestico_c0qt4t.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743364699/reloj_inteligente_smart_whatch_kn9hdm.jpg"
  ];
  
  // Función para extraer el nombre del producto de la URL
  function extractProductName(url) {
    // Captura la parte del nombre del archivo sin extensión, considerando opcionalmente la versión.
    const regex = /\/upload\/(?:v\d+\/)?([^\/]+)\.[a-z]+$/i;
    const match = url.match(regex);
    if (match) {
      let fileName = match[1];
      // Elimina el sufijo aleatorio, asumiendo que es un guión bajo seguido de 5 a 7 caracteres.
      fileName = fileName.replace(/_[a-z0-9]{5,7}$/i, "");
      // Normaliza: convierte a minúsculas y reemplaza guiones bajos por espacios.
      return fileName.toLowerCase().replace(/_/g, ' ');
    }
    return null;
  }
  
  // Función para extraer el segmento variable completo de la URL
  // Ejemplo: a partir de "https://res.cloudinary.com/dknm8qct5/image/upload/v1743364699/reloj_inteligente_smart_whatch_kn9hdm.jpg"
  // devuelve "v1743364699/reloj_inteligente_smart_whatch_kn9hdm.jpg"
  function getVersion(url) {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    return url.substring(uploadIndex + 8);
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
      let score = similarity(newProductName, goodProductName);
      // Si uno de los nombres contiene al otro, se asigna similitud máxima.
      if (goodProductName.includes(newProductName) || newProductName.includes(goodProductName)) {
        score = 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = goodUrl;
      }
    }
    if (bestScore > 0.6 && bestMatch) {
      const correctVersion = getVersion(bestMatch);
      // Reemplaza el segmento variable en la URL nueva por el correcto.
      return newUrl.replace(newVersion, correctVersion);
    }
    return newUrl;
  }
  
  // Función para reconstruir la URL en caso de error en la carga
  function rebuildUrl(badUrl) {
    const badProductName = extractProductName(badUrl);
    const badVersion = getVersion(badUrl);
    let bestMatch = null;
    let bestScore = 0.0;
    for (const goodUrl of goodUrls) {
      const goodProductName = extractProductName(goodUrl);
      let score = similarity(badProductName, goodProductName);
      if (goodProductName.includes(badProductName) || badProductName.includes(goodProductName)) {
        score = 1;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = goodUrl;
      }
    }
    if (bestScore > 0.6 && bestMatch) {
      const correctVersion = getVersion(bestMatch);
      return badUrl.replace(badVersion, correctVersion);
    }
    return null;
  }
  
  // Función para agregar mensajes al chat y procesar Markdown para imágenes
  // Se devuelve el elemento creado para poder modificarlo (por ejemplo, para el contador)
  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);
  
    // Expresión regular para detectar imágenes en formato Markdown: ![alt](url)
    const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/gi;
    let lastIndex = 0;
    let match;
  
    while ((match = markdownImageRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textFragment = text.substring(lastIndex, match.index).trim();
        if (textFragment) {
          const textElement = document.createElement("p");
          textElement.innerHTML = textFragment;
          messageElement.appendChild(textElement);
        }
      }
      let imageUrl = fixUrl(match[2].trim());
      console.log("URL procesada:", imageUrl);
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = match[1] || "Imagen";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";
      // Fallback y reconstrucción forzada en caso de error al cargar la imagen.
      img.dataset.errorHandled = "false";
      img.onerror = function() {
        if (this.dataset.errorHandled === "false") {
          this.dataset.errorHandled = "true";
          const rebuiltUrl = rebuildUrl(this.src);
          if (rebuiltUrl && rebuiltUrl !== this.src) {
            console.log("Reintentando con URL reconstruida:", rebuiltUrl);
            this.src = rebuiltUrl;
          } else {
            this.src = "https://tu-dominio.com/imagenes/fallback.jpg";
          }
        }
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
    return messageElement;
  }
  
  // Función para enviar el mensaje al webhook de n8n con contador de respuesta
  async function sendMessage() {
    const msg = msgInput.value.trim();
    if (!msg) return;
    addMessage(msg, "sent");
    msgInput.value = "";
  
    // Inicia el contador de respuesta
    let seconds = 0;
    const waitingMessage = addMessage(`Esperando respuesta de Tatiana Bustos... (0s)`, "waiting");
    // Dentro de tu código, cuando creas el mensaje de espera:
    // Personaliza el estilo usando .style:
    waitingMessage.style.backgroundColor = "#007bff"; // Fondo azul
    waitingMessage.style.color = "#fff";              // Texto blanco
    waitingMessage.style.padding = "5px 10px";          // Espaciado interno
    waitingMessage.style.borderRadius = "5px";          // Bordes redondeados
    waitingMessage.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    waitingMessage.style.fontSize = "14px";             // Tamaño de fuente
    waitingMessage.style.marginTop = "10px";            // Margen superior
  
    const interval = setInterval(() => {
      seconds++;
      waitingMessage.textContent = `Esperando respuesta... (${seconds}s)`;
    }, 1000);
  
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId, // Incluye el userId en el cuerpo de la solicitud
          mensaje: msg
        })
      });
      clearInterval(interval);
      waitingMessage.remove();
      if (response.ok) {
        const data = await response.json();
        addMessage(data.respuesta || "Sin respuesta", "received");
      } else {
        addMessage("Error en la respuesta del servidor.", "received");
      }
    } catch (error) {
      clearInterval(interval);
      waitingMessage.remove();
      addMessage("No se pudo conectar con el servidor.", "received");
    }
  }
  
  // NUEVO: Función para mostrar un mensaje de bienvenida animado
  function showWelcomeMessage() {
    const welcome = document.createElement("div");
    welcome.classList.add("welcome-message");
    welcome.textContent = "¡PRODUCTOS DE LA MEJOR CALIDAD  SALUDABLES!";
    messagesDiv.appendChild(welcome);
    setTimeout(() => {
      welcome.remove();
    }, 8000);
  }
  
  // Llamadas de configuración y listeners
  showWelcomeMessage();
  // Llamamos a la función para recuperar los chats almacenados desde Google Sheets
  recuperarChats();
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});













