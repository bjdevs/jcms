Ext.define('Admin.view.content.headline.text.TextMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'content-headline-text-mform',

    requires: [
        'Admin.view.content.headline.text.TextController'
    ],


    controller: 'content-headline-text',

    maximized: true,// 默认最大化窗口
    width: 1000,
    height: 800,
    layout: 'border',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [{
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                minHeight: 400,
                scrollable: true,
                items: [
                    {
                        xtype: 'form',
                        height: '100%',
                        defaults: {
                            defaults: {
                                labelWidth: 80,
                                labelAlign: 'right',
                                width: '50%'
                            }
                        },
                        bodyPadding: 10,
                        items: [
                            {
                                xtype: 'fieldcontainer',
                                fieldLabel: '',
                                layout: {
                                    type: 'hbox',
                                    align: 'stretchmax'
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '头条标题'
                                    },
                                    {
                                        xtype: 'displayfield',
                                        width: '30%',
                                        fieldLabel: '文章ID',
                                        value: '1001'
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                fieldLabel: '',
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        fieldLabel: '文章标题',
                                        value: 'Display Field'
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                items: [
                                    {
                                        xtype: 'filefield',
                                        fieldLabel: '标题图片'
                                    },
                                    {
                                        xtype: 'container',
                                        height: 150,
                                        width: '50%',
                                        fieldLabel: '',
                                        items: {
                                            xtype: 'image',
                                            src: 'resources/images/placeholder.jpg',
                                            height: 150,
                                            width: 300
                                        },
                                        style: {
                                            left: '80px'
                                        }

                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                fieldLabel: '',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        width: '50%',
                                        fieldLabel: '栏目名称'
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: 'fit',
                                width: '60%',
                                fieldLabel: '',
                                items: [
                                    {
                                        xtype: 'itemselector',
                                        width: '60%',
                                        height: 137,
                                        imagePath: '../ux/images/',
                                        buttons: [
                                            'add', 'remove'
                                        ],
                                        buttonsText: [
                                            '增加', '删除'
                                        ],
                                        store: {
                                            proxy: {
                                                type: 'ajax',
                                                url: 'data/categorys.json',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'rows'
                                                }
                                            },
                                            autoLoad: true
                                        },
                                        displayField: 'name',
                                        valueField: 'id',
                                        allowBlank: false,
                                        msgTarget: 'side'
                                    }
                                ]
                            }

                        ]
                    }
                ]
            },
                {
                    region: 'south',
                    height: 150,
                    items: new Admin.view.workbench.WorkbenchMainGrid()
                }
            ]
        });

        me.callParent();
    }

});