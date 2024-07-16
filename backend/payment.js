/**
 * 
 * @param {string} cardNumber 
 */
function luhnsAlgorithmCheck(cardNumber) {
    const cardArray = cardNumber.split('')
    //console.log(cardArray);
    const decodedArray = cardArray.map((digit, index) => {
        const digitNum = parseInt(digit);
        if (index % 2 === 0) {
            if (digitNum === 5) {
                return 1;
            } else if (digitNum === 6) {
                return 3;
            } else if (digitNum === 7) {
                return 5;
            } else if (digitNum === 8) {
                return 7;
            } else if (digitNum === 9) {
                return 9;
            } else {
                return digitNum * 2;
            }
        } else {
            return digitNum;
        }
    });
    
    let sum = 0;

    decodedArray.forEach(digit => {
        sum += digit;
    });

    if (sum % 10 === 0) {
        return true;
    }
    return false;
}

module.exports = luhnsAlgorithmCheck;