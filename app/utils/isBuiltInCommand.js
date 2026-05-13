const { builtInCommands } = require('./handleBuiltInCommands');

const isBuiltInCommand = command => builtInCommands.hasOwnProperty(command);

module.exports = {
    isBuiltInCommand
}