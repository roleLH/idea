#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "common.h"
#include "stream.h"

typedef struct {
    char* id;
    u_int32_t size_section;
    u_int16_t nTilesY;
    u_int16_t nTilesX;
    ColorFormat depth;
    u_int16_t unknown1;
    u_int16_t unknown2;
    u_int32_t tiledFlag;
    u_int32_t size_tiledata;
    u_int32_t unknown3;
    char* data;
} RAHC_t;

typedef struct {
    char* id;
    u_int32_t size_section;
    u_int32_t unknown1;
    u_int16_t charSize;
    u_int16_t nChar;
} SOPC_t;



typedef struct NCGR {
    NH_t header;
    RAHC_t rahc;
    SOPC_t sopc;
    TileForm order;
    void* other;
    u_int32_t id;
} NCGR_t;


NCGR_t* NCGR_read(const char*);
void    NCGR_free(NCGR_t*);

void dump_rach_data(const char* data, int len) {
    int i = 0;
    for(i; i < len; i++) {
        printf("%x ", data[i]);
    }
    printf("\n");
}

int RAHC_read(RAHC_t* rahc, Stream* stream) {
    if(!rahc) {
        return -1;
    }
    if(!file) {
        return -2;
    }
    if(!rahc->id) {
        rahc->id = (char*) malloc(4);
    }
    fread(rahc->id, 1, 4, file);
    fread(&rahc->size_section, 1, 4, file);
    fread(&rahc->nTilesY, 1, 2, file);
    fread(&rahc->nTilesX, 1, 2, file);
    fread(&rahc->depth, 1, 4, file);
    fread(&rahc->unknown1, 1, 2, file);
    fread(&rahc->unknown2, 1, 2, file);
    fread(&rahc->tiledFlag, 1, 4, file);
    fread(&rahc->size_tiledata, 1, 4, file);
    fread(&rahc->unknown3, 1, 4, file);
    rahc->data = (char*)malloc(rahc->size_tiledata);
    fread(rahc->data, 1, rahc->size_tiledata, file);
    // dump_rach_data(rahc->data, rahc->size_tiledata);

    if(rahc->nTilesX != 0xFFFF) {
        rahc->nTilesX *= 8;
        rahc->nTilesY *= 8;
    }
    return 0;
}

int SOPC_read(SOPC_t* sopc, FILE* file) {
    if(!sopc) {
        return -1;
    }
    if(!file) {
        return -2;
    }
    if(!sopc->id) {
        sopc->id = (char*)malloc(4);
    }

    fread(sopc->id, 1, 4, file);
    fread(&sopc->size_section, 1, 4, file);
    fread(&sopc->unknown1, 1, 4, file);
    fread(&sopc->charSize, 1, 2, file);
    fread(&sopc->nChar, 1, 2, file);

    return 0;
}

NCGR_t* NCGR_read(Stream* stream) {

}


NCGR_t* NCGR_read(const char* file_name) {

    NCGR_t* ncgr = (NCGR_t*)malloc(sizeof(NCGR_t));
    memset(ncgr, 0, sizeof(NCGR_t));
    int ret = NH_reader(&(ncgr->header), file);
    if(ret != 0) {
        //TODO:
        printf("read nh-head error\n");
        free(ncgr);
        fclose(file);
        return NULL;
    }
    // read data
    ret = RAHC_read(&(ncgr->rahc), file);
    if(ret != 0) {
        //TODO:
        printf("rahc read error\n");
        return NULL;
    }
    if((ncgr->rahc.tiledFlag & 0xFF) == 0x0) {
        ncgr->order = Horizontal;
    } else {
        ncgr->order = Lineal;
    }

    if(ncgr->header.nSection == 2) {
        SOPC_read(&(ncgr->sopc), file);
    }

    fclose(file);
    return ncgr;
}

//TODO:
void NCGR_free(NCGR_t* ncgr) {
    // noop
    if(ncgr) {

    }
}

const char* file_name_default = "../test.data";

union Int32{
    char buf[4];
    int num;
};

int main(int argc, char** argv) {
    char* file_name = NULL;
    if(argc != 2) {
        printf("input a file path\n");
    }
    file_name = file_name_default;
//    NCGR_t* ncgr = NCGR_read(file_name);

    union Int32 num;
    num.num = 2080;
    printf("%8x: [%x, %x, %x, %x]", num.num, num.buf[0], num.buf[1], num.buf[2], num.buf[3]);
    return 0;
}
