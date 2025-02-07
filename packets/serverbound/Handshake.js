const types = require("../../types");
const bounds = require("../../bounds");
const states = require("../../states");

class Handshake {
    // https://minecraft.wiki/w/Java_Edition_protocol#Handshake
    constructor(options = {}) {       
        this._protocolVersion = options.protocolVersion ?? 767;
        this._serverAddress = options.serverAddress;
        this._serverPort = options.serverPort ?? 25565;
        this._nextState = options.nextState ?? 1;
    }

    static packetName = "Handshake";
    static packetId = Buffer.from([0x00]);
    static state = states.HANDSHAKING;
    static bound = bounds.SERVER;

    protocolVersion = () => types.writeVarInt(this._protocolVersion);
    serverAddress = () => types.writeString(this._serverAddress, 255);
    serverPort = () => types.writeUnsignedShort(this._serverPort);
    nextState = () => types.writeVarInt(this._nextState);

    data = () => Buffer.concat([
        this.protocolVersion(),
        this.serverAddress(),
        this.serverPort(),
        this.nextState()
    ]);

    length = () => types.writeVarInt(Handshake.packetId.byteLength + this.data().byteLength);

    buffer = () => Buffer.concat([
        this.length(),
        Handshake.packetId,
        this.data()
    ]);
}

module.exports = Handshake;