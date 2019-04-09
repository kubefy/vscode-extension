const Configstore = require('configstore');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const axios = require('axios');
const vscode = require('vscode');

var log;
var context;

function register(_context, _log) {
    log = _log;
    context = _context;    
}

module.exports = {
    register: register
};