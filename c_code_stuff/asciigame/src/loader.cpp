#include <string>
#include <iostream>
#include <fstream>
#include <vector>
using namespace std;

string loadFile(string filename)
{
	ifstream file(filename);
	string out;
	string line;
	if (file.is_open())
	{
		while (getline(file, line))
		{
			out = out.append(line + '\n');
		}
		file.close();
	}
	return out;
}
void savefile(string filename, string data)
{
	ofstream file(filename);
	file << data;
	file.close();
}

class Asset
{
public:
	string name;
	string url;
	string data;
	Asset(string n, string u, bool loadImmediatly)
	{
		name = n;
		url = u;
		if (loadImmediatly)
		{
			load();
		}
	}
	void load()
	{
		data = loadFile(url);
	}
};

class Assets
{
public:
	//Asset loaded[];
	vector<string> toLoad {"test", "test2", "test3"};
	Assets()
	{
	}
};