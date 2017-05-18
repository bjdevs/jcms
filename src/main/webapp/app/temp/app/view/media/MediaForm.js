Ext.define('Admin.view.media.MediaForm', {
    extend: 'Admin.view.common.window.BaseFormWindow',
    xtype: 'media-mform',

    controller: 'media',

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
                    name: 'title',
                    fieldLabel: '标题',
                    allowBlank: false

                },
                {
                    itemId: 'd-media-type',
                    name: 'type',
                    fieldLabel: '类型',
                    xtype: 'radiogroup',
                    hidden: false,
                    items: [
                        {inputValue: MEDIA_TYPE_PICTURE, boxLabel: '图片', checked: true},
                        {inputValue: MEDIA_TYPE_AUDIO, boxLabel: '音频'},
                        {inputValue: MEDIA_TYPE_DOCUMENT, boxLabel: '文档'}
                    ]
                },
                {
                    itemId: 'd-file-rule',
                    name: 'rule',
                    fieldLabel: '规则',
                    hidden: false,
                    xtype: 'radiogroup',
                    items: [
                        {inputValue: 0, boxLabel: '系统生成', checked: true,labelAlign : 'left'},
                        {inputValue: 1, boxLabel: '原始名称（覆盖）', labelAlign : 'left'}
                    ]
                },
                {
                    itemId: 'd-file-type',
                    xtype: 'fieldcontainer',
                    fieldLabel: '文件',
                    hidden: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'filefield',
                        name: 'imgFile',
                        allowBlank: false,
                        blankText: '请选择要上传的文件!',
                        msgTarget: 'side',
                        flex: 1,
                        validator: function (val) {
                            var mediaType,
                                regex,
                                fileRule;
                            mediaType = me.down('#d-media-type').getValue()['type'].toString();
                            if (mediaType == MEDIA_TYPE_PICTURE) {
                                regex = /^.+\.(jpg|jpeg|gif|png|bmp)$/;
                                if (!regex.test(val)) {
                                    return '不支持的图片类型，请上传jpg|jpeg|gif|png|bmp格式的图片';
                                }
                            }
                            if (mediaType == MEDIA_TYPE_AUDIO) {
                                regex = /^.+\.(mp3|wma)$/;
                                if (!regex.test(val)) {
                                    return '不支持的音频类型，请上传mp3|wma格式的音频文件';
                                }
                            }
                            if (mediaType == MEDIA_TYPE_DOCUMENT) {
                                regex = /^.+\.(txt|pdf|doc|docx|xls|xlsx)$/;
                                if (!regex.test(val)) {
                                    return '不支持的文档类型，请上传txt|pdf|doc|docx|xls|xlsx格式的文档文件';
                                }
                            }
                            fileRule = me.down('#d-file-rule').getValue()['rule'].toString();
                            if (fileRule == 1) {
                                regex = /(C:\\fakepath\\)+[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;
                                if (!regex.test(val)) {
                                    return '非法文件名，原始名称只能是半角状态下的字母、数字、下划线"_"、连接符"-"';
                                }
                            }
                            return true;
                        }
                    }]
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