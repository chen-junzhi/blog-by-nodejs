# Host: localhost  (Version 5.5.13)
# Date: 2018-07-11 21:12:48
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "article"
#

DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `article_id` int(10) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `article_title` varchar(200) NOT NULL,
  `article_content` text,
  `article_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  `article_acessNum` int(11) NOT NULL DEFAULT '0',
  `img` varchar(255) NOT NULL DEFAULT 'public/images/view.jpg',
  PRIMARY KEY (`article_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

#
# Data for table "article"
#

INSERT INTO `article` VALUES (2,1,'jQuery上拉加载更多案例原理分享','<p>\n    <span style=\"color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;为避免服务器存储负荷，下面简单介绍下jquery.qrcode根据链接直接生成二维码。</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;使用方法：</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;1、引入jquery和qrcode库，可手动下载或直接引用百度开发中心的链接；&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&lt;script src=”http://apps.bdimg.com/libs/jquery.js;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; 2、在页面中加入要显示二维码的地方；&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; 3、调用插件显示二维码（qrcode支持canvas和table两种方式进行图片渲染，默认使用canvas方式，效率最高，当然要浏览器支持html5）；&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; var _url = ‘<a href=\"http://www.baidu.com’;\">www.baidu.com’;</a></span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; $(‘#code’).qrcode(_url); //传入链接或文字，js直接生成二维码。</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; 你也可以加一些其它的参数调用：</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; $(“#code”).qrcode({&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;render: “canvas”, // 渲染方式有table方式（IE兼容）和canvas方式&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;width: 100, //宽度&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height:100, //高度&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; text: utf16to8(url), //内容：链接或文字</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; typeNumber:-1,//计算模式&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; correctLevel:2,//二维码纠错级别&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; background:”#ffffff”,//背景颜色</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;foreground:”#000000″ //二维码颜色&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;希望以上分享对大家有用。</span><br/>\n</p>\n\n','2018-04-17 20:58:46',1,537,'public/images/view.jpg'),(3,1,'jquery和qrcode根据链接直接生成二维码','<p>\n    <span style=\"color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;为避免服务器存储负荷，下面简单介绍下jquery.qrcode根据链接直接生成二维码。</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;使用方法：</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;1、引入jquery和qrcode库，可手动下载或直接引用百度开发中心的链接；&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&lt;script src=”http://apps.bdimg.com/libs/jquery.js</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; 2、在页面中加入要显示二维码的地方；&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; 3、调用插件显示二维码（qrcode支持canvas和table两种方式进行图片渲染，默认使用canvas方式，效率最高，当然要浏览器支持html5）；&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; var _url = ‘<a href=\"http://www.baidu.com’;\">www.baidu.com’;</a></span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; $(‘#code’).qrcode(_url); //传入链接或文字，js直接生成二维码。</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; 你也可以加一些其它的参数调用：</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; $(“#code”).qrcode({&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;render: “canvas”, // 渲染方式有table方式（IE兼容）和canvas方式&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;width: 100, //宽度&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; height:100, //高度&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; text: utf16to8(url), //内容：链接或文字</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; typeNumber:-1,//计算模式&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; correctLevel:2,//二维码纠错级别&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; background:”#ffffff”,//背景颜色</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;foreground:”#000000″ //二维码颜色&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;});&nbsp;</span>\n</p>\n<p>\n    <span style=\"background-color: rgba(255, 255, 255, 0.7); color: rgb(51, 51, 51); font-family: \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;希望以上分享对大家有用。</span><br/>\n</p>\n\n','2018-04-17 20:51:33',4,458,'public/images/view.jpg'),(4,3,'飒飒分淘汰','3人大概豆腐干大商股份的闪光灯','2018-04-17 20:52:21',2,280,'public/images/view.jpg'),(5,4,'关于nodejs','<p style=\"text-indent: 2em;\">\n    nodejs是一个Javascript运行环境，它将js开发人员带入到后端服务器开发。\n</p>\n<p style=\"text-indent: 2em;\">\n    <span style=\"text-indent: 2em;\">它的最大优势是借助Javascript天生的事件驱动机制加 Chrome V8 高性能引擎，使我们能够轻而易举的编写高性能<span style=\"text-indent: 32px;\">Web服务</span></span>\n</p>','2018-04-25 21:23:20',4,32,'public/images/view.jpg'),(6,1,'javascript 权威指南','javascript 权威指南了解一下','2018-04-25 21:23:58',3,66,'public/images/view.jpg'),(7,2,'html5','html5了解一下','2018-04-25 21:25:16',2,84,'public/images/view.jpg'),(8,5,'这是一篇随笔的标题','这是一篇随笔的内容','2018-05-11 15:31:50',1,5,'public/images/view.jpg'),(9,6,'这是一篇资源分享的标题','这是一篇资源分享的内容','2018-05-11 15:32:36',2,2,'public/images/view.jpg'),(11,5,'随笔','随笔内容','2018-05-11 17:25:20',2,8,'public/images/view.jpg'),(14,1,'test文章','<p><img src=\"/public/upload/img//994213038527746048.jpg\" alt=\"994213038527746048.jpg\" width=\"300\" height=\"200\" border=\"0\" vspace=\"0\" title=\"994213038527746048.jpg\" style=\"width: 300px; height: 200px; float: right;\"/>开始发表你的文章吧!</p>','2018-05-12 16:38:40',3,15,'public/images/view.jpg'),(15,5,'文章','<p>测试表情<img src=\"http://localhost:8888/public/ueditor/dialogs/emotion/images/jx2/j_0013.gif\"/></p>','2018-05-12 16:54:17',3,7,'public/images/view.jpg'),(16,6,'test资源分享','<p>资源分享模块<img src=\"http://localhost:8888/public/ueditor/dialogs/emotion/images/face/i_f47.gif\" style=\"white-space: normal;\"/></p><p><br/></p><p><img src=\"/public/upload/img/995249247991500800.jpg\" title=\"47251dd3ebc354ec76fccd719f377efe75cda6cb.jpg\" alt=\"47251dd3ebc354ec76fccd719f377efe75cda6cb.jpg\" width=\"200\" height=\"300\" border=\"0\" vspace=\"0\" style=\"width: 200px; height: 300px;\"/></p>','2018-05-12 18:29:57',3,3,'public/images/view.jpg'),(40,7,'testt','<p>开始发表你的文章吧!</p>','2018-05-13 10:27:30',1,2,'public/upload/img/1526178450887_youke.png'),(41,7,'test','<p>开始发表你的文章吧!</p>','2018-05-13 10:28:50',1,1,'public/upload/img/1526178530534_QQ图片20180509221447.png'),(43,1,'带图文章','<p>带图文章测试带图文章测试带图文章测试<img src=\"/public/upload/img/995666557902393344.png\" title=\"\" alt=\"dy.png\"/><img src=\"http://localhost:8888/public/ueditor/dialogs/emotion/images/jx2/j_0003.gif\"/></p>','2018-05-13 22:06:39',1,19,'public/upload/img/1526220399627_47251ddtest.jpg'),(44,7,'学海无涯测试','<p>    这是学海无涯的文章<br/></p><p>    <img src=\"http://localhost:8888/public/upload/img/996581788585431040.jpg\" title=\"bg.jpg\" alt=\"bg.jpg\" width=\"300\" height=\"200\" border=\"0\" vspace=\"0\" style=\"white-space: normal; width: 300px; height: 200px;\"/></p><p>    <img src=\"http://localhost:8888/public/ueditor/dialogs/emotion/images/jx2/j_0011.gif\"/></p>','2018-05-16 10:46:06',4,4,'public/upload/img/996581788585431040.jpg'),(45,6,'资源分享标题','<p>资源分享内容</p>','2018-05-16 10:49:55',4,0,'public/upload/img/1526438995039_icon.png'),(46,6,'系统功能模块图','<p>       文章的内容是通过<strong>富文本编辑器</strong>存到数据库的所以有<span style=\"color: rgb(255, 0, 0);\">样式</span>，但是评论留言模块没有样式，</p><p>因为评论留言存的是字符串不是html代码<span style=\"color: rgb(0, 0, 0);\">，不管你开始怎么设置排版，</span></p><p><span style=\"color: rgb(0, 0, 0);\">从数据库拿出来的都是挤在一堆的字符串</span><img src=\"http://localhost:8888/public/ueditor/dialogs/emotion/images/jx2/j_0006.gif\" width=\"50\" height=\"50\" border=\"0\" vspace=\"0\" title=\"\" alt=\"\" style=\"width: 50px; height: 50px;\"/><span style=\"color: rgb(0, 0, 0);\"></span><br/></p><p><br/></p><p style=\"text-align: center;\"><img src=\"/public/upload/img//1526179681585_47251ddtest.jpg\" alt=\"文章内容图片\" width=\"220\" height=\"300\" border=\"0\" vspace=\"0\" title=\"文章内容图片\" style=\"width: 220px; height: 300px;\"/></p>','2018-05-16 20:31:59',7,4,'public/upload/img/1526473919895_moudle.png');

