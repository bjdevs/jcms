Ext.define('Admin.view.content.ArticleUpdateHandlePanel', {
    extend: 'Admin.view.common.panel.BaseSearchPanel',
    xtype: 'article-handle',

    initComponent: function () {
        var me = this;
        var defaults = me.subDefaults;

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
                    hidden: true
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '文章标题',

                    layout: 'hbox',
                    combineErrors: true,
                    defaultType: 'textfield',

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

                    items: {
                        xtype: 'combobox',

                        name: 'sId',
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
                        // allowBlank: false, // 允许空白
                        width: '50%'
                    }

                }

            ],
            buttons: [
                /*{
                 text: '预览',
                 iconCls: 'x-fa fa-eye',
                 action: 'preview',
                 disabled: true,
                 formBind: true,
                 handler: 'onPreviewBtnClicked'
                 },*/
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
            items: form,
        });

        me.callParent();
    }

});