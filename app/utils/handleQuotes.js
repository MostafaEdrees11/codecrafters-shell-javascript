let specialCharactersToEscape = ['"', '\\', '$', '`'];

const handleQuotes = (input) => {
    let counter = 0, temp = '', args = [];
    let quote = {
        hasQuote: false,
        quoteSign: ''
    }

    while (counter < input.length) {
        if (!quote.hasQuote && input[counter] === "\\") {
            temp += input[counter + 1];
            counter += 2;
            continue;
        }

        if (quote.hasQuote && quote.quoteSign === '"' && input[counter] === "\\") {
            if (specialCharactersToEscape.includes(input[counter + 1])) {
                temp += input[counter + 1];
                counter += 2;
                continue;
            }
        }

        if (input[counter] === "'" || input[counter] === '"') {
            if (!quote.hasQuote) {
                quote.quoteSign = input[counter];
                quote.hasQuote = true;
            } else if (quote.quoteSign === input[counter]) {
                quote.hasQuote = false;
                quote.quoteSign = '';
            } else {
                temp += input[counter];
            }
            counter++;
            continue;
        }

        if (!quote.hasQuote && input[counter] === ' ' && temp.length > 0) {
            args.push(temp);
            temp = '';
            counter++;
            continue;
        }

        if (!quote.hasQuote && input[counter] === ' ' && temp.length === 0) {
            counter++;
            continue;
        }

        temp += input[counter];
        counter++;
    }

    if (temp.length > 0) args.push(temp);
    return args;
}

module.exports = {
    handleQuotes
}