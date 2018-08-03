const Command = require('forge-cli/src/Command');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
module.exports = class NewCommand extends Command {
    constructor(context) {
        super(context);
        this.signature = 'new {type} {name}';
        this.description = 'This will list all commands registered with an application.'
    }
    handle() {
        if (!this.argument('type')) {
            this.warning('You did not have a type defined...')
            return;
        }

        if (!this.argument('name')) {
            this.warning('You did not have a name defined...')
            return;
        }

        let script_path = path.join(process.env.HOME_DIR, this.argument('type'), 'new.sh');

        if (!fs.existsSync(script_path)) {
            let doTheThing = async () => {
                this.danger('Your desired script is not created yet.');

                let { confirm: confirmation } = await this.confirm('Would you like to create an example script in that directory?')
                if (!confirmation) {
                    this.info('Okay I will not do anything!')
                    return;
                }

                // Create our directory for the command.
                fs.mkdirSync(path.join(process.env.HOME_DIR, this.argument('type')))

                // Copy over our "new command" thing to a new place
                fs.createReadStream(path.join(__dirname, '/../src/stubs/new-command.sh'), 'UTF-8')
                    .pipe(fs.createWriteStream(path.join(process.env.HOME_DIR, this.argument('type'), 'new.sh'), 'UTF-8'));

            }

            doTheThing().catch(e => {console.log(e)})
        } else {
            // Give our command access to the current working directory, and the directory where our stubs live.
            this.callCommand('WORKING_DIR="'+process.cwd() + '" STUB_DIR="'+ path.join(process.env.HOME_DIR, this.argument('type'), 'stubs')+'" /bin/bash "' + script_path + '" ' + this.argument('name'))
                .then(output => {
                    console.log(output)
                })
                .catch(err => {
                    this.error(err)
                })
        }
    }

    callCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, {}, (err, stdout, stderr) => {
                if (err) {
                    return reject(err);
                }

                resolve(stdout, stderr)
            })
        })
    }
};