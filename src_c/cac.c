#include "common.h"
#include "stream.h"
#include  <string.h>

typedef struct {
    u_int8_t sprite_id;
    u_int8_t next_sprite_id;
    u_int16_t duration;
} Frame_t;


typedef struct {
    u_int8_t id;
    u_int8_t n_frames;
    Frame_t* frames;
} Anim_Data_t;

typedef struct {
    char* name;
    Anim_Data_t* anims;
    u_int16_t unknown1;
    u_int8_t unknown2;
    u_int8_t n_anims;
} CAC_t;


Frame_t* make_anim(u_int8_t n_frames, Stream* stream) {
    Frame_t* frames = (Frame_t*)malloc(sizeof(Frame_t) * n_frames);
    int i = 0;

    for(i; i < n_frames; i++) {
        u_int16_t frame_flag = read_uint16(stream);
        if(frame_flag != 0x01) {
            printf("[cac frame] error frame flag %d\n", frame_flag);
        }
        frames[i].sprite_id = read_char(stream);
        frames[i].next_sprite_id = read_char(stream);
        u_int16_t time_flag = read_uint16(stream);
        if(time_flag != 0x02) {
            printf("[cac frame] error time flag %d\n", time_flag);
        }
        frames[i].duration = read_uint16(stream);
    }
    return frames;
}


CAC_t* CAC_read(Stream* stream) {
    CAC_t* cac = (CAC_t*)malloc(sizeof(CAC_t));
    memset(cac, 0, sizeof(CAC_t));
    u_int32_t size = read_uint32(stream);
    if(size != stream->len) {
        printf("[cac] error size %d, %d", size, stream->len);
    }
    cac->unknown1 = read_uint16(stream);
    cac->n_anims = read_char(stream);
    cac->unknown2 = read_char(stream);
    u_int32_t data_len = read_uint32(stream);
    u_int8_t n_frames = data_len >> 3;

    cac->anims = (Anim_Data_t*)malloc(sizeof(Anim_Data_t) * cac->n_anims);
    int i = 0;
    for(i; i < cac->n_anims; i++) {
        cac->anims[i].id = i;
        cac->anims[i].n_frames = n_frames;
        cac->anims[i].frames = make_anim(n_frames, stream);
    }
    return cac;
}
/*
void CAC_free(CAC_t* cac) {
    if(!cac) return;
    if(cac->anims) {
        int i = 0;
        for(i; i < cac->n_anims; i++) {
            if(cac->anims[i] && cac->anims[i].frames) {
                free(cac->anims[i].frames);
            }
        //    cac->anims[i] = NULL;
        }
        free(cac->anims);
    }
    free(cac);
}
*/
