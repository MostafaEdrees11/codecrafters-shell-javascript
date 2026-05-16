const echo = (undefined, args) => {
    const fs = require('fs');

    if (args.length > 0) {
        const indexOfOutputRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
        const indexOfAppendOutput = args.findIndex(arg => arg === '>>' || arg === '1>>');
        const indexOfOutput = indexOfOutputRedirection !== -1 ? indexOfOutputRedirection : indexOfAppendOutput;
        const indexOfErrorRedirection = args.findIndex(arg => arg === '2>');
        try {
            if (indexOfOutput !== -1) {
                let output = args.slice(0, indexOfOutput).join(' ') + '\n';
                const fileName = args[indexOfOutput + 1];
                if (indexOfOutputRedirection !== -1) {
                    fs.writeFileSync(fileName, output);
                } else if (indexOfAppendOutput !== -1) {
                    fs.appendFileSync(fileName, output);
                }
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