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

    const createDisposable = vscode.commands.registerCommand('extension.kubefy.user.create', createUser);
    const deleteDisposable = vscode.commands.registerCommand('extension.user.delete', deleteUser);
	context.subscriptions.push(createDisposable, deleteDisposable);
}

async function createUser(params) {
    const url = await vscode.window.showInputBox({placeHolder: 'Enter Kubefy URL:'});
    const userName = await vscode.window.showInputBox({placeHolder: 'Enter user name:'});

    if (url) {
        conf.set('kubefy.url', url);
    }
    if (userName) {
        conf.set('kubefy.userName', userName);
    }

    try {
        const response = await axios.post(url + '/users', {
            /*
            bucket: bucket,
            dockerId: dockerId,
            dockerPassword: dockerPassword,
            githubId: githubId,
            githubPassword: githubPassword,
            */
           userName: userName
        });
        vscode.window.showInformationMessage(response.data);
    } catch (err) {
        vscode.window.showWarningMessage(err);
    }
}

function deleteUser(params) {
}

module.exports = {
    register: register
};