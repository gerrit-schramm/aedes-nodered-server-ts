const aedes = require('aedes')()
const mqttServer = require('net').createServer(aedes.handle)

mqttServer.listen(1883, () => {
    console.log('MQTT server started.')
})

const http = require('http')
const express = require("express")
const red = require("node-red")

const app = express()

app.use("/",express.static("public"))

const webServer = http.createServer(app)

const settings = {
    httpAdminRoot: "/red",
    httpNodeRoot: "/api",
    userDir: "./.nodered/",
    functionGlobalContext: { },
    flowFile: "./flows.json"
}

red.init(webServer, settings)

app.use(settings.httpAdminRoot, red.httpAdmin)

app.use(settings.httpNodeRoot, red.httpNode)

webServer.listen(8080)

red.start()