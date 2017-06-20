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
        border: false
    },

    viewModel: {
        data: {
            article: null
        }
    },

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            xtype: 'form',
            defaults: {
                anchor: '100%',
                labelAlign: 'right',
                msgTarget: 'side'
            },

            bodyPadding: 10,
            items: [
                {
                    xtype: 'displayfield',
                    itemId: 'd-title',
                    // hidden: true,
                    bind: '<strong>文章标题：</strong>{article.title}',
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '<strong>文章标题</strong>',
                    hidden: true,
                    style: 'position: absolute;top: 10px;left: -33px;',
                    itemId: 'v-title',
                    combineErrors: true,
                    defaultType: 'textfield',
                    items: {
                        name: 'title',
                        bind: '{article.title}',
                        allowBlank: false,
                        width: 300
                    }
                },
                {
                    xtype: 'displayfield',
                    name: 'id',
                    bind: '<strong>文章ID</strong>：{article.id}',
                },
                {
                    xtype: 'displayfield',
                    value: '',
                    // hidden: true,
                    itemId: 'd-keyWord',
                    colspan: 3,
                    listeners: {
                        beforerender: function (filed) {
                            var objects;
                            var id = filed.up().getViewModel().data.article.data.id;
                            Ext.Ajax.request({
                                method: 'POST',
                                url: '/cn/article/getArticleKeyWord?aId=' + id,
                            }).then(function (response) {
                                var data = response.responseText;
                                var json = JSON.parse(data);
                                objects = json.rows;
                                var ob = new Array();
                                var ob1 = new Array();
                                for (var i = 0; i < objects.length; i++) {
                                    ob1 = [objects[i].name];
                                    ob[i] = ob1;
                                }
                                objects = ob;
                                filed.setValue('<strong>标签：</strong>' + objects);
                            });
                        }
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '<strong>标签</strong>',
                    colspan: 3,
                    itemId: 'v-keyWord',
                    layout: 'hbox',
                    hidden: true,
                    publishes: 'value',

                    combineErrors: true,
                    defaultType: 'textfield',
                    // name: 'kId',
                    style: 'position: absolute;top: 10px;left: 49.5%;',
                    items: [
                        {
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
                },
                {
                    xtype: 'displayfield',
                    bind: '<strong>发布路径：</strong><a href="{article.url}" target="_blank">{article.url}</a>',
                    // colspan: 2
                },
                {
                    xtype: 'displayfield',
                    itemId: 'd-author',
                    bind: '<strong>作者：</strong>{article.author}',
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: '<strong>作者</strong>',
                    hidden: true,
                    style: 'position: absolute;left: 32.7%;top: 45px;',
                    itemId: 'v-author',
                    combineErrors: true,
                    defaultType: 'textfield',
                    items: {
                        name: 'author',
                        bind: '{article.author}',
                        allowBlank: false,
                        width: 150
                    }
                },
                {
                    xtype: 'displayfield',
                    bind: '<strong>录入人：</strong>{article.creator}',
                    colspan: 3
                },
                {
                    xtype: 'displayfield',
                    value: '<strong>简介：</strong>',
                    colspan: 5
                },
                {
                    xtype: 'displayfield',
                    bind: '{article.depict}',
                    itemId: 'd-depict',
                    colspan: 5
                },
                {
                    xtype: 'textarea',
                    bind: '{article.depict}',
                    itemId: 'v-depict',
                    name: 'depict',
                    colspan: 5,
                    hidden: true,
                    width: '100%'
                },
                {
                    xtype: 'displayfield',
                    value: '',
                    listeners: {
                        beforerender: function (filed) {
                            var status = filed.up().getViewModel().data.article.data.status;
                            var value = "";
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
                    bind: '<strong>创建于：</strong>{article.createDate}'
                },
                {
                    xtype: 'displayfield',
                    bind: '<strong>最后更新于：</strong>{article.updateDate}'
                },
                {
                    xtype: 'displayfield',
                    bind: '<strong>发布于：</strong>{article.publishDate}'
                },
                {
                    xtype: 'displayfield',
                    value: '',
                    listeners: {
                        beforerender: function (filed) {
                            var sId = filed.up().getViewModel().data.article.data.sId;
                            if (sId == 0) {
                                filed.setValue('<strong>连载：</strong>未连载');
                                return;
                            }
                            Ext.Ajax.request({
                                method: 'POST',
                                url: '/cn/serial/serialQueryForId?id=' + sId,
                            }).then(function (response, opts) {
                                var obj = Ext.decode(response.responseText);
                                filed.setValue('<strong>连载：</strong>' + obj.rows.name);
                            })
                        }
                    }
                },
                {
                    html: '<hr />',
                    border: false,
                    colspan: 5
                },
                {
                    xtype: 'displayfield',
                    bind: '{article.content}',
                    itemId: 'd-content',
                    colspan: 5
                },
                {
                    width: '100%',
                    height: 480,
                    colspan: 5,
                    border: 0,
                    itemId: 'v-content',
                    hidden: true,
                    name: 'content',
                    xtype: 'panel',
                    html: '<textarea id="content" style="width: 100%; height: 350px;"></textarea>',
                    listeners: {
                        afterrender: function (filed, eOpts) {
                            var content = filed.up().getViewModel().data.article.data.content;
                            // editor = KindEditor.create('#' + filed.id, {
                            window.editor = KindEditor.create('#content', {
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
                            window.editor.html(content);
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
                },
                /*{
                 xtype: 'button',
                 text: '审核',
                 iconCls: 'x-fa fa-check-circle-o',
                 action: 'audit'
                 },
                 {
                 xtype: 'button',
                 text: '返工',
                 iconCls: 'x-fa fa-undo',
                 action: 'rework'
                 },
                 {
                 xtype: 'button',
                 text: '发布',
                 iconCls: 'x-fa fa-paper-plane-o',
                 action: 'release'
                 },
                 {
                 xtype: 'button',
                 text: '删除',
                 iconCls: 'x-fa fa-trash-o',
                 action: 'delete'
                 }*/
            ]

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