import {
    ObjectConfig,
    HostConfig,
    PortConfig,
    FileConfig,
    StringConfig
} from '../../src';

export class ConfigModel {
    @ObjectConfig()
    public server: ConfigServer = new ConfigServer();
    @ObjectConfig()
    public mqtt: ConfigMQTT = new ConfigMQTT();
    @ObjectConfig()
    public undefinedObj: any = undefined;
}

export class ConfigServer {
    @HostConfig()
    public host: string = process.env.HOST || 'localhost';
    @PortConfig()
    public port: number = parseInt(process.env.HTTPS_PORT, 10) || 1081;
    @PortConfig()
    public ws_port: number = parseInt(process.env.WEBSOCKET_PORT, 10) || 1443;
    @FileConfig('certificatePath')
    public certificate: string = process.env.CERTIFICATE || './certs/server.crt';
    @StringConfig()
    public undefinedProperty: string = undefined;

    public certificatePath: string;
}

export class ConfigMQTT {
    @HostConfig()
    public host: string = process.env.MQTT_HOST;
    @PortConfig()
    public port: number = parseInt(process.env.MQTT_PORT, 10);
    @StringConfig()
    public user: string = process.env.MQTT_USERNAME;
    @StringConfig()
    public password: string = process.env.MQTT_PASSWORD;
}
