Ext.define('Admin.view.auth.function.FunctionController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.auth-function',

    module: 'auth-function',

    url: 'Super Awesome',

    init: function() {
        console.log(this)
    },

    control: {

        'auth-function-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'auth-function-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'auth-function-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'auth-function-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function(model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // function
            viewModel = ctrl.getViewModel() || {};

        var functionGrid = view.down('auth-function-mgrid'),
            count = !selected ? 0 : selected.length;

        if(count == 0) Ext.log('No selection');

        functionGrid.down('button[action=save]').setDisabled(count !== 1);
    },

    onAddBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('auth-function-mform');

        if(!win) {
            win = Ext.create({
                reference: 'auth-function-mform',

                xtype: 'auth-function-mform'
            });

            view.add(win);
        }
        win.setTitle('新增');
        win.show();
    },
    onSaveBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromData(button.action, button.text, grid, {
            url: _ADMIN.root + '/auth-function/update.do'
        });
    },

    onSubmitBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();


        var form = view.down('form').getForm();

        ctrl.formSubmit(form, {
            url: _ADMIN.root + '/auth-function/create.do'
        }, function(form, action) {
            Ext.ux.Msg.info('保存成功', function() {

                view.hide();

                var grid = view.up().down('auth-function-mgrid'),
                    store = grid.getStore();

                store.getProxy().setExtraParam('page', 1);
                store.reload();

                grid.getSelectionModel().deselectAll();

            });
        });
    }


});
