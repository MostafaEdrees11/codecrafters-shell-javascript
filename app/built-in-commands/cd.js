const cd = (undefined, args) => {
    if (args.length > 0) {
        try {
            if (args[0] === '~') {
                process.chdir(process.env.HOME);
            } else {
                process.chdir(args[0]);
            }
        } catch {
            console.log(`cd: ${args[0]}: No such file or directory`);
        }
    }
}

module.exports = {
    cd
}