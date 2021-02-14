#include "decompress.h"
#include "common.h"
#include "cvector.h"

typedef struct {
    u_int32_t start_offset;
    u_int32_t end_offset;
} BTAF_Entry_t;


typedef struct {
    char* id;
    u_int32_t section_size;
    u_int32_t nFiles;
    BTAF_Entry_t* entries;
} BTAF_t;

typedef struct {
    u_int32_t offset;
    u_int32_t first_pos;
    u_int32_t parent;
    cvector_vector_type(File_t) files;
    cvector_vector_type(Folder_t) folders;
} BTNF_MainEntry_t;

typedef struct {
    char* id;
    u_int32_t section_size;
    cvector_vector_type(BTNF_MainEntry_t) entries;
} BTNF_t;

typedef struct {
    char* id;
    u_int32_t section_size;
} GMIF_t;

typedef struct {
    char* id;
    u_int16_t id_endian;
    u_int16_t constant;
    u_int32_t file_size;
    u_int16_t header_size;
    u_int16_t nSections;

    BTAF_t btaf;
    BTNF_t btnf;
    GMIF_t gmif;
} ARC_t;


char* num2string(u_int32_t num) {
    char buff[16];
    sprintf(buff, "%d", num);
    int len = 0;
    while(buffer[len++]);
    char* str = (char*)malloc(len + 1);
    int i = 0;
    for(i; i < len; i++) str[i] = buffer[i];
    str[len] = 0;
    return str;
}





void construct_btaf(BTAF_t* btaf, Stream* stream) {
    read_len(stream, btaf->id, 4);
    btaf->section_size = read_uint32(stream);
    btaf->nFiles = read_uint32(stream);
    btaf->entries = (BTAF_Entry_t*)malloc(sizeof(BTAF_Entry_t) * btaf->nFiles);
    int i = 0;
    for(i; i < btaf->nFiles; i++) {
        btaf->entries[i].start_offset = read_uint32(stream);
        btaf->entries[i].end_offset = read_uint32(stream);
    }
}

//TODO:
File_t* file;
void construct_btnf(BTNF_t* btnf, Stream* stream) {
    read_len(stream, btnf->id, 4);
    btnf->section_size = read_uint32(stream);

    u_int32_t main_tables_offset = stream->pos;
    u_int32_t gmif_offset = main_tables_offset + btnf->section_size;

    stream->pos += 6;
    u_int16_t num_mains = read_uint16(stream);
    stream->pos -= 8;

    int m = 0;
    for(m; m < num_mains; m++) {
        BTNF_MainEntry_t* main = (BTNF_MainEntry_t*)malloc(sizeof(BTNF_MainEntry_t));
        main->offset = read_uint32(stream);
        main->first_pos = read_uint16(stream);
        main->parent = read_uint16(stream);

        u_int32_t id_file = main->first_pos;
        if(main->offset < 0x8) { // There aren't names (in Pokemon games) ?
            File_t* cur_file = (File_t*)malloc(sizeof(File_t));
            // TODO: get path?
            // cur_file->name = num2string();
            cur_file->id = id_file++;
            cur_file->path = file->path;
            cur_file->offset =


        }
    }

}

Folder_t Unpack(File_t file) {
//    ARC_t* arc = alloc_arc();
    alloc_struct(ARC_t, arc);
    Stream* stream = make_stream(file.name);
    if(!stream) {
        printf("[narc] error not found file %s\n", file.name);
        return ;
    }
    read_len(stream, arc->id, 4);
    arc->id_endian = read_uint16(stream);
    if(arc->id_endian == 0xFFFE) {
        //TODO: arc.id.Reverse<Char>();
    }
    arc->constant = read_uint16(stream);
    arc->file_size = read_uint32(stream);
    arc->header_size = read_uint16(stream);
    arc->nSections = read_uint16(stream);


}
