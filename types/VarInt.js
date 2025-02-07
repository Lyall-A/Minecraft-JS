function writeVarInt(value) {
    const buffer = Buffer.alloc(5);
    let cursor = 0;
    while (value & ~0x7F) {
        buffer.writeUInt8((value & 0xFF) | 0x80, cursor)
        cursor++;
        value >>>= 7;
    }
    buffer.writeUInt8(value, cursor);
    return buffer.subarray(0, cursor + 1);
}

function readVarInt(buffer, offset = 0) {
    let result = 0;
    let shift = 0;
    let cursor = offset;
  
    while (true) {
        if (cursor + 1 > buffer.length) throw new Error();
        const b = buffer.readUInt8(cursor);
        result |= ((b & 0x7f) << shift);
        cursor++;
        if (!(b & 0x80)) {
            return {
                value: result,
                size: cursor - offset
            }
        }
        shift += 7;
        if (shift > 64) throw new Error(`varint is too big: ${shift}`);
    }
}

module.exports = {
    writeVarInt,
    readVarInt
};