Ext.define('Admin.view.main.region.ContentTabPanel', {
    extend: 'Ext.tab.Panel',
    xtype: 'contentPanel',

    id: 'content-tabpanel',

    viewModel: {
        type: 'main'
    },

    //scrollable: true,

    header: {
        hidden: true
    },

    defaults: {
        closable: true, // 可操作关闭
        closeAction: 'destory' // 点击"关闭"进行销毁,

    },
    plugins: [
        Ext.create('Ext.ux.TabCloseMenu')
    ],

    items: {
        title: '工作台',
        id: 'workbench',
        iconCls: 'x-fa fa-home',
        closable: false,
        scrollable: 'y',
        xtype: 'workbench'
    }
});
