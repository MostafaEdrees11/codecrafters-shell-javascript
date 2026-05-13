let builtInCommands = ['echo', 'exit', 'type', 'pwd', 'cd'];

const isBuiltInCommand = command => builtInCommands.includes(command);

module.exports = {
    isBuiltInCommand
}