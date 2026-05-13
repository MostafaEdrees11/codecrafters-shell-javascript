const type = (undefined, args) => {
    if (args.length > 0) {
        const { isBuiltInCommand } = require("../utils/isBuiltInCommand");
        if (isBuiltInCommand(args[0])) {
            console.log(`${args[0]} is a shell builtin`);
        } else {
            const { isExecutable } = require("../utils/isExecutable");
            const { state, data } = isExecutable(args[0]);
            if (state) {
                console.log(`${args[0]} is ${data}`);
            } else {
                console.log(`${args[0]}: not found`);
            }
        }
    }
}

module.exports = {
    type
}