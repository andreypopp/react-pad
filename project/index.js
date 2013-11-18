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
    dependencies: {},

    style: './index.css',
    main: './index.jsx',
    example: './example.jsx'
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
      'example.jsx': {
        filename: 'example.jsx',
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

  for (var i = 0, len = deps.length; i < len; i++) {
    if (!proj.meta.dependencies[deps[i]])
      proj.meta.dependencies[deps[i]] = '*';
  }

  proj.files['package.json'].content = jsonStringifyPretty(proj.meta);
}

module.exports = {
  create: create,
  updateDependencies: updateDependencies
};
