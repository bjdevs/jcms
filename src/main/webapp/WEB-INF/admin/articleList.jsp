<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="Cache-control" content="max-age=3600">

    <title>${winTitle}</title>
    <meta name="author" content="4what"/>
    <meta name="description" content="黄梅老祖寺 ${depict}"/>
    <meta name="keywords" content="老祖寺,黄梅老祖寺,紫云山,${keyWord}"/>
    <link rel="stylesheet" href="http://cache.amap.com/lbs/static/main.css?v=1.0?v=1.0" />
    <link rel="stylesheet" type="text/css" href="http://www.hmlzs.me:8080/article/static/lzs/css/style.css"/>
    <style type="text/css">
        #container{
            margin:0;
            height:100%;
            width:100%;
            font-size:12px;
        }
    </style>
</head>

<body>
<div class="main">
    <div class="container">
        <div class="topbar">
            <div class="wrapper">
		<span class="welcome">
			<em>欢迎来到黄梅老祖寺首页</em>
			<span class="datetime"></span>
            </span>
		<span class="tools">
			<a href="javascript: void(0);" onclick="addFavorite();">收藏本站</a> |
			<a href="javascript: void(0);" onclick="setHome();">设为首页</a> |
			<a href="#contact">来访路线</a> |
			<a href="javascript: void(0);">微信公众号</a>
		</span>
            </div>
        </div>

        <div class="header">
            <div class="wrapper">
                <h1><a href="http://www.hmlzs.cn"><img src="http://www.hmlzs.me:8080/article/static/lzs/images/logo.png" alt="黄梅老祖寺"/></a></h1>
                <form action="${listURLPrefix}search" method="get" id="search-frm" class="search">
                    <div>
                        <div class="keyword"><input type="text" name="kw" value=""/></div>
                        <input type="submit" name="" value="搜索" class="submit"/>
                    </div>
                    <input type="hidden" name="pn" class="pn" value=""/>
                    <input type="hidden" name="c" class="c" value=""/>
                    <input type="hidden" name="t" class="t" value=""/>
                </form>
                <div class="qrcode"></div>
            </div>
        </div><div class="navbar">
    <div class="wrapper" id="navbar">
        <script type="text/javascript" src="http://www.hmlzs.me:8080/article/base/nav.html"></script>
    </div>
</div>
<div class="content">
    <div class="notice">
        <span class="icon left"></span>

        <p>
            <strong>活动通知</strong>
            <script type="text/javascript" src="http://www.hmlzs.me:8080/article/base/notice.html"></script>
        </p>
        <span class="icon right"></span>
    </div>
    <div class="breadcrumb">
        当前位置：<a href="#">${list.category}</a>
    </div>

    <div class="layer2 layer2-1 article-list">
        <h2><span><em>${list.category}</em></span></h2>
        <dl>
            <c:if test="${!list.listEmpty}">
                <c:forEach items="${list.data}" var="item">
                    <dt><span><a href="${item.get("url")}" target="_blank">${item.get("title")}</a></span><em>[${item.get(
                        "publishDate")}
                        ]</em>
                    </dt>
                    <dd>
                        ${item.get("depict")}<a href="${item.get("url")}" target="_blank">[详细]</a>
                    </dd>
                </c:forEach>
            </c:if>
            <c:if test="${list.listEmpty}">
                <dt><span style="color:red;text-align: center; background: none">(当前文章列表为空)</span></dt>
            </c:if>
        </dl>
        <div class="paginator">
        </div>
    </div>

    <div class="rightside">
        <script type="text/javascript" src="http://www.hmlzs.me:8080/article/base/fawu.html"></script>
        <script type="text/javascript" src="http://www.hmlzs.me:8080/article/base/futian.html"></script>
    </div>
</div>
<!-- /content -->

<!-- footer -->
<div class="footer">
    &copy; 2006-<span id="year">0</span> 黄梅老祖寺 京ICP备15008795号-2
</div>

<!-- /container -->