#
# Structure for table "category"
#

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_title` varchar(50) DEFAULT NULL,
  `category_class` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

#
# Data for table "category"
#

INSERT INTO `category` VALUES (1,'js','文章'),(2,'html','文章'),(3,'css','文章'),(4,'nodejs','文章'),(5,NULL,'随笔'),(6,NULL,'资源分享'),(7,NULL,'学海无涯');

#
# Structure for table "message"
#

DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `message_content` text NOT NULL,
  `message_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='留言表';

#
# Data for table "message"
#

INSERT INTO `message` VALUES (2,'我是二楼','2018-05-12 12:05:20',3),(3,'2222','2018-05-12 13:00:05',2),(4,'现在可以留言了吧','2018-05-12 13:09:46',1),(5,'这里是对博主的留言，单独的一张留言表','2018-05-12 13:10:44',1),(6,'       注册的时候，如果字段有默认值，','2018-05-16 20:15:07',7),(7,'插入数据时应该是insert into 表名(a,b,d) values (null,?,?);','2018-05-16 20:57:05',7),(8,'不填c项，也不给它赋值系统会自动取默认值','2018-05-16 20:58:45',7);

#
# Structure for table "message_view"
#

DROP TABLE IF EXISTS `message_view`;
CREATE TABLE `message_view` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `num` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='留言参与数';

