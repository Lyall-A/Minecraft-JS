const types = require("../../types");
const bounds = require("../../bounds");
const states = require("../../states");

class StatusRequest {
    // https://minecraft.wiki/w/Java_Edition_protocol#Status_Request
    constructor(options = {}) {

    }

    static packetName = "Status_Request";
    static packetId = Buffer.from([0x00]);
    static state = states.STATUS;
    static bound = bounds.SERVER;

    data = () => Buffer.alloc(0);

    length = () => types.writeVarInt(StatusRequest.packetId.byteLength + this.data().byteLength);

    buffer = () => Buffer.concat([
        this.length(),
        StatusRequest.packetId,
        this.data()
    ]);
}

module.exports = StatusRequest;