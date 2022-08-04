var cache = new Object();

function update(id, friend) {
    cache[id] = friend;
}

function check(id) {
    if(id in cache) return true;
    return false;
}

function get(id) {
    return cache[id]
}

module.exports = { update, check, get }