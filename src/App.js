import React, { useState } from "react";

const LED_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"; // Custom Service UUID
const LED_CHARACTERISTIC_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"; // LED Characteristic UUID


function App() {
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);

  // Connect to the BLE device
  const connectBluetooth = async () => {
    try {
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        filters: [{ name: "nRF52_LED_Controller" }],  // ✅ Matches Arduino name
        optionalServices: [LED_SERVICE_UUID]
      });

      setDevice(bluetoothDevice);
      const server = await bluetoothDevice.gatt.connect();
      setServer(server);

      const service = await server.getPrimaryService(LED_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(LED_CHARACTERISTIC_UUID);
      setCharacteristic(characteristic);
      setConnected(true);

      setLogs((prev) => [...prev, `Connected to ${bluetoothDevice.name}`]);

      // Handle Disconnection
      bluetoothDevice.addEventListener("gattserverdisconnected", () => {
        setConnected(false);
        setLogs((prev) => [...prev, "Device Disconnected"]);
      });

    } catch (error) {
      console.error("Bluetooth Connection Failed:", error);
      setLogs((prev) => [...prev, `Error: ${error.message}`]);
    }
  };

  // Send data to the LED Characteristic
  const toggleLED = async (state) => {
    if (!characteristic) return;
    const value = new TextEncoder().encode(state); // Convert "1" or "0" to bytes
    await characteristic.writeValue(value);
    setLogs((prev) => [...prev, `Sent: ${state}`]);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>nRF52 Bluetooth LED Controller</h1>
      <button onClick={connectBluetooth} disabled={connected}>
        {connected ? "Connected ✅" : "Connect to Bluetooth"}
      </button>
      <br /><br />
      <button onClick={() => toggleLED("1")} disabled={!connected}>
        Turn LED ON
      </button>
      <button onClick={() => toggleLED("0")} disabled={!connected}>
        Turn LED OFF
      </button>
      <h2>Logs:</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
