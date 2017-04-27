Ext.define('Admin.view.category.CategoryController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.category',

    module: 'category',

    url: 'Super Awesome',

    init: function () {
        console.log(this)
    },

    control: {

        'category-mgrid': {
            selectionchange: 'onSelectionChange',
            itemclick: 'onItemClick'
        },

        'category-mgrid button[action=add]': {
            click: 'onAddBtnClicked'
        },
        'category-mgrid button[action=save]': {
            click: 'onSaveBtnClicked'
        },
        'category-mgrid button[action=delete]': {
            click: 'onBtnClicked'
        },
        'category-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },

    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // category
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            categoryGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        if (count == 0) Ext.log('No selection');

        categoryGrid.down('button[action=save]').setDisabled(count < 1);
        categoryGrid.down('button[action=delete]').setDisabled(count < 1);
    },
    onItemClick: function (grid, record, item, index, e, eOpts) {
        var ctrl = this,
            view = ctrl.getView();

        var target = e.target;
        if (!target) return;

        var action = target.getAttribute('action'),
            id = record.get('id');

        switch (action) {
            case 'preview':

                alert('【' + id + '】' + target.getAttribute('title'));

                break;
            case 'add':

                //alert('【' + id + '】' + target.getAttribute('title'));


                var win = ctrl.lookupReference('category-mform');

                if (!win) {
                    win = Ext.create({
                        reference: 'category-mform',
                        xtype: 'category-mform'
                    });

                    view.add(win);
                }

                win.setTitle('新增子栏目');

                win.show();



                var form = win.down('form').getForm();
                form.findField('parentId').setValue(id);
                form.findField('parentPath').setValue(record.get('name')).setHidden(false);

                break;
            case 'headlineText':

                alert('【' + id + '】' + target.getAttribute('title'));

                break;
            case 'picture':

                alert('【' + id + '】' + target.getAttribute('title'));

                break;
            case 'article':

                alert('【' + id + '】' + target.getAttribute('title'));

                break;
        }


    },

    onAddBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();

        var win = ctrl.lookupReference('category-mform');

        if (!win) {
            win = Ext.create({
                reference: 'category-mform',
                xtype: 'category-mform'
            });

            view.add(win);
        }

        win.setTitle('新增');

        win.show();

        var form = win.down('form').getForm();
        form.findField('parentId').setValue('');
        form.findField('parentPath').setValue('').setHidden(true);
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

    onSubmitBtnClicked: function (button) {
        var ctrl = this,
            view = ctrl.getView();


        var form = view.down('form').getForm();

        ctrl.formSubmit(form, {
            url: 'data/ajax.json' // todo edit
        }, function (form, action) {
            Ext.ux.Msg.info('保存成功', function () {

                view.hide();

                var grid = view.up().down('category-mgrid'),
                    store = grid.getStore();

                store.getProxy().setExtraParam('page', 1);
                store.reload();

                grid.getSelectionModel().deselectAll();

            });
        });
    }
});
