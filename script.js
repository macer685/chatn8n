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
    "cafe soluble de ganoderma": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "café de bayas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "café antioxidante": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "reloj inteligente": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "cafe con te negro": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742957809/black-tea_hrbjm3.png",
    "dulces de arandano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958544/hgw_blueberry_candy_02_sc8kbe.jpg",
    "lactiberry": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "probiótico de arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958875/LACTIBERRY_gnzimc.jpg",
    "bebida de leche de soja y arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958245/BLUEBERRY-SOYBEAN-MILK-DRINK-HGW-v001_tr97ph.jpg",
    "té de frutas de arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743190150/blueberry_fruit_e3jpzc.jpg",
    "mermelada de arándano": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743190150/blueberry_fruit_e3jpzc.jpg",
    "toalla sanitaria día": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743094789/toalla-higienica-dia-600x585_tccg7s.png",
    "toalla sanitaria noche": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959554/toallas_varias_xripi6.webp",
    "protector diario": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958957/PROTECTOR-DE-USO-DIARIO-HGW-v.001-final-_q0tglu.jpg",
    "Pasta de dientes Green World Herbs": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958366/crema_dental_umniaj.jpg",
    "jabon de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "jabon de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg",
    "gel de ducha de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959103/shower_gel_mc43eu.jpg",
    "champú de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959047/Shampoo-de-Keratina_xzv3uk.jpg",
    "Gel de esencia de disparo Mingdeshijia HGW": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743095061/miso_e7yuqf.webp",
    "Crema de manos de miel y arándanos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105671/crema_manos_pggrmu.jpg",
    "collar de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112458/collarturmalina_hidk0y.webp",
    "collar de tourmalina version ltda": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112817/collar_lr07dk.png",
    "prensa sobre uñas 1-92": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743107137/u%C3%B1as_rqdbae.webp",
    "colgante piedra energetica": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105878/collar_hu5kq6.webp",
    "uñas postizas 93-105": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112593/u%C3%B1as_2_ujqee0.avif",
    "plantillas de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109713/images_k8xpei.jpg",
    "protector cuello autocalentable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109911/descarga_c7oldp.jpg",
    "protector cintura autocalentable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110173/4f587f3db2104f73a6e7fdeb8f63d79f-1_vqrl0e.jpg",
    "Kit smilife arándano, kit cosméticos smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110411/kit_i3uhy1.jpg",
    "smilife blueberry facial cleanser limpieza facial": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110649/blueberry-cleanser_sca0at.png",
    "loción de arándanos smilee (humectante)": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110842/6-2_gzzpax.jpg",
    "humectante de arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111001/humectante-facial-crema_t67rgx.png",
    "Tónico facial de arándanos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111159/tonificador_facial_yfbz6x.webp",
    "crema  arándanos smilee(contorno de ojos)": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111357/contorno_ojos_cam2xv.webp",
    "esencia de arándanos smilee( facial)": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111541/Esscence_mmp9c9.jpg",
    "turmalina térmica Whaterson": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111704/watter_h6l4ie.jpg",
    "aerosol desinfectante portátil": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111854/spray_nndur4.jpg",
    "generador de ozono digital para uso domestico": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112068/ozono_db5no6.jpg"
  };

  // URL de respaldo en caso de error (por ejemplo, error 404)
  const fallbackImageUrl = "https://tu-dominio.com/imagenes/fallback.jpg";

  console.log("Mapping de palabras clave a URL:", keywordToUrlMapping);

  /**
   * Transforma en el texto las palabras clave detectadas en formato Markdown de imagen,
   * agrupando los keywords por producto para evitar reemplazos duplicados.
   */
  function transformKeywordsToUrls(text) {
    // Crear un mapeo único: URL -> [keywords]
    const productMapping = {};
    for (const [keyword, url] of Object.entries(keywordToUrlMapping)) {
      if (!productMapping[url]) {
        productMapping[url] = [];
      }
      productMapping[url].push(keyword);
    }

    // Para cada producto, crear un regex que detecte cualquiera de sus keywords y reemplazar solo la primera ocurrencia.
    // Si la keyword contiene espacios, no se añaden delimitadores de palabra.
    for (const [url, keywords] of Object.entries(productMapping)) {
      const regexParts = keywords.map(k => k.includes(" ") ? k : `\\b${k}\\b`);
      const regex = new RegExp("(" + regexParts.join("|") + ")", "gi");
      let firstReplaced = false;
      text = text.replace(regex, (match) => {
        if (!firstReplaced) {
          firstReplaced = true;
          console.log(`Reemplazando "${match}" por: ![${match}](${url})`);
          return `![${match}](${url})`;
        } else {
          return "";
        }
      });
    }
    return text;
  }

  /**
   * Agrega un mensaje al chat.
   * Transforma el texto, reemplazando palabras clave por Markdown de imagen, y luego procesa el mensaje para mostrarlo.
   */
  function addMessage(text, type) {
    text = transformKeywordsToUrls(text);

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    // RegExp para detectar imágenes en formato Markdown: ![Texto](URL)
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
      const imageUrl = match[2].trim();
      console.log("URL extraída:", imageUrl);

      const img = document.create










