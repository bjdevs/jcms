Ext.define('Admin.view.publish.publishController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.publish',

    control: {
        'publish-mgrid button[action=publish]': {
            click: 'onClickBtnPublish'
        },
        'publish-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    }
});