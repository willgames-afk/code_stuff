#include <stdlib.h>
#include <iostream>
#include <allegro5/allegro5.h>
#include "helpers.hpp"
int main(int argc, char *argv[])
{
    al_init();                                            //Initialize allegro
    ALLEGRO_EVENT_QUEUE *queue = al_create_event_queue(); //Event queue for storing events

    ALLEGRO_TIMER *timer = al_create_timer(1.0 / 30.0); //Create timer and register its events.
    al_register_event_source(queue, al_get_timer_event_source(timer));

    ALLEGRO_DISPLAY *display = al_create_display(320, 200); //Create 320 x 200 display and register its events
    al_register_event_source(queue, al_get_display_event_source(display));
    al_set_window_title(display, "Retrosurvival Test Build");

    bool redraw = false;
    ALLEGRO_EVENT event;
    while (true)
    { //Game Loop

        //EVENT HANDLING
        al_wait_for_event(queue, &event); //Wait for something to happen

        if (event.type == ALLEGRO_EVENT_DISPLAY_CLOSE)
        { //If user clicks the X, close the window
            break;
        }
        //Otherwise, deal with other events
        switch (event.type)
        {
        case ALLEGRO_EVENT_TIMER: //Frame timer
            redraw = true;
            break;
        case ALLEGRO_EVENT_KEY_DOWN: //Self explanitory

            break;
        }
        if (redraw && al_is_event_queue_empty(queue))
        { //If redraw is needed and there are no more events to handle,
            //Render
            al_clear_to_color(al_map_rgb(0, 0, 0)); //Clear to black

            al_flip_display(); //Show everything we just rendered
            redraw = false;    //No need to render again
        }
    }
    //Cleanup
    al_destroy_display(display);
    al_destroy_timer(timer);
    al_destroy_event_queue(queue);

    printf("\n");
    return 0;
}