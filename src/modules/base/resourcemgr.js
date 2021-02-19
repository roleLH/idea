const TAST_STATE = {
    succeed : 0,
    pending : 1,
    failed  : 2
}


class Task {
    constructor(cb, state) {
        this.cb = cb;
        this.state = state;
    }
}

class ResourceManager {
    constructor() {
        this.resources = new Map();
        this.tasks = new Map();
    //    this.fetch_list = new Set();
    }

    _AllFinish(key) {
        if(this.tasks.has(key)) {
            let array = this.array.get(key);
            array.forEach((task) => {
                if(task.cb) {
                    task.cb(data);
                }
                task.state = TASK_STATE.succeed;
            })
        }
        
    }

    /**
     * 
     * @param {String} key
     * @returns {String} 
     */
    _get_url(key) {
        return key
    }

    /**
     * 
     * @param {String} key 
     * @param {Array} array 
     */
    _GetFromNet(key) {
        let url = this._get_url(key);
        let self = this
        fetch(url).then(function(response) {
            if(response.status == 200) {
                let data = response.blob();
                self.SetResource(key, data);
            } else {
                // array.forEach((task)=> {
                //     task.state = TASK_STATE.failed;
                // })
            }
        }).catch()
    }

    GetResource(key, cb) {
        if(this.resources.has(key)) {
            let resource = this.resources.get(key);
            cb(resource);
        }
        if(!this.tasks.has(key)) {
            this.tasks.set(key, new Array());
        }
        let array = this.tasks.get(key);
        array.push(new Task(cb, TAST_STATE.pending));
    }

    SetResource(key, resource) {
        this.resources.set(key, resource);
    }

    _GetEvent(key) {

    }
}

let GResourceMgr = new ResourceManager();
export default GResourceMgr;