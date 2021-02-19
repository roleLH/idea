#include "decompress.h"

#define MAGIC 0x10

int to_nds_u24(char* buffer, int offset) {
    return (int)(
                 buffer[offset] |
                 (buffer[offset + 1] << 8) |
                 (buffer[offset + 2] << 16)
                 );
}

size_t lz10_decompress(Stream* in, Stream* out) {
    size_t read_bytes = 0;
    u_int8_t type = read_char(in);
    if(type != MAGIC) {
        printf("[lz10] error not lz10 file:%d", type);
        return 1;
    }
    u_int8_t size[3];
    read_len(in, size, 3);
    int decompressed_size = to_nds_u24(size, 0);
    read_bytes += 4;
    if(decompressed_size == 0) {
        printf("[lz10] error \n");
        //TODO:
    }

    int buffer_len = 0x1000;
    char* buffer = (char*)malloc(sizeof(char) * buffer_len);
    int buffer_offset = 0;
    int cur_outsize = 0;
    int flags = 0, mask = 1;
    u_int32_t in_length = in->len;
    while(cur_outsize < decompressed_size) {
        if(mask == 1) {
            if(read_bytes >= in_length) {
                printf("[lz10] error read_bytes\n, %d, %d", cur_outsize, decompressed_size);
            }
            flags = read_char(in); read_bytes++;
            if(flags < 0) {
                //TODO:
            }
            mask = 0x80;
        } else {
            mask >>= 1;
        }

        if((flags & mask) > 0) {
            if(read_bytes + 1 >= in_length) {
                if(read_bytes < in_length) {
                    read_char(in); read_bytes++;
                }
                printf("[lz10] error read_bytes\n, %d, %d", cur_outsize, decompressed_size);
            }
            int byte1 = read_char(in); read_bytes++;
            int byte2 = read_char(in); read_bytes++;
            if(byte2 < 0) {
                printf("[lz10] error ........TODO\n");
            }
            int len = byte1 >> 4;
            len += 3;
            int disp = ((byte1 & 0x0F) << 8) | byte2;
            disp += 1;

            if(disp > cur_outsize) {
                printf("[lz10] error ....\n");
            }
            int buf_idx = buffer_offset + buffer_len - disp;
            int i = 0;
            for(i; i < len; i++) {
                char next = buffer[buf_idx % buffer_len];
                buf_idx ++;
 //               write_char(out, next);
                buffer[buffer_offset] = next;
                buffer_offset = (buffer_offset + 1) % buffer_len;
            }
            cur_outsize += len;
        } else {
            if(read_bytes >= in_length) {
                printf("[lz10] error\n");
            }
            int next = read_char(in); read_bytes++;
            if(next < 0) {
                printf("[lz10] error [next]\n");
            }
            cur_outsize ++;
//            write_char(out, next);
            buffer[buffer_offset] = (char)next;
            buffer_offset = (buffer_offset + 1) % buffer_len;
        }

    }
    if (read_bytes < in_length) {
        if ((read_bytes ^ (read_bytes & 3)) + 4 < in_length) {
            printf("[lz10] error ........................\n");
        }
    }
    return decompressed_size;
}
