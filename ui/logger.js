module.exports = function(name) {
  function log(level) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.unshift('[' + name + ']');
    console[level].apply(console, args);
  }
  return {
    debug: log.bind(null, 'debug'),
    log: log.bind(null, 'log'),
    warn: log.bind(null, 'warn'),
    error: log.bind(null, 'error')
  };
}
