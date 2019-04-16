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

    const createDisposable = vscode.commands.registerCommand('extension.kubefy.storage.create', createStorage);
    const deleteDisposable = vscode.commands.registerCommand('extension.kubefy.storage.delete', deleteStorage);
    const viewDisposable = vscode.commands.registerCommand('extension.kubefy.storage.view', viewStorage);
	context.subscriptions.push(createDisposable, deleteDisposable, viewDisposable);
}

async function createStorage(params) {
    const kubefy = conf.get('kubefy')
    if (!kubefy) {
        vscode.window.showWarningMessage('Couldn\'t get kubefy config');        
        return;
    }
    const url = kubefy.url;
    try {    
        const response = await axios.post(url + '/storage', {
            userName: kubefy.userName
        });
        console.log('create function succeeded');
        vscode.window.showInformationMessage(response.data);
    } catch (err) {
        vscode.window.showWarningMessage(err);
    }
}

async function deleteStorage(params) {
}

async function viewStorage(params) {
}

module.exports = {
    register: register
};