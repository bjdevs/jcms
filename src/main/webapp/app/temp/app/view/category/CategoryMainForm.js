Ext.define('Admin.view.category.CategoryMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'category-mform',

    controller: 'category',

    width: 520,

    initComponent: function () {
        var me = this;

        var form = Ext.create({
            xtype: 'form',

            layout: 'anchor',
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelAlign: 'right',
                msgTarget: 'side',
                beforeLabelTextTpl: '<span class="admin-color-red">* </span>'
            },

            defaultType: 'textfield',

            items: [
                {
                    fieldLabel: 'categoryId',
                    hidden: true
                },
                {
                    fieldLabel: 'parentId',
                    name: 'parentId',
                    hidden: true
                },
                {
                    xtype: 'displayfield',
                    name: 'parentPath',
                    fieldLabel: '父路径',
                    hidden: true
                },
                {
                    name: 'name',
                    fieldLabel: '目录名称',
                    allowBlank: false
                },
                {
                    name: 'ename',
                    fieldLabel: '路径英文',
                    allowBlank: false
                },
                {
                    xtype: 'textarea',
                    name: 'desc',
                    beforeLabelTextTpl: '',
                    fieldLabel: '目录描述'
                },
                {
                    xtype: 'textarea',
                    name: 'counter',
                    beforeLabelTextTpl: '',
                    fieldLabel: '计数器'
                }
            ],
            buttons: [
                {
                    text: '重置',
                    iconCls: 'x-fa fa-undo',
                    action: 'reset',
                    handler: 'onResetBtnClicked'
                },
                {
                    text: '提交',
                    iconCls: 'x-fa fa-floppy-o',
                    tooltip: '快捷键：Ctrl+Enter',
                    disabled: true,
                    formBind: true,  // 表单验证通过后才能点击
                    action: 'submit',
                    handler: 'onSubmitBtnClicked'
                }
            ]
        });


        Ext.apply(me, {
            items: form
        });

        me.callParent();
    }

});