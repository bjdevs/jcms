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
                    emptyText: '广告标题',
                    allowBlank: false
                },
                {
                    name: 'location',
                    fieldLabel: '位置',
                    emptyText: '广告位置',
                    itemId: 'd-location',
                    xtype: 'combo',
                    /*store: [
                        ['hmlzs.home.banner1.left', 'hmlzs.home.banner1.left'],
                        ['hmlzs.home.banner1.right', 'hmlzs.home.banner1.right']
                    ],*/
                    store: {
                        proxy: {
                            type: 'ajax',
                            url: '/cn/admin/adlocation',
                            reader: {
                                type: 'json',
                                rootProperty: 'data'
                            }
                        },
                        fields: ['id', 'name']
                    },
                    displayField: 'name',
                    valueField: 'id',
                    editable: false, // 不允许编辑
                    listeners: {
                        "select": function(combo,record,index){
                            if (combo.getValue() == 'hmlzs.home.banner1.left') {
                                me.down('#d-size').setValue('912x100');
                            } else {
                                me.down('#d-size').setValue('240x100');
                            }
                        }
                    }
                },
                {
                    name: 'size',
                    fieldLabel: '尺寸',
                    emptyText: '广告尺寸',
                    itemId: 'd-size',
                    xtype: 'combo',
                    store: [
                        ['912x100', '912x100'],
                        ['240x100', '240x100']
                    ],
                    editable: false // 不允许编辑
                },
                {
                    name: 'url',
                    fieldLabel: '链接',
                    emptyText: '广告跳转链接地址',
                    allowBlank: false,
                    maxLength: 150,
                    maxLengthText: "链接不能超过150个字符"
                },
                {
                    name: 'materialUrl',
                    fieldLabel: '素材',
                    emptyText: '广告素材地址',
                    allowBlank: false,
                    maxLength: 150,
                    maxLengthText: "素材地址不能超过150个字符"
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