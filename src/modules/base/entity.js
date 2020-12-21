import {GComponentMgr} from "./components";

class Entity {
    constructor(guid) {
        this.guid = guid || -1;
        this.events = new Map();
        this.components = new Map();
        this.tags = {};
    }


    AddComponent(name) {
        let Component = GComponentMgr.GetComponent(name);
        if(!Component) {
            //TODO: Logger()
            return null;
        }
        let comp = new Component(inst);
        this.components.set(name, comp);
        return comp;
    }

    AddListener(event, fn) {
        if(!this.events.has(event)) {
            let set = new Set();
            this.events.set(event, set);
        }
        this.events[event].add(fn);
    }
    RemoveListener(event, fn) {
        if(this.events.has(event)) {
            let set = this.events[event];
            if(set.has(fn)) {
                set.delete(fn);
            }
        }
    }
    PushEvent(event, data) {
        if(this.events[event]) {
            let set = this.events[event];
            for(fn in set) {
                fn(this, data);
            }
        }
    }
    AddTag(tag) {
        this.tags[tag] = true;
    }
    RemoveTag(tag) {
        this.tags[tag] = null;
    }
}



export default Entity;