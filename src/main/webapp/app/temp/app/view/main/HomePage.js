Ext.define('Admin.view.main.HomePage', {
    extend: 'Ext.container.Container',
    xtype: 'homepage',

    requires: [
        'Ext.ux.layout.ResponsiveColumn',

        //'Admin.data.Simulated',
        //'Admin.data.SysUpdateLog',
        //'Admin.view.log.update.Timeline'
    ],

    layout: 'responsivecolumn',

    //cls: 'userProfile-container',

    items: [
        {
            xtype: 'panel',
            title: '更新日志',

            html: '<ul type="disc">' +
            '<li>20170703</li>' +
                '<ol>' +
                    '<li>修复文章不能保存。</li>' +
                    '<li>修复文章列表在小屏幕不能显示标题内容。</li>' +
                    '<li>修改文章时增加连载可修改。</li>' +
                '</ol>' +
            '</ul>'
        }
    ]


});