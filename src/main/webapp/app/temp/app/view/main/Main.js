Ext.define('Admin.view.main.Main', {
    extend: 'Ext.panel.Panel',

    plugins: ['viewport'],

    requires: [
        'Admin.view.main.MainController',
        'Admin.view.main.MainModel',
        'Admin.view.main.region.NavigationTree',
        //'Admin.view.thumbnails.Thumbnails',
        'Admin.view.main.region.ContentTabPanel'
    ],

    controller: 'main',
    viewModel: 'main',

    layout: 'border',

    border: false,


    icon: 'http://www.pconline.com.cn/favicon.ico',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            header: {
                baseCls: 'x-panel-body',
                border: false,
                height: 60,
                items: [
                    {
                        xtype: 'image',
                        src: 'http://www.hmlzs.cn/static/lzs/images/logo.png',
                        userCls: 'admin-header-logo'
                    },
                   /* {
                        xtype: 'label',
                        userCls: 'x-fa fa-refresh',
                        handler: function () {
                            console.log('log')
                        }
                    },*/
                  /*  {
                        xtype: 'tbtext',
                        userCls: 'x-fa fa-clock-o',
                        text: ' 2017-04-17 15:04:54'
                    },*/
                    {
                        xtype: 'tbtext',
                        userCls: 'x-fa fa-user',
                        bind: {
                            text: '{adminUser}，欢迎您 12345 ！'
                        }
                    },
                    {
                        xtype: 'tbtext',
                        userCls: 'x-fa fa-sign-out',
                        html: ' <a href="logout">退出</a>'

                    }
                ]
            },

            items: [
                {
                    region: 'west',
                    xtype: 'navigation-tree',
                    split: true
                },
                {
                    region: 'center',
                    xtype: 'contentPanel'
                }
            ]
        });

        me.callParent();
    }

});

