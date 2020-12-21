
class ComponentMgr {
    constructor() {
        this.components = new Map();
    }

    Register(name, Component) {
        if(this.components.has(name)) {
            GLogger.info("[components], reset a component", name);
        }
        this.components.set(name, Component);
    }
    GetComponent(name) {
        if(this.components.has(name)) {
            return this.components[name];
        }
        return null;
    }
}
let GComponentMgr = new ComponentMgr();
export {GComponentMgr};