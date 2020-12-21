let skill_cfg = {
    [0] : {
        name : "",
        desc : "",
        kind : 0,
        where : 0,
        sp : [0, 1, 2, 3, 4],
        effectid : [0, 0, 0, 0, 0],
        career : 0,
    }
}


function get_skill_cfg(id) {
    return skill_cfg[id];
}

class SkillBase {
    constructor(id) {
        this.skillid = id || 0;
        this.lv = 0;
    }

    lvup() {
        let cfg = get_skill_cfg(this.skillid);
        if(!cfg) {
            //TODO: error cant found cfg by id : this.skillid
            return false;
        }
        

    }
}