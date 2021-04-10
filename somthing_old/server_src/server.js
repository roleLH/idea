const http = require("http");
const url = require("url");

let log2 = function(...args) {
    console.log(args);
}

const timeout = 5 * 60 * 1000

class TinyHomeBuildingMgr {
    constructor() {
        this.users = new Map();

    }

    updateUserInfo(user, info) {
        if(!this.users.has(user)) {
            log2("[warning] not found user. and will register user", user);
        //    this.registerUser(user);
        }
        this.users.set(user, info)
    }

    getUserInfo(user) {

    }

    getAllUserInfos() {

    }

    clearUser(user) {
        
    }

}

const APP = new TinyHomeBuildingMgr()
let handlers = {}

function send_msg(rsp, msg) {
    rsp.setHeader("Content-Type", "test/json; chatset=utf8");
    rsp.end(msg);
}

handlers.update_user_info = function(req, rsp) {
    let info = req.msg_obj
    if(info.user && info.data) {
        APP.updateUserInfo(info.user, info.data)
        send_msg(rsp, "succeed")
    }
}

handlers.get_user_info = function(req, rsp) {
    let info = req.msg_obj
    if(info.user) {
        let data = APP.getUserInfo(info.user);
        send_msg(rsp, "{\"user\":4455}")
    }
}

handlers.get_all_users = function(req, rsp) {
    let data = APP.getAllUserInfos()

}

const server = http.createServer((req,rsp)=> {

    let url = req.url.substr(1)
    let handler = handlers[url];
    if(handler) {
        var msg = '';				  
        req.on('data',function(chunk){        //req的监听方法data
            msg += chunk;		      //拼接获取到数据
        }).on('end',function(){		      //数据接收完触发
            req.msg = msg;		 
            req.msg_obj = JSON.parse(msg)
            handler(req, rsp)
        })
    } else {
        rsp.writeHead(404,"Not Found");
        rsp.end('<h1>404 Not Found!</h1>')
    }

    
    // rsp.write("hello\n");
    // rsp.end();
});


server.listen(9528, ()=>{
    console.log("server started");
})