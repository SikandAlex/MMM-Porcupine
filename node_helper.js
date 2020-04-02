/** Snowboy module **/


"use strict"
const path = require("path")
const Detector = require("./snowboy/lib/node/index.js").Detector
const Models = require("./snowboy/lib/node/index.js").Models
const Recorder = require("./components/lpcm16.js")

var NodeHelper = require("node_helper")
var _log = function() {
    var context = "[SNOWBOY]"
    return Function.prototype.bind.call(console.log, console, context)
}()

var log = function() {
  //do nothing
}

module.exports = NodeHelper.create({
  start: function () {
    console.log("[SNOWBOY] Loading...")
    this.snowboyDict = {
      "smart_mirror": {
        hotwords: "smart_mirror",
        file: "smart_mirror.umdl",
        sensitivity: "0.5"
      },
      "computer": {
        hotwords: "computer",
        file: "computer.umdl",
        sensitivity: "0.6"
      },
      "snowboy": {
        hotwords: "snowboy",
        file: "snowboy.umdl",
        sensitivity: "0.5"
      },
      "jarvis": {
        hotwords: ["jarvis", "jarvis"],
        file: "jarvis.umdl",
        sensitivity: "0.7,0.7"
      },
      "subex": {
        hotwords: "subex",
        file: "subex.umdl",
        sensitivity: "0.6"
      },
      "neo_ya": {
        hotwords: ["neo_ya", "neo_ya"],
        file: "neoya.umdl",
        sensitivity: "0.7,0.7"
      },
      "hey_extreme": {
        hotwords: "hey_extreme",
        file: "hey_extreme.umdl",
        sensitivity: "0.6"
      },
      "view_glass": {
        hotwords: "view_glass",
        file: "view_glass.umdl",
        sensitivity: "0.7"
      }
    }
    this.config = {}
    this.model = []
    this.models = []
    this.mic = null
    this.detector = null
    this.running = false
    this.err = false
    this.defaultOption = {}
  },

  socketNotificationReceived: function (notification, payload) {
    switch(notification) {
      case "INIT":
        this.config = payload
        this.initialize()
        break
      case "START":
        if (!this.running) this.activate()
        break
      case "STOP":
        if (this.running) this.deactivate()
        break
    }
  },

  initialize: function() {
    var debug = (this.config.debug) ? this.config.debug : false
    if (debug == true) log = _log
    this.defaultOption = {
      sampleRate: 16000,
      channels: 1,
      threshold: 0.5,
      thresholdStart: null,
      thresholdEnd: null,
      silence: '1.0',
      verbose: debug,
    }
    this.models = new Models();
    var modelPath = path.resolve(__dirname, "models")

    if (this.config.Model) {
      for (let [item, value] of Object.entries(this.snowboyDict)) {
        if (this.config.Model == item) {
          log("Model selected:", item)
          if (this.config.Sensitivity) {
             if ((isNaN(this.config.Sensitivity)) || (Math.ceil(this.config.Sensitivity) > 1)) {
               log("Wrong Sensitivity value.")
             } else {
              if (item == ("jarvis" || "neo_ya")) {
                value.sensitivity = this.config.Sensitivity + "," + this.config.Sensitivity
              }
              else value.sensitivity = this.config.Sensitivity
            }
          }
          log("Sensitivity set:", value.sensitivity)
          this.model.push(value)
        }
      }
    }

    if (this.model.length == 0) return console.log("[SNOWBOY][ERROR] No model to load")
    this.model.forEach((model)=>{
      model.file = path.resolve(modelPath, model.file)
      this.models.add(model)
    })
    log("Initialized...")
  },

  activate: function() {
    this.detector = new Detector({
      resource: path.resolve(__dirname, "snowboy/resources/common.res"),
      models: this.models,
      audioGain: this.config.AudioGain,
      applyFrontend: this.config.Frontend
    })

    this.detector
      .on("error", (err)=>{
        console.log("[SNOWBOY] Detector Error", err)
        this.stopListening()
        return
      })
      .on("hotword", (index, hotword, buffer)=>{
        log("Detected:", hotword)
        this.stopListening()
        this.sendSocketNotification("DETECTED")
        return
      })
    this.startListening()
  },

  startListening: function () {
    if (this.mic) return
    this.running = true
    var Options = Object.assign({}, this.defaultOption, this.config.micConfig)
    this.mic = new Recorder(Options, this.detector, (err)=>{this.error(err)})
    this.mic.start()
  },

  deactivate: function() {
    this.stopListening()
  },

  stopListening: function() {
    if (!this.mic) return
    this.running = false
    this.mic.stop()
    this.mic = null
  },

  error: function(err) {
	if (err) {
     console.log("[SNOWBOY][ERROR] " + err)
     this.stopListening()
     return
    }
  }
})
