let registeredCommands = {};

const complete = (command, args) => {
    if (args.includes('-C')) {
        let commandToRegister = args[args.indexOf('-C') + 2];
        let pathToCompleter = args[args.indexOf('-C') + 1];
        if (!registeredCommands.hasOwnProperty(commandToRegister)) {
            registeredCommands = {
                ...registeredCommands,
                [commandToRegister]: pathToCompleter
            };
        }
    }

    if (args.includes('-p')) {
        let givenCommand = args[args.indexOf('-p') + 1];

        if (registeredCommands.hasOwnProperty(givenCommand)) {
            process.stdout.write(`complete -C '${registeredCommands[givenCommand]}' ${givenCommand}\n`);
        } else {
            process.stdout.write(`complete: ${givenCommand}: no completion specification\n`)
        }
    }
}

module.exports = { complete }