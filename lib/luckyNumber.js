const randomDisplay = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

exports.getLuckyNumber = () => {
    const idx = Math.floor(Math.random() * randomDisplay.length)
    return randomDisplay[idx]
}