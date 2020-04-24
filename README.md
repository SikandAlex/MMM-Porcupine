<p align="center">
  <img src="https://lh3.googleusercontent.com/j-ZoFrLkHjVTbRnj0kXW9FRQz8wLA5xf2LJasXL35na2_KaZjyr-HcdDWLhXysFfTYaNWKCCdEiV4He0e-aaFrl-O1rqANNmp-7hyuDl3uKL7zcJZaiIkdTAWcXmg5HwTtNMiOHVGyE=w2400" width="600" />
</p>

<p align="center">
  <a href="#">
    <img src="https://img.shields.io/badge/made%20with-love-E760A4.svg" alt="Made with love">
  </a>
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  </a>
</p>

# MMM-Porcupine

MMM-Porcupine is a customizable hotword detection module to activate/notify other [MagicMirror](https://github.com/MichMich/MagicMirror) modules

The default hotwords are "porcupine", "bumblebee", "grasshopper", "terminator, and "hey edison"

See [Picovoice Porcupine](https://github.com/Picovoice/porcupine) for info on how to train your own model

It would be great to get a model trained by the community on the "smart mirror" hotword 

## Installation and updates 
```sh
cd ~/MagicMirror/modules
git clone https://github.com/SikandAlex/MMM-Porcupine.git
cd MMM-Porcupine
npm install
```

## Update
**2020/04/23**: v0.0.1
  * First release for testing on RPi 4 Raspbian Buster

## Configuration
### Minimal configuration
```js
{
  module: 'MMM-Porcupine',
  config: {
    hotwords: ["porcupine"]
  }
},
```

### Personalized configuration
this is the default configuration defined if you don't define any value

```js
{
  module: 'MMM-Porcupine',
  config: {
    debug: false,
    micVolume: 1,
    hotwords: ["bumblebee"],
    sensitivity: 0.5,
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
  }
},
```

### Options

- `debug` - turn on/off debug mode.

- `hotword` - The hotword you wish to detect. The available hotwords are "porcupine", "bumblebee", "grasshopper", "terminator, and "hey edison"

- `sensitivity` - Override default sensitivity value for applied model defined in `Model`. 
    * Value could be within a range from `0.0` to `1.0`.
    * Default sensitivity values is 0.5

- `recorder` - record program, `rec`, `arecord`, `sox`, `parec` is available.
    * On RaspberryPi or some linux machines, `arecord` is better.
    * On OSX, `rec` is better.
    * If you prefer to use `pulse audio`, `parec` would be available also.

- `device` - recording device (microphone) name of your environment. (e.g. "plughw:1")
    * Find proper device name by yourself. (arecord -l will be help on Raspberry Pi)

- `notification` - notification name to emit when the hotword is detected. [Preconfigured for AMk2 activation.]

- `parameters` - payload to send with your notification. [Preconfigured for AMk2 activation].

 ### Notifications
 MMM-Snowboy can receive notification for start or stop listening
  * `PORCUPINE_START`: Start listening for hotwords
  * `PORCUPINE_STOP`: Stop listening for hotwords
  
 ### MMM-AssistantMk2 users
  * MMM-Porcupine is preconfigured for this module
  * Just turn `useA2D: true` on the MMM-AssistantMk2 config file
