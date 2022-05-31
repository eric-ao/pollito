const fs = require('fs');
const dirPath = './logs';


/**
 * Sends through console a new info message.
 * @param message - content of the message.
 */
function print(message) {
    let msg = `${getTimeStamp()} - ${message}`;
    console.log(msg);
    try {
        if(!fs.existsSync(dirPath)) 
            fs.mkdir(dirPath, (err) => {
                if(err) error(err);
            });
        fs.writeFile(getPath(), msg+"\n", {flag: 'a', recursive: true}, err => {if (err) error(err)})
    } catch (err) {
        error(err);
    }
}

/**
 * Send through console a new error message.
 * @param message - content of the message.
 */
function error(message) {
    let msg = `${getTimeStamp()} - ERROR: ${message}`;
    console.log(msg);
    try {
        if(!fs.existsSync(dirPath)) 
            fs.mkdir(dirPath, (err) => {
                if(err) console.error(err);
            });
        fs.writeFile(getPath(), msg+"\n", {flag: 'a', recursive: true}, err => {if (err) console.error(err)})
    }catch (err) {
        console.error(err);
    }
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
    return `${dirPath}/${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.log`
}

module.exports = { print, error }