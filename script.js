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
    "toalla sanitaria día": "https://res.cloudinary.com/dknm8qct5









