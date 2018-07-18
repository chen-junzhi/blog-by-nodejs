//加载express
var express = require("express");

//创建一个路由对象，用来处理/api下的请求
var router = express.Router();
var mysql=require("mysql");

var pool=mysql.createPool({    //数据连接池
    host:"127.0.0.1",
    port:3306,
    database:"blog",
    user:"root",
    password:"aaaa"
});

//定义一下统一返回的json格式
var resData;
router.use(function (req,res,next) {
    resData={
        code:-1,
        msg:""
    };
    next();
});

//注册
router.post("/user/register",function (req, res) {
    var uname=req.body.uname;
    var pwd=req.body.pwd;
    pool.getConnection(function(err,conn){
        conn.query("select * from user where uname=?",[uname],function(err,result){
            if(err){
                resData.code=0;
                resData.msg="网络连接失败，请稍后重试...";
                res.json(resData);
            }else if(result.length>0){
                resData.code=1;
                resData.msg="用户名已存在，请重新注册!";
                res.json(resData);
            }else{
                conn.query("insert into user(uid,uname,pwd,isAdmin,realname,idcard,email,local) values(null,?,?,0,null,null,null,null)",[uname,pwd],function (err, resu) {
                    conn.release();
                    if(err){
                        resData.code=0;
                        resData.msg="网络连接失败，请稍后重试...";
                        res.json(resData);
                    }else{
                        resData.code=2;
                        resData.msg="注册成功,即将为您跳转登陆界面...";
                        res.json(resData);
                    }
                });
            }
        });
    });
});

//登录
router.post("/user/login",function (req,res) {
    var uname=req.body.uname;
    var pwd=req.body.pwd;
    pool.getConnection(function(err,conn){
        if(err){
            resData.code=0;
            resData.msg="网络连接失败，请稍后重试...";
            res.json(resData);
        }else{
            conn.query("select * from user where uname=? and pwd=?",[uname,pwd],function (err,result) {
                conn.release();
                if(err){
                    resData.code=0;
                    resData.msg="网络连接失败，请稍后重试...";
                    res.json(resData);
                } else if(result.length<=0){
                    resData.code=1;
                    resData.msg="用户名或者密码输入错误，请检查输入!";
                    res.json(resData);
                }else{
                    resData.code=2;
                    resData.msg="登陆成功";
                    //result:  [ RowDataPacket { uid: xxx, uname: 'xxx', pwd: 'xxx', isAdmin: xxx } ]
                    resData.info=result[0];
                    //把用户信息存储到session里面去
                    req.session.user={
                        _id:result[0].uid,
                        uname:result[0].uname,
                        isAdmin:result[0].isAdmin
                    };
                    res.json(resData);
                }
            })
        }
    })
});


//退出登录
router.get("/userExit",function (req, res) {
    pool.getConnection(function (err,conn) {
        conn.release();
        if(err){
            console.log(err);
            res.send("0");
        }else{
            req.session.user=null;    //注销成功
            res.send("1");
            //console.log("用户注销成功");
        }
    });
});


//2.把这个路由的文件和主模块连接起来,或者说把router的结果作为模块的输出返回出去
module.exports=router;