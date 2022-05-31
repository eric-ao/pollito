const fs = require('fs');

/**
 * Sends through console a new info message.
 * @param message - content of the message.
 */
function print(message) {
    let msg = `${getTimeStamp()} - ${message}`;
    console.log(msg);
    fs.writeFile(getPath(), msg+"\n", {flag: 'a'}, err => {if (err) error(err)})
}

/**
 * Send through console a new error message.
 * @param message - content of the message.
 */
function error(message) {
    let msg = `${getTimeStamp()} - ERROR: ${message}`;
    console.log(msg);
    fs.writeFile(getPath(), msg+"\n", {flag: 'a'}, err => {if (err) console.error(err)})
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

function getPath() {
    let date = new Date();
    return `./logs/${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.log`
}

module.exports = { print, error }