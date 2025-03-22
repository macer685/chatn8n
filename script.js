// Reemplaza esta URL con la de tu webhook en n8n
const webhookUrl = "https://macercreative.app.n8n.cloud/webhook/chat";

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// Función para agregar mensajes al área de mensajes
function addMessage(text, sender) {
  const msgElement = document.createElement("div");
  msgElement.textContent = sender + ": " + text;
  messagesDiv.appendChild(msgElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Función para enviar el mensaje al webhook y mostrar la respuesta
async function sendMessage() {
  const msg = msgInput.value.trim();
  if (!msg) return;
  addMessage(msg, "Usuario");
  msgInput.value = "";
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje: msg })
    });
    const data = await response.json();
    addMessage(data.respuesta || "Sin respuesta", "Bot");
  } catch (error) {
    console.error("Error al enviar:", error);
    addMessage("Error al comunicarse con el bot.", "Tatiana");
  }
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") sendMessage();
});
