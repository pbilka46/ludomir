# Ludomir
Ludomir is a simple CLI to maintain `RELEASES.rst` file per your project.
Strongly inspired by [PyHistory](https://github.com/beregond/pyhistory) library, but for `NPM`. It uses semantic version to store release messages.  


## Installation
- Install globally
```javascript
    npm install -g ludomir
```
- Install as a dev dependency (then your own npm script will be required to call `ludomir`)
```
    npm install --save-dev ludomir
```
  
## Features
The toll can start wih `ludomir` or simplified `ludo`.
- add release message(s):
```shell
ludomir add 'Initialized ludo' 'Fixed xyz bug'
ludomir add 'Another fix for xyz'
```
- print current release messages

```shell
ludomir list
```
- update `RELEASES.rst` file with release messages under `version`:
```shell
ludomir update 0.1.1
```
The command will update RELEASES.rst file and copy the whole release content to your clipboard, so it's ready to post!
It will also remove release messages under temporary directory.


