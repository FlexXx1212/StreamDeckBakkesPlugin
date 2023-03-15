let websocket = null;
let pluginUUID = null;

const defaultSettings = {
    ip: "127.0.0.1",
    port: "9002",
    command: "echome 'Hello World'",
    password: ""
}

let cachedSettings = defaultSettings;
let currentlySelectedCommand = "";


function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    setupPropertyInspector(inUUID, inActionInfo);
    setupWebSocket(inPort, inRegisterEvent, inActionInfo);
}


function setupPropertyInspector(inUUID, inActionInfo) {
    pluginUUID = inUUID;
}

function setupWebSocket(inPort, inRegisterEvent) {
    const websocketURL = `ws://localhost:${inPort}`
    websocket = new WebSocket(websocketURL);

    websocket.onopen = () => onWebSocketOpen(inRegisterEvent);
    websocket.onmessage = (messageEvent) => onWebSocketMessage(messageEvent);

}

function onWebSocketOpen(inRegisterEvent) {
    callRegister(inRegisterEvent);
    callGetSettings();
}

function onWebSocketMessage(messageEvent) {
    const eventData = JSON.parse(messageEvent.data);
    const eventType = eventData['event'];

    if (eventType === "didReceiveSettings") {
        const settings = eventData["payload"]["settings"];
        loadSettings(settings);
    }
}

function updateUI() {
    document.getElementById("field_ip").value = cachedSettings.ip;
    document.getElementById("field_port").value = cachedSettings.port;
    document.getElementById("field_password").value = cachedSettings.password;
    document.getElementById("field_command").value = cachedSettings.command;
}

function fetchAndSaveSettings() {
    fetchSettings();
    callSaveSettings();
}

function fetchSettings() {
    cachedSettings.ip = document.getElementById("field_ip").value;
    cachedSettings.port = document.getElementById("field_port").value;
    cachedSettings.command = document.getElementById("field_command").value;
    cachedSettings.password = document.getElementById("field_password").value;
}

function loadSettings(settings) {
    if (!settings.ip || !settings.port || !settings.command || !settings.password) {
        console.log("No settings found. Init with default settings.");
        callSaveSettings();
    } else {
        cachedSettings = settings;
    }

    updateUI();
}

function callRegister(inRegisterEvent) {
    const json = {
        event: inRegisterEvent,
        uuid: pluginUUID
    };
    sendJSON(json);
}

function callGetSettings() {
    const json = {
        "event": "getSettings",
        "context": pluginUUID
    };
    sendJSON(json);
}

function callSaveSettings() {
    var json = {
        "event": "setSettings",
        "context": pluginUUID,
        "payload": cachedSettings
    };
    sendJSON(json);
}

function sendJSON(json) {
    websocket.send(JSON.stringify(json));
}