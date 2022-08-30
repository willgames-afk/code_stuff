
#include <allegro5/allegro5.h>


void blit() {
	al_set_target_backbuffer(display);
	al_draw_bitmap(gb,0,0,0);
	al_flip_display();
	al_set_target_bitmap(gb);
}


ALLEGRO_DISPLAY *display;
ALLEGRO_BITMAP* gb;

int main(int argc, char **argv)
{
	al_init();

	ALLEGRO_TIMER *timer = al_create_timer(1.0/60.0);

	ALLEGRO_EVENT_QUEUE *eventQueue = al_create_event_queue();
	al_register_event_source(eventQueue, al_get_timer_event_source(timer));

	display = al_create_display(180 * 4, 120 * 4);
	gb = al_create_bitmap(180, 120);
	blit(); //Blit blank screen

	ALLEGRO_EVENT currentEvent;

	printf("init!\n");
	al_start_timer(timer);
	while(true) {
		al_wait_for_event(eventQueue, &currentEvent);
		if (currentEvent.type == ALLEGRO_EVENT_TIMER) {
			break;
		}
	}

	al_destroy_display(display);
	al_destroy_timer(timer);
    al_destroy_event_queue(eventQueue);
	return 0;
}