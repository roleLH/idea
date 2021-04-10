
let buildingInfos = [];
const SCORE = "score";
const MATERIAL_INFO_KEY = "material";
const COLOR_INFO_KEY = "color";
buildingInfos.sort((a, b)=> {
    return a[SCORE] < b[SCORE];
})

let buildingid2info = {}
let material2id = {}
let color2id = {}

buildingInfos.forEach((item) => {
    buildingid2info[item.id] = item
    let materialinfo = item[MATERIAL_INFO_KEY];
    if(materialinfo) {
        materialinfo.forEach((id)=> {
            if(!material2id[id]) {
                materialinfo[id] = {}
            }
            materialinfo[id][item.id] = true;
        })
    }

    let colorinfo = item[COLOR_INFO_KEY];
    if(colorinfo) {
        colorinfo.forEach(info => {
            let color = info[0]
            if(!color2id[color]) {
                color2id[color] = {}
            }
            color2id[color][item.id] = true;
        })
    }

})






let basecfg = [] // 配置表
let BASESCOREKEY = ""
let CONUTLIMITKEY = ""
let COUNTLIMITPARAMKEY = ""
let getbasescore = (homelv) =>{
    let info = basecfg[homelv]
    if(!info) {
        console.log("[basecfg] not found info:", homelv)
        return
    }
    return info[BASESCOREKEY]
}
let getcountlimit = (homelv) => {
    return basecfg[homelv] != null ? basecfg[homelv][CONUTLIMITKEY] : null
}
let getlimitparam = (homelv) => {
    return basecfg[homelv] != null ?
        basecfg[homelv][COUNTLIMITPARAMKEY] :
        null;
}

let favour_cfg = [] // 配置表
const COUNT_ID_KEY = "countid";
const COUNT_SCORE = "score";
const MATERIAL_KEY = "material";
const MATERIAL_SCORE_KEY = "material_score";
const COLOR_KEY = "color";
const COLOR_SCORE_KEY = "color_score";
const GROUND_KEY = "ground";


let getfavourtbl = (favour_id) => {
    return favour_cfg[favour_id]
}

let _init_favour_cfgs = (cfgs) => {
    cfgs.forEach(cfg => {
        let material_ = cfg[MATERIAL_KEY];
        let union_a = null;
        let union_b = null;
        if(material_) {
            union_a = material2id[material_[0]];
            material_.forEach(id => {
                let tbl = material2id[id];
                union_a = _union_tbl(union_a, tbl);
            })
            
        }
        let color_ = cfg[COLOR_KEY];
        if(color_) {
            union_b = color2id[color_[0]];
            color_.forEach(id => {
                let tbl = color2id[id];
                union_b = _union_tbl(union_b, tbl);
            })
        }

        cfg.__material_ids = union_a;
        cfg.__color_ids = union_b;
        if(union_a && union_b) {
            cfg.__ids = _intersection_tbl(union_a, union_b);
        } 

    })
}


/**
 * @note 交集
 * @param {Object} tbl_a 
 * @param {Object} tbl_b 
 */
let _intersection_tbl = (tbl_a, tbl_b) => {
    let ret = {}
    for(let id in tbl_a) {
        if(tbl_b[id]) {
            ret[id] = true;
        }
    }
    return ret;
}

/**
 * @note 并集
 * @param {Set} tbl_a 
 * @param {Set} tbl_b 
 */
let _union_tbl = (tbl_a, tbl_b) => {
    let ret = {}
    for(let id in tbl_a) {
        ret[id] = true;
    }
    for(let id in tbl_b) {
        ret[id] = true;
    }
    return ret;
}



class SystemCore {
    constructor() {
        this.homelv = 0;
        this.buildings = new Map();
        this.homenpc = false;
        this.favourids = {};

        this.results = {};
        this.cur_favour_result = null;

        this._matheds = {};
    }

    reset() {
        this.homelv = 0;
        this.buildings = new Map();
        this.grounds = new Map();
        this.homenpc = false;
        this.favourids = {};

        this.results = {};
    }

    init() {
        this._matheds["buildings"] = (list) => {
            list.forEach((item) => {
                if(this.buildings.has(item.buildingid)) {
                    let info = this.buildings.get(item.buildingid);
                    info.count = item.count;
                } else {
                    this.buildings.set(item.buildingid, {
                        id: item.buildingid,
                        count: item.count,
                    })
                }
            })
            return true;
        }

        this._matheds["grounds"] = (list) => {
            list.forEach((item) => {
                if(this.grounds.has(item.groundid)) {
                    let info = this.grounds.get(item.groundid);
                    info.count = item.count;
                } else {
                    this.grounds.set(item.groundid, {
                        id: item.groundid,
                        count = item.count,
                    })
                }
            })
        }

    }


    submitData(key, value) {
        if(this._matheds[key]) {
            return this._matheds[key](value);
        }
        if(!this[key]) {
            console.log("[core]error not found key", key);
            return false
        }
        
        this[key] = value;
        return true;
    }

    getBuildingInfo(id) {
        return buildingid2info[id];
    }

    sort() {

    }

