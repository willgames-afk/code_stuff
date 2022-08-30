.SUFFIXES: .cpp .o
CXX := g++
CXXFLAGS := -Wall
OUTPUT := main
OBJS := main.o loader.o screens.o
OBJ_DIR := objs
OBJS_INDIR := $(addprefix $(OBJ_DIR)/,$(OBJS))

SRC_DIR := src

CXXFLAGS := -std=c++17 -Wall

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	
	$(CXX) $(CXXFLAGS) -c  -o $@ $<

$(OUTPUT): $(OBJS_INDIR)
	$(CXX)  $(CXXFLAGS) -o $@ $(OBJS_INDIR)


all: $(OUTPUT)

clean:
	-rm -f $(OUTPUT) $(OBJS)

run: all
	./$(OUTPUT)