
typedef struct {
    CAC cac_data;      // ��������
    NCBR_t ncbr_data;  // tilesets
    NCER_t ncer_data;  // ����֡����
    char* id;
} Sprite_Data_t;

typedef struct {
    int npc_id;
    NCLR_t palette_data;
    Sprite_Data_t* sprite_datas;
} NPC_Data_t;
