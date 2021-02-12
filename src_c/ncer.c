#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "common.h"


typedef struct {
    int32_t yOffset;
    u_int8_t rs_flag;
    u_int8_t objDisable;
    u_int8_t doubleSize;
    u_int8_t objMode;
    u_int8_t mosaic_flag;
    u_int8_t depth;
    u_int8_t shape;
} Obj0;

typedef struct {
    int32_t xOffset;
    u_int8_t unused;
    u_int8_t flipX;
    u_int8_t flipY;

    u_int8_t select_param;
    u_int8_t size;
} Obj1;

typedef struct {
    u_int32_t tileOffset;
    u_int8_t priority;
    u_int8_t index_palette;
} Obj2;

typedef struct {
    u_int16_t nCells;
    u_int16_t readOnlyCellInfo;
    u_int16_t cell_offset;
    u_int32_t partition_offset;
    u_int32_t partition_size;
}Bank_t;

typedef struct {
    char* id;
    u_int32_t section_size;
    u_int16_t nBanks;
    u_int16_t tBank;
    u_int32_t bank_data_offset;
    u_int32_t block_size;
    u_int32_t partition_data_offset;
    u_int32_t unused[2];
    Bank_t* banks;

    u_int32_t max_partition_size;
    u_int32_t first_partition_data_offset;
} CEBK_t;


typedef struct {
    char* id;
    u_int32_t section_size;
    u_int32_t offset;
    char** name;
} LABL_t;

typedef struct {
    char* id;
    u_int32_t section_size;
    u_int32_t unknown;
} UEXT_t;
