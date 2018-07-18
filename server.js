/**
 * Created by Administrator on 17-3-4.
 */
//加入路由的原因：目前代码太多，还有不方便整合，
//加载express
var express=require("express");
var cookieParser=require("cookie-parser");
var session=require("express-session");
var bodyParser=require("body-parser");
var ueditor = require("ueditor");
var path = require('path');



//加载模块引擎
var swig=require("swig");

//创建app应用，相当于 ==> Node.js Http.createServer();
var app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//配置模板引擎
app.engine("html",swig.renderFile);   //后缀名    处理模板引擎渲染的方法
//设置模板引擎所放的目录
app.set("views","./view");   //不可改变   目录
//注册所使用的模板引擎
app.set("view engine","html");    //不可改变    为app.engine这个方法所定义的东西
swig.setDefaults({cache:false});

//静态资源托管
app.use("/public",express.static(__dirname+"/public"));

// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'

app.use("/public/ueditor/ue", ueditor(path.join(__dirname,'/public'), function(req, res, next) {
    // ueditor 客户发起上传文件请求，判断请求类型
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        // 这里你可以获得上传图片的信息
        /*var foo = req.ueditor;
		console.log(ActionType);
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png*/

        var file_url = '/upload/img/';//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/upload/file/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/upload/video/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = '/upload/img/';
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.config.json 这个文件的路径
        res.redirect('/public/ueditor/nodejs/config.json');
    }
}));



app.use(cookieParser());
//session的设置
app.use(session({
    secret:"keyboard cat",  //私密ID,一个session对应着一个ID
    resave:true,            //每次请求，都会重新设置session cookie
    saveUninitialized:true, //无论有没有session cookie,每次请求都会自动添加一个
    cookie:{
        secure:false, //https协议   http协议
        maxAge:1000*6000
    }
}));

//定义路由的路径(前提：routers下面的三个js文件必须有路由对象,主模块和路由模块必须连接起来);
app.use("/admin",require("./routers/admin"));
app.use("/api",require("./routers/api"));
app.use("/",require("./routers/main"));


//这里的地址改成0.0.0.0就表示在同一个局域网下，只要在地址栏输入ip为本机ip，例如：10.85.1.116，加上端口8888，就可以访问我这台服务器

app.listen(8888,'127.0.0.1',function(err){
    if(err){
        console.log(err);
    }else{
        console.log("服务器启动成功");
    }
});