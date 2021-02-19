import GResourceMgr from "../base/resourcemgr";
/**
 *   NW  N   NE
 *   
 *   W   C   E
 *  
 *   SW  S   SE
 * east west south north
 */
const DIRECTION = {
    invaild     : 0,
    northwest   : 1,
    north       : 2,
    northeast   : 3,
    west        : 4,
    center      : 5,
    east        : 6,
    southwest   : 7,
    south       : 8,
    southeast   : 9
}

let _to_key = function(npcid, animid) {
    return toString(npcid) + "_" + toString(animid);
}



class TextureCache {
    constructor() {
        this.cache = new Map();
    }

    GetTextures(npcid, animid) {
        let key = _to_key(npcid, animid);
        if(this.cache.has(key)) {
            return this.cache.get(key);
        }
    }

    SetTextures(npc, animid) {

    }
}

/**
 * @param 
 * @returns 
 */
var get_anim_data = function(data_json) {
    let obj = JSON.parse(data_json);

}

/**
 * {
 *      npcid : id;
 *      imgs : {
 *          img_1_key : [];
 *          ... 
 *      };
 *      animdata : {
 *          img_1_key : {
 *              
 *          };
 *      };
 * 
 *      
 * 
 *      frame {
 *          cells : [
 *              {
 *                  xo, yo, flipx, flipy
 *                  w, h, size, shape, mode, depth,
 * 
 *                  palidx, pri, tileo
 *              };
 *              ...
 *          ];
 *      };
 * } 
 */

class NDSSprite {
    constructor(id) {
        this.id = id || 0;
        this.dir = DIRECTION.invaild;
        this.c_data = null;

        this.textures = null;
    }

    GetAnimation(animid) {

    }

};

