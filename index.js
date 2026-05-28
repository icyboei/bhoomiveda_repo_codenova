const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

// ESP32 Port
const port = new SerialPort({
  path: 'COM8', // CHANGE THIS
  baudRate: 115200,
})

// Parser
const parser = port.pipe(
  new ReadlineParser({ delimiter: '\r\n' })
)

// Receive ESP32 Data
parser.on('data', (data) => {

  console.log("Raw:", data)

  const parts = data.split(',')

  let sensorData = {}

  parts.forEach(part => {

    const keyValue = part.split(':')

    if (keyValue.length < 2) return

    const key = keyValue[0].trim()
    const value = keyValue[1].trim()

    sensorData[key] = value
  })

  console.log(sensorData)

  // Send to frontend
  io.emit('sensorData', sensorData)

})

// Start server
server.listen(3000, () => {
  console.log("Server running on port 3000")
})