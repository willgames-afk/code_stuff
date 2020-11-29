var aC = { // aC for all commands
  north: 'north',
  south: 'south',
  east: 'east',
  west: 'west',
  forward: 'north',
  left: 'west',
  right: 'east',
  use: 'use',
  help: 'help',
  save: 'save',
  take: 'grab',
  grab: 'grab',
  save: 'save',
  stop: 'terminate',
  inventory: 'inventory',
  soth: 'soth',
  load: 'load',
  reset: 'reset',
  exit: 'e',// Didn't like it when I put exits, so it has to be ust exit. 
  map: 'map',
  downloadit: 'dload',
  loadmap: 'mapload',
  clear: 'clear',
  rem: 'rem',
  remember: 'rem'
}
var message = {
  nothingToUse: "You don't have anything to use here. Not yet, anyway.",
  notUse: "There's nothing to use here.",
  grab: "There's nothing to grab in this area.",
  move: "You can't go that way!",
  save: 'Are you sure you want to save? It will erase all previous saves.'
}
var aI = {
  "debugStick": {
    "name": "Debug Stick",
    "desc": "A Debug Stick. Grants the power of debugging. Can also be used to whack things.", "pers": true
  }
}
var theMap = { "data": [[{ "desc": "You enter a test room. The test must have been successful.", "exit": ["south"] }, false], [{ "desc": "This test worked too!", "exit": ["south", "east", "north"] }, { "desc": "This test has a Debug Stick! Type grab to pick it up.", "exit": ["west"], "loot": ["debugStick"] }], [{ "desc": "You enter a room with a big bug in it. It seems to be blocking an exit. If only you had something to debug it with by typing use.", "exit": ["north"], "locked": { "onUnlock": "You whack the bug with the debug stick. Some code shifts around, and the bug poofs out of existance.", "move": "south", "use": "debugStick" } }, false], [{ "desc": "You have reached the end of this test map. If you poke will a lot, maybe he'll make another one.", "exit": [] }, false]], "startText": "This map was designed by will kam, and is just a test. To load a different map, download it, select the file by clicking the \"Choose File\" button, and type loadmap.\n", "directions": { "north": { "x": 0, "y": -1, "opp": "south" }, "south": { "x": 0, "y": 1, "opp": "north" }, "east": { "x": 1, "y": 0, "opp": "west" }, "west": { "x": -1, "y": 0, "opp": "east" } } }
var textMap = 'Not Available '
var player = {
  x: 0,
  y: 0,
  inventory: {},
  lastMove: 'not'
}
var originalMap = JSON.stringify(theMap)
var originalPlayer = JSON.stringify(player)
var helpText = "Type 1 word commands to tell me what to do. Which one word commands? I can tell you if you type help. Note: you can replace north, west, east, south with up, down left, right respectively and I'll still work. (left will move you east, etc.) To use an item just type use, I'll know which one you mean.\n\n"
var saveMessage = 'Are you sure you want to save? It will erase all previous saves.'
var loadMessage = ['Loading...', 'Still Loading...', 'Working...', '...', 'Still not done...', 'Almost Kinda Halfway...', 'Processing...']
var started = false;


function startAll() { // starts the whole thing, triggered by start or init commands
  if (!started) {
    started = true;
    initCommands();
    if (!theMap.data) {
      alert("I don't have a map, you need to load one!")
      text = ';Load a map by selecting a file using the file button over there and then typing loadmap.'
      main()
      return 'start'
    } else {
      createCompletionElements()
      startText = theMap.startText
      displayText(startText + '\n' + helpText + '\n' + theMap.data[player.y][player.x].desc)
      commandExecute.start = false;
      main();
      return 'start'
    }
  } else {
    displayText("Already Running.", '', false)
    return 'start'
  }
}

function initCommands() { // Very similar to code used in Google's Text Adventure, just wanted to give credit.
  var win = this; // "this" is window, var win is just the window object
  this.commandExecute = {}; // whether a command was called or not is stored in this object
  var b = {}, command;       //All the b.num and d.num stuff is magic to me.
  for (command in aC) {
    b.num = command;
    win.commandExecute[aC[b.num]] = false;
    Object.defineProperty(window, b.num, {
      get: function (d) { 
        return function () {
          win.commandExecute[aC[d.num]] = true;
          return d.num;
        }
      }(b) 
    });
    b = { num: b.num } //I think this is to detach b from the properties defined in Obect.defineProperty
  }
}
Object.defineProperty(window, 'start', { get: function () { startAll() } }) // All of these will initialize the program.
Object.defineProperty(window, 'START', { get: function () { startAll() } }) // The nice thing is that you don't need a loop
Object.defineProperty(window, 'Start', { get: function () { startAll() } }) // to check it like the other commands.
Object.defineProperty(window, 'init', { get: function () { startAll() } })
Object.defineProperty(window, 'currentCell', { get: function () { if (theMap.data) { return theMap.data[player.y][player.x] } } })

