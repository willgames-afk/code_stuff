#include <string>
#include <iostream>
#include <fstream>
#include "loader.hpp"
#include "screens.hpp"
using namespace std;

void load();

int main(int argc, char *argv[])
{
	string name;
	string titlescreen = loadfile("assets/test.txt");

	cout << titlescreen;

	string savegame = loadfile("assets/test.txt");
	cout << savegame;

	savefile("assets/test.txt", savegame + name);

	return 0;
}