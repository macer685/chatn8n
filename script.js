
document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const webhookURL = "https://macercreative.app.n8n.cloud/webhook/chat";

  function appendMessage(text, type) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("chat-message", type);
      messageElement.textContent = text;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  sendButton.addEventListener("click", async () => {
      const message = userInput.value.trim();
      if (!message) return;

      appendMessage(message, "sent");
      userInput.value = "";

      try {
          const response = await fetch(webhookURL, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ mensaje: message })
          });

          if (response.ok) {
              const data = await response.json();
              appendMessage(data.respuesta, "received");
          } else {
              appendMessage("Error al recibir respuesta.", "received");
          }
      } catch (error) {
          appendMessage("No se pudo conectar con el servidor.", "received");
      }
  });

  userInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") sendButton.click();
  });
});
