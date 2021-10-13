# code_stuff
 Welcome to my central repo!
 No guarantees that any of this stuff works, it's mostly just so that my code is safe from accidental deletion.
 
 Everything in this folder and in all subfolders are covered by the MIT license found in the LICENSE file, please read that.

## Contents

 It's categorized mostly by language- here's a brief summary of the top level Folders

- `6502-asm`- programs written in 6502 assembly for various hobby projects
- `haskell`- Some haskell stuff
- `mc-datapacks`- Datapacks for Minecraft
- `nodejs`- Various nodejs apps and things
- `php`- Some bits of PHP code- now mostly broken and in the process of being replaced.
- `python`- Various python things.
- `html`- This folder contains a website, meant to be hosted with my `MDWebServer` project. This is where I'm most active.
- `html-res`- Various server resources to allow `MDWebServer` to host the above folder


 There are also some loose files:

- `.gitattributes` and `.gitignore` allow git to do its thing
- `.replit` and `repl-start.sh` allow this repo to be edited and run on [replit.com](https://replit.com)
- `start.sh`- Shortcut to run this repo on my home computer
- `command.txt`- Some localhost server commands I used to use to start the HTML and PHP stuff.
- `LICENSE.txt`- License file, covers everything in this repo
- `README.md`- This file!

## Launching Things

 How do I run this code? Here's how:


#### HTML/JS
 The web JS in here is structured in the form of a webpage- I use my `MDWebServer` project to host it. Here's what that looks like:
```sh
npm start --prefix ../MDWebServer ../code_stuff/html ../code_stuff/html-res
```
 But that's long and awkward, so I chucked it in a shell script and now all you have to do is `./start.sh`. I should note that this expects a copy of `MDWebServer` *outside* the `code_stuff` folder.

#### 6502 Stuff
 There's a handful of 6502 assembly programs, which target a handful of platforms. Most of them are for [Ben Eater's Breadboard Computer](https://eater.net/6502). I'm using the [vasm assembler](http://www.compilers.de/vasm.html) to assemble:

```sh
./vasm6502_oldstyle -Fbin -dotdir [insert filename here]
```
 and a tool called [minipro](https://gitlab.com/DavidGriffith/minipro)
 to write it to the EEPROM:

```sh
minipro -p AT28C256 -w a.out
```

 However, some of the programs are meant for [Skilldrick's Easy6502 Emulator](https://skilldrick.github.io/easy6502/), which has an assembler built in- just copy and paste.

#### haskell
 Most of these are just small experimental test, run with GHCi

#### mc-datapacks
 In order to use datapacks in a minecraft world, you need to add them to that world's datapacks folder, then reload the the game with `/reload`.

#### nodejs
 These are all standard nodejs apps; use `cd [project]` followed by `npm start` to launch them. You may also need to do `npm install`.

#### php
 This used to be part of the HTML/JS webpage, as I used php's built-in server, but since then I switched to `MDWebServer` and none of these things really work anymore. You can still run them (if you want) with
```sh
php -S 127.0.0.1:8080 -t php
```
 (You can use a different address or port)

#### python
 This is *all* Python 3, so run accordingly. (```python3 [file] [options]```) 
 
 Everything in the `ev3-stuff` folder is meant to be run on a Lego Mindstorms EV3 Brick running [EV3Dev](https://www.ev3dev.org/), a 3rd party alternate OS for the EV3. I usually download and run it using the [VSCode EV3Dev Extention](https://marketplace.visualstudio.com/items?itemName=ev3dev.ev3dev-browser), see [here](https://github.com/ev3dev/vscode-hello-python) or on EV3Dev's website for more info.

## Website files
 You are probably aware by now that there is a website inside this repo, located in the `html` folder. But what's inside?

- `6502`- Contains various attemps at emulating a 6502 computer.
- `blockDiagram`- A diagram editor- one of my longest running projects
- `consoleQuest`- My first real game, a text adventure played in the JS Console inspired by the google easter egg
- `fractals`- Renders the mandlebrot set over and over again, in changing color schemes
- `jsonViewer`- A JSON viewer and editor, used in blockDiagram
- `MiniGames`- My versions of some old classics
- `musicTracker`- It's a music tracker.
- `noms`- A little physics program that can simulate circles. Originally intended to simulate creatures that would eat other creatures known as 'noms', now lives in the background of my webpages.
- `nonscience`- More simulation attemps.
- `physics`- My attempt at a physics engine.
- `rebrickableApi`- Some code that uses the [reBrickable part api](https://rebrickable.com/api/) to search for lego bricks.
- `saveStuff`- A system for saving things client side, in browsers, using localhost, cookies, etc.
- `simplegame-engine`- A really simple 2D game engine, based off my [Microfighter](https://microfighter.williamkam2.repl.co/) project
- `snakeAI`- My attempt at coding a snake AI.
- `templates`- Various page templates- I'm going to be getting rid of these soon, as I'm trying to integrate templates into `MDWebServer`.
- `text-input-engine`- A very simple system to provide text input and output to a program.
- `TGL`- Assorted stuff related to a new data language I'm creating- It'll be like HTML and CSS but not XML and more dynamic
- `tinyJS`- A parser and interpereter for a new programming language I'm creating. 