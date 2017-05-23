Ext.define('Admin.view.content.headline.picture.PictureMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'content-headline-picture-mform',

    requires: [
        'Admin.view.content.headline.picture.PictureController'
    ],

    controller: 'content-headline-picture',

    maximized: true,// 默认最大化窗口
    maximizable: false, // 不支持放大 or 缩小
    // width: 1000,
    // height: 800,
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
                                    /*{
                                     xtype: 'filefield',
                                     fieldLabel: '标题图片',
                                     buttonText: '',
                                     buttonConfig: {
                                     iconCls: 'x-fa fa-file-image-o'
                                     }
                                     },*/
                                    {
                                        xtype: 'combobox',
                                        reference: 'media',
                                        publishes: 'value',
                                        fieldLabel: '选择图片',
                                        name: 'imageId',
                                        displayField: 'title',
                                        emptyText: '请选择图片',
                                        allowBlank: false,
                                        editable: false,
                                        valueField: 'id',
                                        anchor: '-15',
                                        store: {
                                            storeId: 'media',
                                            proxy: {
                                                type: 'ajax',
                                                url: '/cn/article/mediaImgList',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'rows'
                                                }
                                            },
                                            autoLoad: true
                                        },
                                        queryMode: 'local',
                                        listConfig: {
                                            itemTpl: [
                                                '<div data-qtip="{title}: {url}">{title} ({url})</div>'
                                            ]
                                        },
                                        listeners: {
                                            'select': function (filed) {
                                                var imgUrl = filed.lastSelectedRecords[0].data.url;
                                                var img = filed.up().query('[name=image]');
                                                img[0].getEl().dom.src = imgUrl;
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'container',
                                        height: 150,
                                        items: {
                                            // xtype: 'image',
                                            name: 'image',
                                            autoEl: {
                                                tag: 'image',    //指定为img标签
                                                src: 'resources/images/placeholder.jpg'    //指定url路径
                                            },
                                            // src: 'resources/images/placeholder.jpg',
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
                                                url: '/cn/article/categoryENameList',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'rows'
                                                }
                                            },
                                            autoLoad: true
                                        },
                                        displayField: 'eName',
                                        valueField: 'id',
                                        msgTarget: 'side'
                                    }
                                ]
                            }

                        ],
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
                ]
            }/*,
                {
                    region: 'south',
                    height: 250,
                    items: new Admin.view.workbench.WorkbenchMainGrid()
                }*/
            ]
        });

        me.callParent();
    }

});