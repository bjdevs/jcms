Ext.define('Admin.view.common.window.MoveWindow', {
    extend: 'Ext.window.Window',
    xtype: 'move-window',

    reference: 'moveWindow',

    layout: 'fit',
    width: 300,
    height: 250,

    scrollable: true,
    bodyPadding: 10,
    title: '请选择目标分类',
    modal: true,// 模态窗
    closeAction: 'hide', // 关闭窗口动作
    closeToolText: '关闭窗口',
    constrain: true,// 固定在父view中
    constrainHeader: true, // 固定在浏览器内
    resizable: false // 不支持手动更改窗口大小
});