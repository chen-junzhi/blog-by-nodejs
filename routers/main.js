//加载express
var express = require("express");

//创建一个路由对象，用来处理/下的请求
var router = express.Router();
var mysql=require("mysql");
var moment = require('moment');
//评论的时间显示中文
moment.locale('zh-cn');
var url = require('url');
var qs = require('querystring');

var pool=mysql.createPool({    //数据连接池
    host:"127.0.0.1",
    port:3306,
    database:"blog",
    user:"root",
    password:"aaaa"
});
//定义一下resData的json格式
var resData;
router.use(function (req,res,next) {
    resData={
        code:-1,
        msg:""
    };
    next();
});

//首页
router.get("/",function (req,res,next) {    //next: 方法next()，用于执行下一个和路径匹配的函数（行为）;
    //第一个参数模板的路径   第二个参数：分配给模板使用的数据
    //确保你绝对是从第一页开始的
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示几条数据
    //获取用户所有信息
    var allComment ;
    var article_rank;
    var topItem;
    var noteNav;
    var hotRecommend;
    pool.getConnection(function(err,conn){
        //置顶项根据文章访问量取最多的那一篇，之后可以根据自己喜好，查一篇作为置顶项（重要程度）
        conn.query("select * from article left join category on article.category_id = category.category_id group by article_acessNum desc limit 0,1",function (err, topR) {
            topItem = topR;
        });
        //笔记导航分别从文章、随笔、资源分享、学海无涯选出一篇最新发表的文章
        conn.query("select * from\n" +
            "(select category_class,article_title,article_date,article_id from category c,article a where c.category_id = a.category_id\n" +
            "order by article_date desc) t group by category_class order by article_date desc ",function (err, note) {
            noteNav = note;
        });
        //热门推荐选出评论最多的四篇文章
        conn.query("select * from ( select review.article_id,article_title,count(*) as sum from review,article where review.article_id = article.article_id group by review.article_id ) t group by sum desc limit 0,4",function (err,recommend) {
            hotRecommend = recommend;
        });
        //首页选最新的六条评论自动上翻
        conn.query("select review.article_id,article.article_title,review_content,review_datetime,review.user_id,uname,article.category_id,category_title from review left join article on review.article_id = article.article_id left join user on review.user_id = user.uid left join category on article.category_id = category.category_id  group by review_datetime desc limit 0,6",function (err, resu) {
            allComment = resu ;
        });
        //首页点击排行的数据显示六条
        conn.query("select article_id,category_title,article_title from article left join category on article.category_id = category.category_id order by article_acessNum desc limit 0,6",function (err,re) {
            article_rank = re;
        });
        //首页需要的文章数据（所有文章数据）
        conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_class \n" +
            "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
            "group by article_date desc",function (err, r) {
            var count=r.length;
            var pages=Math.ceil(count/size);
            //控制一下页数
            pageNo=Math.min(pageNo,pages);
            pageNo=Math.max(1,pageNo);
            conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_class \n" +
                "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
                "group by article_date desc limit ?,?", [size*(pageNo-1),size] ,function(err,result){
                //console.log(result[0].article_acessNum);

                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for ( var i = 0; i < result.length; i++ ){
                    result[i].article_date = moment(result[i].article_date).format('YYYY-MM-DD HH:mm:ss');
                }

                if(err){
                    console.log(err);
                    result={};
                    res.render("main/500",{
                        //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                        userInfo:req.session.user,
                        allArticle:result
                    });
                }else{
                    res.render("main/index",{
                        userInfo:req.session.user,
                        allArticle:result,
                        tag:"",
                        pageNo:pageNo,
                        pages:pages,
                        count:count,
                        size:size,
                        allComment:allComment,
                        article_rank:article_rank,
                        topItem:topItem,
                        noteNav:noteNav,
                        hotRecommend:hotRecommend
                    });
                }
                conn.release();
            });
        });
    });
});

