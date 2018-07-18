//加载express
var express = require("express");
var mysql = require("mysql");
var multer=require("multer");
var fs=require("fs");
var moment = require('moment');
moment.locale('zh-cn');

var upload=multer({dest:__dirname+"/../public/upload/img"});    //指定文件上传路径

var pool=mysql.createPool({    //数据连接池
    host:"127.0.0.1",
    port:3306,
    database:"blog",
    user:"root",
    password:"aaaa"
});

//创建一个路由对象，用来处理/admin下的请求
var router = express.Router();

//定义一下统一返回的json格式
var resData;
router.use(function (req,res,next) {
    resData={
        code:-1,
        msg:""
    };
    next();
});

//个人中心基本资料
router.get("/personal",function(req,res,next){
    var uname=req.query.uname;
    pool.getConnection(function (err,conn) {
        conn.query("select * from user where uname=?",[uname],function (err,result) {
            conn.release();
            res.render("admin/personal",{
                data:result[0],
                userInfo:req.session.user
            });
        });
    });
});

//更改个人资料
router.post("/saveInfo",upload.array("photo"),function(req,res,next){
    var realname=req.body.realname;
    var sex = req.body.sex;
    var idcard=req.body.idcard;
    var email=req.body.email;
    var local=req.body.local;
    var uname=req.body.uname;

    pool.getConnection(function (err,conn) {
        //先把文件上传
        if(req.files!=undefined){
            var file;
            var fileName;
            var filePath="";
            for(var i in req.files){
                file=req.files[i];
                fileName=new Date().getTime() + "_" + file.originalname;
                fs.renameSync(file.path, __dirname + "/../public/upload/img/" + fileName);
                if(filePath!=""){
                    filePath+=",";
                }
                filePath+="public/upload/img/"+fileName;
            }
        }
        conn.query("update user set realname=?,sex=?,idcard=?,email=?,avatar=?,local=? where uname=? ",
            [realname,sex,idcard,email,filePath,local,uname],function (err,result) {
            conn.release();
            if(err){
                console.log(err);
            }else{
                resData.code=1;
                resData.message="修改成功";
                res.json(resData);
            }
        });
    });
});


//个人中心用户设置
router.get("/user_set",function (req,res,next) {
    var uname = req.query.uname;
    pool.getConnection(function (err, conn) {
        conn.query("select * from user where uname=? ",
        [uname],function (err,result) {
            conn.release();
            if(err){
                console.log(err);
            }else{
                res.render("admin/user_set",{
                    userInfo:req.session.user,
                    data: result[0]
                });
            }
        });
    });
});

//改密码
router.post("/userSet",function(req,res,next){
    var opwd=req.body.opwd;
    var npwd=req.body.npwd;
    var uname=req.body.uname;
    //console.log(opwd+"--"+npwd);
    pool.getConnection(function(err,conn){
        if(err){
            resData.code=0;
            resData.msg="网络连接失败，请稍后重试...";
            res.json(resData);
        }else{
            conn.query("select pwd from user where pwd=?",[opwd],function (err,result){
                if(err){
                    resData.code=0;
                    resData.msg="网络连接失败，请稍后重试...";
                    res.json(resData);
                }else if(result.length<=0){
                    resData.code=1;
                    resData.msg="旧密码输入有误，请重新输入！";
                    res.json(resData);
                }else{
                    conn.query("update user set pwd=? where uname=?",[npwd,uname],function(err,result){
                        conn.release();
                        if(err){
                            resData.code=0;
                            resData.msg="网络连接失败，请稍后重试...";
                            res.json(resData);
                        }else{
                            resData.code=2;
                            resData.msg="密码修改成功，请重新登录！";
                            req.session.user=null;
                            res.json(resData);
                        }
                    });
                }
            });
        }
    });
});


//点击发布文章渲染ueditor页面
router.get("/ueditor",function (req, res, next) {    //next: 方法next()，用于执行下一个和路径匹配的函数（行为）;
   var data;
   var uname = req.query.uname;
    pool.getConnection(function (err, conn) {
       conn.query("select * from user where uname = ?",[uname],function(err,resu ){ data = resu });
       conn.query("select * from category group by category_class",function (err,result) {
           if( err ) {
               console.log(err);
               res.render("main/500",{
                   //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                   userInfo:req.session.user
               });
           }else {
               res.render("admin/ueditor",{
                   userInfo:req.session.user,
                   categorys:result,
                   data:data[0]
               });
           }
       });
   });
});

//处理发布文章的请求
router.post("/publish",upload.array("photo"),function (req, res, next) {
    var category = req.body.category;
    var title = req.body.title;
    var article = req.body.article;
    var uname = req.body.uname;
    pool.getConnection(function (err, conn) {
        //先把文件上传
        if(req.files!=undefined){
            var file;
            var fileName;
            var filePath="";
            for(var i in req.files){
                file=req.files[i];
                fileName=new Date().getTime() + "_" + file.originalname;
                fs.renameSync(file.path, __dirname + "/../public/upload/img/" + fileName);
                if(filePath!=""){
                    filePath+=",";
                }
                filePath+="public/upload/img/"+fileName;
            }
        }

        conn.query("insert into article values (null,?,?,?,null,?,0,?)",[category,title,article,uname,filePath],function (err,result) {
            if(err){
                console.log(err);
                result={};
                res.render("main/500",{
                    //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                    userInfo:req.session.user,
                    data:result
                });
            }else {
                resData.code=1;
                resData.msg="发布成功，即将为您跳转到首页";
                res.writeHead(200,{"Content-Type": "text/plain"});
                res.write(JSON.stringify(resData));
                res.end();
            }
        });
    });
});

