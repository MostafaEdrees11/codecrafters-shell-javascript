const fs = require('fs');
const path = require('node:path');

const cat = (undefined, args) => {
    let data = '';
    const indexOfOutputRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
    const indexOfErrorRedirection = args.findIndex(arg => arg === '2>');
    const indexOfAppendOutput = args.findIndex(arg => arg === '>>' || arg === '1>>');
    const indexOfAppendError = args.findIndex(arg => arg === '2>>');
    const indexOfOutput = indexOfOutputRedirection !== -1 ? indexOfOutputRedirection : indexOfAppendOutput;
    const indexOfError = indexOfErrorRedirection !== -1 ? indexOfErrorRedirection : indexOfAppendError;
    const redirectionIndex = indexOfOutput !== -1 && indexOfError !== -1 ? Math.min(indexOfOutput, indexOfError) :
        indexOfOutput !== -1 ? indexOfOutput : indexOfError;
    let files = args.slice(0, redirectionIndex !== -1 ? redirectionIndex : args.length);

    try {
        files.forEach(file => {
            data += fs.readFileSync(file, 'utf8');
        })

        if (indexOfOutput === -1) {
            process.stdout.write(data);
        }
    } catch (err) {
        if (indexOfError !== -1) {
            const fileName = args[indexOfError + 1];
            if (indexOfErrorRedirection !== -1) {
                fs.writeFileSync(fileName, `cat: ${path.basename(err.path)}: No such file or directory\n`);
            } else if (indexOfAppendError !== -1) {
                fs.appendFileSync(fileName, `cat: ${path.basename(err.path)}: No such file or directory\n`);
            }

            if (data !== '') process.stdout.write(data);
        }

        if (indexOfOutput !== -1) {
            process.stdout.write(`cat: ${path.basename(err.path)}: No such file or directory\n`);
        }
    } finally {
        if (data !== '') {
            const fileName = args[indexOfOutput + 1];
            if (indexOfOutputRedirection !== -1) {
                fs.writeFileSync(fileName, data);
            } else if (indexOfAppendOutput !== -1) {
                fs.appendFileSync(fileName, data);
            }
        }
    }
}

module.exports = {
    cat
}