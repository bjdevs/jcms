<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>黄梅老祖寺-后台</title>
    <!-- extjs.css -->
    <link href="//cdn.bootcss.com/extjs/6.2.0/classic/theme-neptune/resources/theme-neptune-all.css" rel="stylesheet">
    <link href="//cdn.bootcss.com/extjs/6.2.0/packages/ux/classic/neptune/resources/ux-all-debug.css" rel="stylesheet">
    <link href="//cdn.bootcss.com/extjs/6.2.0/packages/charts/classic/neptune/resources/charts-all-debug.css" rel="stylesheet">
    <!-- font -->
    <!--<link href="//cdn.bootcss.com/extjs/6.2.0/packages/font-awesome/resources/font-awesome-all-debug.css" rel="stylesheet">-->
    <link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <!-- kindeditor -->
    <link href="/resources/kindeditor/themes/default/default.css" rel="stylesheet">

    <!-- 自定义 -->
    <!-- admin.css -->
    <link href="/resources/css/admin.css" rel="stylesheet">

    <!-- extjs.core -->
    <script src="//cdn.bootcss.com/extjs/6.2.0/ext-all-debug.js"></script>
    <!-- extjs.ux -->
    <script src="//cdn.bootcss.com/extjs/6.2.0/packages/ux/classic/ux-debug.js"></script>
    <!-- extjs.chart -->
    <script src="//cdn.bootcss.com/extjs/6.2.0/packages/charts/classic/charts-debug.js"></script>
    <!-- extjs.locale -->
    <script src="//cdn.bootcss.com/extjs/6.2.0/classic/locale/locale-zh_CN-debug.js"></script>

    <!-- 自定义 -->
    <script src="/resources/extjs/ext-expand-debug.js"></script>
    <!-- tinymce editor -->
    <script src="/resources/extjs/expand/TinyMCETextArea.js"></script>
    <script src="/resources/tinymce/tinymce.min.js"></script>
    <!-- kindeditor -->
    <script charset="utf-8" src="/resources/kindeditor/kindeditor-all-min.js"></script>
    <script charset="utf-8" src="/resources/kindeditor/lang/zh_CN.js"></script>
    <jsp:include page="_script.jspf"></jsp:include>

</head>
<body>
<script type="text/javascript">
    var _am = {
        currentUser: {
            id: "${user.id}",
            account: "${user.account}",
            name: "${user.name}",
            phone: "${user.phone}",
            mail: "${user.mail}",
            depict: "${user.depict}",
            status:"${user.status}"
        }
    }
</script>
<!-- 系统入口 -->
<script type="text/javascript" src="../../app/application.js"></script>
</body>
</html>