//文章详情页渲染，根据地址栏传过来的article_Id来查这篇文章的所有关联数据
router.get("/article_detail",function (req,res,next) {
    var queryUrl = req.url;
    //console.log(queryUrl);
    queryUrl = url.parse(queryUrl).query ;
    var articleId = qs.parse(queryUrl).article_Id;
    var comments ;
    var allComment;
    var reviews;
    //console.log(qs.parse(queryUrl)) ; //{ id: '0', category: 'html', article_Id: '3' }
    //

    pool.getConnection(function(err,conn){
        conn.query("select review.article_id,article.article_title,review_content,review_datetime,review.user_id,uname,article.category_id,category_title from review left join article on review.article_id = article.article_id left join user on review.user_id = user.uid left join category on article.category_id = category.category_id  group by review_datetime desc limit 0,6",function (err, res) {
            allComment = res ;
        });
        conn.query("update article set article_acessNum = article_acessNum + 1 where article_id = ?",[ articleId ],function (err,resu) {});
        conn.query("select review.review_id,review.user_id,uname,realname,avatar,isAdmin,review_datetime,review_content from review left join user on review.user_id = user.uid where article_id = ?  group by review_datetime desc",[articleId],function (err,resul) {
            comments = resul;
            for ( var i = 0; i < comments.length; i++ ){
                if( comments[i].review_datetime ){
                    comments[i].review_datetime = moment(comments[i].review_datetime ,"YYYY-MM-DD HH:mm:ss").startOf('minute').fromNow()+'('+moment(comments[i].review_datetime).format('YYYY-MM-DD HH:mm:ss')+')';
                }
            }
        });
        conn.query("select reply.*,uname from reply,user",[],function (err, r) {
            reviews = r;
        });
        conn.query("select article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num ,article_acessNum,article.category_id,category_title from article left join user on user.uid = article.user_id left join review on article.article_id = review.article_id left join category on category.category_id = article.category_id where article.article_id = ? ",[articleId],function(err,result){
            //console.log(result);
            //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
            result[0].article_date = moment(result[0].article_date).format('YYYY-MM-DD HH:mm:ss');
            if(err){
                console.log(err);
                result={};
                res.render("main/500",{
                    //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                    userInfo:req.session.user,
                    allArticle:result
                });
            }else{
                res.render("main/article_detail",{
                    userInfo:req.session.user,
                    allArticle:result,
                    comments:comments,
                    allComment:allComment,
                    reviews:reviews
                });
            }
            conn.release();
        });
    });
});

//处理文章评论insert的请求
router.post("/insert",function (req, res, next) {
    var article_id = req.body.article_id;
    var review_content = req.body.review_content;
    var user_id = req.body.user_id;
    pool.getConnection(function (err, conn) {
        conn.query("insert into review values (null,?,?,null,?)",[article_id,review_content,user_id],function (err, result) {
            if(err){
                console.log(err);
                result={};
                res.render("main/500",{
                    //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                    userInfo:req.session.user,
                    data:result
                });
            }else {
                resData.code = 1;
                resData.msg = '评论成功';
                res.json(resData);
            }
        });
    });
});

//处理留言的请求
router.post("/insertMessage",function (req, res, next) {
    var message_content = req.body.message_content;
    var user_id = req.body.user_id;
    pool.getConnection(function (err, conn) {
        conn.query("insert into message values (null,?,null,?)",[message_content,user_id],function (err, result) {
            if(err){
                console.log(err);
                result={};
                res.render("main/500",{
                    //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                    userInfo:req.session.user,
                    data:result
                });
            }else {
                resData.code = 1;
                resData.msg = '留言成功';
                res.json(resData);
            }
        });
    });
});

