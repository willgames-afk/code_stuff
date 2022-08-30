CC := gcc
LIBS := allegro-5 allegro_main-5 allegro_font-5 allegro_primitives-5 allegro_audio-5 allegro_acodec-5
ADDITIONAL := $(shell pkg-config $(LIBS) --libs --cflags)
OF := hello

all:
	$(CC) helloworld.c -o $(OF) $(ADDITIONAL)

clean:
	-rm $(OF)