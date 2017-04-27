Ext.define('Admin.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    data: {
        ename: 'hmlzs',
        cname: '老祖寺后台',

        adminUser: _am.currentUser.name,

        currentView: null
    }
});
