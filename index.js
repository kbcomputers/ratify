const Application = require('forge-cli');
const helpers = require('./src/helpers')(Application);

helpers.createResourceDirectory();

const config = helpers.loadConfigFile();

Application.setConfig(config)

Application.register(__dirname, [
    'Commands'
]);

helpers.registerCustomCommands(Application)

const args =  Object.assign({}, { args: process.argv });

Application.start(args);

Application.saveConfig()
