Ext.define('Admin.view.keyword.KeywordController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.keyword',

    module: 'keyword',

    url: 'Super Awesome',

    control: {

        'keyword-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'keyword-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'keyword-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'keyword-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'keyword-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'hotkeyword-grid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // keyword
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            keywordGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        keywordGrid.down('button[action=save]').setDisabled(count < 1);
        keywordGrid.down('button[action=delete]').setDisabled(count < 1);
    },

    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('keyword-mform');

        if (!win) {
            win = Ext.create({
                xtype: 'keyword-mform'
            });

            view.add(win);
        }

        win.show();
    },

    onSaveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: 'data/ajax.json?' + button.action
        });
    },

});
