Ext.define('Admin.view.keyword.KeyWordForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',

    xtype: 'keyword-mform',

    controller: 'keyword',

    initComponent: function () {
        var me = this;

        var form = Ext.create({
            xtype: 'form',
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
                    xtype: 'fieldcontainer',
                    fieldLabel: '名称',
                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

                    items: {
                        name: 'name',
                        allowBlank: false,
                        emptyText: '',
                        width: '80%'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '描述',
                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',
                    beforeLabelTextTpl: '',
                    items: {
                        name: 'depict',
                        // allowBlank: false,
                        emptyText: '',
                        width: '80%'
                    }
                }
            ],
            buttons: [
                {
                    text: '重置',
                    iconCls: 'x-fa fa-eye',
                    action: 'preview',
                    handler: 'onResetBtnClicked'
                },
                {
                    text: '提交',
                    iconCls: 'x-fa fa-floppy-o',
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