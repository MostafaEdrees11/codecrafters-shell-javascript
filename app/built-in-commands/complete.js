const complete = (command, args) => {

    if (args.includes('-p')) {
        let registeredCommands = [];
        let givenCommand = args[args.indexOf('-p') + 1];

        if (registeredCommands.includes(givenCommand)) {
        } else {
            process.stdout.write(`complete: ${givenCommand}: no completion specification\n`)
        }
    }
}

module.exports = { complete }