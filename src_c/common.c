#include "common.h"

int NH_reader(NH_t* nh, FILE* file) {
    if(!nh) {
        printf("nh is null");
        return -1;
    }
    if(!file) {
        printf("file is null");
        return -2;
    }
    if(!nh->id) {
        nh->id = malloc(4);
    }
    
    fread(nh->id, 1, 4, file);
    fread(&nh->endianess, 1, 2, file);
    if(nh->endianess == 0XFFFE) {
        //TODO: id.reverse
    }
    fread(&nh->constant, 1, 2, file);
    fread(&nh->file_size, 1, 4, file);
    fread(&nh->header_size, 1, 2, file);
    fread(&nh->nSection, 1, 2, file);

    return 0;
}