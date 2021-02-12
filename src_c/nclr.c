#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "common.h"


typedef struct {
    char* id;
    u_int32_t length;
    ColorFormat depth;
    u_int16_t unknown1;
    u_int32_t unknown2;
    u_int32_t pal_length;
    u_int32_t num_colors;

} TTLP_t;

typedef struct {
    char* id;
    u_int32_t blockSize;
    u_int16_t unknown1;
    u_int16_t unknown2;
    u_int32_t unknown3;
    u_int16_t first_palette_num;
}   PMCP_t;


typedef struct {
    NH_t header;
    TTLP_t pltt;
    PMCP_t pmcp;
} NCLR_t;


NCLR_t* NCLR_read() {


    return NULL;
}
