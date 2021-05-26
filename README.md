# code_stuff
 General code stuff.
 No guarantees that any of this stuff works, it's just a repo I use to make sure I can't accidentally delete all my code.
 
 BTW, everything in this folder is covered by the MIT license found in the LICENSE file, go check that out.

## Contents

 This is mostly Web Javascript & HTML, and it's structured (somewhat) like a website. To actually use any of this software, you need some kind of server. I just use the version of PHP built into MacOS, you could also use Python's `SimpleHTTPServer` (It just wouldn't be able to serve the PHP).

I generally use something like this:

```
php -S localhost:8080 -t ~/code_stuff
```

I've also got some 6502 Assebly, PHP and NodeJS in here!


### Loose files

- `Cookie.png`- A random image of a Cookie. Because why not?
- `default.css`- The default `CSS` for the various pages scattered across this 'site'
- `doesntExistYet.html`- A webpage to let you know when something doesn't exist.
- `favicon.ico`- The site's favicon.
- `index.html`- The site's landing page.
- `LICENSE.txt`- The license for everything in this folder.
- `localhostdetector.js`- A script for determining whether or not the site is running locally or globally.
- `README.md`- This file!


### Folders

- `6502`- Contains various 6502 and 6502 related programs, including a dynamic block-diagram creator.
- `consolequest`- A game played in the JS terminal
- `electronTests`- Where I put the results of me messing around with Electron
- `fractals`- Some fractal drawing code
- `jsonViewer`- A tool for converting JS Objects into renderable (And more importantly, editable) HTML
- `login`- A login system. Probably not very secure, but it works.
- `MDWebServer`- A prototype of a NodeJS + Express web server for serving a blog written in Markdown files.
- `MiniGames`- My renditions of some very popular games
- `musicTracker`- A little 8-bit music music tracker
- `noms`- A weirdly named colorful ball physics engine, which generates the colorfol bouncy balls in the background of any of the `index.html` pages
- `nonscience`- a few atom-like simulators
- `PHPtest`- Where I put the results of me messing around with PHP
- `saveStuff`- A little interface for saving data locally in the browser
- `templates`- Templates for things that appear often (Like webpages)
- `TGL`- Stuff related to a prototypical language of mine, TGL.
- `tileFarm3D`- My first exploration into a 3D game
- `tinyJS` - Stuff related to a prototypical language of mine, Tiny.
- `other`- Other small bits and bobs that are generally not very useful.

## 6502 Stuff

There's also some 6502 Assembly code in the 6502 folder. These are (mostly) programs for [Ben Eater's 6502 Breadboard Computer](https://eater.net/6502). I'm using the [vasm assenbler](http://www.compilers.de/vasm.html) to compile...
```
./vasm6502_oldstyle -Fbin -dotdir [Insert Filename Here]
```
followed by a tool called [minipro](https://gitlab.com/DavidGriffith/minipro) to write it to the EEPROM.
```
minipro -p AT28C256 -w a.out
```

However, some of the assembly was written for [skilldrick's easy6502 emulator](https://skilldrick.github.io/easy6502/), which has its own assembler.