#
# Data for table "message_view"
#

INSERT INTO `message_view` VALUES (1,93);

#
# Structure for table "reply"
#

DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `review_id` int(11) NOT NULL DEFAULT '1',
  `reply_id` int(11) DEFAULT NULL,
  `reply_type` varchar(255) DEFAULT NULL,
  `content` text,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `from_uid` int(11) DEFAULT NULL,
  `to_uid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='回复表';

#
# Data for table "reply"
#

INSERT INTO `reply` VALUES (1,3,1,'reply','这是id为3的那条评论对应的回复','2018-05-02 00:00:00',2,3);

#
# Structure for table "review"
#

DROP TABLE IF EXISTS `review`;
CREATE TABLE `review` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) NOT NULL,
  `review_content` text NOT NULL,
  `review_datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`review_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

#
# Data for table "review"
#

INSERT INTO `review` VALUES (1,2,'1111111','2018-04-20 20:12:36',1),(2,2,'2222222222','2018-04-20 20:52:34',2),(3,2,'33333333333','2018-04-20 20:12:34',3),(4,2,'444444444','2018-04-20 09:12:27',2),(5,4,'5555555555','2018-04-20 20:22:34',4),(6,3,'666','2018-04-20 08:49:35',1),(7,3,'这是文章id为3的评论内容','2018-04-25 11:44:11',4),(8,4,'这是文章id为4的评论','2018-04-25 19:19:58',3),(9,2,'这下应该可以评论了吧','2018-04-25 20:05:08',4),(10,2,'这下应该可以评论了吧','2018-04-25 20:05:15',4),(11,4,'这次可以评论吗','2018-04-25 20:42:51',4),(12,4,'6666666666','2018-04-25 20:43:08',4),(13,4,'99999999999999999','2018-04-25 20:43:19',4),(14,4,'88888888888888','2018-04-25 20:43:33',4),(15,3,'文章的格式怎么改。。','2018-04-25 20:44:48',4),(16,2,'测试测试测试','2018-04-25 20:45:25',4),(17,2,'侧边的评论会显示几条','2018-04-25 20:50:10',4),(18,2,'网页刷新后定位到评论栏\n','2018-04-25 20:51:27',4),(19,2,'只要不为空就可以评论','2018-04-25 20:53:09',4),(20,2,'定位','2018-04-25 20:53:30',4),(21,3,'测试','2018-04-25 21:10:00',4),(22,3,'时间格式化了一下','2018-04-26 19:34:48',4),(23,7,'了解一下文章格式','2018-04-26 20:33:53',4),(24,4,'让人头疼的文章格式','2018-04-26 21:20:48',2),(25,6,'6666666666','2018-04-26 22:54:35',2),(26,7,'hhhhh','2018-04-27 09:47:33',2),(27,7,'红红火火恍恍惚惚','2018-04-27 14:02:43',2),(28,6,'回复感觉又得建一张表','2018-04-27 21:14:26',2),(29,6,'我用手机看，还是不很自适应啊','2018-04-27 23:34:51',4),(30,6,'Jjj ','2018-04-27 23:38:01',3),(31,7,'nishi猪\n','2018-04-30 22:41:13',2),(32,7,'我正在用手机访问这篇文章','2018-04-30 22:54:59',4),(33,5,'哈哈哈','2018-05-10 22:55:51',2),(34,5,'666','2018-05-10 22:56:31',4),(35,8,'随笔写些什么内容好呢','2018-05-11 15:42:34',2),(36,11,'6','2018-05-12 13:11:27',1),(37,14,'终于可以发文章了','2018-05-12 16:40:19',3),(38,14,'头像','2018-05-13 12:48:01',1),(39,43,'自己的文章自己当然可以评论','2018-05-13 22:07:12',1),(40,6,'js\n','2018-05-16 10:55:40',4),(41,46,'666','2018-07-11 21:10:46',1);

#
# Structure for table "user"
#

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `uname` varchar(20) CHARACTER SET utf8 NOT NULL,
  `pwd` varchar(20) CHARACTER SET utf8 NOT NULL,
  `isAdmin` tinyint(4) NOT NULL DEFAULT '0',
  `avatar` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'public/images/default.png' COMMENT '用户头像',
  `realname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `sex` enum('男','女') COLLATE utf8_unicode_ci NOT NULL DEFAULT '男',
  `idcard` char(18) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `local` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "user"
#

INSERT INTO `user` VALUES (1,'16675189108','a123456',0,'public/upload/img/1526220736631_47251ddtest.jpg','陈俊志','男','431121199403090792','1120705580@qq.com','湖南省永州市祁阳县'),(2,'13207343359','a123456',0,'public/upload/img/1526456882758_qq.png','安琪拉','女','431121199812122121','1120705560@qq.com','湖南省衡阳市珠晖区'),(3,'13207343358','a123123',0,'public/images/default.png',NULL,'男',NULL,NULL,NULL),(4,'admin','a123456',1,'public/images/default.png',NULL,'男',NULL,NULL,NULL),(6,'18593413305','zjh18593413305',0,'public/images/default.png',NULL,'男',NULL,NULL,NULL),(7,'13207343357','a123456',0,'public/images/default.png',NULL,'男',NULL,NULL,NULL);