//处理模糊查询请求
router.get("/search",function (req,res,next) {
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示几条数据
    var val = req.query.val;
    pool.getConnection(function (err, conn) {
        conn.query("select *,count(review.article_id) as review_num,article.article_id,img from article left join user on article.user_id = user.uid left join review on article.article_id = review.article_id left join category on article.category_id = category.category_id  where concat(article_title,article_content) like '%"+val+"%' group by article.article_id",function (err,r) {
            var count = r.length;
            var pages = Math.ceil(count / size);
            //控制一下页数
            pageNo = Math.min(pageNo, pages);
            pageNo = Math.max(1, pageNo);
            conn.query("select *,count(review.article_id) as review_num,article.article_id,img from article left join user on article.user_id = user.uid left join review on article.article_id = review.article_id left join category on article.category_id = category.category_id  where concat(article_title,article_content) like '%"+val+"%' group by article.article_id limit ?,?",[size * (pageNo - 1), size],function (err, result) {
                conn.release();
                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for ( var i = 0; i < result.length; i++ ){
                    result[i].article_date = moment(result[i].article_date).format('YYYY-MM-DD HH:mm:ss');
                }
                if(err) {
                    console.log(err);
                    result={};
                    res.render("main/500",{
                        //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                        userInfo:req.session.user,
                        allData:result
                    });
                }else {
                    res.render('main/search',{
                        userInfo:req.session.user,
                        allData:result,
                        tag: "search",
                        pageNo: pageNo,
                        pages: pages,
                        count: count,
                        size: size,
                        val: "&val="+val
                    });
                }
            });
        });
    });
});

//关于我
router.get("/about",function (req,res,next) {
    pool.getConnection(function (err, conn) {
        conn.query("select * from ( select review.article_id,article_title,count(*) as sum from review,article where review.article_id = article.article_id group by review.article_id ) t group by sum desc limit 0,4",function (err,result) {
            if(err) {
                console.log(err);
                res.render("main/500",{
                    //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                    userInfo:req.session.user,
                    hotRecommend:result
                });
            }else {
                res.render("main/about",{
                    userInfo:req.session.user,
                    hotRecommend:result
                })
            }
        });
    });
});

//文章
router.get("/article",function (req,res,next) {
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示几条数据
    var article_rank;
    var hotRecommend;
    pool.getConnection(function (err, conn) {
        //热门推荐
        conn.query("select * from ( select review.article_id,article_title,count(*) as sum from review,article where review.article_id = article.article_id group by review.article_id ) t group by sum desc limit 0,4",function (err,recommend) {
            hotRecommend = recommend;
        });
        //首页点击排行的数据显示六条
        conn.query("select article_id,category_title,article_title from article left join category on article.category_id = category.category_id order by article_acessNum desc limit 0,6",function (err,re) {
            article_rank = re;
        });
        conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
            "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
            "where category_class = '文章' group by article_date desc",function (err, r) {
            var count = r.length;
            var pages = Math.ceil(count / size);
            //控制一下页数
            pageNo = Math.min(pageNo, pages);
            pageNo = Math.max(1, pageNo);
            conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
                "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
                "where category_class = '文章' group by article_date desc limit ?,?", [size * (pageNo - 1), size], function (err, result) {
                //console.log(result[0].article_acessNum);

                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for (var i = 0; i < result.length; i++) {
                    result[i].article_date = moment(result[i].article_date).format('YYYY-MM-DD HH:mm:ss');
                }

                if (err) {
                    console.log(err);
                    result = {};
                    res.render("main/500", {
                        //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                        userInfo: req.session.user,
                        allArticle: result
                    });
                } else {
                    res.render("main/article", {
                        userInfo: req.session.user,
                        allArticle: result,
                        tag: "article",
                        pageNo: pageNo,
                        pages: pages,
                        count: count,
                        size: size,
                        article_rank:article_rank,
                        id:"&id=2",
                        hotRecommend:hotRecommend
                    });
                }
                conn.release();
            });
        });
    });
});

