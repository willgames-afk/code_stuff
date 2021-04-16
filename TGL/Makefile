CXX = g++

SRCDIR = src
SOURCES = $(wildcard *.cpp)


CXXFLAGS = -Wall -I$(SRCDIR)/headers

OBJDIR = objs
OBJECTS = $(SOURCES:.cpp=.o)

TDIR = bin
TARGET = test

all: $(TDIR)/$(TARGET)
	echo done!

$(TDIR)/$(TARGET): $(OBJDIR)/$(OBJECTS)
	$(CXX) $(CXXFLAGS) -o $(TDIR)/$(TARGET) $(OBJDIR)/$(OBJECTS)

$(OBJDIR)/$(OBJECTS): $(SRCDIR)/$(SOURCES)
	$(CXX) $(CXXFLAGS) -o $(OBJDIR)/$(OBJECTS) $(SRCDIR)/$(SOURCES)