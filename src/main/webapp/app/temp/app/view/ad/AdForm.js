Ext.define('Admin.view.ad.AdForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'ad-mform',

    controller: 'ad',

    width: 480,

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
                    name: 'name',
                    fieldLabel: '标题',
                    allowBlank: false
                },
                {
                    name: 'size',
                    fieldLabel: '尺寸',
                    allowBlank: false
                },
                {
                    name: 'url',
                    fieldLabel: '链接',
                    allowBlank: false
                },
                {
                    name: 'materialUrl',
                    fieldLabel: '素材',
                    allowBlank: false
                },
                {
                    name: 'uId',
                    hidden: true,
                    value: _am.currentUser.id
                },
                {
                    name: 'id',
                    hidden: true
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