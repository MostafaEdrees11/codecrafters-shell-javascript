const { cat } = require('../external-commands/cat');

const externalCommands = {
    'cat': cat
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