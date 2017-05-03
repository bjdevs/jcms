Ext.define('Admin.view.auth.function.FunctionMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'auth-function-mform',

    controller: 'auth-function',

    maximizable: false,

    initComponent: function () {
        var me = this;

        var form = Ext.create({
            xtype: 'form',

            layout: 'anchor',
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                labelAlign: 'right',
                msgTarget: 'side',
                beforeLabelTextTpl: '<span class="admin-color-red">* </span>'
            },

            defaultType: 'textfield',

            items: [
                {
                    fieldLabel: 'ID',
                    name: 'id'
                },
                {
                    name: 'name',
                    fieldLabel: '名称',
                    allowBlank: false
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