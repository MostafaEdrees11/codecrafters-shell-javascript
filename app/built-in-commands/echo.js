const echo = (undefined, args) => {
    const fs = require('fs');

    if (args.length > 0) {
        const indexOfOutputRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
        const indexOfErrorRedirection = args.findIndex(arg => arg === '2>');
        try {
            if (indexOfOutputRedirection !== -1) {
                let output = args.slice(0, indexOfOutputRedirection).join(' ') + '\n';
                const fileName = args[indexOfOutputRedirection + 1];
                fs.writeFileSync(fileName, output);
                return;
            }
            if (indexOfErrorRedirection !== -1) {
                process.stdout.write(args.slice(0, indexOfErrorRedirection).join(' ') + '\n');
                const fileName = args[indexOfErrorRedirection + 1];
                fs.writeFileSync(fileName, '');
                return;
            }
            process.stdout.write(args.join(' ') + '\n');
        } catch (err) {
            if (indexOfErrorRedirection !== -1) {
                const fileName = args[indexOfErrorRedirection + 1];
                fs.writeFileSync(fileName, err.message);
                return;
            }
            process.stdout.write(err.message);
        }

    }
}

module.exports = {
    echo
}