//随笔
router.get("/essay",function (req,res,next) {
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示几条数据
    var noteNav;
    var hotRecommend;
    pool.getConnection(function (err, conn) {
        //笔记导航分别从文章、随笔、资源分享、学海无涯选出一篇最新发表的文章
        conn.query("select * from\n" +
            "(select category_class,article_title,article_date,article_id from category c,article a where c.category_id = a.category_id\n" +
            "order by article_date desc) t group by category_class order by article_date desc ",function (err, note) {
            noteNav = note;
        });
        //热门推荐选出评论最多的四篇文章
        conn.query("select * from ( select review.article_id,article_title,count(*) as sum from review,article where review.article_id = article.article_id group by review.article_id ) t group by sum desc limit 0,4",function (err,recommend) {
            hotRecommend = recommend;
        });
        conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
            "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
            "where category_class = '随笔' group by article_date desc",function (err, r) {
            var count = r.length;
            var pages = Math.ceil(count / size);
            //控制一下页数
            pageNo = Math.min(pageNo, pages);
            pageNo = Math.max(1, pageNo);
            conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
                "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
                "where category_class = '随笔' group by article_date desc limit ?,?", [size * (pageNo - 1), size], function (err, result) {
                //console.log(result[0].article_acessNum);

                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for (var i = 0; i < result.length; i++) {
                    result[i].article_date = moment(result[i].article_date).format('YYYY-MM-DD HH:mm:ss');
                }

                if (err) {
                    console.log(err);
                    result = {};
                    res.render("main/500", {
                        //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                        userInfo: req.session.user,
                        allArticle: result
                    });
                } else {
                    res.render("main/essay", {
                        userInfo: req.session.user,
                        allArticle: result,
                        tag: "essay",
                        pageNo: pageNo,
                        pages: pages,
                        count: count,
                        size: size,
                        id:"&id=3",
                        noteNav:noteNav,
                        hotRecommend:hotRecommend
                    });
                }
                conn.release();
            });
        });
    });
});

//资源分享
router.get("/resource-sharing",function (req,res,next) {
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示几条数据
    var noteNav;
    var hotRecommend;
    pool.getConnection(function (err, conn) {
        //笔记导航分别从文章、随笔、资源分享、学海无涯选出一篇最新发表的文章
        conn.query("select * from\n" +
            "(select category_class,article_title,article_date,article_id from category c,article a where c.category_id = a.category_id\n" +
            "order by article_date desc) t group by category_class order by article_date desc ",function (err, note) {
            noteNav = note;
        });
        //热门推荐选出评论最多的四篇文章
        conn.query("select * from ( select review.article_id,article_title,count(*) as sum from review,article where review.article_id = article.article_id group by review.article_id ) t group by sum desc limit 0,4",function (err,recommend) {
            hotRecommend = recommend;
        });
        conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
            "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
            "where category_class = '资源分享' group by article_date desc",function (err, r) {
            var count = r.length;
            var pages = Math.ceil(count / size);
            //控制一下页数
            pageNo = Math.min(pageNo, pages);
            pageNo = Math.max(1, pageNo);
            conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
                "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
                "where category_class = '资源分享' group by article_date desc limit ?,?", [size * (pageNo - 1), size], function (err, result) {
                //console.log(result[0].article_acessNum);

                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for (var i = 0; i < result.length; i++) {
                    result[i].article_date = moment(result[i].article_date).format('YYYY-MM-DD HH:mm:ss');
                }

                if (err) {
                    console.log(err);
                    result = {};
                    res.render("main/500", {
                        //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                        userInfo: req.session.user,
                        allArticle: result
                    });
                } else {
                    res.render("main/resource-sharing", {
                        userInfo: req.session.user,
                        allArticle: result,
                        tag: "resource-sharing",
                        pageNo: pageNo,
                        pages: pages,
                        count: count,
                        size: size,
                        id:"&id=4",
                        noteNav:noteNav,
                        hotRecommend:hotRecommend
                    });
                }
                conn.release();
            });
        });
    });
});

