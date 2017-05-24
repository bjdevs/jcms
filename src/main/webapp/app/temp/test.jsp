<%@ page import="com.core.domain.User" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    User user = (User) request.getAttribute("user");
    if (user != null && user.getId() > 0) {
        out.println("能获取到User对象");
    } else {
        out.println("无法获取到User对象");
    }
%>

