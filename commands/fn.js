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

    const createDisposable = vscode.commands.registerCommand('extension.kubefy.fn.create', createFn);
    const deleteDisposable = vscode.commands.registerCommand('extension.kubefy.fn.delete', deleteFn);
    const viewDisposable = vscode.commands.registerCommand('extension.kubefy.fn.view', viewFn);
	context.subscriptions.push(createDisposable, deleteDisposable, viewDisposable);
}

async function createFn(params) {
    const kubefy = conf.get('kubefy')
    if (!kubefy) {
        vscode.window.showWarningMessage('Couldn\'t get kubefy config');        
        return;
    }
    const url = kubefy.url;
    const funcName = await vscode.window.showInputBox({placeHolder: 'Enter Function Name:'});
    const gitRepo = await vscode.window.showInputBox({placeHolder: 'Enter Git Repo URL:'});
    const image = await vscode.window.showInputBox({placeHolder: 'Enter Container Image URL:'});
    try {    
        const response = await axios.post(url + '/functions', {
            userName: kubefy.userName,
            functionName: funcName,
            image: image,
            repo: gitRepo
        });
        console.log('create function succeeded');
        vscode.window.showInformationMessage(response.data);
    } catch (err) {
        vscode.window.showWarningMessage(err);
    }
}


async function viewFn(params) {
    const kubefy = conf.get('kubefy')
    if (!kubefy) {
        vscode.window.showWarningMessage('Couldn\'t get kubefy config');        
        return;
    }
    const url = kubefy.url;
    const funcName = await vscode.window.showInputBox({placeHolder: 'Enter Function Name:'});

    try {
        const response = await axios.get(url + '/functions',
            {
                data: {
                    userName: kubefy.userName,
                    functionName: funcName
                }
            });

        if (response.data.endpoints) {
            vscode.window.showInformationMessage(JSON.stringify(response.data));
        }
    } catch (err) {
        vscode.window.showWarningMessage(err);
    }    
}

function deleteFn(params) {
}

module.exports = {
    register: register
};