const { echo } = require('../built-in-commands/echo');
const { pwd } = require('../built-in-commands/pwd');
const { cd } = require('../built-in-commands/cd');
const { cat } = require('../built-in-commands/cat');
const { type } = require('../built-in-commands/type');

const builtInCommands = {
    'echo': echo,
    'type': type,
    'pwd': pwd,
    'cd': cd,
    'cat': cat
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