Ext.define('Admin.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',


    onMainViewRender: function() {
        var params = Ext.Object.fromQueryString(location.search),
            ref = params['ref'] || '',
            module = params['module'] || '';

        this.redirectTo(module);


    }
});
