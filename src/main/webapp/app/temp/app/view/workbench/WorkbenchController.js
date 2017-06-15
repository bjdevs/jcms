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
        'workbench-mgrid button[action=update]': {
            click: 'onUpdateBtnClicked'
        },
        'workbench-mgrid button[action=release]': {
            click: 'onBtnClicked'
        },
        'workbench-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        }
    },
    onUpdateBtnClicked: function (button) {
        var grid = button.up().up(),
            tabPanel = button.up().up().up().up().up().down('contentPanel'),
            selected = grid.getSelection()[0];

        var tab = tabPanel.add({
            id: 'article-' + selected.id,
            title: selected.data.title,
            noRoute: true,
            xtype: 'main-panel-article',
            // html: selected.data.content

        });

        var objects;
        Ext.Ajax.request({
            url: '/cn/article/getArticleKeyWord',
            method: 'POST',
            async: false,
            params: {
                aId: selected.id
            },
            success: function (response) {
                var data = response.responseText;
                var json = JSON.parse(data);
                objects = json.rows;
                var ob = new Array();
                var ob1 = new Array();
                for (var i = 0; i < objects.length; i++) {
                    ob1 = [objects[i].name];
                    ob[i] = ob1;
                }
                objects = ob;
            }
        });
        selected.set("kId", objects);
        tab.getViewModel().data.article = selected;
        tabPanel.setActiveTab(tab);
    },
    onSelectionChange: function (model, selected, eOpts) {
        var ctrl = this,
            view = ctrl.getView(), // workbench
            viewModel = ctrl.getViewModel() || {};

        var module = ctrl['module'],
            workbenchGrid = view.down(module + ctrl.getSearchGridSuffix()),
            count = !selected ? 0 : selected.length;

        var auditBtn = true;
        var reworkBtn = true;
        var releaseBtn = false;

        if (count == 0) {
            Ext.log('No selection');
            auditBtn = true;
            reworkBtn = true;
            releaseBtn = false;
        } else {
            /*Ext.each(selected, function (item, index, allItems) {
             var status = item.data.status;
             console.log(status);
             if (status == 0 || status == 5) {
             auditBtn = false;
             } else{
             auditBtn = true;
             }
             console.log(auditBtn);
             });*/

            // auditBtn
            for (var i = 0; i < selected.length; i++) {
                var status = selected[i].data.status;
                if (status == 0 || status == 5) {
                    auditBtn = false;
                } else {
                    auditBtn = true;
                    break;
                }
            }

            // reworkBtn
            for (var i = 0; i < selected.length; i++) {
                var status = selected[i].data.status;
                if (status == 1 || status == 9) {
                    reworkBtn = false;
                } else {
                    reworkBtn = true;
                    break;
                }
            }

            // releaseBtn
            for (var i = 0; i < selected.length; i++) {
                var status = selected[i].data.status;
                if (status == 1) {
                    releaseBtn = false;
                } else {
                    releaseBtn = true;
                    break;
                }
            }

        }

        workbenchGrid.down('button[action=audit]').setDisabled(auditBtn);
        workbenchGrid.down('button[action=rework]').setDisabled(reworkBtn);
        workbenchGrid.down('button[action=move]').setDisabled(count < 1);
        workbenchGrid.down('button[action=delete]').setDisabled(count < 1);
        workbenchGrid.down('button[action=update]').setDisabled(count < 1);
        workbenchGrid.down('button[action=release]').setDisabled(releaseBtn);
    },

    onBtnClicked: function (button) {
        var ctrl = this,
            grid = button.up('grid');

        // todo edit
        ctrl.sendAjaxFromIds(button.action, button.text, grid, {
            url: '/cn/article/articleButton?' + button.action
        });
    }

});