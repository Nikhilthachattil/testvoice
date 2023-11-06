const voiceToggle = document.getElementById("voice-toggle");
const inputField = document.getElementById("input-field");

let recognition = null;
let isListening = false;

function handleButtonClick(event) {
  inputField.value += event.target.textContent;
}

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    if (!isListening) {
      return;
    }

    const speechResult = event.results[0][0].transcript.toLowerCase().trim();
    if (speechResult.includes("undo")) {
      const words = inputField.value.split(/\s+/); // Split input into words
      words.pop(); // Remove the last word
      inputField.value = words.join(" ");
    } else {
      inputField.value += speechResult;
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  voiceToggle.addEventListener("change", () => {
    isListening = voiceToggle.checked;

    if (isListening) {
      recognition.start();
    } else {
      // Only stop speech recognition when the toggle is switched off
      recognition.stop();
    }
  });
} else {
  console.error("Speech recognition is not supported in this browser.");
  voiceToggle.disabled = true;
}
