import sys

with open(sys.argv[1],'r') as filea:
	with open(sys.argv[2], "r") as fileb:
		filea = filea.read() #Get data
		fileb = fileb.read()


		pa = 0
		pb = 0
		
