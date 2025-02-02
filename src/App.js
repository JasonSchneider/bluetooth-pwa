import React, { useState } from "react";

function App() {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);

  // Function to request Bluetooth Device
  const connectBluetooth = async () => {
    try {
      console.log("Requesting Bluetooth Device...");
      const bluetoothDevice = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Allows scanning for all devices
      });

      setDevice(bluetoothDevice);
      setConnected(true);
      setLogs((prevLogs) => [...prevLogs, `Connected to ${bluetoothDevice.name}`]);

      // Listen for device disconnect
      bluetoothDevice.addEventListener("gattserverdisconnected", () => {
        setConnected(false);
        setLogs((prevLogs) => [...prevLogs, `Disconnected from ${bluetoothDevice.name}`]);
      });

    } catch (error) {
      console.error("Bluetooth Connection Failed:", error);
      setLogs((prevLogs) => [...prevLogs, `Error: ${error.message}`]);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Bluetooth PWA Test</h1>
      <button onClick={connectBluetooth} disabled={connected}>
        {connected ? `Connected to ${device.name} ✅` : "Connect to Bluetooth"}
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
