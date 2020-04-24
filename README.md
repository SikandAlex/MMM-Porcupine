# MMM-Porcupine

<p align="right">
  <a href="http://choosealicense.com/licenses/mit"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

MMM-Porcupine is a customizable hotword detection module to activate/notify other [MagicMirror](https://github.com/MichMich/MagicMirror) modules

The default hotwords are "porcupine", "bumblebee", "grasshopper", "terminator, and "hey edison"

See [Picovoice Porcupine](https://github.com/Picovoice/porcupine) for info on how to train your own model

It would be great to get a model trained by the community on the "smart mirror" hotword 

## Installation and updates
To install and update MMM-Porcupine module, you can use automatic scripts. 

### Automatic installation
For automatic installation run this command and execute electron rebuild step:
  
```sh
cd ~/MagicMirror/modules/MMM-Porcupine
npm install
```

### Manual installation
MMM-Porcupine need some libraries 
`libmagic-dev libatlas-base-dev sox libsox-fmt-all build-essential`

```sh
sudo apt-get install libmagic-dev libatlas-base-dev sox libsox-fmt-all build-essential
cd ~/MagicMirror/modules/MMM-Porcupine
npm install
```
Don't execute automatic installation

`Do you want to execute automatic intallation ? [Y/n]`<br>
`Your choice: N`<br>

Don't execute electron rebuild

`Do you want to execute electron rebuild ? [Y/n]`<br>
`Your choice: N`<br> 

Now, do electron rebuild step manualy:
```sh
./node_modules/.bin/electron-rebuild
```


### Automatic update
If you have installed module already, run the following code to update your install:
```sh
cd ~/MagicMirror/modules/MMM-Porcupine
npm run update
```

### Full Snowboy rebuild
  * If you have some trouble with new a version of MagicMirror<br>
  * If you want install lasted version of `@bugsounet/snowboy` library
```sh
cd ~/MagicMirror/modules/MMM-Snowboy
npm run rebuild
```
## Update
**2020/04/23**: v0.0.1
  * First release for testing on RPi 4 Raspbian Buster

## Configuration
### Minimal configuration
```js
{
  module: 'MMM-Snowboy',
  config: {
    Frontend: false,
    Model: "smart_mirror"
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

- `micVolume` - The volume of the microphone. Usually you don't need to set or adjust this value.

- `hotwords` - Array of hotwords you wish to detect. The available hotwords are "porcupine", "bumblebee", "grasshopper", "terminator, and "hey edison"

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

 ### Notification received
 MMM-Snowboy can receive notification for start or stop listening
  * `PORCUPINE_START`: Start listening for hotwords
  * `PORCUPINE_STOP`: Stop listening for hotwords
  
 ### Notes
  * This module does't need any configuration for position because it runs behind-the-scenes
  * With npm install, you can generate a proper micConfig {} configuration
  
 ### MMM-AssistantMk2 users
  * MMM-Porcupine is preconfigured for this module
  * Just turn `useA2D: true` on the MMM-AssistantMk2 config file
