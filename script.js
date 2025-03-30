document.addEventListener("DOMContentLoaded", () => {
  const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";

  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const backBtn = document.getElementById("backBtn");

  backBtn.addEventListener("click", () => {
    window.location.href = "https://www.macer.digital/";
  });

  // Array de emojis para respuestas del bot
  const botEmojis = ["🤖", "😊", "🚀", "👍", "🎉", "✨", "📢", "🔥"];

  function addMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    if (type === "received") {
      // Agregar un emoji aleatorio al mensaje del bot
      const randomEmoji = botEmojis[Math.floor(Math.random() * botEmojis.length)];
      text = `${randomEmoji} ${text}`;
    }

    const textElement = document.createElement("p");
    textElement.innerHTML = text;
    messageElement.appendChild(textElement);

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













