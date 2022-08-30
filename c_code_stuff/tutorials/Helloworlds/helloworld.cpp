#include <iostream>
#include <string>

int main() {
    std::cout << "What's your name?\n";
    std::string name;
    std::getline(std::cin, name);

    std::cout << "Hello, " << name << '!';
    return 0;
}