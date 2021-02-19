#include "gbareader.h"

typedef struct {
    Stream* stream;

} GBA_Rom_t;

GBA_Rom_t load_rom(const char* file_name) {
    GBA_Rom_t rom;
    Stream* stream = make_stream(file_name);
    rom.stream = stream;
    return rom;
}



