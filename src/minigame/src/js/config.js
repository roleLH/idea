
const rcn = {
    rom_size: 0x5000, // = 20KiB
    ram_size: 0x8000, // = 32KiB
    mem_spritesheet_offset: 0x0000,
    mem_spritesheet_size: 0x1800, // 6KiB = 128x96x4bits
    mem_map_offset: 0x1800,
    mem_map_size: 0x2000, // 8KiB = 128x64x8bits
    mem_palette_offset: 0x3800,
    mem_palette_size: 0x0040, // 64B = 16x(24+1+3+4)bits (24bit RGB color + 1b transp + 3b reserved + 4b redir)
    mem_spriteflags_offset: 0x3840,
    mem_spriteflags_size: 0x00c0, // 192B = 192x8bits
    mem_sound_offset: 0x3900,
    mem_sound_size: 0x1080, // 4224B = 64x(8+2+6+(32x(2+6+2+3+3)))bits
    mem_music_offset: 0x4980,
    mem_music_size: 0x0100, // 256B = 64x(4x(1+1+6))bits
    // ... 0x0580
    // RAM/ROM limit
    mem_network_offset: 0x5000,
    mem_network_size: 0x0400, // 1024B
    // ... 0x0b90
    mem_cam_offset: 0x5f90,
    mem_cam_size: 0x0004, // 4B = 2x16bits
    mem_soundstate_offset: 0x5fa0,
    mem_soundstate_size: 0x0014, // 20B = 4x(8+8+8+16)bits (8b index + 8b offset + 8b length + 16b time)
    mem_musicstate_offset: 0x5fc0,
    mem_musicstate_size: 0x0005, // 5B = 1+7+16+16bits (1b playing + 7b index + 16b time + 16b max_time)
    mem_soundreg_offset: 0x5fd0,
    mem_soundreg_size: 0x0010, // 16B = 4x(8+8+6+1+3+3)bits
    mem_gamepad_offset: 0x5fe0,
    mem_gamepad_size: 0x0018, // 24B = 2x8x(4+4)+8x8bits (4b directions + 4b buttons)
    mem_screen_offset: 0x6000,
    mem_screen_size: 0x2000, // 8KiB = 128x128x4bits
  
    gamepad_count: 8,
    map_width: 128,
    map_height: 64,
    music_count: 64,
    music_track_count: 4,
    sound_count: 64,
    sound_pitch_count: 64,
  
    gamepad_layout_xcvb: 0,
    gamepad_layout_abxy: 1,
  };

  export {rcn};