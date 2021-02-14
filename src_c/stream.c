#include "stream.h"
#include <string.h>
#include <stdio.h>
#include <stdlib.h>

Stream* make_stream(const char* file_name) {
    FILE* file = fopen(file_name, "rb");
    if(!file) {
        printf("cant open file %s\n", file_name);
        return NULL;
    }
    Stream* stream = (Stream*)malloc(sizeof(Stream));
    if(!stream) {
        printf("[stream] error alloc failed\n");
        return NULL:
    }
    memset(stream, 0, sizeof(Stream));
    stream->buffer = (char**)malloc(sizeof(char*) * BUFFER_COUNT_MAX);
    if(!stream->buffer) {
        printf("[stream] buffer alloc failed\n");
        free(stream);
        return NULL;
    }

    while(!feof(file)) {
        int size = stream->buffer_count+ 1;
        if(size >= BUFFER_COUNT_MAX) {
            printf("[stream] too large file");
            break;
        }
        char* buffer = (char*)malloc(sizeof(char) * BUFFER_SIZE);
        size_t read_len = fread(buffer, 1, BUFFER_SIZE, file);
        stream->len += read_len;
        stream->buffer[stream->buffer_count] = buffer;
        stream->buffer_count = size;
    }
    fclose(file);
    return stream;
}

void stream_read(Stream* stream, char* buf, int size) {
    if(stream->pos + size > stream->len) {
         printf("[stream] warning end of stream\n");
         size = stream->len - stream->pos;
    }
    int i = 0;
    for(i; i < size; i++) {
        int x = stream->pos / BUFFER_SIZE;
        int y = stream->pos % BUFFER_SIZE;
        buf[i] = stream[x][y];
        stream->pos++;
    }
}

u_int8_t  read_char(Stream* stream) {
    u_int8_t ret = 0;
    stream_read(stream, (char*)&ret, sizeof(u_int8_t));
    return ret;
}

u_int16_t read_uint16(Stream* stream) {
    u_int16_t ret = 0;
    stream_read(stream, (char*)&ret, sizeof(u_int16_t));
    return ret;
}
u_int32_t read_uint32(Stream* stream) {
    u_int32_t ret = 0;
    stream_read(stream, (char*)&ret, sizeof(u_int32_t));
    return ret;
}
int read_len(Stream* stream, char* buf, int len) {
    return stream_read(stream, buf, len);
}
