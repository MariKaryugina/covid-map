export const formatDate = (date) => {
    let newDate = date.toLocaleDateString('en-US');

    newDate = newDate.slice(-1) === '1'
        ? `${newDate.slice(0, -3)}1`
        : `${newDate.slice(0, -3)}0`;
    
    return newDate;
};

export const numberToShortString = (number) => {
    let resultString = '';

    if (number > 1000000) {
        resultString = `${`${number}`.slice(0, -6)}M+`;
    } else if (number > 1000) {
        resultString = `${`${number}`.slice(0, -3)}K+`;
    } else {
        resultString = `${number}`;
    }

    return resultString;
};
