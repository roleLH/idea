#include <stdlib.h>
#include <stdio.h>

typedef unsigned short u_int16_t;
typedef unsigned int   u_int32_t;
typedef int int32_t;
typedef unsigned char u_int8_t;

typedef struct NH {
    char* id;
    u_int16_t endianess;
    u_int16_t constant;
    u_int32_t file_size;
    u_int16_t header_size;
    u_int16_t nSection;
} NH_t;


typedef enum ColorFormat {
    A3I5 = 1,           // 8 bits-> 0-4: index; 5-7: alpha
    colors4 = 2,        // 2 bits for 4 colors
    colors16 = 3,       // 4 bits for 16 colors
    colors256 = 4,      // 8 bits for 256 colors
    texel4x4 = 5,       // 32bits, 2bits per Texel (only in textures)
    A5I3 = 6,           // 8 bits-> 0-2: index; 3-7: alpha
    direct = 7,         // 16bits, color with BGR555 encoding
    colors2 = 8,        // 1 bit for 2 colors
    BGRA32 = 9,   // 32 bits -> ABGR
    A4I4 = 10,
    ABGR32 = 11
} ColorFormat;

typedef enum TileForm {
    Lineal,
    Horizontal,
    Vertical
} TileForm;

int NH_reader(NH_t* nh, FILE* file);
