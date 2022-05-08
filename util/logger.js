/**
 * Sends through console a new info message.
 * @param message - content of the message.
 */
function print(message) {
    console.log(`${getTimeStamp()} - ${message}`);
}

/**
 * Send through console a new error message.
 * @param message - content of the message.
 */
function error(message) {
    console.log(`${getTimeStamp()} - ERROR: ${message}`);
}

/**
 * Gets the timestamp.
 * Format: hh:mm:ss
 * @returns {string} - the timestamp
 */
function getTimeStamp() {
    let date = new Date();
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

module.exports = { print, error }