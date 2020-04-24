// Module : MMM-Porcupine

Module.register("MMM-Porcupine", {
  defaults: {
    debug: false,
    // Default hotword is 'bumblebee'
    hotword: ["bumblebee"],
    sensitivity: 0.5,
    micConfig: {
      recorder: "arecord",
      device: "plughw:1",
    },
    onDetected: {
      notification: "ASSISTANT_ACTIVATE",
      parameters: {
        type: "MIC",
        profile: "default",
        chime: true
       }
    }
  },

  start: function() {
    this.config = this.configAssignment({}, this.defaults, this.config)
    this.sendSocketNotification('INIT', this.config)
  },

  notificationReceived: function(notification, payload, sender) {
    switch (notification) {
      case "ASSISTANT_READY":
      case "A2D_AMK2_READY":
      case "PORCUPINE_START":
        this.sendSocketNotification('START')
        break
      case "A2D_AMK2_BUSY":
      case "PORCUPINE_STOP":
        this.sendSocketNotification('STOP')
        break
    }
  },

  // When node_helper sends the DETECTED socket notification and it is recieved
  // here
  socketNotificationReceived: function(notification, payload) {
    switch (notification) {
      case "DETECTED":
        // Send ASSISTANT_ACTIVATE notification to MM Google Assistant MK2
        // find handling code in line 278 of MMM-AssistantMk2.js
        // https://github.com/bugsounet/MMM-AssistantMk2
        this.sendNotification(this.config.onDetected.notification, this.config.onDetected.parameters)
        break
    }
  },

  // Assign the configuration
  configAssignment : function (result) {
    var stack = Array.prototype.slice.call(arguments, 1)
    var item
    var key
    while (stack.length) {
      item = stack.shift()
      for (key in item) {
        if (item.hasOwnProperty(key)) {
          if (typeof result[key] === "object" && result[key] && Object.prototype.toString.call(result[key]) !== "[object Array]") {
            if (typeof item[key] === "object" && item[key] !== null) {
              result[key] = this.configAssignment({}, result[key], item[key])
            } else {
              result[key] = item[key]
            }
          } else {
            result[key] = item[key]
          }
        }
      }
    }
    return result
  },
})
