"use strict";
exports.__esModule = true;
exports.parse = void 0;
var YAML = require("yaml");
function parse(content) {
    var matched = content.match(/---\n([.\S\s]+)---/g)[0];
    var frontmatter = matched.replace(/-+/g, '');
    var entity = YAML.parse(frontmatter);
    if (entity.type === 'event') {
        entity.persons = entity.persons ? entity.persons.split(' ') : [];
    }
    return entity;
}
exports.parse = parse;
