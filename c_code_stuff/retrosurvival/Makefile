.SUFFIXES: .cpp .o
CXX := g++
CXXFLAGS := -Wall
OUTPUT := main
OBJS := helpers.o main.o

LIBS := allegro-5 allegro_main-5 allegro_font-5 allegro_image-5
ADDITIONAL := $(shell pkg-config $(LIBS) --libs --cflags)

helpers.o: helpers.cpp helpers.hpp
main.o: main.cpp helpers.hpp

.cpp.o:
	$(CXX) $(CXXFLAGS) -c $<

$(OUTPUT): $(OBJS)
	$(CXX) -o $(OUTPUT) $(OBJS) $(CXXFLAGS) $(ADDITIONAL)
	-rm -f $(OBJS)


all: $(OUTPUT)

clean:
	-rm -f $(OUTPUT) $(OBJS)

run: all
	./$(OUTPUT)