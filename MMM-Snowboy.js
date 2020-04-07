//
// Module : MMM-Hotword
//


Module.register("MMM-Snowboy", {
  defaults: {
    debug: false,
    AudioGain: 2.0,
    Frontend: false,
    Model: "jarvis",
    Sensitivity: null,
    // When you use only`snowboy` and `smart_mirror`, `false` is better. But with other models, `true` is better.
    micConfig: {
      recorder: "arecord",
      device: "plughw:1"
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
      case "SNOWBOY_START":
        this.sendSocketNotification('START')
        break
      case "A2D_AMK2_BUSY":
      case "SNOWBOY_STOP":
        this.sendSocketNotification('STOP')
        break
    }
  },

  socketNotificationReceived: function(notification, payload) {
    switch (notification) {
      case "DETECTED":
        this.sendNotification(this.config.onDetected.notification, this.config.onDetected.parameters)
        break
    }
  },

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
