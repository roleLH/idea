
typedef struct {
    CAC cac_data;      // 动画数据
    NCBR_t ncbr_data;  // tilesets
    NCER_t ncer_data;  // 动画帧数据
    char* id;
} Sprite_Data_t;

typedef struct {
    int npc_id;
    NCLR_t palette_data;
    Sprite_Data_t* sprite_datas;
} NPC_Data_t;
