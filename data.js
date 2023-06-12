exports.getDate = function () {
    const days = new Date()
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    return days.toLocaleDateString("en-US", options)

}

exports.getDay = function () {
    const days = new Date()
    const options = {
        weekday: 'long',
    }
    return days.toLocaleDateString("en-US", options)
}


