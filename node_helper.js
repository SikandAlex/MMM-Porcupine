/** Porcupine module **/
"use strict"
const path = require("path")

const Porcupine = require('bumblebee-hotword-node');
var NodeHelper = require("node_helper")

// Logging function to log MMM-Porcupine output, in this case it is binding the
// output of the current script to the console with the [PORCUPINE] context
var _log = function() {
    var context = "[PORCUPINE]"
    return Function.prototype.bind.call(console.log, console, context)
}()

// Logging
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
        // if we get a START socket notification, tell Porcupine to start listening
        if (!this.running) this.activate()
        break
      case "STOP":
        // If we get a STOP socket notification, tell Porcupine to stop listening
        if (this.running) this.deactivate()
        break
    }
  },

  initialize: function() {
    // if config has debug=true then start in debug mode, else dont
    var debug = (this.config.debug) ? this.config.debug : false
    if (debug == true) log = _log

    // Create a new porcupine instance
    this.porcupine = new Porcupine()

    var hotword = this.config.hotword

    // Inform the user of the hotword currently in use
    console.log('USING HOTWORD:', hotword)

    // Add the hotword
    const data = require(`./hotwords/${this.config.hotword}`);
    this.porcupine.addHotword(this.config.hotword, data, config.sensitivity);

    // Set the sensitivity for the hotword detection
    this.porcupine.setSensitivity(this.config.sensitivity)

    // DOESN'T WORK (only normal JS version)
    //this.porcupine.setMicVolume(this.config.micVolume)

    // Listen for hotword detection events, when we receive the event:
    // send a socketNotification
    this.porcupine.on('hotword', (hotword) => {
        this.sendSocketNotification("DETECTED")
        console.log('DETECTED:', hotword);
    });

    log("Initialized...")

    /* DEBUG?
    // On receiving data
    porcupine.on('data', function(data) {
        console.log('data', data);
    });
    */
  },

  // Tell Porcupine to start listening
    this.porcupine.start()
    this.running = true
  },

  // Tell Porcupine to stop listening
  deactivate: function() {
    this.porcupine.stop()
    this.running = false
  },

})