//管理员用户管理
router.get("/user_manage",function (req, res) {
    //确保你绝对是从第一页开始的
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示7条数据
    var data;
    var uname=req.query.uname;
    //获取用户所有信息
    pool.getConnection(function (err, conn) {
        conn.query("select avatar from user where uname = ?",[uname],function(err,avatar){
            data = avatar[0];
        });
        conn.query("select * from user",function (err, result) {
            var count=result.length;
            var pages=Math.ceil(count/size);
            //控制一下页数
            pageNo=Math.min(pageNo,pages);
            pageNo=Math.max(1,pageNo);
            //还要查一次数据库
            conn.query("select * from user limit ?,?",[size*(pageNo-1),size],function (err, rs) {
                conn.release();
                if(err){
                    console.log(err);
                    result={};
                    res.render("admin/user_manage",{
                        allUser:rs
                    });
                }else{
                    res.render("admin/user_manage",{
                        userInfo:req.session.user,
                        allUser:rs,
                        data:data,
                        tag:"admin/user_manage",
                        pageNo:pageNo,
                        pages:pages,
                        count:count,
                        size:size,
                        num:"3"
                    });
                }
            });
        });
    });
});

//管理员文章管理
router.get("/article_manage",function (req, res, next) {
    var data;
    var uname=req.query.uname;
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示7条数据
    pool.getConnection(function (err, conn) {
        conn.query("select avatar from user where uname=?",[uname],function(err,resu){
            data = resu[0];
        });
        conn.query("select article.article_title,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_class " +
            "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id " +
            "group by article_id",function (err, result) {
            var count=result.length;
            var pages=Math.ceil(count/size);
            //控制一下页数
            pageNo=Math.min(pageNo,pages);
            pageNo=Math.max(1,pageNo);
            conn.query("select article.article_title,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_class " +
                "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id " +
                "group by article_id limit ?,?",[size*(pageNo-1),size],function (err, rs) {
                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for ( var i = 0; i < rs.length; i++ ){
                    rs[i].article_date = moment(rs[i].article_date).format('YYYY-MM-DD HH:mm:ss');
                }
                if(err){
                    console.log(err);
                    result={};
                    res.render("admin/article_manage",{
                        allUser:rs
                    });
                }else{
                    res.render("admin/article_manage",{
                        userInfo:req.session.user,
                        allArticle:rs,
                        data:data,
                        tag:"admin/article_manage",
                        pageNo:pageNo,
                        pages:pages,
                        count:count,
                        size:size,
                        num:"5"
                    });
                }
                conn.release();
            });
        });
    });
});

//处理删除文章请求
router.post("/delArticle",function (req,res,next) {
    var article_id = req.body.num;
    pool.getConnection(function (err, conn) {
        conn.query("delete a,r from article a left join review r on a.article_id = r.article_id where a.article_id = ?",[article_id],function (err, result) {
            if(err){
                console.log(err);
            }else{
                resData.code=1;
                resData.msg="删除成功";
                res.json(resData);
            }
            conn.release();
        });
    });
});

//处理留言管理请求
router.get("/message_manage",function (req, res, next) {
    var data;
    var uname=req.query.uname;
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示7条数据
    pool.getConnection(function (err, conn) {
        conn.query("select avatar from user where uname=?",[uname],function(err,resu){
            data = resu[0];
        });
        conn.query("select * from message,user where message.user_id = user.uid group by message_datetime desc",function (err, result) {
            var count=result.length;
            var pages=Math.ceil(count/size);
            //控制一下页数
            pageNo=Math.min(pageNo,pages);
            pageNo=Math.max(1,pageNo);
            conn.query("select * from message,user where message.user_id = user.uid group by message_datetime desc limit ?,?",[size*(pageNo-1),size],function (err, rs) {
                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for ( var i = 0; i < rs.length; i++ ){
                    rs[i].message_datetime = moment(result[i].message_datetime ,"YYYY-MM-DD HH:mm:ss").startOf('minute').fromNow()+'('+moment(rs[i].message_datetime).format('YYYY-MM-DD HH:mm:ss')+')';
                }
                if(err){
                    console.log(err);
                    result={};
                    res.render("admin/message_manage",{
                        message:rs
                    });
                }else{
                    res.render("admin/message_manage",{
                        userInfo:req.session.user,
                        message:rs,
                        data:data,
                        tag:"admin/message_manage",
                        pageNo:pageNo,
                        pages:pages,
                        count:count,
                        size:size,
                        num:"4"
                    });
                }
                conn.release();
            });
        });
    });
});

//处理删除评论请求
router.post("/delMessage",function (req, res, next) {
    var message_id = req.body.num;
    pool.getConnection(function (err, conn) {
        conn.query("delete from message where message_id = ?",[message_id],function (err, result) {
            if(err){
                console.log(err);
            }else{
                resData.code=1;
                resData.msg="删除成功";
                res.json(resData);
            }
            conn.release();
        });
    });
});

//2.把这个路由的文件和主模块连接起来,或者说把router的结果作为模块的输出返回出去
module.exports = router;