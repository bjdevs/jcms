Ext.define('Admin.view.content.headline.HeadLineWindow', {
    extend: 'Admin.view.common.window.BaseWindow',
    xtype: 'headlinewindow',

    maximizable: false, // 支持放大 or 缩小
    maximized: true,// 默认最大化窗口
    border: false,

    initComponent: function () {

        var me = this,
            viewModel = me.getViewModel();


        var category = viewModel.get('category'),
            categoryName = viewModel.get('categoryName'),
            type = viewModel.get('type'),
            subItem = viewModel.get('subItem');


        switch (type) {
            case 'text':
                me.setTitle('【' + categoryName + '】栏目文字列表');
                break;
            case 'picture':
                me.setTitle('【' + categoryName + '】图片头条列表');
                break;
        }

        Ext.apply(me, {
            items: {
                xtype: subItem,
                viewModel: {
                    data: category
                }
            }


        });

        me.callParent();
    }
});