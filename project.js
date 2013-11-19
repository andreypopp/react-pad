var detective = require('detective');

function jsonStringifyPretty(obj) {
  return JSON.stringify(obj, null, '  ');
}

/**
 * Create new project
 *
 * @param {String} name
 */
function create(name) {
  var meta = {
    name: name,
    version: '0.0.0',
    description: 'React component',

    dependencies: {},

    style: 'index.css',
    main: 'index.jsx',
    example: 'example.html'
  };

  return {
    meta: meta,
    files: {
      'index.jsx': {
        filename: 'index.jsx',
        displayName: 'Component',
        content: [
          'var React = require("react-tools/build/modules/React");',
          '',
          'module.exports = React({',
          '  render: function() {',
          '    return (',
          '      <div className="Component">',
          '        Hello, {this.props.name}!',
          '      </div>',
          '    )',
          '  }',
          '});'
        ].join('\n')
      },
      'index.css': {
        filename: 'index.css',
        displayName: 'Styles',
        content: [
          '.Component {',
          '  background: #444;',
          '}'
        ].join('\n')
      },
      'example.html': {
        filename: 'example.html',
        displayName: 'Example',
        content: [
          '<!doctype>',
          '<html>',
          '<head>',
          '  <title>Component Example</title>',
          '  <link rel="stylesheet" href="bundle.css">',
          '  <style>',
          '    body {',
          '      padding: 10px;',
          '    }',
          '  </style>',
          '  <script src="bundle.js"></script>',
          '  <script>',
          '    var React = require("react-tools/build/modules/React");',
          '    var Component = require("./index.jsx");',
          '',
          '    React.renderComponent(Component({name: "You"}), document.body);',
          '  </script>',
          '</head>',
          '<body>',
          '</body>',
          '</html>'
        ].join('\n')
      },
      'package.json': {
        filename: 'package.json',
        displayName: 'Project Metadata',
        content: jsonStringifyPretty(meta)
      }
    }
  };

}

function createFromFiles(files) {
  var project = {files: {}};

  for (var filename in files) {
    project.files[filename] = {
      filename: files[filename].filename,
      content: files[filename].content
    }
  }
  project.meta = JSON.parse(files['package.json'].content);
  return project;
}

function findModuleNames(source) {
  return detective(source)
    .filter(function(m) { return m[0] !== '.' && m[0] !== '/'; })
    .map(function(m) { return m.split('/').filter(Boolean)[0]; });
}

/**
 * Update project with dependencies extracted from sources
 *
 * @param {Project} proj project
 * @param {Array<String>?} changedFilenames optional array of changed filenames
 *                                          to parse dependencies from
 */
function updateDependencies(proj, changedFilenames) {

  var deps = [];

  for (var filename in proj.files) {
    var file = proj.files[filename];
    if (/\.jsx?$/.exec(filename)) {
      if (!changedFilenames || changedFilenames &&
          changedFilenames.indexOf(filename) > -1) {
        file.dependencies = findModuleNames(file.content);
      }
      deps = deps.concat(file.dependencies);
    }
  }

  // check if we have something new
  deps.forEach(function(dep) {
    if (proj.meta.dependencies[dep] === undefined)
      proj.meta.dependencies[dep] = '*';
  });

  // check if we need to remove old deps
  Object.keys(proj.meta.dependencies).forEach(function(dep) {
    if (deps.indexOf(dep) === -1)
      delete proj.meta.dependencies[dep];
  });

  metaChanged(proj);
}

function fileChanged(proj, file) {
  proj.files[file.filename] = file;
  updateDependencies(proj, [file.filename]);
  return proj;
}

function metaChanged(proj) {
  proj.files['package.json'].content = jsonStringifyPretty(proj.meta);
}

function getEntryPoint(name, fallbacks, proj) {
  var filename = proj.meta[name];

  while (!proj.files[filename] && fallbacks.length > 0)
    filename = fallbacks.shift();

  if (!proj.files[filename])
    throw new InvalidProjectError('cannot load "' + name + '" entry point');

  return proj.files[filename];
}

function InvalidProjectError(msg) {
  Error.call(this, msg);
  this.msg = msg;
  this.name = 'InvalidProjectError';
}

InvalidProjectError.prototype = new Error;

module.exports = {
  create: create,
  createFromFiles: createFromFiles,

  fileChanged: fileChanged,
  metaChanged: metaChanged,
  updateDependencies: updateDependencies,

  getExample: getEntryPoint.bind(null, 'example', ['example.jsx', 'example.js']),
  getMain: getEntryPoint.bind(null, 'main', ['index.jsx', 'index.js']),
  getStyle: getEntryPoint.bind(null, 'style', ['index.css']),

  InvalidProjectError: InvalidProjectError,
};
