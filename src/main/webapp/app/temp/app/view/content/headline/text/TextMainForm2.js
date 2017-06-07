Ext.define('Admin.view.content.headline.text.TextMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'content-headline-text-mform',

    requires: [
        'Admin.view.content.headline.text.TextController'
    ],


    controller: 'content-headline-text',

    maximized: true,// 默认最大化窗口
    minWidth: 800,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },

                items: [
                    {
                        flex: 2,
                        region: 'center',
                        items: {

                            xtype: 'form',
                            scrollable: true,
                            style: {
                                marginBottom: 10
                            },
                            items: {
                                xtype: 'fieldcontainer',

                                layout: 'anchor',

                                defaults: {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'hbox',
                                        pack: 'start',
                                        align: 'stretch'
                                    },

                                    margin: '5 0 5 10',
                                    defaults: {
                                        anchor: '100%',
                                        labelWidth: 80,
                                        labelAlign: 'right',
                                        msgTarget: 'side',
                                        beforeLabelTextTpl: '<span class="admin-color-red">* </span>',
                                        width: 600
                                    },

                                    defaultType: 'textfield'
                                },
                                items: [
                                    {
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                reference: 'title',
                                                publishes: 'value',
                                                fieldLabel: '文章标题',
                                                name: 'title'
                                            },
                                            {
                                                xtype: 'displayfield',
                                                fieldLabel: '文章ID',
                                                name: 'id',
                                                width: 100
                                            }
                                        ]
                                    },
                                    {
                                        items: [
                                            {
                                                fieldLabel: '头条标题',
                                                name: 'topTitle',
                                                bind: {
                                                    value: '{title.value}'
                                                },
                                                allowBlank: false
                                            },
                                            {
                                                xtype: 'checkboxgroup',
                                                fieldLabel: '套红',
                                                items: [
                                                    {
                                                        name: 'redStatus',
                                                        inputValue: '1'
                                                    }
                                                ],
                                                width: 100
                                            }
                                        ]
                                    },
                                    {
                                        items: [
                                            {
                                                fieldLabel: '栏目名称',
                                                name: 'category',
                                                allowBlank: false
                                            }
                                        ]
                                    },
                                    {
                                        items: {
                                            xtype: 'itemselector',
                                            beforeLabelTextTpl: '',
                                            fieldLabel: '手工增加',
                                            name: 'itemselector',
                                            maxHeight: 200,
                                            scrollable: 'y',
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
                                    }

                                ]
                            },
                            tbar: [
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
                        }
                    },
                    {
                        region: 'south',
                        height: 300,
                        items: new Admin.view.keyword.KeywordMainGrid()
                    }
                ]
            }
        });

        me.callParent();
    }

});