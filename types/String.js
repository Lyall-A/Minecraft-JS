const { writeVarInt, readVarInt } = require("./VarInt");

function writeString(value, maxLength) {
    if (value.length > maxLength) throw new Error(`Length must be <= ${maxLength}`);
    return Buffer.concat([
        writeVarInt(value.length),
        Buffer.from(value)
    ]);
}

function readString(buffer, offset = 0) {
    const { value: length, size: lengthSize } = readVarInt(buffer, offset);
    const string = buffer.subarray(offset + lengthSize, offset + lengthSize + length);
    return { value: string.toString(), size: lengthSize + length };
}

module.exports = {
    writeString,
    readString
};