document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  let goodUrls = [
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958440/GANODERMA-SOLUBLE-COFFEE_ptuzzd.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742954477/Berry-Gano-Coffee-v.001-final_yt0ytj.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1743112350/reloj_bbcz1j.jpg",
    "https://res.cloudinary.com/dknm8qct5/image/upload/v1742958789/JABON-DE-OLIVA-CON-ACEITE-NATURAL_ayp0tm.jpg"
  ];

  function extractProductName(url) {
    const match = url.match(/v\d+\/([^.]+)[._-]/);
    return match ? match[1].toLowerCase().replace(/[-_]/g, ' ') : null;
  }

  function getVersion(url) {
    const match = url.match(/(v\d+)\//);
    return match ? match[1] : null;
  }

  function levenshtein(a, b) {
    const matrix = [];
    const aLen = a.length, bLen = b.length;
    if (aLen === 0) return bLen;
    if (bLen === 0) return aLen;
    for (let i = 0; i <= bLen; i++) matrix[i] = [i];
    for (let j = 0; j <= aLen; j++) matrix[0][j] = j;
    for (let i = 1; i <= bLen; i++) {
      for (let j = 1; j <= aLen; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[bLen][aLen];
  }

  function similarity(a, b) {
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
  }

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
      return newUrl.replace(newVersion, correctVersion);
    }
    return newUrl;
  }

  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    if (type === "received") {
      const emojis = ["😊", "🚀", "🔥", "💡", "🎉", "👍", "😉"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      text = `${randomEmoji} ${text}`;
    }

    messageElement.textContent = text;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

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

  function showWelcomeMessage() {
    const welcome = document.createElement("div");
    welcome.classList.add("welcome-message");
    welcome.textContent = "¡PRODUCTOS DE LA MEJOR CALIDAD Y SALUDABLES!";
    messagesDiv.appendChild(welcome);
    setTimeout(() => {
      welcome.remove();
    }, 5000);
  }

  showWelcomeMessage();
  sendBtn.addEventListener("click", sendMessage);
  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
});













