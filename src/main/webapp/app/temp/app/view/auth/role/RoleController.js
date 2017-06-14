Ext.define('Admin.view.auth.role.RoleController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.auth-role',

    module: 'auth-role',

    url: 'Super Awesome',

    init: function() {
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
        },
        'auth-role-mgrid button[action=delete]': {
            click: 'onDeleteBtnClicked'
        }
    },

    onSelectionChange: function(model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // role
            viewModel = ctrl.getViewModel() || {};

        var roleGrid = view.down('auth-role-mgrid'),
            count = !selected ? 0 : selected.length;

        if(count == 0) Ext.log('No selection');

        roleGrid.down('button[action=edit]').setDisabled(count !== 1);
        roleGrid.down('button[action=delete]').setDisabled(count < 1);
    },

    onAddBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('auth-role-mform');

        if(!win) {
            win = Ext.create({
                reference: 'auth-role-mform',

                xtype: 'auth-role-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');
        win.show();
    },
    onEditBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('auth-role-mform');

        if(!win) {
            win = Ext.create({
                reference: 'auth-role-mform',

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

    onSubmitBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();


        var form = view.down('form').getForm(),

            id = form.findField('id').getValue(),
            submitUrl = id ? 'update.do' : 'create.do';


        ctrl.formSubmit(form, {
            url: '/cn/admin/authRoleUpdate'
        }, function(form, action) {
            Ext.ux.Msg.info('保存成功', function() {

                view.hide();

                var grid = view.up().down('auth-role-mgrid'),
                    store = grid.getStore();

                store.getProxy().setExtraParam('page', 1);
                store.reload();

                grid.getSelectionModel().deselectAll();

            });
        });
    },

    onDeleteBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/admin/authRoleFunctionDelete'
        });
    }
});
