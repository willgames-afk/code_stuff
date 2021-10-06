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

FASTPERCENT = 75
SLOWPERCENT = 20
SEPDIST = 0.5

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
    liftMotor.on_to_position(FAST, liftMotor.count_per_rot * pos,block=block)

def feedline(block=True):
    feedMotor.on_for_rotations(FAST, -1,block=block)

feedMotorZero = 0
def loadPage():
    global feedMotorZero 
    feedMotor.on(SpeedPercent(-SLOWPERCENT))
    while colSensor.reflected_light_intensity < 1:
        time.sleep(0.05)
    feedMotor.off()
    feedMotorZero = feedMotor.position

def xGoto(pos,block=True):
    xMotor.on_to_position(FAST,degsToXAngle(pos),block=block)

def yGoto(pos,block=True):
    feedMotor.on_to_position(FAST,degsToYAngle(pos),block=block)

def xMove(count, block=True):
    xMotor.on_for_rotations(FAST,degsToXAngle(count),block=block)

def yMove(count, block=True):
    feedMotor.on_for_rotations(FAST, -degsToYAngle(count), block=block)

def xReset(block=True):
    xMotor.on_to_position(FAST,0,block=block)

def changeLEDS(self):
	leds = Leds()
	leds.set_color('LEFT','RED')

letters.__init__(xMove,yMove,penUp,penDown)

def print_string(text):
    for char in text:
        letters.print(char)
        xMove(SEPDIST)

def main():
    '''The main function of our program'''

    # set the console just how we want it
    vsconsole.reset()
    vsconsole.set_cursor(OFF)
    vsconsole.set_font('Lat15-Terminus24x12')
    
    # print something to the output panel in VS Code
    vsconsole.debug_print('Hello VS Code!') 

    #penUp(2.5)#Lift pen to user
    print('Please insert a pen and')
    print('push enter to continue.')   

    running = False
    done = False

    while(not done):
        if running == False:
            #if buttons.enter:
                running = True
                liftTo(1)
                loadPage()
                xGoto(0)
                yGoto(0)

                print_string("HELLO WORLD")
                
                done = True
        time.sleep(0.05)
    
    liftTo(1)
    xReset()
    yGoto(50) #feed paper out
    liftMotor.on_to_position(SpeedPercent(75),0)


if __name__ == '__main__':
    main()