<div class="gototop">
    <a href="#"><span>回顶部</span><em></em></a>
</div>
</div>
</div>
<!-- /main -->
<script type="text/javascript" src=http://www.hmlzs.me:8080/article/static/lzs/js/header.js></script>

<script type="text/javascript" src=http://www.hmlzs.me:8080/article/static/lzs/js/jquery/jquery-1.8.3.min.js></script>

<script type="text/javascript" src=http://www.hmlzs.me:8080/article/static/lzs/js/jquery/plugin/jquery.cycle.all.js></script>

<script type="text/javascript" src=http://www.hmlzs.me:8080/article/static/lzs/js/audiojs/audio.min.js></script>

<script type="text/javascript" src=http://www.hmlzs.me:8080/article/static/lzs/js/jquery.qrcode.min.js></script>

<script src="http://cache.amap.com/lbs/static/es5.min.js"></script>
<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=aa83bb67a3b8592e7b3aaf2674b6a50b&plugin=AMap.ToolBar"></script>

<script type="text/javascript" src="http://www.hmlzs.me:8080/article/static/lzs/js/map_main.js"></script>
<script type="text/javascript" src="http://webapi.amap.com/ui/1.0/main.js"></script>
<script type="text/javascript" src="http://www.hmlzs.me:8080/article/static/lzs/js/map.js"></script>




<!-- page analytics -->
<script type="text/javascript" src=http://www.hmlzs.me:8080/article/static/lzs/js/analytics.js></script>

<script type="text/javascript">
    $('.qrcode:eq(0)').qrcode({width: 64,height: 64,text: window.location.href})
    $('#code').qrcode({width: 80,height: 80,text: window.location.href})
    $('.qrcode > canvas').css({'margin-top': 10});
</script>

<script type="text/javascript">

    var scroll = function (target, options) {
        var defaults = {
                    duration: 0, // {Number|String}
                    offset: 0, // {Number}
                    position: "bottom" // {String} "bottom|top"
                },
                settings = $.extend(defaults, options);

        target = $(target);

        var position = (function () {
                    if (settings.position === "bottom") {
                        var outerHeight = target.outerHeight(true);
                        return function () {
                            return $(window).height() - outerHeight - settings.offset;
                        };
                    } else {
                        return function () {
                            return settings.offset;
                        };
                    }
                })(),

                prop = function () {
                    return {
                        "top": $(window).scrollTop() + position()
                        + "px" // for IE
                    };
                },

                handler = (function () {
                    return !settings.duration ?
                            function () {
                                target.css(prop());
                            } :
                            function () {
                                target.stop().animate(prop(), settings.duration);
                            };
                })();

        $(window).bind("load resize scroll", handler);
    }

    // gototop
    scroll($(".gototop"), {
        // duration: "slow",
        offset: 16
    });

    // header
    document.getElementsByClassName("datetime")[0].innerText = " " + getCalStr();
    // footer
    document.getElementById("year").innerText = new Date().getFullYear();
</script>
<script>

    // 紫云法务
    $(".zyfw ul li").each(function (index) {
        $(this).mouseenter(function () {
            $("ul li:eq(" + index + "), ol li:eq(" + index + ")", ".zyfw").addClass("current").siblings().removeClass("current");
        });
    });

    // nav current category
    var liIndex = ${list.categoryId} -1;
    if($('#navbar > ul > li').length > liIndex){
        $('#navbar > ul > li:eq("' + liIndex + '")').addClass("current").siblings().removeClass("current");
    }else{
        $('#navbar > ul > li').removeClass("current");
    }
    var pageCnt = ${list.totalPage};
    var page = ${list.pageNum};
    var listUrl = ${listUrl};

    $('#contact li:eq(2) > span').text("");
    $('#contact li:eq(2)').css("text-align", "center");
    $('#map_container').css("width", "270px");
</script>
<script type="text/javascript" src="http://www.hmlzs.me:8080/article/static/lzs/js/paginate.js"></script>
</body>
</html>
