const longestCommonPrefix = (arr) => {
    if (arr.length === 0) return "";

    let prefix = arr[0];
    for (let i = 1; i < arr.length; i++) {
        while (prefix !== arr[i].slice(0, prefix.length)) {
            prefix = prefix.slice(0, prefix.length - 1);

            if (prefix === "") return "";
        }
    }
    return prefix;
}

module.exports = { longestCommonPrefix };