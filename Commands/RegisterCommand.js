const Command = require('forge-cli/src/Command');
const fs = require('fs');
const path = require('path');

module.exports = class NewCommand extends Command {
    constructor(context) {
        super(context);
        this.signature = 'command {filePath}';
        this.description = 'This will register a single custom command.'
    }
    handle() {
        if (!this.argument('filePath')) {
            this.danger('You did not have any kind of file path defined...')
            return;
        }

        let filePath = this.argument('filePath');

        let fullPath;

        if (filePath.startsWith('/')) {
            fullPath = filePath;
        } else {
            fullPath = path.join(process.cwd(), filePath)
        }

        if (!fs.existsSync(fullPath)) {
            this.danger('Your file does not exist at: ', { fullPath })
            return;
        }

        if (!fullPath.endsWith('.js')) {
            this.danger('Your file does not exist as a JS file')
            return;
        }

        let commandsConfig = this.Application.getConfigValue('commands', []);

        commandsConfig.push(fullPath);

        this.Application.setConfigValue('commands', [...new Set(commandsConfig)])

        this.Application.registerCommand(fullPath)
    }
};