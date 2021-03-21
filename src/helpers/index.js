function getNumberTime(time) {
    return time.getHours()*100 + time.getMinutes()
}

module.exports = {getNumberTime}