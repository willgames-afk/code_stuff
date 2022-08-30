CXX := g++
LIBS := allegro-5 allegro_main-5 allegro_font-5 allegro_primitives-5 allegro_image-5
ADDITIONAL := $(shell pkg-config $(LIBS) --libs --cflags)
OF := plantman
TF := main.cpp

all:
	$(CXX) $(TF) -o $(OF) $(ADDITIONAL)

run: all
	./$(OF)

clean:
	-rm $(OF)