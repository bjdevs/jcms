Ext.define('Admin.view.workbench.WorkbenchController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.workbench',

    module: 'workbench',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {
        'workbench-sp button[action=search]': {
            click: 'onSearchPanelQuery'
        },
        'workbench-sp button[action=reset]': {
            click: 'onSearchPanelReset'
        },

        'workbench-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'workbench-mgrid button[action=audit]': {
            click: 'onBtnClicked'
        },
        'workbench-mgrid button[action=rework]': {
            click: 'onBtnClicked'
        },
        'workbench-mgrid button[action=move]': {
            click: 'onBtnClicked'
        },
        'workbench-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'workbench-mgrid button[action=release]': {
            click: 'onBtnClicked'
        },
        'workbench-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // workbench
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            workbenchGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        workbenchGrid.down('button[action=audit]').setDisabled(count < 1);
        workbenchGrid.down('button[action=rework]').setDisabled(count < 1);
        workbenchGrid.down('button[action=move]').setDisabled(count < 1);
        workbenchGrid.down('button[action=delete]').setDisabled(count < 1);
        workbenchGrid.down('button[action=release]').setDisabled(count < 1);
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
