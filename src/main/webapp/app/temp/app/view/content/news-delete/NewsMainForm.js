Ext.define('Admin.view.content.news.NewsMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'content-news-mform',

    controller: 'content-news',

    maximized: true,// 默认最大化窗口
    maximizable: false, // 不允许放大 or 缩小

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
                    fieldLabel: 'newsId',
                    hidden: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '文章标题',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

                    items: {
                        name: 'name',
                        allowBlank: false,
                        width: '50%'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '文章来源',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

                    items: {
                        name: 'name',
                        allowBlank: false,
                        width: '50%'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '作者',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

                    items: {
                        name: 'name',
                        allowBlank: false,
                        width: '50%'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '描述',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textarea',

                    items: [
                        {
                            name: 'name',
                            allowBlank: false,
                            minLength: 50,
                            maxLength: 200,
                            width: '50%'
                        },
                        {
                            xtype: 'tbtext',
                            userCls: 'x-fa fa-info-circle',
                            text: ' 50~200个字'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '标签',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

                    items: [
                        {

                            xtype: 'tagfield',
                            name: 'name',
                            store: {
                                proxy: {
                                    type: 'ajax',
                                    url: 'data/keywords.json',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'rows'
                                    }
                                },
                                autoLoad: true
                            },
                            displayField: 'name',
                            valueField: 'id',
                            queryMode: 'local', // 与autoLoad:true结合使用,避免手动输入标签时,下拉列表实时显示出来,影响操作
                            //minChars: 2,
                            //triggerAction: 'all',
                            //typeAhead: true,
                            createNewOnEnter: true,
                            createNewOnBlur: true,
                            filterPickList: true,
                            allowBlank: false,
                            width: '50%'
                        },
                        {
                            xtype: 'tbtext',
                            userCls: 'x-fa fa-info-circle',
                            text: '多选，可手动输入（回车或切换焦点即可创建），也可从标签库选择'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    beforeLabelTextTpl: '',
                    fieldLabel: '连载',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

                    items: {
                        xtype: 'combobox',

                        name: '',
                        store: {
                            proxy: {
                                type: 'ajax',
                                url: 'data/serals.json',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'rows'
                                }
                            }
                        },
                        displayField: 'title',
                        valueField: 'id',
                        queryMode: 'remote',
                        minChars: 1,
                        triggerAction: 'all',
                        typeAhead: true,
                        forceSelection: true,
                        emptyText: '请选择系列',
                        allowBlank: false,
                        width: '50%'
                    }
                },
                {
                    xtype: 'textarea',
                    itemId: 'content-area',
                    name: 'desc',
                    beforeLabelTextTpl: '',
                    width: '100%',
                    height: 460,
                    listeners: {
                        afterrender: function (self, eOpts) {
                            editor = KindEditor.create('#' + self.id, {
                                resizeType: 1,
                                allowPreviewEmoticons: false,
                                items: [
                                    'fontname', 'fontsize', '|',
                                    'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'removeformat', '|',
                                    'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', '|',
                                    'table', 'emoticons', 'image', 'link', '|',
                                    'quickformat', 'pagebreak', 'fullscreen'
                                ],
                                allowFileUpload: false,
                                uploadJson: "media/create", // todo edit
                                fillDescAfterUploadImage: true,
                                formatUploadUrl: false,
                                extraFileUploadParams: {
                                    type: 1
                                }
                            });
                        }
                    }
                }

            ],
            buttons: [
                {
                    text: '预览',
                    iconCls: 'x-fa fa-eye',
                    action: 'preview',
                    handler: 'onPreviewBtnClicked'
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