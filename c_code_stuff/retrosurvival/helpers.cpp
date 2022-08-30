#include <stdlib.h>
#include <time.h>
#include "helpers.hpp"
bool init_rand() {
	srand(time(NULL));
	return true;
}

int boundedRand(int min, int max) {
	return rand() % (max - min) + min;
}