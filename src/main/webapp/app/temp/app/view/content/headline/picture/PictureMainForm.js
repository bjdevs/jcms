Ext.define('Admin.view.content.headline.picture.PictureMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'content-headline-picture-mform',

    requires: [
        'Admin.view.content.headline.picture.PictureController'
    ],

    controller: 'content-headline-picture',

    maximized: true,// 默认最大化窗口
    maximizable: false, // 不支持放大 or 缩小
    width: 1000,
    height: 800,
    layout: 'border',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [{
                xtype: 'panel',
                region: 'center',
                layout: 'form',
                minHeight: 400,
                border: false,
                scrollable: 'y',
                items: [
                    {
                        border: false,
                        xtype: 'form',
                        height: '100%',
                        defaults: {
                            xtype: 'fieldcontainer',
                            defaults: {
                                labelWidth: 80,
                                labelAlign: 'right',
                                width: '50%'
                            }
                        },
                        bodyPadding: 10,
                        items: [
                            {

                                layout: {
                                    type: 'hbox',
                                    align: 'stretchmax'
                                },
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        fieldLabel: '文章标题',
                                        reference: 'title',
                                        publishes: 'value',
                                        name: 'title'
                                    },
                                    {
                                        xtype: 'displayfield',
                                        fieldLabel: '文章ID',
                                        name: 'id',
                                        width: '30%'
                                    }
                                ]
                            },
                            {
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '头条标题',
                                        name: 'topTitle',
                                        allowBlank: false,
                                        bind: {
                                            value: '{title.value}'
                                        }
                                    }
                                ]
                            },
                            {
                                items: [
                                    {
                                        xtype: 'filefield',
                                        fieldLabel: '标题图片',
                                        buttonText: '',
                                        buttonConfig: {
                                            iconCls: 'x-fa fa-file-image-o'
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        height: 150,
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
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: '栏目名称',
                                        name: 'category',
                                        allowBlank: false,
                                        width: '50%'
                                    }
                                ]
                            },

                            {
                                layout: 'fit',
                                width: 595,
                                style: {
                                    left: '85px'
                                },
                                items: [
                                    {
                                        xtype: 'itemselector',
                                        name: 'category',
                                        height: 160,
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
                    height: 250,
                    items: new Admin.view.workbench.WorkbenchMainGrid()
                }
            ]
        });

        me.callParent();
    }

});