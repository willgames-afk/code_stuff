
def main():

	with open("letters.txt", encoding = 'utf-8') as f:
   # perform file operations

		obj = {}
		
		for line in f:

			#Remove newline, if any
			if line[-1] == "\n":
				line = line[:-1]

			#Get char start coords
			char = ""
			sx = ''
			sy = ""
			pointer=0
			while line[pointer] != ",":  #Get x coords
				if line[pointer].isdigit():
					sx += line[pointer]
				pointer+=1
			sx = float(sx)


			while line[pointer] != " ":  #Get y coords
				if line[pointer].isdigit():
					sy += line[pointer]
				pointer+=1
			sy = float(sy)

			
			#Remove whitespace from line- no longer necessary
			line = cleanLine(line)

			#Get letter
			print("\n" + line[0])
			print("Char starts at " + str(sx) + ", " + str(sy))
			line = line[1:]

			#Get commands
			x = 0.0
			y = 0.0

			#iterate through line
			while pointer < len(line)-1:

				#Get raw command
				buffer = ""
				char = ""
				while char != ";":
					char = line[pointer]
					buffer += char
					pointer += 1

				buffer = buffer[:-1] #Remove seperating semicolon
			
				#Extract command info
				command = getCommand(buffer)
				

				if command == "up":
					print("UP!!!")
				elif command == "down":
					print("DOWN!")
				else:
					string = "Move motor "
					if 'x' in command and command['x'] - x != 0:
						string += "A by " + str(command['x'] - x)
						x = command['x']


					if 'y' in command and command["y"] - y != 0:
						if 'x' in command:
							string += " and motor "
						
						string += "B by " + str(command['y'] - y)
						y = command['y']

					print(string)



def cleanLine(line):
	newline = ""
	for char in line:
		if not (char == " "):
			newline += char

	return newline

def getCommand(line):

	x = ""
	y = ""
	obj={}
	char = ""
	thepointer = 0
	while char != ",":
		char = line[thepointer]
		#print(char +": "+ str(thepointer))
		if char == "v":
			return "down"
		elif char == "^":
			return "up"
		else:
			x += char
		thepointer += 1

	if len(x[:-1]) > 0:
		obj["x"] = float(x[:-1])
	
	while thepointer < len(line):
		char = line[thepointer]
		#print(char +": "+ str(thepointer))
		y += char
		thepointer += 1

	if len(y) > 0:
		obj["y"] = float(y)
	
	return obj


if __name__ == '__main__':
    main()