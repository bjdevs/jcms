Ext.define('Admin.view.template.TemplateController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.template',

    module: 'template',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {

        'template-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'template-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'template-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'template-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'template-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // template
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            templateGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        // templateGrid.down('button[action=save]').setDisabled(count < 1);
        // templateGrid.down('button[action=delete]').setDisabled(count < 1);
    },

    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('template-mform');

        if (!win) {
            win = Ext.create({
                xtype: 'template-mform'
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
    }

});
