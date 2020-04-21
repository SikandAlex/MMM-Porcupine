/** Snowboy module **/


"use strict"
const path = require("path")
const Snowboy = require("@bugsounet/snowboy").Snowboy

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
    console.log("[SNOWBOY] Starting...")
    this.config = {}
    this.running = false
    this.snowboyConfig = {}
    this.snowboy = null
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
    this.snowboyConfig = {
      AudioGain: this.config.AudioGain,
      Frontend: this.config.Frontend,
      Model: this.config.Model,
      Sensitivity: this.config.Sensitivity
    }
    this.snowboy = new Snowboy(this.snowboyConfig, this.config.micConfig, (detected) => { this.onDetected(detected) }, this.config.debug )
    this.snowboy.init()
    log("Initialized...")
  },

  activate: function() {
    this.snowboy.start()
    this.running = true
  },

  onDetected: function (detected) {
    this.sendSocketNotification("DETECTED")
  },

  deactivate: function() {
    this.snowboy.stop()
    this.running = false
  },

})
