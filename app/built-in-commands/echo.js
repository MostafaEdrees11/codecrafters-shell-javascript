const echo = (undefined, args) => {
    if (args.length > 0) {
        const indexOfRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
        if (indexOfRedirection !== -1) {
            const fs = require('fs');
            let output = args.slice(0, indexOfRedirection).join(' ');
            const fileName = args[indexOfRedirection + 1];
            fs.writeFileSync(fileName, output);
            return;
        }
        console.log(args.join(' '));
    }
}

module.exports = {
    echo
}