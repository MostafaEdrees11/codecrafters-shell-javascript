const echo = (undefined, args) => {
    if (args.length > 0) {
        console.log(args.join(' '));
    }
}

module.exports = {
    echo
}