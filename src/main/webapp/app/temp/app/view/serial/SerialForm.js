Ext.define('Admin.view.serial.SerialForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'serial-mform',

    controller: 'serial',

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
                    fieldLabel: 'id',
                    name: 'id',
                    hidden: true
                },
                {
                    name: 'name',
                    fieldLabel: '连载名称',
                    allowBlank: false
                },
                {
                    xtype: 'textarea',
                    fieldLabel: '连载描述',
                    name: 'depict',
                    allowBlank: false
                },
                {
                    xtype: 'combobox',
                    fieldLabel: '目录模版',
                    name: 'tId',
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/cn/article/templateListForId?type=2',
                            reader: {
                                type: 'json',
                                rootProperty: 'rows'
                            }
                        }
                    },
                    displayField: 'name',
                    valueField: 'id',
                    queryMode: 'remote',
                    editable: false, // 不允许编辑
                    triggerAction: 'all',
                    forceSelection: true,
                    emptyText: '请选择',
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