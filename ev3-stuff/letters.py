from typing import Sized


def xMove():
    pass
def yMove():
    pass
def penUp():
    pass
def penDown():
    pass

size = 10

def __init__(xm,ym,pu,pd,s):
    global xMove 
    global yMove
    global penUp
    global penDown
    global size
    xMove = xm
    yMove = ym
    penUp = pu
    penDown = pd
    size = s
    

def setSize(s):
    global size
    size = s

def space():
    xMove(1)

def A():
    pass

def B():
    pass

def C():
    pass

def D():
    yMove(size) #D
    penDown()
    yMove(-size)
    xMove(size,False)
    yMove(size/2)
    xMove(-size, False)
    yMove(size/2)

def E():
    yMove(size)  #E
    penDown()
    yMove(-size)
    xMove(size)
    penUp()
    xMove(-size)
    yMove(size/2)
    penDown()
    xMove(size)
    penUp() 
    xMove(-size)
    yMove(size/2)
    penDown()
    xMove(size)
    penUp()
    yMove(-size)

def F():
    pass

def G():
    pass

def H():
    yMove(size)
    penDown() #H
    yMove(-size)
    penUp()
    yMove(size/2)
    penDown()
    xMove(size)
    penUp()
    yMove(size/2)
    penDown()
    yMove(-size)
    penUp()

def I():
    pass

def J():
    pass

def K():
    pass

def L():
    penDown() # L
    yMove(size)
    xMove(size)
    penUp()
    yMove(-size)

def M():
    pass

def N():
    pass

def O():
    yMove(size/2) # O
    penDown()
    yMove(size/2,False)
    xMove(size/2)
    yMove(-size/2,False)
    xMove(size/2)
    yMove(-size/2,False)
    xMove(-size/2)
    yMove(size/2,False)
    xMove(-size/2)
    penUp()
    xMove(size)
    yMove(-size/2)

def P():
    pass

def Q():
    pass


def R():
    yMove(size) # R
    penDown()
    yMove(-size)
    xMove(size)
    yMove(size/2, False)
    xMove(-size)
    yMove(size/2, False)
    xMove(size)
    penUp()
    yMove(-size)

def S():
    pass

def T():
    pass

def U():
    pass

def V():
    pass

def W():
    penDown() # W
    yMove(size)
    xMove(size/2, False)
    yMove(-size/2)
    xMove(size/2, False)
    yMove(size/2)
    yMove(-size)
    penUp()

def X():
    pass

def Y():
    pass

def Z():
    pass


data = {
    "A":A,
    "B":B,
    "C":C,
    "D":D,
    "E":E,
    "F":F,
    "G":G,
    "H":H,
    "I":I,
    "J":J,
    "K":K,
    "L":L,
    "M":M,
    "N":N,
    "O":O,
    "P":P,
    "Q":Q,
    "R":R,
    "S":S,
    "T":T,
    "U":U,
    "V":V,
    "W":W,
    "X":X,
    "Y":Y,
    "Z":Z,
    " ":space
}

def print(letter):
    data[letter]()