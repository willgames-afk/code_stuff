#include "headers/second.hpp"
#include <iostream>

int main(int argc, char** argv) {
	std::cout << "Hello, World!"<< std::endl;
	char str[5];
	sprintf(str,"%d",scream());
	std::cout << str << std::endl;
	return 0;
}