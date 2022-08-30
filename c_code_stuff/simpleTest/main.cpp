#include <stdlib.h>
#include <allegro5/allegro5.h>
#include <allegro5/allegro_font.h>
#include <allegro5/allegro_image.h>
int main(int argc, char **argv) // MUST BE IN THIS SPECIFIC FORM!!
{
	al_init();
	al_install_keyboard();

	ALLEGRO_TIMER       *timer = al_create_timer(1.0 / 30.0);
	ALLEGRO_EVENT_QUEUE *queue = al_create_event_queue();
	ALLEGRO_DISPLAY     *disp = al_create_display(640, 480);
	ALLEGRO_FONT        *font = al_create_builtin_font();

	//Make all the events go to the event queue
	al_register_event_source(queue, al_get_keyboard_event_source());
	al_register_event_source(queue, al_get_display_event_source(disp));
	al_register_event_source(queue, al_get_timer_event_source(timer));

	bool redraw = false;
	ALLEGRO_EVENT event;

	while(1) {
		al_wait_for_event(queue, &event);
		switch(event.type) 
		{
			case ALLEGRO_EVENT_TIMER:
				redraw = true;
                break;
		}
	}
}