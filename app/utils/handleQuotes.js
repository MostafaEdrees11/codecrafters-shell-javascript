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
            if (quote.quoteSign === "") quote.quoteSign = input[counter];

            if (quote.hasQuote) {
                if (temp.length > 1 && input[counter] === quote.quoteSign) temp = temp.replace(quote.quoteSign, "");
                else temp += input[counter];
            }
            else temp += input[counter];

            if (input[counter] === quote.quoteSign) quote.hasQuote = !quote.hasQuote;
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