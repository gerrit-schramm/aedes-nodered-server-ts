import { createServer } from 'node:net'
import { Aedes } from 'aedes'
import express from 'express'
import http from 'http'
import red from 'node-red'

const aedes = await Aedes.createBroker()
const mqttServer = createServer(aedes.handle)

mqttServer.listen(1883, () => {
    console.log('MQTT server started.')
})

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
