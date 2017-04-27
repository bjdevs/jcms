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

            html: '<ul>' +
            '<li>（1）登录 -> 1个页面；</li>' +
            '<li>（2）首页 -> 1个页面；unfinished:查看文章</li>' +
            '<li>（3）账户资料（资料设置、密码修改）-> 2个页面；</li>' +
            '<li>（4）栏目维护（目录维护、新增目录、模板维护、标签维护）-> 4个页面；</li>' +
            '<li>（5）内容管理（新增新闻）-> 1个页面；</li>' +
            '<li>（6）内容管理（新闻法讯 -> 图片头条、新闻法讯 -> 栏目图片列表） -> 2个页面；</li>' +
            '<li>（7）系统安全（角色管理）-> 1个页面；</li>' +
            '</ul>'
        }
    ]


});