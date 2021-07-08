#!/usr/bin/env python3
'''Hello to the world from ev3dev.org'''

# Global/EV3Dev Modules
import time
from ev3dev2.led import Leds
from ev3dev2.button import Button

# My Modules
import vsconsole

# state constants
ON = True
OFF = False


def changeLEDS(self):
	leds = Leds()
	leds.set_color('LEFT','RED')

def main():
	'''The main function of our program'''

	# set the console just how we want it
	vsconsole.reset()
	vsconsole.set_cursor(OFF)
	vsconsole.set_font('Lat15-Terminus24x12')

	# print something to the screen of the device
	print('Hello World!')

	# print something to the output panel in VS Code
	vsconsole.debug_print('Hello VS Code!')

	leds = Leds()
	leds.animate_stop()
	buttons = Button()
	buttons.on_enter = changeLEDS

    # wait a bit so you have time to look at the display before the program
    # exits
	
	buttons.process_forever()


if __name__ == '__main__':
    main()
