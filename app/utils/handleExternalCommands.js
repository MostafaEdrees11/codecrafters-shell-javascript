const { cat } = require('../external-commands/cat');
const { ls } = require('../external-commands/ls');

const externalCommands = {
    'cat': cat,
    'ls': ls
}

const handleExternalCommands = (command, args) => {
    if (externalCommands[command]) {
        externalCommands[command](command, args);
    }
}

module.exports = {
    externalCommands,
    handleExternalCommands
}