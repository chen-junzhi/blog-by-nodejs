$(function(){
    var timer;
	//动态设置二维码高度
	var width_img = $('#container aside .ewm img').width();
	$('#container aside .ewm img').css('height',width_img);
	$(window).resize(function(){
		width_img = $('#container aside .ewm img').width();
		$('#container aside .ewm img').css('height',width_img);
	});

	//动态加类名，其实这个类名就是有动画效果的二维码ewm_show这个动画
	var lis = $('#container aside .contact li');
	var imgs = $('#container aside .ewm img');
	var ewm_idx;
	lis.hover(function(){
		var width;
		ewm_idx = $(this).index();
		imgs.removeClass('animate');
		imgs.eq(ewm_idx).addClass('animate');
		width = imgs.eq(ewm_idx).width();
		imgs.eq(ewm_idx).css('height',width);
	},function(){
		imgs.removeClass('animate');
	});
	
    /* 返回顶部 */
    $(window).scroll(function(){
        if ( $(window).scrollTop() >= 200 ) {
            $('.toTop a').slideDown();
        }else {
            $('.toTop a').slideUp();
        }
    });

    $('.toTop a').click(function () {
        $('html,body').animate({
            scrollTop: 0
        },500)
    });

    //点击排行移入移出
    $('.download-rank li a').hover(function () {
        $(this).stop().animate({
            marginLeft: "8px"
        }).css({
           "color": "red"
        });
    },function () {
        $(this).stop().animate({
            marginLeft: "0px"
        }).css({
            "color": "black"
        });
    });

    //最新评论滚动
    function AutoScroll(obj) {
        //var liHeight = $(obj).find("li:first").height();
        //$(obj).find("ul").scrollTop("-72px");
        $(obj).find("ul").animate({
                marginTop: "-" + 104 + "px"
            }, 1000,
            function () {
                $(this).css({
                    marginTop: "0px"
                }).find("li:first").appendTo(this);
            });
        //console.log(obj);
    }
    /*timer = setInterval(function(){
        AutoScroll('.c-new');
    },1500);*/
    function time() {
        timer = setInterval(function(){
            AutoScroll('.c-new');
        },2500);
    }
    time();

    $('.c-new').hover(function(){
        $(this).find("ul").stop(true).animate({
                marginTop: "-" + 104 + "px"
            }, 1000,
            function () {
                $(this).css({
                    marginTop: "0px"
                }).find("li:first").appendTo(this);
            });
        clearInterval(timer);
    },function(){
        $(this).find("ul").stop(true).animate({
                marginTop: "-" + 104 + "px"
            }, 1000,
            function () {
                $(this).css({
                    marginTop: "0px"
                }).find("li:first").appendTo(this);
            });
        time();
    });

   /* //限定c-content（滚动的评论内容）,和sec-con（文章内容）显示的字符数，加上省略号...
    第一个用超出部分隐藏不就行了css样式 解决  ==》 overflow: hidden;  text-overflow: ellipsis;  white-space: nowrap;
    */
    function wordLimit(obj, num) {
        obj = $(obj);
        var con;
        for (var i = 0; i < obj.length; i++) {
            var len = $(obj[i]).html().length;
            if ( len > num) {
                con = $(obj[i]).html().substring(0,num) + '...';
            }else {
                con = $(obj[i]).html().substring(0);
            }
            $(obj[i]).html(con);
        }
    }

    //数据库取出的如果是html代码，就需要处理一下
    $('.article-item .article-con a').each(function (index, value) {
        var p = $(this).find('p');
        var str = '';
        for( var i = 0; i < p.length; i++ ){
            str += p[i].innerText;
        }
        if( $(this).find('pre').length > 0 ){
            $(this).find('.sec-con').html( $(this).find('pre').html() );
            $(this).find('pre').remove();
        }else {
            $(this).find('.sec-con').html(str).nextAll().remove();
        }
    });

    var pStr = '';
    var artTopP = $('.article-top-con p');
    for( var j = 0; j < artTopP.length; j++ ){
        pStr += artTopP[j].innerText;
    }
    artTopP.html(pStr);

    $('.article-con p:not(.sec-con)').remove();


    wordLimit('.sec-con',280);
    wordLimit('.c-title a',19);
    wordLimit('.article-top-con',150);

    //登录注册显示
    $("#login").click(function(){
        $("#loginMask").fadeIn();
        $("#loginBox").fadeIn();
        $("#loginBox").animate({
            top:"0px"
        },1000);
    });
    $("#register").click(function(){
        $("#loginMask").fadeIn();
        $("#registerBox").fadeIn();
        $("#registerBox").animate({
            top:"0px"
        },1000);
    });

    //点击排行部分，控制样式
    var article_ran = $('#article_rank li span');
    for(var i = 0; i < article_ran.length; i++){
            article_ran[i].innerHTML = i+1;
            article_ran[0].className = 'top1';
            article_ran[1].className = 'top2';
            article_ran[2].className = 'top3';
    }



});

//登录注册切换以及关闭
function reg(){
    $("#loginBox").animate({
        top:"-600px"
    },500,function(){
        $("#loginMask").fadeIn();
        $("#registerBox").fadeIn();
        $("#registerBox").animate({
            top:"0px"
        });
    });
}

function log(){
    $("#registerBox").animate({
        top:"-600px"
    },500,function(){
        $("#loginMask").fadeIn();
        $("#loginBox").fadeIn();
        $("#loginBox").animate({
            top:"0px"
        });
    });
}

function loginClose(){
    $("#loginMask").fadeOut();
    //$("#loginBox").fadeOut();
    $("#loginBox").animate({
        top:"-600px"
    },500);
    $("#registerBox").animate({
        top:"-600px"
    },500);
    $("#registerBox").find("[name='username']").val("");
    $("#registerBox").find("[name='password']").val("");
    $("#registerBox").find("[name='repassword']").val("");
    $("#registerBox").find("[name='verify']").val("");
    $("#verify_btn").removeAttr("disabled");//启用按钮
    $("#verify_btn").text("获取验证码");
    $("#verify_btn").css("background","#66cc33");
}

//退出登录
function Exit(){
    var href = location.href;
    $.get("/api/userExit",null,function (data) {
        if(data==="0"){
            alert("网络连接失败，请稍后重试...");
        }else if(data==="1"){
            if( href.indexOf('admin') !== -1 ){
                alert('即将为你跳转至首页');
                location.href = '/';
            }else{
                location.reload();
            }
        }
    })
}
