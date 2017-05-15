Ext.Loader.setConfig({
    enabled: true, // 是否启动动态依赖加载,默认开启
    disableCaching: true // 启用脚本文件缓存
});


Ext.QuickTips.init();

Ext.application({
    name: 'Admin',

    requires: [
        'Ext.app.*',
        'Ext.chart.*'
    ],

    controllers: [
        'AppController'
    ],
    views: [
        // common
        'common.window.BaseWindow',
        'common.window.BaseFormWindow',
        'common.panel.BaseGridPanel',
        'common.panel.BaseSearchPanel',
        'common.charts.BaseChart',

        'login.Login',

        'main.Main',

        // 工作台
        'workbench.Workbench',

        // 内容管理
        'content.index.nav.Nav',
        //'content.news.News',
        'content.Content',
        'content.recycle.Recycle',


        // 栏目维护
        'category.Category',
        'template.Template',
        'keyword.Keyword',

        // 媒体管理
        'media.Media',

        // 帐户资料
        'account.AccountEditSetting',
        'account.AccountEditPwd',

        // 系统安全
        'auth.role.Role',
        'log.Log',

        // 欢迎页
        'main.HomePage'
    ],
    stores: [
        'Navigation'
    ],


    defaultToken: '',

    //mainView: 'Admin.view.main.Main',

    launch: function () {
        Ext.create('Admin.store.Navigation', {
            storeId: 'navigation'
        });

        var view = 'Admin.view.main.Main';
        if (!_am.currentUser.name) {
            view = 'Admin.view.auth.login.Login';

            Ext.create(view);

        } else {
            this.setMainView({
                xclass: view
            });
        }

    },
    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});