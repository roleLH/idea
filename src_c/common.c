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

typedef Color_t (*extra_info)(const Color_Info_t*, const char* data);

typedef struct {
    int index;
    int alpha;
    int pos_step;
    extra_info extra_fn;
} Color_Info_t;

Color_Info_t A3I5_get_info(const char* data, int* pos) {
    int idx = data[*pos] & 0x1F;
    int alpha = data[*pos] >> 5;
    alpha = ((alpha << 2) + (alpha >> 1)) << 3;
    Color_Info_t info = {.alpha = alpha, .index = idx};
    return info;
}

Color_Info_t A4I4_get_info(const char* data, int* pos) {
    int idx = data[*pos] & 0xF;
    int alpha = data[*pos] >> 4;
    alpha << 4;
    Color_Info_t info = {.alpha = alpha, .index = idx};
    return info;
}

Color_Info_t A5I3_get_info(const char* data, int* pos) {
    int idx = data[*pos] & 0x7;
    int alpha = data[*pos] >> 3;
    alpha << 3;
    Color_Info_t info = {.alpha = alpha, .index = idx};
    return info;
}

Color_Info_t colors2_get_info(const char* data, int* pos) {
    u_int8_t bit = data[*pos >>3];
    int idx = (bit >> (7 - (*pos %8))) & 0x1;
    Color_Info_t info = {
        .alpha = -1,
        .index = idx
    };
    return info;
}

Color_Info_t colors4_get_info(const char* data, int* pos) {
    u_int8_t bit = data[*pos >> 2];
    int idx = (bit >> ((3 - (*pos %4)) * 2)) & 0x3;
    Color_Info_t info = {
        .alpha = -1,
        .index = idx
    };
    return info;
}

Color_Info_t colors16_get_info(const char* data, int* pos) {
    u_int8_t bit = data[*pos >> 1];
    int idx = (bit >> ((1 - (*pos %2)) * 4)) & 0x7;
    Color_Info_t info = {
        .alpha = -1,
        .index = idx
    };
    return info;
}

Color_Info_t colors256_get_info(const char* data, int* pos) {
    int idx = data[*pos];
    Color_Info_t info = {
        .alpha = -1,
        .index = idx
    };
    return info;
}

Color_Info_t colorsdirect_get_info(const char* data, int* pos) {
    //TODO:

    Color_Info_t info = {
        .alpha = -1,
        .index = -1,
        .pos_step = 2
    };
    return info;
}

Color_t BGRA_extra(Color_Info_t* info, const char* data) {
    return (Color_t){
        .a = data[info->index + 3],
        .r = data[info->index + 0],
        .g = data[info->index + 1],
        .r = data[info->index + 2]
    };
}
Color_Info_t colorBGRA_get_info(const char* data, int* pos) {
    return (Color_Info_t){
        .index = *pos,
        .alpha = -1,
        .pos_step = 4,
        .extra_fn = BGRA_extra
    };
}

Color_t ABGR_extra(Color_Info_t* info, const char* data) {
    return (Color_t){
        .a = data[info->index + 0],
        .r = data[info->index + 1],
        .g = data[info->index + 2],
        .r = data[info->index + 3]
    };
}
Color_Info_t colorABGR_get_info(const char* data, int* pos) {
    return (Color_Info_t){
        .index = *pos,
        .alpha = -1,
        .pos_step = 4,
        .extra_fn = ABGR_extra
    };
}

typedef Color_Info_t(*get_info_fn)(const char*, int*);
const get_info_fn info_tabs[] = {
    NULL,
    A3I5_get_info,
    colors4_get_info,
    colors16_get_info,
    colors256_get_info,

};

Color_t get_color(const char* data, Color_t* palette, ColorFormat format, int* pos) {
    get_info_fn fn = info_tabs[format];
    if(!fn) {
        //TODO: error not found fn by format
        return (Color_t){};
    }
    Color_Info_t info = fn(data, pos);
    *pos += info.pos_step;
    if(info.extra_fn) {
        return info.extra_fn(&info, data);
    }
    Color_t c = {
        .r = palette[info.index].r,
        .g = palette[info.index].g,
        .b = palette[info.index].b,
    };
    if(info.alpha == -1) {
        c.a = palette[info.index].a;
    } else {
        c.a = info.alpha;
    }
    
    return c;
}

Color_t* get_image_data() {
    return NULL;
}