function printInventory() { //Prints your inventory. Nothin' else to say 'bout that.
  console.group('Inventory:')
  for (var item in player.inventory) {
    console.groupCollapsed(player.inventory[item].name)
    console.log(player.inventory[item].desc)
    console.groupEnd()
  }
  console.groupEnd()
}

var everything = ''
var finalFile = {}
function loadFile() { // Loads a map file. Far too complecated, in my opinion.
  const file = document.getElementById('file')
  if (file.files[0] && file.files[0].type == 'text/plain') {
    reader = new FileReader()
    reader.readAsText(file.files[0])
    reader.onload = function (e) {
      everything = e.target.result
      try {
        finalFile = JSON.parse(everything)
      } catch (e) {
        console.log("Your file is not a valid map. :(")
        return
      }
      if (confirm("I'm about to re-write your current map, so you'll lose all progress. This includes your save file. If you don't want that, push cancel and type downloadit to download your save.")) {

        theMap = finalFile[0]
        player = finalFile[1]
        aI = finalFile[2]
        createCompletionElements();
        if (theMap.data[0][0].vis)
          localStorage.clear()
        console.clear()
        console.log('New map loaded. Saves have been cleared.')
        startText = theMap.startText
        text = theMap.startText + '\n' + helpText + '\n' + theMap.data[player.y][player.x].desc
      }
    }
  } else {
    console.log("I couldn't load the map, make sure you've selected it by clicking the Choose File button to the left and that the file you selcted is a text file.")
  }
}
function initSaveSystem() { // cookies coming soon?
  let savedMap = localStorage.getItem('map');
  let savedPlayer = localStorage.getItem('player');
  let savedItems = localStorage.getItem('items');
  this.loadGame = function () {
    if (savedMap) {
      theMap = JSON.parse(savedMap) // Turns the stringified object back into an actual object.
      player = JSON.parse(savedPlayer)
      aI = JSON.parse(savedItems)
      createCompletionElements()
      printInventory() // very convinent
      displayText(currentCell.desc)
    } else {
      displayText("Sorry, but I can't find your save.", '', false)
    }
  }
  this.saveGame = function () {
    localStorage.clear()
    localStorage.setItem('map', JSON.stringify(theMap)) // Turns the 3 objects used in the game into text localStorage can store.
    localStorage.setItem('player', JSON.stringify(player))
    localStorage.setItem('items', JSON.stringify(aI))
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function createCompletionElements() {
  if (!theMap.data[player.x][player.y].vis) {
    for (i = 0; i < theMap.data.length; i++) {
      for (j = 0; j < theMap.data[i].length; j++) {
        if (theMap.data[i][j]) {
          theMap.data[i][j].vis = false;
        }
        if (theMap.data[i][j].locked) {
          theMap.data[i][j].locked.comp = false;
        }
      }
    }
  }
}

var i = 0
commands = {
  terminate() {
    if (confirm("Are you sure you want to stop this program? You will lose all unsaved progress!")) {
      window.close()
      displayText("Your browser says I can't shut down. You'll just have to close this tab the old fashioned way.", '', false)
    }
  },
  help() {
    acceptedCommands = ';Accepted Commands: '
    for (command in aC) {
      if (!(command == 'soth')) {
        acceptedCommands = acceptedCommands + command + ', '
      }
    }
    acceptedCommands = acceptedCommands.substr(0, acceptedCommands.length - 2) + '.\n\n'
    displayText(acceptedCommands + "To use an item just type use, I'll know which one you mean")
  },
  save() {
    if (confirm(saveMessage)) {
      saveGame()
      displayText("\nSaved your game. Note that some things can erase this save, you can get a more permanant save file by typing downloadit.")
    }
    else {
      displayText("\nNo? Well, you can always save later.")
    };
  },
  load() {
    if (confirm('Loading a save will overwrite your current progress. Are you sure you want to?')) {
      loadGame()
    }
  },
  grab() {
    if (currentCell.loot && !Array.isArray(currentCell.loot)) {
      currentCell.loot = [currentCell.loot]
    }
    if (currentCell.loot && currentCell.loot.length > 0) {
      for (i = 0; i < currentCell.loot.length; i++) {
        //console.log(i)
        loot = currentCell.loot.slice(i, i + 1)
        player.inventory[loot] = aI[loot] // puts the loot from the room into your inventory
      }
      currentCell.loot = []//Makes it so that the cell no longer has loot
      printInventory()
    } else {
      currentCell.loot = [];
      displayText(message.grab)
    }
  },
  inventory() {
    console.group('Inventory:')
    for (var item in player.inventory) {
      console.groupCollapsed(player.inventory[item].name)
      console.log(player.inventory[item].desc)
      console.groupEnd()
    }
    console.groupEnd()
  },
  use() {
    used = false
    if (currentCell.locked) {
      if (!Array.isArray(currentCell.locked.use)) {
        currentCell.locked.use = [currentCell.locked.use]
      }
      for (item in player.inventory) { // checks if you have something useful

        for (i = 0; i < currentCell.locked.use.length; i++) {

          if (currentCell.locked.use[i] == item) {
            used = true
            exitOpen = ''
            //If there is a move property...
            if (currentCell.locked.move) {
              exitOpen = '\nAn exit opens up to the '
              if (Array.isArray(currentCell.locked.move)) { //if the move property is an array, we need to add all the array elements
                if (currentCell.locked.move.length == 1) { // if it's only one long I can't put an 'and' in so this is a thing
                  exitOpen = exitOpen + currentCell.locked.move[0] + '!'
                  //console.log("added one from array")
                  currentCell.exit.push(currentCell.locked.move[0])
                } else {
                  for (i = 0; i < currentCell.locked.move.length; i++) {
                    currentCell.exit.push(currentCell.locked.move[i]) // add the unlocked exit to the exits list
                    if (i == currentCell.locked.move.length - 1) {
                      exitOpen = exitOpen + 'and ' + currentCell.locked.move[i] + '!'
                    } else {
                      exitOpen = exitOpen + currentCell.locked.move[i] + ', '
                    }
                  }
                  //console.log("added "+i+" from array")
                }
              } else { // if the move property isnt an array run the old code
                exitOpen = exitOpen + currentCell.locked.move + '!'
                currentCell.exit.push(currentCell.locked.move)
                //console.log("added string")
              }
            }
            //If there's loot...
            if (currentCell.locked.loot) {
              if (!currentCell.loot) {
                currentCell.loot = [];
              }
              currentCell.loot.push(currentCell.locked.loot)
            }

            displayText(currentCell.locked.onUnlock + exitOpen)

            if (!player.inventory[item].persistant == true) {
              delete player.inventory[item] // if the item isn't persistant it is deleted after its use
            }
            break
          }


        }
        if (used) {// have to break out of both loops (this one gave me some real trouble)
          break
        }
      }
      if (!used) {
        displayText(message.nothingToUse) // you dont have anuything useful
      }
    } else {
      displayText(message.notUse)
    }
  },
  soth() {
    displayText('Something falls into your backpack but climbs out and grabs onto your head. Type inventory to see what it is.');
    player.inventory.soth = aI.soth;
  },
  reset() {
    if (confirm('Do you REALLY want to reset all of you progress and save data!?')) {
      localStorage.clear();
      theMap = JSON.parse(originalMap)
      player = JSON.parse(originalPlayer)
    }
  },
  e() {
    displayText(currentCell.exit, '', false);
  },
  map() {
    textmap = [];
    for (y = 0; y < theMap.data.length; y++) {
      textmap[y] = [];
      for (x = 0; x < theMap.data[y].length; x++) {
        if (curretCell.exit.indexOf('south') != -1) {

        }
      }
    }
  },
  dload() {
    if (confirm("You sure you want to download all the map, item, AND player data for this map?")) {
      data = JSON.stringify([JSON.parse(originalMap), JSON.parse(originalPlayer), aI]);//It was stringifying each separate thing.
      download("data", data);
    }
  },
  mapload() {
    const file = document.getElementById('file')
    if (file.files[0] && file.files[0].type == 'text/plain') {
      reader = new FileReader();
      reader.readAsText(file.files[0]);
      reader.onload = function (e) {
        everything = e.target.result;
        try {
          finalFile = JSON.parse(everything);
        } catch (e) {
          console.log("Your file is not a valid map. :(");
          return
        }
        if (confirm("I'm about to re-write your current map, so you'll lose all progress. This includes your save file. If you don't want that, push cancel and type downloadit to download your save.")) {

          theMap = finalFile[0];
          player = finalFile[1];
          aI = finalFile[2];
          createCompletionElements();
          if (theMap.data[0][0].vis)
          localStorage.clear();
          console.clear();
          displayText('New map loaded. Saves have been cleared.','',false);
          startText = theMap.startText;
          displayText(theMap.startText + '\n' + helpText + '\n' + theMap.data[player.y][player.x].desc);
        };
      };
    } else {
      console.log("I couldn't load the map, make sure you've selected it by clicking the Choose File button to the left and that the file you selcted is a text file.");
    };
  },
  clear() {
    console.clear()
    displayText(helpText + theMap.data[player.y][player.x].desc)
  },
  rem() {
    displayText('\nYou remember when you visited this area...\n%c' + currentCell.desc, 'font-style: italic;');
  },
}




function processCommands() {
  if (commandExecute.terminate) {
    commandExecute.terminate = false
    if (confirm("Are you sure you want to stop this program? You will lose all unsaved progress!")) {
      window.close()
      displayText("Your browser says I can't shut down. You'll just have to close this tab the old fashioned way.", '', false)
    }
  }
  if (commandExecute.help) {
    acceptedCommands = ';Accepted Commands: '
    for (command in aC) {
      if (!(command == 'soth')) {
        acceptedCommands = acceptedCommands + command + ', '
      }
    }
    acceptedCommands = acceptedCommands.substr(0, acceptedCommands.length - 2) + '.\n\n'
    displayText(acceptedCommands + "To use an item just type use, I'll know which one you mean")
    commandExecute.help = false;
  }
  if (commandExecute.save) {
    if (confirm(saveMessage)) {
      saveGame()
      displayText("\nSaved your game. Note that some things can erase this save, you can get a more permanant save file by typing downloadit.")
    }
    else {
      displayText("\nNo? Well, you can always save later.")
    };
    commandExecute.save = false;
  }
  if (commandExecute.load) {
    if (confirm('Loading a save will overwrite your current progress. Are you sure you want to?')) {
      loadGame()
    }
    commandExecute.load = false
  }
  for (direction in theMap.directions) {
    if (commandExecute[direction]) {
      if (typeof theMap.directions[direction] == "string") {
        direction = theMap.directions[theMap.directions[direction]]
      }
      if (currentCell.exit.includes(aC[direction])) {
        player.lastMove = aC[direction]
        player.y += theMap.directions[direction].y
        player.x += theMap.directions[direction].x
        if (currentCell.vis) {
          if (currentCell.vdesc) {
            displayText('\nYou move ' + direction + " and enter a room you've already visited.\n" + currentCell.vdesc)
          } else {
            displayText('\nYou move ' + direction + " and enter a room you've already visited.\n%c" + currentCell.desc, 'font-style: italic;')
          }
        } else {
          displayText('\nYou move ' + direction + ' and enter a new area.\n' + currentCell.desc)
        }
        if (currentCell.locked && currentCell.locked.comp) {
          if (currentCell.locked.compText) {
            displayText('\nYou move ' + direction + " and enter a room you've completed.\n" + currentCell.locked.compText)
          } else {
            displayText("\nYou enter a room you've completed. Type remember (rem for short) to remember what happened here")
          }
        }
        currentCell.vis = true;
      }
      else {
        displayText(";You can't go that way!")
      }
      commandExecute[direction] = false;
    }
  }
  if (commandExecute.grab) {
    commandExecute.grab = false;
    if (currentCell.loot && !Array.isArray(currentCell.loot)) {
      currentCell.loot = [currentCell.loot]
    }
    if (currentCell.loot && currentCell.loot.length > 0) {
      for (i = 0; i < currentCell.loot.length; i++) {
        //console.log(i)
        loot = currentCell.loot.slice(i, i + 1)
        player.inventory[loot] = aI[loot] // puts the loot from the room into your inventory
      }
      currentCell.loot = []//Makes it so that the cell no longer has loot
      printInventory()
    } else {
      currentCell.loot = [];
      displayText(message.grab)
    }
  }
  if (commandExecute.inventory) {
    commandExecute.inventory = false;
    printInventory()
  }
  if (commandExecute.use) {
    commandExecute.use = false;
    used = false
    if (currentCell.locked) {
      if (!Array.isArray(currentCell.locked.use)) {
        currentCell.locked.use = [currentCell.locked.use]
      }
      for (item in player.inventory) { // checks if you have something useful

        for (i = 0; i < currentCell.locked.use.length; i++) {

          if (currentCell.locked.use[i] == item) {
            used = true
            exitOpen = ''
            //If there is a move property...
            if (currentCell.locked.move) {
              exitOpen = '\nAn exit opens up to the '
              if (Array.isArray(currentCell.locked.move)) { //if the move property is an array, we need to add all the array elements
                if (currentCell.locked.move.length == 1) { // if it's only one long I can't put an 'and' in so this is a thing
                  exitOpen = exitOpen + currentCell.locked.move[0] + '!'
                  //console.log("added one from array")
                  currentCell.exit.push(currentCell.locked.move[0])
                } else {
                  for (i = 0; i < currentCell.locked.move.length; i++) {
                    currentCell.exit.push(currentCell.locked.move[i]) // add the unlocked exit to the exits list
                    if (i == currentCell.locked.move.length - 1) {
                      exitOpen = exitOpen + 'and ' + currentCell.locked.move[i] + '!'
                    } else {
                      exitOpen = exitOpen + currentCell.locked.move[i] + ', '
                    }
                  }
                  //console.log("added "+i+" from array")
                }
              } else { // if the move property isnt an array run the old code
                exitOpen = exitOpen + currentCell.locked.move + '!'
                currentCell.exit.push(currentCell.locked.move)
                //console.log("added string")
              }
            }
            //If there's loot...
            if (currentCell.locked.loot) {
              if (!currentCell.loot) {
                currentCell.loot = [];
              }
              currentCell.loot.push(currentCell.locked.loot)
            }

            displayText(currentCell.locked.onUnlock + exitOpen)

            if (!player.inventory[item].persistant == true) {
              delete player.inventory[item] // if the item isn't persistant it is deleted after its use
            }
            break
          }


        }
        if (used) {// have to break out of both loops (this one gave me some real trouble)
          break
        }
      }
      if (!used) {
        displayText(message.nothingToUse) // you dont have anuything useful
      }
    } else {
      displayText(message.notUse)
    }
  }
  if (commandExecute.soth) {
    displayText('Something falls into your backpack but climbs out and grabs onto your head. Type inventory to see what it is.')
    player.inventory.soth = aI.soth
    commandExecute.soth = false
  }
  if (commandExecute.reset) {
    if (confirm('Do you REALLY want to reset all of you progress and save data!?')) {
      localStorage.clear();
      theMap = JSON.parse(originalMap)
      player = JSON.parse(originalPlayer)
    }
  }
  if (commandExecute.e) {
    displayText(currentCell.exit, '', false)
    commandExecute.e = false
  }
  if (commandExecute.map) {
    textmap = [];
    for (y = 0; y < theMap.data.length; y++) {
      textmap[y] = [];
      for (x = 0; x < theMap.data[y].length; x++) {
        if (curretCell.exit.indexOf('south') != -1) {

        }
      }
    }
  }
  if (commandExecute.dload) {
    commandExecute.dload = false;
    if (confirm("You sure you want to download all the map, item, AND player data for this map?")) {
      data = JSON.stringify([JSON.parse(originalMap), JSON.parse(originalPlayer), aI]);//It was stringifying each separate thing.
      download("data", data);
    }
  }
  if (commandExecute.mapload) {
    commandExecute.mapload = false
    loadFile()
  }
  if (commandExecute.clear) {
    commandExecute.clear = false
    console.clear()
    displayText(helpText + theMap.data[player.y][player.x].desc)
  }
  if (commandExecute.rem) {
    commandExecute.rem = false
    displayText('\nYou remember when you visited this area...\n%c' + currentCell.desc, 'font-style: italic;')
  }
}
//   Function that takes care of displaying text. Pretty important for 
//   a text based game.
//.  txtras is short for text extras. 
function displayText(text = '', txtras = '', displayExits = true) {
  console.log(text, txtras)
  if (displayExits) {
    exits = currentCell.exit.join(', ')
    console.log('\nPossible Exits: ' + exits + '.', txtras)
  }
}

//Initializing
//note: can't fully initialize because it doesn't start until you type start, so all the commands except start have to be
//initiated after that.
initSaveSystem()
console.log(' _                         _                  \n/   _   _   _  _  |  _    / \\      _    _  _|_\n\\_ (_) | | _> (_) | (/_   \\_X |_| (/_  _>   | ') 
console.log('Developed by Will Kam\n')
console.log('Type START to continue.')
var terminate = false;
var startLoop = false;
//Main Loop
window.main = function () {
  stopMain = window.requestAnimationFrame(main);
  if (terminate) {
    window.cancelAnimationFrame(stopMain);
  }
  processCommands()
};


 // Start the cycle