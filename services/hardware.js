const socket = io("http://localhost:3000");

export function listenHardwareData(callback) {
  socket.on("sensorData", (data) => {
    console.log("Sensor Data:", data);
    callback(data);
  });
}