Ext.define('Admin.view.log.LogController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.log',


    control: {
        'log-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'log-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        },

        'log-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    }
});
