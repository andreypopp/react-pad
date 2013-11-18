function update(data) {
  updateStyles(data.styles);
  updateDeps(data.deps);
  updateCode(data.component);
}

function updateDeps(deps) {
  if (!deps) return;

  deps.sort();

  var host = document.getElementById('deps');
  if (!host) {
    host = document.createElement('script');
    host.id = 'deps';
    document.head.appendChild(host);
  }
  host.src = '/browserify/partial?modules=' +
    encodeURIComponent(deps.join(' '));
}

function updateStyles(styles) {
  if (!styles) return;

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
