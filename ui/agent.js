function update(data) {
  if (data.styles)
    updateStyles(data.styles);
}

function updateStyles(styles) {
  var host = document.getElementById('styles');
  if (!host) {
    host = document.createElement('style');
    host.id = 'styles';
    document.head.appendChild(host);
  }
  host.innerHTML = styles.content;
}

window.addEventListener("message", function (e) {
  var mainWindow = e.source;
  try {
    var data = JSON.parse(e.data);
    update(data);
  } catch (e) {
    var result = "eval() threw an exception:" + e.toString();
    mainWindow.postMessage(result, event.origin);
  }
});
