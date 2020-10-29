theMap = { "data": [[{ "desc": "You enter a test room. The test must have been successful.", "exit": ["south"] }, False], [{ "desc": "This test worked too!", "exit": ["south", "east", "north"] }, { "desc": "This test has a Debug Stick! Type grab to pick it up.", "exit": ["west"], "loot": ["debugStick"] }], [{ "desc": "You enter a room with a big bug in it. It seems to be blocking an exit. If only you had something to debug it with by typing use.", "exit": ["north"], "locked": { "onUnlock": "You whack the bug with the debug stick. Some code shifts around, and the bug poofs out of existance.", "move": "south", "use": "debugStick" } }, False], [{ "desc": "You have reached the end of this test map. If you poke will a lot, maybe he'll make another one.", "exit": [] }, False]], "startText": "This map was designed by will kam, and is just a test. To load a different map, download it, select the file by clicking the \"Choose File\" button, and type loadmap.\n", "directions": { "north": { "x": 0, "y": -1, "opp": "south" }, "south": { "x": 0, "y": 1, "opp": "north" }, "east": { "x": 1, "y": 0, "opp": "west" }, "west": { "x": -1, "y": 0, "opp": "east" } } }
player = {
    'x': 0,
    'y': 0,
    'inventory': {},
    'lastMove': 'not'
}


def displayText():
    print(theMap["data"][player['y']][player['x']]['desc']) #SOOO MUCH EASIER IN JAVASCRIPT!!!


displayText()