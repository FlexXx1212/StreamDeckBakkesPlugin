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



function activateTabs(activeTab) {
    const allTabs = Array.from(document.querySelectorAll('.tab'));
    let activeTabEl = null;
    allTabs.forEach((el, i) => {
        el.onclick = () => clickTab(el);
        if(el.dataset?.target === activeTab) {
            activeTabEl = el;
        }
    });
    if(activeTabEl) {
        clickTab(activeTabEl);
    } else if(allTabs.length) {
        clickTab(allTabs[0]);
    }
}

function clickTab(clickedTab) {
    const allTabs = Array.from(document.querySelectorAll('.tab'));
    allTabs.forEach((el, i) => el.classList.remove('selected'));
    clickedTab.classList.add('selected');
    activeTab = clickedTab.dataset?.target;
    allTabs.forEach((el, i) => {
        if(el.dataset.target) {
            const t = document.querySelector(el.dataset.target);
            if(t) {
                t.style.display = el == clickedTab ? 'block' : 'none';
            }
        }
    });
}

/**
 * Here's a way to adjust the padding of the tabs without hacking into the CSS
 * Best to call it before the $PI is connected to avoid a visible movement of the tabs
 */

function adjustTabPadding(paddingInPixels = '12px') {
    document.body.style.setProperty('--sdpi-tab-padding-horizontal', paddingInPixels);
}

adjustTabPadding('8px');
activateTabs();
