Ext.define('Admin.view.common.window.BaseFormWindow', {
    extend: 'Ext.window.Window',

    title: '新增',
    iconCls: 'x-fa fa-floppy-o',
    width: 400,
    layout: 'fit',

    modal: true,// 模态窗
    closeAction: 'hide', // 关闭窗口动作
    closeToolText: '关闭窗口',
    constrain: true,// 固定在父view中
    constrainHeader: true, // 固定在浏览器内
    maximizable: true, // 支持放大 or 缩小
    resizable: false, // 不支持手动更改窗口大小
    border: false,

    keyMap: {
        'CTRL+ENTER': 'onSubmitBtnClicked',
        scope: 'controller'
    },

    listeners: {
        /*beforeshow: function () {
            this.down('form').getForm().reset();
        },*/
        beforeclose: function () {
            this.down('form').getForm().reset();
        }
    }


});