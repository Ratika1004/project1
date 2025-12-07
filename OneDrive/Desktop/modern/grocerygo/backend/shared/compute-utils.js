const randomNumberOfDigits = (n) => {
    if(!n || n<=0) return 0;
    const min = Math.pow(10, n-1);
    const max = Math.pow(10,n) -1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = { randomNumberOfDigits };