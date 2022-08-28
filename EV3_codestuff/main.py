#!/usr/bin/env python3
'''Hello to the world from ev3dev.org'''

# Global/EV3Dev Modules
import time
from ev3dev2.led import Leds
from ev3dev2.button import Button
from ev3dev2.motor import LargeMotor, MediumMotor, OUTPUT_A, OUTPUT_B, OUTPUT_C, SpeedPercent
from ev3dev2.sensor import INPUT_1
from ev3dev2.sensor.lego import ColorSensor

# My Modules
import vsconsole
import letters

# state constants
ON = True
OFF = False

FASTPERCENT = 60#75
SLOWPERCENT = 20
SEPDIST = 30

FAST = SpeedPercent(FASTPERCENT)
SLOW = SpeedPercent(SLOWPERCENT)

xMotor = LargeMotor(OUTPUT_A)
feedMotor = LargeMotor(OUTPUT_B)
liftMotor = MediumMotor(OUTPUT_C)

colSensor = ColorSensor(INPUT_1)
buttons = Button()

def degsToXAngle(degs):
    return xMotor.count_per_rot/360 * degs

def degsToYAngle(degs):
    return feedMotor.count_per_rot/360 * degs

def rotToXAngle(rot):
    return feedMotor.count_per_rot * rot

def rotToYAngle(rot):
    return feedMotor.count_per_rot * rot

def penUp(count = 0.75,block=True):
    liftMotor.on_for_rotations(FAST,count,block=block)

def penDown(count = 0.75,block=True):
	liftMotor.on_for_rotations(FAST, -count,block=block)

def liftTo(pos, block=True):
    liftMotor.on_to_position(FAST, liftMotor.count_per_rot * pos * 1.5,block=block)

def feedline(block=True):
    feedMotor.on_for_rotations(FAST, -1,block=block)

def loadPage():
    global feedMotorZero 
    feedMotor.on(SpeedPercent(-SLOWPERCENT))
    while colSensor.color == 0:
        time.sleep(0.05)
    feedMotor.off()
    feedMotor.position = 0 #Reset position, this is new zero

imaginaryX = 0
imaginaryY = 0

def xGoto(pos,block=True):
    xMotor.on_to_position(FAST,degsToXAngle(pos),block=block)

def yGoto(pos,block=True):
    feedMotor.on_to_position(FAST, degsToYAngle(-pos),block=block)

def xMove(count, block=True):
    global imaginaryX
    vsconsole.debug_print(imaginaryX, "X")
    xGoto(imaginaryX + count,block=block)
    imaginaryX += count

def yMove(count, block=True):
    global imaginaryY
    vsconsole.debug_print(imaginaryY, "Y")
    yGoto(imaginaryY + count,block=block)
    imaginaryY += count

def xReset(block=True):
    xMotor.on_to_position(FAST,0,block=block)

def changeLEDS(self):
	leds = Leds()
	leds.set_color('LEFT','RED')

letters.__init__(xMove,yMove,penUp,penDown)

def print_string(text):
    for char in text:
        letters.print(char)
        vsconsole.debug_print(char, imaginaryX, imaginaryY)
        xMove(SEPDIST)

def main():
    '''The main function of our program'''

    # set the console just how we want it
    vsconsole.reset()
    vsconsole.set_cursor(OFF)
    vsconsole.set_font('Lat15-Terminus24x12')
    
    # print something to the output panel in VS Code
    vsconsole.debug_print('Starting...')

    xMotor.position = 0    # Assumed to be as far to the left as possible
    liftMotor.position = 0 # Assumed to be all the way down
    liftTo(1)


    if buttons.enter:
        vsconsole.debug_print("Loading Pen...")
        xGoto(360)
        liftTo(2) 
        while buttons.enter:
            time.sleep(0.5)
            pass
        while not buttons.enter:
            time.sleep(0.5)
            pass
        liftMotor.position = 0
        xReset(0)

    vsconsole.debug_print("Feeding...")
    loadPage()

    vsconsole.debug_print("Printing...")

    #yGoto(0)
    print_string("HELLO WORLD")

    
    liftTo(1)
    xReset()
    yGoto(-1000) #feed paper out
    liftTo(0)


if __name__ == '__main__':
    main()