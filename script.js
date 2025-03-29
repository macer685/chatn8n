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
    "protección femenina diaria": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743094789/toalla-higienica-dia-600x585_tccg7s.png",
    "toalla higienica dia":"https://res.cloudinary.com/dknm8qct5/image/upload/v1743094789/toalla-higienica-dia-600x585_tccg7s.png",
    "toalla higienica nocturna": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959554/toallas_varias_xripi6.webp",
    "toalla sanitaria noche": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959554/toallas_varias_xripi6.webp",
    "compresa femenina noche": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959554/toallas_varias_xripi6.webp",
    "proteccion femenina nocturna":"https://res.cloudinary.com/dknm8qct5/image/upload/v1742959554/toallas_varias_xripi6.webp",
    "protector diario": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958957/PROTECTOR-DE-USO-DIARIO-HGW-v.001-final-_q0tglu.jpg",
    "protector femenino diario": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958957/PROTECTOR-DE-USO-DIARIO-HGW-v.001-final-_q0tglu.jpg",
    "protector íntimo diario": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958957/PROTECTOR-DE-USO-DIARIO-HGW-v.001-final-_q0tglu.jpg",
    "protector higiénico diario": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958957/PROTECTOR-DE-USO-DIARIO-HGW-v.001-final-_q0tglu.jpg",
    "Pasta de dientes Green World Herbs": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958366/crema_dental_umniaj.jpg",
    "crema dental Green World Herbs": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958366/crema_dental_umniaj.jpg",
    "dentífrico Green World Herbs": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958366/crema_dental_umniaj.jpg",
    "pasta dental herbal HGW": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958366/crema_dental_umniaj.jpg",
    "jabon de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "jabón artesanal de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "jabón natural de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "jabón de aceite de oliva": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg",
    "jabon de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg",
    "jabón de turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg",
    "jabón energético de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg",
    "jabón mineral de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958676/jabon_de_tourmalina_mejmca.jpg",
    "gel de ducha de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959103/shower_gel_mc43eu.jpg",
    "gel de baño de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959103/shower_gel_mc43eu.jpg",
    "gel corporal de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959103/shower_gel_mc43eu.jpg",
    "limpiador corporal de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959103/shower_gel_mc43eu.jpg",
    "champú de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959047/Shampoo-de-Keratina_xzv3uk.jpg",
    "shampoo de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959047/Shampoo-de-Keratina_xzv3uk.jpg",
    "champú fortalecedor de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959047/Shampoo-de-Keratina_xzv3uk.jpg",
    "champú reparador de queratina smililife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1742959047/Shampoo-de-Keratina_xzv3uk.jpg",
    "Gel de esencia de disparo Mingdeshijia HGW": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743095061/miso_e7yuqf.webp",
    "gel esencial Mingdeshijia HGW": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743095061/miso_e7yuqf.webp",
    "esencia en gel Mingdeshijia HGW": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743095061/miso_e7yuqf.webp",
    "gel concentrado Mingdeshijia HGW": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743095061/miso_e7yuqf.webp",
    "Crema de manos de miel y arándanos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105671/crema_manos_pggrmu.jpg",
    "crema hidratante de manos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105671/crema_manos_pggrmu.jpg",
    "crema nutritiva de miel y arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105671/crema_manos_pggrmu.jpg",
    "crema suavizante de manos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105671/crema_manos_pggrmu.jpg",
    "collar de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112458/collarturmalina_hidk0y.webp",
    "collar energético de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112458/collarturmalina_hidk0y.webp",
    "colgante de turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112458/collarturmalina_hidk0y.webp",
    "accesorio de turmalina natural": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112458/collarturmalina_hidk0y.webp",
    "collar de tourmalina version ltda": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112817/collar_lr07dk.png",
    "collar especial de turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112817/collar_lr07dk.png",
    "collar de edición limitada de turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112817/collar_lr07dk.png",
    "joya exclusiva de turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112817/collar_lr07dk.png",
    "prensa sobre uñas 1-92": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743107137/u%C3%B1as_rqdbae.webp",
    "uñas adhesivas decorativas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743107137/u%C3%B1as_rqdbae.webp",
    "set de uñas postizas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743107137/u%C3%B1as_rqdbae.webp",
    "uñas artificiales decoradas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743107137/u%C3%B1as_rqdbae.webp",
    "colgante piedra energetica": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105878/collar_hu5kq6.webp",
    "colgante de piedra natural": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105878/collar_hu5kq6.webp",
    "colgante de energía mineral": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105878/collar_hu5kq6.webp",
    "amuleto de piedra energética": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743105878/collar_hu5kq6.webp",
    "uñas postizas 93-105": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112593/u%C3%B1as_2_ujqee0.avif",
    "uñas artificiales adhesivas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112593/u%C3%B1as_2_ujqee0.avif",
    "set de uñas postizas decoradas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112593/u%C3%B1as_2_ujqee0.avif",
    "uñas de acrílico adhesivas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112593/u%C3%B1as_2_ujqee0.avif",
    "plantillas de tourmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109713/images_k8xpei.jpg",
    "plantillas terapéuticas de turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109713/images_k8xpei.jpg",
    "plantillas energéticas": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109713/images_k8xpei.jpg",
    "plantillas de descanso con turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109713/images_k8xpei.jpg",
    "protector cuello autocalentable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109911/descarga_c7oldp.jpg",
    "collar térmico para el cuello": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109911/descarga_c7oldp.jpg",
    "protector cervical térmico": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109911/descarga_c7oldp.jpg",
    "soporte autocalentable para el cuello": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743109911/descarga_c7oldp.jpg",
    "protector cintura autocalentable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110173/4f587f3db2104f73a6e7fdeb8f63d79f-1_vqrl0e.jpg",
    "faja térmica autocalentable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110173/4f587f3db2104f73a6e7fdeb8f63d79f-1_vqrl0e.jpg",
    "cinturón de calor para la espalda": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110173/4f587f3db2104f73a6e7fdeb8f63d79f-1_vqrl0e.jpg",
    "soporte lumbar térmico": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110173/4f587f3db2104f73a6e7fdeb8f63d79f-1_vqrl0e.jpg",
    "Kit smilife arándano, kit cosméticos smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110411/kit_i3uhy1.jpg",
    "set cosmético de arándanos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110411/kit_i3uhy1.jpg",
    "kit de cuidado facial Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110411/kit_i3uhy1.jpg",
    "paquete de belleza Smilife arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110411/kit_i3uhy1.jpg",
    "smilife blueberry facial cleanser limpieza facial": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110649/blueberry-cleanser_sca0at.png",
    "limpiador facial Smilife arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110649/blueberry-cleanser_sca0at.png",
    "gel de limpieza facial Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110649/blueberry-cleanser_sca0at.png",
    "jabón facial de arándanos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110649/blueberry-cleanser_sca0at.png",
    "loción de arándanos smilee (humectante)": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110842/6-2_gzzpax.jpg",
    "loción hidratante Smilee arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110842/6-2_gzzpax.jpg",
    "crema corporal de arándanos Smilee": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110842/6-2_gzzpax.jpg",
    "loción nutritiva de arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743110842/6-2_gzzpax.jpg",
    "humectante de arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111001/humectante-facial-crema_t67rgx.png",
    "crema facial de arándanos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111001/humectante-facial-crema_t67rgx.png",
    "hidratante facial Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111001/humectante-facial-crema_t67rgx.png",
    "nutrición facial con arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111001/humectante-facial-crema_t67rgx.png",
    "Tónico facial de arándanos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111159/tonificador_facial_yfbz6x.webp",
    "tónico refrescante Smilife arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111159/tonificador_facial_yfbz6x.webp",
    "hidratante facial en tónico": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111159/tonificador_facial_yfbz6x.webp",
    "tónico revitalizante Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111159/tonificador_facial_yfbz6x.webp",
    "crema arándanos smilee(contorno de ojos)": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111357/contorno_ojos_cam2xv.webp",
    "contorno de ojos Smilife arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111357/contorno_ojos_cam2xv.webp",
    "crema antiarrugas Smilife arándanos": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111357/contorno_ojos_cam2xv.webp",
    "hidratante de ojos Smilife": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111357/contorno_ojos_cam2xv.webp",
    "turmalina térmica Whaterson": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111704/watter_h6l4ie.jpg",
    "calentador térmico de turmalina": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111704/watter_h6l4ie.jpg",
    "turmalina autocalentable": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111704/watter_h6l4ie.jpg",
    "dispositivo de calor Whaterson": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111704/watter_h6l4ie.jpg",
    "aerosol desinfectante portátil": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111854/spray_nndur4.jpg",
    "spray desinfectante portátil": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111854/spray_nndur4.jpg",
    "atomizador antibacterial portátil": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111854/spray_nndur4.jpg",
    "mini aerosol sanitizante": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743111854/spray_nndur4.jpg",
    "generador de ozono digital para uso domestico": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112068/ozono_db5no6.jpg",
    "purificador de aire con ozono": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112068/ozono_db5no6.jpg",
    "máquina de ozono doméstica": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112068/ozono_db5no6.jpg",
    "desinfectante digital de ozono": "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112068/ozono_db5no6.jpg"
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

    // Para cada producto, crear un regex que detecte cualquiera de sus keywords y reemplazar solo la primera ocurrencia
    for (const [url, keywords] of Object.entries(productMapping)) {
      const regex = new RegExp("\\b(" + keywords.join("|") + ")\\b", "gi");
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

      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = match[1] || "Imagen";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.marginTop = "5px";

     img.onerror = () => {
  console.error("Error al cargar la imagen:", imageUrl, "Cargando imagen de respaldo.");
  // Desactivar onerror para evitar el bucle
  img.onerror = null;
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

  // Eventos: se envía el mensaje al hacer clic en "Enviar" o al presionar Enter.
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});










