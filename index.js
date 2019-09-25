/**
 * MQTT subscriber application that connects                 
 * via  MQTT  and writes data to a MySQL database.
 * 
 * @author Panos Matsaridis
 */

var mqtt = require('mqtt'); //https://www.npmjs.com/package/mqtt
const request = require('request')

/**
 * Create an MQTT connection
 */
var topic = '/power';
var brokerUrl = 'tcp://broker.cloudmqtt.com';
var optionsMQTT = {
    clientId: 'sql-node-parser' + Date.now(),
    port: 1883,
    username: 'user',
    password: 'supersecretpassword',
    keepalive: 60
};

var client = mqtt.connect(brokerUrl, optionsMQTT);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    console.log("Connecting MQTT..");
    client.subscribe(topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + topic + "!");
    if (err) { console.log(err); }
};

function mqtt_reconnect(err) {
    console.log("Reconnecting MQTT..");
    if (err) { console.log(err); }
    client = mqtt.connect(brokerUrl, optionsMQTT);
};

function mqtt_error(err) {
    if (err) { console.log(err); }
};

function after_publish() {
    //do nothing
};

/**
 * On message receive event
 */
function mqtt_messsageReceived(topic, message, packet) {

    var msg = message.toString(); //convert byte array to string
    var msg_json = JSON.parse(msg);
    var str = JSON.stringify(msg_json);
    console.log(str);

    request.post({
        headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
        url: 'https://post.mydomain.com/api/v1/getdata',
        body: "data=" + str
    }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            console.log(`statusCode: ${res.statusCode}`)
            console.log(body)
        })

};

function mqtt_close() {
    console.log("MQTT closed.");
};


