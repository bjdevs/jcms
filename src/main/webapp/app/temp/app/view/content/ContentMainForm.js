Ext.define('Admin.view.content.ContentMainForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'content-mform',

    controller: 'content',

    maximized: true,// 默认最大化窗口
    maximizable: false, // 不允许放大 or 缩小

    viewModel: {
        data: {
            article: null
        }
    },

    initComponent: function () {
        var me = this;
        var contentId = 'content-area-' + me.id + new Date().getTime();

        var form = Ext.create({
            xtype: 'form',

            // layout: 'anchor',
            bodyPadding: 10,
            defaults: {
                anchor: '100%',
                labelAlign: 'right',
                msgTarget: 'side',
                beforeLabelTextTpl: '<span class="admin-color-red">* </span>'
            },

            defaultType: 'textfield',
            height: '100%',
            items: [
                {
                    fieldLabel: 'newsId',
                    name: 'id',
                    bind: '{article.id}',
                    hidden: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '文章标题',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',
                    // bind: '{article.title}',
                    items: {
                        name: 'title',

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
                    beforeLabelTextTpl: '',

                    items: {
                        name: 'source',
                        // allowBlank: false,
                        width: '50%',
                        emptyText: '黄梅老祖寺'
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '作者',

                    name: 'authors',
                    beforeLabelTextTpl: '',
                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

                    items: {
                        name: 'author',
                        // allowBlank: false,
                        emptyText: _am.currentUser.name,
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
                            name: 'depict',
                            allowBlank: false,
                            minLength: 5,
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
                    name: 'kId',
                    // value: [],

                    items: [
                        {
                            xtype: 'tagfield',
                            name: 'kId',
                            store: {
                                proxy: {
                                    type: 'ajax',
                                    url: '/cn/article/getKeyWord',
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
                    publishes: 'value',

                    items: {
                        xtype: 'combobox',
                        name: 'sId',
                        store: {
                            proxy: {
                                type: 'ajax',
                                url: '/cn/serial/serialQuery?status=5',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'rows'
                                }
                            }
                        },
                        displayField: 'name',
                        valueField: 'id',
                        queryMode: 'remote',
                        editable: false, // 不可编辑
                        minChars: 1,
                        triggerAction: 'all',
                        // typeAhead: true, // 不启用组合编辑
                        forceSelection: true,
                        emptyText: '请选择系列',
                        // allowBlank: false, // 允许空白
                        width: '50%'
                    }
                },
                {
                    width: '100%',
                    height: 480,
                    border: 0,
                    name: 'content',
                    // anchor: '100% 100%',
                    xtype: 'panel',
                    html: '<textarea id=' + contentId + ' style="width: 100%; height: 350px;"></textarea><script>document.getElementById("#content-area").val("")</script>',
                    listeners: {
                        afterrender: function (self, eOpts) {
                            // editor = KindEditor.create('#' + self.id, {
                            editor = KindEditor.create('#' + contentId, {
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
                                uploadJson: "/cn/admin/mediaCreate", // todo edit
                                fillDescAfterUploadImage: true,
                                formatUploadUrl: false,
                                extraFileUploadParams: {
                                    type: 1,
                                    rule: 0
                                }
                            });
                        }
                    }
                }

            ],
            tbar: [
                '->',
                {
                    text: '关闭',
                    iconCls: 'x-fa fa-times',
                    name: 'content-btn-close',
                    action: 'close',
                    handler: 'onCloseBtnClicked'
                },
                {
                    text: '提交',
                    iconCls: 'x-fa fa-floppy-o',
                    name: 'content-btn',
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