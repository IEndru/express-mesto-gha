const JWT_SECRET = 'bd540eeb8be6ae1a8234b2ef8eda2eadfca3f80638eefce53f3b3764cba31fda';

const RegExp = /^https?:\/\/(www\.)?[0-9a-zA-Z]+([.|-]{1}[0-9a-zA-Z]+)*\.[0-9a-zA-Z-]+(\/[0-9a-zA-Z\-._~:/?#[\]@!$&'()*+,;=]*#?)?$/;

module.exports = { JWT_SECRET, RegExp };
