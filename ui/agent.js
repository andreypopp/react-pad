function debug() {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('[Scene Frame]')
  console.debug.apply(console, args);
}

function update(msg) {
  debug('updating');
  updateStyle(msg.style);
  //updateDependencies(msg.dependencies);
  updateMain(msg.main);
  updateExample(msg.example);
}

function updateExample(example) {
  debug('updating example:', example);
  eval(example.content);
}

function updateMain(main) {
  debug('updating main:', main);
  eval(main.content);
}

function updateDependencies(deps) {
  debug('updating dependencies:', deps);

  deps = Object.keys(deps);

  if (deps.length === 0)
    return;

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

function updateStyle(style) {
  debug('updating styles:', style);

  var host = document.getElementById('style');
  if (!host) {
    host = document.createElement('style');
    host.id = 'style';
    document.head.appendChild(host);
  }
  host.innerHTML = style.content;
}

window.addEventListener("message", function (e) {
  var mainWindow = e.source;
  try {
    var msg = JSON.parse(e.data);
    update(msg);
  } catch (e) {
    var result = "eval() threw an exception:" + e.toString();
    mainWindow.postMessage(result, event.origin);
  }
});
