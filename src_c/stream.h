#include <stddef.h>
#define BUFFER_SIZE 1024
#define BUFFER_COUNT_MAX 1024
#include "common.h"



typedef struct {
    char** buffer;
    u_int32_t buffer_count;
    u_int32_t len;
    u_int32_t pos;
} Stream;

Stream* make_stream(const char* file_name);
u_int8_t  read_char(Stream*);
u_int16_t read_uint16(Stream*);
u_int32_t read_uint32(Stream*);
int read_len(Stream*, char*, int len);

size_t write_char(Stream*, u_int8_t);
size_t write_uint16(Stream*, u_int16_t);
size_t write_uint32(Stream*, u_int32_t);
size_t write_len(Stream*, char*, int len);
