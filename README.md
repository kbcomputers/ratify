# Ratify
A cli tool that helps you script out common tasks you preform!

## Installation
`npm install -g @kbco/ratify`

## How to use
There are two commands that come with Ratify. The first one allows you to script out tasks that create files, folders, or projects. For example, I tend to create a lot of new Laravel projects. When I do that I tend to pull in the same 5 dependencies and set up the whole project the same. So I created a ratify script to do that for me.

`ratify new {scriptPreset} {nameOfProject}`

My use would be:

```bash
ratify new laravel project-name
```
Then ratify runs my `~/.ratify/laravel/new.sh` file. You can put what ever you'd like in the new.sh file, just know that it runs every time you run the new command with that project.

## Registering your very own commands

If you wish to register your own JavaScript commands, all you have to do is write it up, extend `forge-cli/src/Command` and `ratify command path/to/your/command`

Ratify does accept absolute or relative paths, it's smart enough to know how to resolve both. 

What might an example look like you ask?

`my-command.js`
```js
const Command = require('forge-cli/src/Command');

module.exports = class MyCommand extends Command {
    constructor(context) {
        super(context);
        this.signature = 'mynamespace {param} {--option}';
        this.description = 'This will list all commands registered with an application.'
    }
    handle() {
        //
    }
};
```
And if that was in your Downloads directory on a mac you could use the following command
`ratify command ~/Downloads/my-command`

Once your command is registered it'll be apart of ratify and you can use it globally.

## Real life example
_That's cool and all, but I really don't see how this is valuable to me._

I use this toolset to commit to my work project. Our tests are setup in docker, we have also enforce a code style. I wanted to run our code style checker and our tests before I push my code up to our VCS. _GithooK!_ I thought, but then realized that running the tests against docker won't work because you need a valid TTY session and Githooks don't provide that.

Thus enter in my custom toolset here. I can run `ratify commit path/to/file` and then it runs my tests and cs checks. If anything fails it aborts the commit and then I can address the feedback it provides me.

# Extras
Pull requests, and issues are welcome! Made with my other package [forge-cli](https://github.com/austinkregel/forge-cli)