const net = require("net");
const { EventEmitter } = require("events");

const PacketCapturer = require("./PacketCapturer");
const types = require("./types");
const packets = require("./packets");

class Minecraft extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.options = options;
        this._host = this.options.host;
        this._port = this.options.port || 25565;
    }

    _connected = false;

    connect() {
        return new Promise((resolve, reject) => {
            if (this.connection) return reject("Connection already created");

            if (this.options.timeout) setTimeout(() => {
                if (this._connected) return;
                this.connection.destroy();
                reject();
            }, this.options.timeout);

            this.connection = net.createConnection({ host: this._host, port: this._port }, () => {
                this._connected = true;
                resolve(this.connection);
            });

            const packetCapturer = new PacketCapturer();

            this.connection.on("data", data => packetCapturer.capture(data));
            packetCapturer.onPacket(packet => this.emit("packet", packets.parse(packet)));
            // this.connection.on("data", data => {
            //     try {
            //     const packet = packets.parse(data);
            //     this.emit("packet", packet);
            //     } catch (err) { }
            // });
            this.connection.on("error", err => {
                if (!this._connected) reject(err);
            });
        });
    }

    handshake() {
        this.sendPacket("Handshake", { serverAddress: this._host, serverPort: this._port })
    }

    sendPacket(packetName, options) {
        this.connection.write(packets.create(packetName, options));
    }

    static types = types;
    static packets = packets;
}

module.exports = Minecraft;