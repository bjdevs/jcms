Ext.define('Admin.view.common.window.BaseWindow', {
    extend: 'Ext.window.Window',
    xtype:'basewindow',

    layout: 'fit',
    width: 500,
    bodyPadding: 5,


    modal: true,// 模态窗
    //plain: true, // 纯色效果-主要用于window
    closeAction: 'hide', // 关闭窗口动作
    closeToolText: '关闭窗口',
    constrain: true,// 固定在父view中
    constrainHeader: true, // 固定在浏览器内
    maximizable: true, // 支持放大 or 缩小
    resizable: false // 不支持手动更改窗口大小



});