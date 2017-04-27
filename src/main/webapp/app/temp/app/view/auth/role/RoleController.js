Ext.define('Admin.view.auth.role.RoleController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.auth-role',

    module: 'auth-role',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {

        'auth-role-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'auth-role-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'auth-role-mgrid button[action=edit]': {
            click: 'onEditBtnClicked'
        },
        'auth-role-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // role
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            roleGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        roleGrid.down('button[action=edit]').setDisabled(count !== 1);
    },

    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('auth-role-mform');

        if (!win) {
            win = Ext.create({
                xtype: 'auth-role-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');
        win.show();
    },
    onEditBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('auth-role-mform');

        if (!win) {
            win = Ext.create({
                xtype: 'auth-role-mform'
            });

            view.add(win);
        }


        win.setTitle('修改');
        win.show();

        // render
        var grid = view.down('auth-role-mgrid'),
            record = grid.getSelection()[0];

        win.down('form').getForm().loadRecord(record);
    },

    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();


        var form = view.down('form').getForm();

        ctrl.formSubmit(form, {
            url: 'data/ajax.json' // todo edit
        }, function (form, action) {
            Ext.ux.Msg.info('保存成功', function () {

                view.hide();

                var grid = view.up().down('auth-role-mgrid'),
                    store = grid.getStore();

                store.getProxy().setExtraParam('page', 1);
                store.reload();

                grid.getSelectionModel().deselectAll();

            });
        });
    }


});
