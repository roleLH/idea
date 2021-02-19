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
    Obj0 obj0;
    Obj1 obj1;
    Obj2 obj2;

    u_int16_t width;
    u_int16_t height;
    u_int16_t num_cell;
} OAM_t;

typedef struct {
    u_int16_t nCells;
    u_int16_t readOnlyCellInfo;
    u_int16_t cell_offset;
    u_int32_t partition_offset;
    u_int32_t partition_size;

    OAM_t* oams;
    u_int16_t xMax;
    u_int16_t yMax;
    u_int16_t xMin;
    u_int16_t yMin;
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


typedef struct {
    NH_t header;
    CEBK_t cebk;
    LABL_t labl;
    UEXT_t uext;
} NCER_t;


int CEBK_read(CEBK_t* cebk, FILE* file) {
    //TODO:
    if(!cebk->id) {
        cebk->id = malloc(4);
    }
    fread(cebk->id, 1, 4, file);
    fread(&cebk->section_size, 1, 4, file);
    fread(&cebk->nBanks, 1, 2, file);
    fread(&cebk->tBank, 1, 2, file);
    fread(&cebk->bank_data_offset, 1, 4, file);
    fread(&cebk->block_size, 1, 4, file) & 0xFF;
    fread(&cebk->partition_data_offset, 1, 4, file);
    fread(cebk->unused, 1, 8, file);
    cebk->banks = (Bank_t*)malloc(sizeof(Bank_t) * cebk->nBanks);

    return 0;
}

int CEBK_Bank_read(CEBK_t* cebk, FILE* file) {

    int i = 0;
    for(i; i < cebk->nBanks; i++) {
        Bank_t* bank = &(cebk->banks[i]);
        fread(&bank->nCells, 1, 2, file);
        fread(&bank->readOnlyCellInfo, 1, 2, file);
        fread(&bank->cell_offset, 1, 4, file);

        if(cebk->tBank == 0x01) {
            fread(&bank->xMax, 1, 2, file);
            fread(&bank->yMax, 1, 2, file);
            fread(&bank->xMin, 1, 2, file);
            fread(&bank->yMin, 1, 2, file);
        }
    }


    return 0;
}
