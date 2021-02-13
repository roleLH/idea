简单研究了一下 **宠物精灵 range** 的文件结果  
这是一个nds文件，用**tinke**文件浏览器可以查看它的具体内容  
（想要找出一个完全可以解析的nds游戏并不容易，因为大部分内部文件是加密或是压缩过的，很难看到里面的内容，好在这个游戏可以哈哈）  
为什么想要解析  
因为很喜欢它的像素动画，想要看看这些精灵是怎么运作的。虽然在一些网站可以找到对应的内容，但还是希望看看它们本来的面目。  
好的。那么开始吧。
--TIME:2021-02-13
今天npc文件夹下的内容解析如下：
### 主要是**ncer**文件
效果上来看，它指示着一帧动画精灵是如何摆放的。  
抛开那些无用的，主要的就是**OAM**这个结构，它指示着从哪里索引，多少大小，怎么摆放等。
其中比较诡异的地方就是 ```Obj2.tileOffset ``` 这个字段。  
对于**xxx_w_xx**这样的tileset， ```tileOffset``` 就是按照 8\*8 像素索引的对应的块；  
而对于 **xxx_s_xx**这样的tileset，则是分开索引。
```c
 0000 0000
+----+----+
  |     +---- 决定所在的行
  +---------- 决定所在的列，且 0: 0000
                            1: 0010 
                            2: 0100 
                            3: 0110
```
因为目前还没有找到超过4行的tilesets，所以看起来规则就是上面这样。





### 示例代码
```csharp
public struct OAM
    {
        public Obj0 obj0;
        public Obj1 obj1;
        public Obj2 obj2;

        public ushort width;
        public ushort height;
        public ushort num_cell;
    }

    public struct Obj0  // 16 bits
    {
        public Int32 yOffset;       // Bit0-7 -> signed
        public byte rs_flag;        // Bit8 -> Rotation / Scale flag
        public byte objDisable;     // Bit9 -> if r/s == 0
        public byte doubleSize;     // Bit9 -> if r/s != 0
        public byte objMode;        // Bit10-11 -> 0 = normal; 1 = semi-trans; 2 = window; 3 = invalid
        public byte mosaic_flag;    // Bit12 
        public byte depth;          // Bit13 -> 0 = 4bit; 1 = 8bit
        public byte shape;          // Bit14-15 -> 0 = square; 1 = horizontal; 2 = vertial; 3 = invalid
    }
    public struct Obj1  // 16 bits
    {
        public Int32 xOffset;   // Bit0-8 (unsigned)

        // If R/S == 0
        public byte unused; // Bit9-11
        public byte flipX;  // Bit12
        public byte flipY;  // Bit13
        // If R/S != 0
        public byte select_param;   //Bit9-13 -> Parameter selection

        public byte size;   // Bit14-15
    }
    public struct Obj2  // 16 bits
    {
        public uint tileOffset;     // Bit0-9
        public byte priority;       // Bit10-11
        public byte index_palette;  // Bit12-15
    }
```