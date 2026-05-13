const { externalCommands } = require('./handleExternalCommands');

const isExternalCommand = command => externalCommands.hasOwnProperty(command);

module.exports = {
    isExternalCommand
}