//学海无涯
router.get("/learning",function (req,res,next) {
    var pageNo=Number( req.query.pageNo || 1 );
    var size=5; //默认每一页显示几条数据
    var noteNav;
    var hotRecommend;
    pool.getConnection(function (err, conn) {
        //笔记导航分别从文章、随笔、资源分享、学海无涯选出一篇最新发表的文章
        conn.query("select * from\n" +
            "(select category_class,article_title,article_date,article_id from category c,article a where c.category_id = a.category_id\n" +
            "order by article_date desc) t group by category_class order by article_date desc ",function (err, note) {
            noteNav = note;
        });
        //热门推荐选出评论最多的四篇文章
        conn.query("select * from ( select review.article_id,article_title,count(*) as sum from review,article where review.article_id = article.article_id group by review.article_id ) t group by sum desc limit 0,4",function (err,recommend) {
            hotRecommend = recommend;
        });
        conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
            "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
            "where category_class = '学海无涯' group by article_date desc",function (err, r) {
            var count = r.length;
            var pages = Math.ceil(count / size);
            //控制一下页数
            pageNo = Math.min(pageNo, pages);
            pageNo = Math.max(1, pageNo);
            conn.query("select article.article_title,article_content,article_date,article.user_id,uname,article.article_id,count(review.article_id) as review_num,article_acessNum,img,article.category_id,category_title \n" +
                "from article left join review on review.article_id = article.article_id left join user on user.uid = article.user_id left join category on category.category_id = article.category_id\n" +
                "where category_class = '学海无涯' group by article_date desc limit ?,?", [size * (pageNo - 1), size], function (err, result) {
                //console.log(result[0].article_acessNum);

                //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
                for (var i = 0; i < result.length; i++) {
                    result[i].article_date = moment(result[i].article_date).format('YYYY-MM-DD HH:mm:ss');
                }

                if (err) {
                    console.log(err);
                    result = {};
                    res.render("main/500", {
                        //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                        userInfo: req.session.user,
                        allArticle: result
                    });
                } else {
                    res.render("main/learning", {
                        userInfo: req.session.user,
                        allArticle: result,
                        tag: "learning",
                        pageNo: pageNo,
                        pages: pages,
                        count: count,
                        size: size,
                        id:"&id=5",
                        noteNav:noteNav,
                        hotRecommend:hotRecommend
                    });
                }
                conn.release();
            });
        });
    });
});

//留言
router.get("/message",function (req, res, next) {
    var messages;
    var message_view;
    pool.getConnection(function(err,conn){
        conn.query("select count(*) as sum from message",function (err, res) {
            messages = res[0].sum ;
        });
        conn.query("update message_view set num = num + 1",function (err,resu) { });
        conn.query("select * from message_view",function (err,num) {
            message_view = num[0].num;
        });
        conn.query("select * from message,user where message.user_id = user.uid group by message_datetime desc",function(err,result){
            //console.log(result);
            //解决格式问题，这里查到的时间是  2018-04-15T16:00:00.000Z   没有这一步，传给前台的时间是[object object]
            for ( var i = 0; i < result.length; i++ ){
                if( result[i].message_datetime ){
                    result[i].message_datetime = moment(result[i].message_datetime ,"YYYY-MM-DD HH:mm:ss").startOf('minute').fromNow()+'('+moment(result[i].message_datetime).format('YYYY-MM-DD HH:mm:ss')+')';
                }
            }
            if(err){
                console.log(err);
                result={};
                res.render("main/500",{
                    //req.session.user这个在登陆的时候(api.js)就已经存了，这里用userInfo来代替它，返回给前端页面模版渲染的时候所需要用到的数据
                    userInfo:req.session.user,
                    comments:result,
                    messages:messages,
                    message_view:message_view
                });
            }else{
                res.render("main/message",{
                    userInfo:req.session.user,
                    comments:result,
                    messages:messages,
                    message_view:message_view
                });
            }
            conn.release();
        });
    });
});

//2.把这个路由的文件和主模块连接起来,或者说把router的结果作为模块的输出返回出去
module.exports=router;