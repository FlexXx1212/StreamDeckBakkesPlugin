# StreamDeckBakkesPlugin
Stream Deck Plugin to execute Bakkes mod (Rocket League) commands


## Setup
- Install the Plugin via the Stream Deck Plugin browser
- goto the file: %appdata%\bakkesmod\bakkesmod\data\rcon_commands.cfg and add all commands you want to use via the plugin
    This should cover most usecases but feel free to add more lines:
    ```
    ws_inventory
    sendback
    rcon_password
    plugin
    cl_settings_refreshplugins
    rcon_refresh_allowed
    load_training
    load_workshop
    load_freeplay
    queue
    queue_cancel
    toggle
    sv_soccar_gamespeed
    echome
    ```
- goto the bakkes mod console and type in **rcon_password** to get your password
- now just go to your Stream Deck, add a BakkesModCommand -> Execute Action and enter your password, IP & port should be set by default
- you can easily copy the configured Action, so you dont have to type the password for each one again
## Example commands to use
```
load_training F0BD-E416-D47D-AF28
load_workshop 'T:\\\\Steam\\\\steamapps\\\\workshop\\\\content\\\\252950\\\\1694288506\\\\DribbleChallenge2Overhaul.udk'
load_freeplay
queue
queue_cancel
toggle cl_boostlimiter_enabled 0 1
sv_soccar_gamespeed 1
sv_soccar_gamespeed 0.5
```