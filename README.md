# MMM-Snowboy

<p align="right">
	<a href="http://choosealicense.com/licenses/mit"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>

MMM-Snowboy is a customizable hotword detection module for your MagicMirror to activate your [MagicMirror](https://github.com/MichMich/MagicMirror)/[MMM-AssistantMk2](https://github.com/eouia/MMM-AssistantMk2) module by any hotword like "Smart mirror" or "Jarvis" (standard hotwire from Snowboys database.


## Requirements:
1. [MagicMirror, ^2.11.0](https://github.com/MichMich/MagicMirror) 
2. [MMM-AssistantMk2, ^3.2.0](https://github.com/eouia/MMM-AssistantMk2)


## Installation and updates
To install and update MagicMirror/MMM-Snowboy module, you can use automatic scripts. 

### Automatic installation
For automatic installation run the following code:
  
```sh
cd ~/MagicMirror/modules/
git clone https://github.com/bugsounet/MMM-Snowboy.git
cd ~/MagicMirror/modules/MMM-Snowboy
./install
```

### Automatic update
If you have installed module already, run the following code to update your install:
```sh
cd ~/MagicMirror/modules/MMM-Snowboy
./install
```


## Configuration
### config.js


```

defaults: {
    debug: false,
    AudioGain: 2.0,
    Frontend: false,
    Model: "jarvis",
    Sensitivity: null,
    // When you use only`snowboy` and smart_mirror, false is better. But with other models, true is better.
    micConfig: {
      recordProgram: "arecord",
      device: null
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
```
### Options

`debug` - turn on/off debug mode.

`AudioGain` - set the gain of mic. Usually you don't need to set or adjust this value.

`Frontend` -  set pre-processing of hotword detection. When you are using .pmdl, set this to false. For .umdl, When you use only snowboy and smart_mirror, false is better. But with other models, true is better to recognize..

`Model` - set the name of your detector. Available: "smart_mirror", "jarvis", "computer", "snowboy", "subex", "neo_ya", "hey_extreme", "view_glass"

`Sensitivity` - set sensitivity of detection for this hotword. Try various values to find a right one for your environment. When you use only`snowboy` and smart_mirror, false is better. But with other models, true is better.

`recordProgram` - standard program used by the module. `arecord` is preinstalled in Raspbian Buster.

`notification` - notification name to emit when the hotword is detected. Preconfigured for AMk2 activation.

`type` - 

`profile` - 

`chime` - 


