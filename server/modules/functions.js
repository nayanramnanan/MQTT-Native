// ----------------------
// Generate Serial Number
// ----------------------
export const genSerialNumber = () => {
    try {
        // Serial number is a hex string no more than 20 octets and starts with a positive hex (i.e. first bit is 0)
        return (
            Math.floor(Math.random() * 8).toString() +
            [...Array(39)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        )
    } catch (e) {
        throw e
    }
}
