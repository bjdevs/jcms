Ext.define('Admin.view.auth.acl.AclController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.auth-acl',

    module: 'auth-acl',

    url: 'Super Awesome',

    init: function() {
        console.log(this)
    },

    control: {

        'auth-acl-mgrid': {
            selectionchange: 'onSelectionChange'
        },

        'auth-acl-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'auth-acl-mgrid button[action=edit]': {
            click: 'onEditBtnClicked'
        },
        'auth-acl-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function(model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // acl
            viewModel = ctrl.getViewModel() || {};

        var aclGrid = view.down('auth-acl-mgrid'),
            count = !selected ? 0 : selected.length;

        if(count == 0) Ext.log('No selection');

        aclGrid.down('button[action=edit]').setDisabled(count !== 1);
    },

    onAddBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('auth-acl-mform');

        if(!win) {
            win = Ext.create({
                reference: 'auth-acl-mform',

                xtype: 'auth-acl-mform'
            });

            view.add(win);
        }

        var form = win.down('form').getForm();
        form.findField('department').setHidden(true);
        form.findField('name').setHidden(true);
        win.down('#form-userInfo').setHidden(false);

        win.setTitle('新增');
        win.show();
    },
    onEditBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('auth-acl-mform');

        if(!win) {
            win = Ext.create({
                reference: 'auth-acl-mform',

                xtype: 'auth-acl-mform'
            });

            view.add(win);
        }

        var form = win.down('form').getForm();
        form.findField('department').setHidden(false);
        form.findField('name').setHidden(false);
        win.down('#form-userInfo').setHidden(true);


        win.setTitle('修改');
        win.show();

        // render
        var grid = view.down('auth-acl-mgrid'),
            record = grid.getSelection()[0];

        win.down('form').getForm().loadRecord(record);
    },

    onResetBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();

        view.down('form').getForm().reset();
        view.down('#form-grid-userInfo').getStore().removeAll();
    },
    onSubmitBtnClicked: function(button) {
        var ctrl = this,
            view = ctrl.getView();


        var formPanel = view.down('form'),
            form = formPanel.getForm(),

            roleId = form.findField('id').getValue(),
            submitUrl = 'update.do',


            userInfo_ids = [], role_ids = [],
            callback = function() {

            };


        if(!roleId) {

            submitUrl = 'create.do';

            var userInfoStore = formPanel.down('#form-grid-userInfo').getStore();
            userInfoStore.each(function(record) {
                userInfo_ids.push(record.get('value'));
            });

            if(userInfo_ids.length == 0) {
                Ext.Msg.alert('请添加权限用户');
                return;
            }

            callback = function() {
                userInfoStore.removeAll();
            }

        }


        ctrl.formSubmit(form, {
            url: _ADMIN.root + '/auth-acl/' + submitUrl,
            params: {
                userInfo_ids: userInfo_ids.join(',')
            }
        }, function(form, action) {
            Ext.ux.Msg.info('保存成功', function() {

                view.hide();

                var grid = view.up().down('auth-acl-mgrid'),
                    store = grid.getStore();

                store.getProxy().setExtraParam('page', 1);
                store.reload();

                grid.getSelectionModel().deselectAll();

                callback();
            });
        });
    },

    onDeleteUserInfoBtnByFormClicked: function(button, e) {
        var ctrl = this;

        var userInfoForm = ctrl.getView().down('#form-grid-userInfo'),
            userInfoFormStore = userInfoForm.getStore(),
            selection = userInfoForm.getSelection();

        for(var i = 0; i < selection.length; i++) {
            for(var j = 0; j < userInfoFormStore.getCount(); j++) {
                if(userInfoFormStore.getAt(j).get('id') == selection[i].get('id')) {
                    userInfoFormStore.removeAt(j);
                    break;
                }
            }
        }
    }


});
