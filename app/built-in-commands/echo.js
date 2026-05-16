const echo = (undefined, args) => {
    const fs = require('fs');

    if (args.length > 0) {
        const indexOfOutputRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
        const indexOfErrorRedirection = args.findIndex(arg => arg === '2>');
        const indexOfAppendOutput = args.findIndex(arg => arg === '>>' || arg === '1>>');
        const indexOfAppendError = args.findIndex(arg => arg === '2>>');
        const indexOfOutput = indexOfOutputRedirection !== -1 ? indexOfOutputRedirection : indexOfAppendOutput;
        const indexOfError = indexOfErrorRedirection !== -1 ? indexOfErrorRedirection : indexOfAppendError;
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
            if (indexOfError !== -1) {
                process.stdout.write(args.slice(0, indexOfError).join(' ') + '\n');
                const fileName = args[indexOfError + 1];
                if (indexOfErrorRedirection !== -1) {
                    fs.writeFileSync(fileName, '');
                } else if (indexOfAppendError !== -1) {
                    fs.appendFileSync(fileName, '');
                }
                return;
            }
            process.stdout.write(args.join(' ') + '\n');
        } catch (err) {
            if (indexOfError !== -1) {
                const fileName = args[indexOfError + 1];
                if (indexOfErrorRedirection !== -1) {
                    fs.writeFileSync(fileName, err.message);
                } else if (indexOfAppendError !== -1) {
                    fs.appendFileSync(fileName, err.message);
                }
                return;
            }
            process.stdout.write(err.message);
        }
    }
}

module.exports = {
    echo
}