    calcBaseScore() {
        let tbl = getbasescore(this.homelv)
        if(!tbl) {
            console.log("[core]error, base score calc failed");
            return;
        }
        let count = 0;
        let size = this.buildings.size;
        if(size <= tbl[1]) {
            count = size;
        } else {
            let max = tbl[1]
            count = max
        }
        let limit = getcountlimit(this.homelv);
        let param = 0;
        if(size > limit) {
            let limit_param = getlimitparam(this.homelv);
            param = (size - limit) / limit_param[0] * limit_param[1] / 100;
        }

        this.results["basescore"] = {
            count,
            param,
            basescore : count * tbl[0] * param,
        }
        return this.results["basescore"].basescore;
    }

    //TODO:
    calcExtraKitScore() {


        return 0;
    }

    calcExtraBaseScore() {
        let count = this.results["basescore"].count;
        let score = 0;
        let result = {}
        while(count > 0) {
            for(let i = 0; i < buildingInfos.length; ++i) {
                let info = buildingInfos[i]
                if(this.buildings.has(info.id)) {
                    let building = this.buildings.get(info.id);
                    if(building.count > count) {
                        result[info.id] = {
                            count: count,
                            score: info[SCORE]
                        }
                        count = 0;
                    } else {
                        result[info.id] = {
                            count: building.count,
                            score: info[SCORE]
                        }
                        count -= building.count;
                    }
                }
            }
        }
        for(let id in result) {
            score += result[id].count * result[id].score;
        }

        if(!this.result["extrascore"]){
            this.results["extrascore"] = {};
        }
        this.results["extrascore"].base = {
            result,
            score,
        }
        return score;
    }

    /**
     * 
     * @param {Array} count_tbl 
     * @param {Array} count_score_tbl 
     */
    calcCountScore(count_tbl, count_score_tbl) {
        let count = 0;
        let max_count = count_score_tbl[1];
        let score = count_score_tbl[0];

        for(let i = 0; i < count_tbl.length; ++i) {
            let id = count_tbl[i]
            if(this.buildings.has(id)) {
                let info = this.cur_favour_result["base"][id]
                if(!info) {
                    console.log("[systemcore] error count found info in reuslt table", id)
                    continue;
                }
                let building = this.buildings.get(id);
                if(count + building.count >= max_count) {
                    let n = max_count - count;
                    count = max_count;
                    info.count_score = score * n; 
                } else {
                    count += building.count;
                    info.count_score = score * building.count;
                }
            }
            if(count >= max_count) { break;}
        }
    }

    /**
     * 
     * @param {*} material_tbl 
     * @param {*} material_score_tbl 
     */
    calcMaterialScore(material_score_tbl, material_ids) {
        let max_count = material_score_tbl[1];
        let score = material_score_tbl[0];
        let count = 0;

        for(let id in material_ids) {
            if(this.buildings.has(id)) {
                let info = this.cur_favour_result["base"][id]
                if(!info) {
                    console.log("[systemcore] error count found info in reuslt table", id)
                    continue;
                }
                let building = this.buildings.get(id);
                if(count + building.count >= max_count) {
                    let n = max_count - count;
                    count = max_count;
                    info.count_score = score * n; 
                } else {
                    count += building.count;
                    info.count_score = score * building.count;
                }
            }
            if(count >= max_count) { break;}
        }
    }

    calcColorScore(color_score_tbl, color_tag_tbl) {
        let colorinfos = {}
        this.buildings.forEach((building) => {
            let id = building.id;
            let info = self.getBuildingInfo(id);
            let colorinfo = info[COLOR_INFO_KEY]
            if(colorinfo) {
                colorinfo.forEach((info) => {
                    let color = info[0]
                    colorinfos[color] = colorinfo[color] == null 
                        ? info[1]
                        : colorinfos[color] + info[1];
                })
            }
        })

        let score = 0;
        let sum = 0;
        color_tag_tbl.forEach((color) => {
            if(colorinfos[color]) {
                sum += colorinfos[color];
            }
        })
        score = Math.floor(sum / color_score_tbl[0]) * color_score_tbl[1];
        score = score > color_score_tbl[2] ? color_score_tbl[2] : score;
        
        this.cur_favour_result["color"].colorinfos = colorinfos;
        this.cur_favour_result["color"].score = score;
    }

    calcMaterialColorScore(tbl_ids) {
        let baseinfo = this.cur_favour_result["base"]
        this.buildings.forEach((building) => {
            if(tbl_ids[building.id]) {
                
            }
        })
    }

    calcGroundScore(ground_tbl, ground_score_tbl) {
        let count = 0;

        let groundinfo = this.cur_favour_result["ground"];
        this.grounds.forEach((ground) => {
            if(ground_tbl[ground.id]) {
                count += ground.count;
                groundinfo.info[ground.id] = true;
            }
        })
        let score = Math.floor(count / ground_score_tbl[0]) * ground_score_tbl[1];
        score = score > ground_score_tbl[2] ? ground_score_tbl[2] : score;

        groundinfo.score = score
    }

    calcFavourScore(favour_id) {
        this.results[favour_id] = buildResult(this.buildings);

    }

}

/**
 * @param buildings {Map}
 */
let buildResult = (buildings) =>{
    let base = {}
    buildings.forEach(item => {
        base[item.id] = {
            id: 0,
            name: "",
            number: 0,
            count_score: 0,
            material_score: 0,
            color_score: 0,
            sum_score: 0,
        }
    })
    let color = {
        colorinfos : null,
        score : 0,
    }
    let ground = {
        info: {},
        score : 0,
    }

    ret["base"] = base;
    ret["color"] = color;
    ret["ground"] = ground;
    return ret;
}

let GCore = new SystemCore()
export default GCore