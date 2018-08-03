const os = require('os');
const path = require('path');
const fs = require('fs');
const HOME_DIR = path.join(os.homedir(), '.ratify');
const CONFIG_FILE = path.join(HOME_DIR, 'config.js');

process.env.HOME_DIR = HOME_DIR;
process.env.CONFIG_FILE = CONFIG_FILE;
function createResourceDirectory() {
    try {
        fs.statSync(HOME_DIR);
    } catch(e) {
        fs.mkdirSync(HOME_DIR);
    }
}
function loadConfigFile() {
    if (!fs.existsSync(CONFIG_FILE)) {
        fs.createReadStream(path.join(__dirname, 'config.js'), 'UTF-8').pipe(fs.createWriteStream(CONFIG_FILE, 'UTF-8'));
    }
    let config;
    try {
        config = require(CONFIG_FILE);
    } catch(E) {
        fs.createReadStream(path.join(__dirname, 'config.js'), 'UTF-8').pipe(fs.createWriteStream(CONFIG_FILE, 'UTF-8'));
        config = require(CONFIG_FILE)
    }
    for (let key in config) {
        let value = config[key];

        if (typeof value === 'function') {
            value = value();
        }
        process.env[key.toUpperCase()] = value
    }

    return config;
}

function registerCustomCommands(Application) {
    Application.getConfigValue('commands', []).map(command => (Application.registerCommand(command)))
}

module.exports = function (Application) {

    Application.setConfig = function (config) {
        this.config = config;
    };
    Application.setConfigValue = function (key, value) {
        this.config[key] = value;
    };

    Application.getConfigValue = function (key, defaultValue) {
        return this.config[key] || defaultValue;
    };

    Application.getConfig = function () {
        return this.config;
    };

    Application.saveConfig = function () {
        fs.writeFileSync(CONFIG_FILE, 'module.exports = ' + JSON.stringify(this.config, null, 4));
    };

    return {
        loadConfigFile,
        createResourceDirectory,
        registerCustomCommands
    }
}