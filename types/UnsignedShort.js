function writeUnsignedShort(value) {
    const buffer = Buffer.alloc(2);
    buffer.writeUInt16BE(value);
    return buffer;
}

module.exports = {
    writeUnsignedShort
};