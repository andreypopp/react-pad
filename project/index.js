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
        content: ''
      },
      'index.css': {
        filename: 'index.css',
        displayName: 'Styles',
        content: ''
      },
      'example.html': {
        filename: 'example.html',
        displayName: 'Example',
        content: ''
      },
      'package.json': {
        filename: 'package.json',
        displayName: 'Project Metadata',
        content: jsonStringifyPretty(meta)
      }
    }
  };

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

  for (var filename in proj.files)
    if (/\.jsx?$/.exec(filename) &&
        (!changedFilenames || changedFilenames &&
         changedFilenames.indexOf(filename) > -1))
      deps = deps.concat(detective(proj.files[filename].content));

  deps.forEach(function(dep) {
    if (dep[0] === '.' && dep[0] === '/')
      return;
    dep = dep.split('/').filter(Boolean)[0];
    console.log('dep', dep, proj.meta.dependencies);
    if (proj.meta.dependencies[dep] === undefined)
      proj.meta.dependencies[dep] = '*';
  });

  metaChanged(proj);
}

function fileChanged(proj, file) {
  proj.files[file.filename] = file;
  updateDependencies(proj, [file.filename]);
  return proj;
}

function metaChanged(proj) {
  console.log(proj.meta);
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
  fileChanged: fileChanged,
  metaChanged: metaChanged,
  updateDependencies: updateDependencies,

  getExample: getEntryPoint.bind(null, 'example', ['example.jsx', 'example.js']),
  getMain: getEntryPoint.bind(null, 'main', ['index.jsx', 'index.js']),
  getStyle: getEntryPoint.bind(null, 'style', ['index.css']),

  InvalidProjectError: InvalidProjectError,
};
