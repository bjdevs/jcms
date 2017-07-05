Ext.define('Admin.view.content.ArticleUpdatePanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'main-panel-article',
    // layout: 'border',
    margin: 5,

    requires: [
        'Admin.view.content.ArticleUpdateController'
    ],

    controller: 'main-panel-article',

    layout: {
        type: 'table',
        columns: 5,
        tableAttrs: {
            style: {
                width: '100%'
            }
        }
    },

    scrollable: true,

    defaults: {
        bodyPadding: '8 10',
        border: false,
        closable: false
    },

    viewModel: {
        data: {
            article: null
        }
    },

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
            xtype: 'button',
            text: '取消',
            hidden: true,
            iconCls: 'x-fa fa-undo',
            action: 'cancel'
        },
        {
            xtype: 'button',
            text: '保存',
            hidden: true,
            iconCls: 'x-fa fa-floppy-o',
            action: 'save'
        },
        {
            xtype: 'button',
            text: '修改',
            iconCls: 'x-fa fa-pencil-square-o',
            action: 'update'
        }
    ],
    initComponent: function () {
        var me = this,
            vm = me.getViewModel();

        var form = {
            xtype: 'form',
            scrollable: 'y',
            // layout: 'form',
            defaults: {
                anchor: '100%',
                labelAlign: 'right',
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    hidden: true,
                    itemId: 'submit-field',
                    defaults: {
                        labelWidth: 75,
                        labelAlign: 'left'
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            margin: '0 0 5 0',
                            defaults: {
                                labelWidth: 75,
                                labelAlign: 'left',
                                margin: '0 10 0 0'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'title',
                                    bind: '{article.title}',
                                    fieldLabel: '<strong>文章标题</strong>',
                                    width: '40%'
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'id',
                                    fieldLabel: '<strong>文章ID</strong>',
                                    bind: '{article.id}',
                                    width: '20%'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: '<strong>标签</strong>',
                                    width: '40%',
                                    layout: 'hbox',
                                    publishes: 'value',

                                    combineErrors: true,
                                    defaultType: 'textfield',
                                    // name: 'kId',
                                    style: 'position: absolute;top: 10px;left: 49.5%;',
                                    items: [
                                        {
                                            width: '100%',
                                            xtype: 'tagfield',
                                            name: 'kId',
                                            bind: '{article.kId}',
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
                                            createNewOnEnter: true,
                                            createNewOnBlur: true,
                                            filterPickList: true,
                                            allowBlank: false,
                                            width: 350
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            margin: '0 0 5 0',
                            defaults: {
                                labelWidth: 75,
                                labelAlign: 'left',
                                margin: '0 10 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    name: 'url',
                                    fieldLabel: '<strong>发布路径</strong>',
                                    bind: '<a href="{article.url}" target="_blank">{article.url}</a>',
                                    width: '40%'

                                },
                                {
                                    xtype: 'textfield',
                                    name: 'author',
                                    fieldLabel: '<strong>作者</strong>',
                                    bind: '{article.author}',
                                    width: '20%'
                                },
                                {
                                    xtype: 'displayfield',
                                    name: 'creator',
                                    fieldLabel: '<strong>录入人</strong>',
                                    bind: '{article.creator}',
                                    width: '40%'
                                }
                            ]
                        },
                        {
                            xtype: 'textarea',
                            name: 'depict',
                            fieldLabel: '<strong>简介</strong>',
                            labelAlign: 'top',
                            bind: '{article.depict}',
                            width: '98%'

                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            margin: '0 0 5 0',
                            defaults: {
                                labelWidth: 75,
                                labelAlign: 'left',
                                margin: '0 30 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    // fieldLabel: '<strong>状态</strong>',
                                    // labelWidth: 35,
                                    width: '20%',
                                    bind: '{article.status}',
                                    margin: '0 100 0 0',
                                    listeners: {
                                        afterrender: function (filed) {
                                            var status = vm.get('article').get('status');
                                            var value = '';
                                            switch (status) {
                                                case 0:
                                                    value = '<span style="color:#0066FF">初稿</span>';
                                                    break;
                                                case 1:
                                                    value = '<span style="color: black">已签</span>';
                                                    break;
                                                case 5:
                                                    value = '<span style="color:#FF6633">返工</span>';
                                                    break;
                                                case 9:
                                                    value = '<span style="color:#7DB336">已发</span>';
                                                    break;
                                                default:
                                                    value = '<span style="color:red">异常</span>';
                                                    break;
                                            }
                                            filed.setValue('<strong>状态：</strong>' + value);
                                        }
                                    }

                                },

                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>创建于</strong>',
                                    labelWidth: 45,
                                    bind: '{article.createDate}'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>最后更新于</strong>',
                                    labelWidth: 75,
                                    bind: '{article.updateDate}'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>发布于</strong>',
                                    labelWidth: 45,
                                    bind: '{article.publishDate}'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    beforeLabelTextTpl: '',
                                    fieldLabel: '连载',
                                    labelWidth: 45,
                                    layout: 'hbox',
                                    combineErrors: true,
                                    defaultType: 'textfield',
                                    publishes: 'value',
                                    /*style: {
                                        "border": "1px solid red"
                                    },*/
                                    items: {
                                        xtype: 'combobox',
                                        name: 'sId',
                                        bind: '{article.sId}',
                                        /*style: {
                                            "border": "1px solid blue",
                                            "position": "absolute",
                                            "left": "35px"
                                        },*/
                                        store: {
                                            proxy: {
                                                type: 'ajax',
                                                url: '/cn/serial/serialQuery?status=5',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'rows'
                                                }
                                            },
                                            autoLoad: true
                                        },
                                        displayField: 'name',
                                        valueField: 'id',
                                        queryMode: 'remote',
                                        editable: false, // 不可编辑
                                        minChars: 1,
                                        triggerAction: 'all',
                                        // typeAhead: true, // 不启用组合编辑
                                        forceSelection: true,
                                        emptyText: '未连载',
                                        // allowBlank: false, // 允许空白
                                        // width: 100
                                    }
                                },
                            ]
                        },
                        {
                            xtype: 'kindEditorField',
                            name: 'content',
                            bind: '{article.content}',
                            width: '98%',
                            // height: 480,
                            // layout: 'fit',
                            border: false,
                            style: {
                                border: 'none'
                            },
                            listeners: {
                                render: function () {
                                    setTimeout(function () {   //有个加载次序的问题，需要延迟下 if(KindEditor){
                                        me.kindEditor = KindEditor.create('textarea[name="' + me.name + '"]', {
                                            // width: '95%',
                                            // height: 480,
                                            autoHeightMode: true,
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
                                            },
                                            afterCreate: function () {
                                                this.loadPlugin('autoheight');
                                            },
                                            afterChange: function () {
                                                me.value = this.html();
                                            }
                                        });
                                    }, 100);
                                },

                                afterrender: function (filed, eOpts) {

                                    KindEditor('#' + filed.id).hide();

                                    filed.triggerWrap.dom.style.border = 'none';
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    itemId: 'display-field',
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            margin: '0 0 5 0',
                            defaults: {
                                labelWidth: 60,
                                labelAlign: 'left',
                                margin: '0 10 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    bind: '{article.title}',
                                    fieldLabel: '<strong>文章标题</strong>',
                                    width: '40%'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>文章ID</strong>',
                                    bind: '{article.id}',
                                    width: '20%'
                                },
                                {
                                    xtype: 'displayfield',
                                    itemId: 'cName',
                                    fieldLabel: '<strong>标签</strong>',
                                    width: '40%',
                                    bind: '{article.cName}'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            margin: '0 0 5 0',
                            defaults: {
                                labelWidth: 60,
                                labelAlign: 'left',
                                margin: '0 10 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>发布路径</strong>',
                                    bind: '<a href="{article.url}" target="_blank">{article.url}</a>',
                                    width: '40%'

                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>作者</strong>',
                                    bind: '{article.author}',
                                    width: '20%'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>录入人</strong>',
                                    bind: '{article.creator}',
                                    width: '40%'
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: '<strong>简介</strong>',
                            labelAlign: 'top',
                            bind: '{article.depict}',
                            width: '97%'

                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaultType: 'textfield',
                            margin: '0 0 5 0',
                            defaults: {
                                labelWidth: 75,
                                labelAlign: 'left',
                                margin: '0 30 0 0'
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    // fieldLabel: '<strong>状态</strong>',
                                    // labelWidth: 35,
                                    width: '40%',
                                    bind: '{article.status}',
                                    // margin: '0 100 0 0',
                                    listeners: {
                                        afterrender: function (filed) {
                                            var status = vm.get('article').get('status');
                                            filed.setValue(status);
                                        }
                                    }

                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>创建于</strong>',
                                    labelWidth: 45,
                                    bind: '{article.createDate}'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>最后更新于</strong>',
                                    labelWidth: 75,
                                    bind: '{article.updateDate}'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>发布于</strong>',
                                    labelWidth: 45,
                                    bind: '{article.publishDate}'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: '<strong>连载</strong>',
                                    labelWidth: 45,
                                    itemId: 'sName',
                                    // labelWidth: 40,
                                    listeners: {
                                        afterrender: function (filed) {
                                            var sId = vm.get('article').get('sId');
                                            if (sId == 0) {
                                                filed.setValue('未连载');
                                                return false;
                                            }
                                            Ext.Ajax.request({
                                                method: 'POST',
                                                url: '/cn/serial/serialQueryForId?id=' + sId
                                            }).then(function (response, opts) {
                                                var obj = Ext.decode(response.responseText);
                                                filed.setValue(obj.rows.name);
                                            })
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'displayfield',
                            width: '98%',
                            style: {
                                'border-bottom': '1px solid #c2c2c2'
                            }
                        },
                        {
                            xtype: 'displayfield',
                            itemId: 'dis_content',
                            bind: '{article.content}',
                            width: '98%'
                        }
                    ]
                }
            ]
        };

        Ext.apply(me, {
            layout: 'fit',
            items: form,
            listeners: {
                beforeclose: function (tab, eOpts) {
                    // var grid = tab.up().down('content-mgrid');
                    // grid.getStore().reload();

                    // var ctrl = this;
                    // var view = ctrl.getView();
                    var id = location.hash;
                    if (id.indexOf('#') > -1) {
                        id = id.substring(1, id.length);
                    }
                    var grid = tab.up('contentPanel').getComponent('main-panel-' + id);
                    if (grid == null) {
                        grid = tab.up('contentPanel').getComponent('workbench').down('workbench-mgrid');
                    } else {
                        grid = grid.down('grid');
                    }
                    grid.getStore().reload();
                    grid.getSelectionModel().deselectAll();
                }
            }
        });

        me.callParent();
    },

    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var me = this,

            headerCt = me.getHeaderContainer(),
            column = headerCt.getHeaderAtIndex(colIndex),
            dataIndex = column.dataIndex;

        switch (dataIndex) {
            case 'status':
                switch (value) {
                    case 0:
                        metaData.tdStyle = 'color:#0066FF';
                        return '状态：初稿';
                    case 1:
                        metaData.tdStyle = 'color:blank';
                        return '状态：已签';
                    case 5:
                        metaData.tdStyle = 'color:#FF6633';
                        return '状态：返工';
                    case 9:
                        metaData.tdStyle = 'color:#7DB336';
                        return '状态：已发';
                    default:
                        metaData.tdStyle = 'color:red';
                        return value;
                }
            case 'hAId':
                if (value == 0) {
                    return '<button class="x-fa fa-flag admin-label-button admin-color-purple" action="set-text-headline"></button>';
                } else {
                    return '<button class="x-fa fa-flag admin-label-button admin-color-gray" action="cancel-text-headline"></button>';
                }
            case 'hPId':
                if (value == 0) {
                    return '<button class="x-fa fa-picture-o admin-label-button admin-color-purple" action="set-picture-headline"></button>';
                } else {
                    return '<button class="x-fa fa-picture-o admin-label-button admin-color-gray" action="cancel-picture-headline"></button>';
                }
            default:
                return value;
        }
    }
});