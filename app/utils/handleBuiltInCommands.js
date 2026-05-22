const { exit } = require('../built-in-commands/exit');
const { echo } = require('../built-in-commands/echo');
const { pwd } = require('../built-in-commands/pwd');
const { cd } = require('../built-in-commands/cd');
const { type } = require('../built-in-commands/type');

const builtInCommands = {
    'exit': exit,
    'echo': echo,
    'type': type,
    'pwd': pwd,
    'cd': cd,
    'complete': null
}

const handleBuiltInCommands = (command, args) => {
    if (builtInCommands[command]) {
        builtInCommands[command](command, args);
    }
}

module.exports = {
    builtInCommands,
    handleBuiltInCommands
}