/** Porcupine module **/
"use strict"
const path = require("path")

const Porcupine = require('bumblebee-hotword-node');

// Helps to do node tasks easier
// https://github.com/vkuehn/node-helper
var NodeHelper = require("node_helper")

// Logging function to log snowboy output, in this case it is binding the
// output of the current script to the console with the [SNOWBOY] context
var _log = function() {
    var context = "[PORCUPINE]"
    return Function.prototype.bind.call(console.log, console, context)
}()

// Don't know what this is for
var log = function() {
  //do nothing
}

// export functions for use elsewhere
module.exports = NodeHelper.create({
  // Start function
  start: function () {
    console.log("[PORCUPINE] Starting...")
    //console.log("[SNOWBOY] Starting...")
    this.config = {}
    this.running = false
    this.porcupine = null
  },

  socketNotificationReceived: function (notification, payload) {
    switch(notification) {
      case "INIT":
        // set the internal config to the payload received in socket notification
        this.config = payload
        this.initialize()
        break
      case "START":
        // if we get a START socket notification, tell Snowboy to start listening
        if (!this.running) this.activate()
        break
      case "STOP":
        // If we get a STOP socket notification, deactivate Snowboy, stop listening
        if (this.running) this.deactivate()
        break
    }
  },

  initialize: function() {
    // if config has debug=true then start in debug mode, else dont
    var debug = (this.config.debug) ? this.config.debug : false
    if (debug == true) log = _log

    // Create a new porcupine instance
    this.porcupine = new Porcupine({hotwords: ["bumblebee"]})

    // Configure the porcupine instance with config parameters
    console.log('SELECTED HOTWORD:', this.config.hotword)

    this.porcupine.setHotword(this.config.hotword)


    // DOESN'T WORK (only normal JS version)
    //this.porcupine.setMicVolume(this.config.micVolume)

    this.porcupine.setSensitivity(this.config.sensitivity)

    // Listen for hotword detection events
    this.porcupine.on('hotword', (hotword) => {
        this.sendSocketNotification("DETECTED")
        console.log('DETECTED:', hotword);
    });

    const data = require(`./hotwords/${this.config.hotword}`);
    this.porcupine.addHotword(this.config.hotword, data, config.sensitivity);


    /* DEBUG
    // On receiving data
    porcupine.on('data', function(data) {
        console.log('data', data);
    });
    */

    log("Initialized...")
  },

  // Activate snowboy and start listening
  activate: function() {
    this.porcupine.start()
    this.running = true
  },

  // Snowboy stop listening
  deactivate: function() {
    this.porcupine.stop()
    this.running = false
  },

})
