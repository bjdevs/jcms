Ext.define('Admin.view.log.LogController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.log',

    module: 'log',

    url: 'Super Awesome',

    init: function() {
        console.log(this)
    },

    control: {
        'log-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'log-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        },

        'log-mgrid': {
            itemclick: 'onItemClick'
        },

        'log-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onItemClick: function(grid, record, item, index, e, eOpts) {
        var ctrl = this,
            view = ctrl.getView();

        var target = e.target;
        if(!target) return;

        var action = target.getAttribute('action');


        switch(action) {
            case 'show-json':
                var returnStr = JSON.stringify(record.get('logDetail'));

                /* var win = ctrl.lookupReference('json-editoronline-win');
                 if(!win) {
                 win = Ext.create({
                 reference: 'json-editoronline-win',
                 xtype: 'basewindow',
                 maximized: true,// 默认最大化窗口
                 maximizable: false, // 不允许放大 or 缩小

                 items: {
                 xtype: 'uxiframe'/!*,
                 src: 'http://jsoneditoronline.org/?json=' + encodeURIComponent(returnStr)*!/
                 }
                 });

                 view.add(win);
                 }

                 win.setTitle('日志ID：' + record.get('operateLogId'));
                 win.down('uxiframe').setConfig('src', 'http://jsoneditoronline.org/?json=' + encodeURIComponent(returnStr)+'#/new');
                 win.show();*/

                window.open('http://jsoneditoronline.org/?json=' + encodeURIComponent(returnStr));

                break;
        }

    },

    onBtnClicked: function(button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    }

});
