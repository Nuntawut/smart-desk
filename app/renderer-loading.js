function updateLoadingText(message) {
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
      loadingText.textContent = message;
    }
  }

window.api.receiveFromMain('loading-message', (message) => {
    updateLoadingText(message);
});