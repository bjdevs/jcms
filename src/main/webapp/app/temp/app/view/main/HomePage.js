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
            height: '25%',
            html: '<ul type="disc">' +
            '<li>20170707' +
                '<ol>' +
                    '<li>增加前台文章搜索功能</li>' +
                '</ol>' +
            '</li>' +
            '<li>20170705' +
                '<ol>' +
                    '<li>修复删除文章时，静态文件不能每次删除。</li>' +
                    '<li>修改分页 全部内容 的后缀为‘_all’</li>' +
                '</ol>' +
            '</li>' +
            '<li>20170703' +
                '<ol>' +
                    '<li>修复文章不能保存。</li>' +
                    '<li>修复文章列表在小屏幕不能显示标题内容。</li>' +
                    '<li>修改文章时增加连载可修改。</li>' +
                '</ol>' +
            '</li>' +
            '</ul>'
        }
    ]


});