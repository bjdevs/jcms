Ext.define('Ext.ux.form.KindEditorField', {
    extend: 'Ext.form.field.TextArea',
    xtype: 'kindEditorField',
    initComponent: function() {
        var me = this;

        Ext.apply(this, {
            listeners: {
                render: function() {
                    setTimeout(function() {   //有个加载次序的问题，需要延迟下 if(KindEditor){
                        me.kindEditor = KindEditor.create('textarea[name="' + me.name + '"]', {
                            width: '100%',
                            minHeight: 300,
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
                }
            }
        });

        me.callParent();
    },
    setValue: function(value) {
        var me = this;
        me.value = value;

        if(!me.kindEditor) {
            setTimeout(function() {
                me.kindEditor.html(value);
            }, 200);
        } else {
            me.kindEditor.html(value);
        }
    },
    getValue: function() {
        var me = this;
        return me.value;
    }
});