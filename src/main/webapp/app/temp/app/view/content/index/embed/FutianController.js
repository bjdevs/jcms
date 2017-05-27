Ext.define('Admin.view.content.index.embed.FutianController', {
    extend: 'Admin.controller.ViewController',
    alias: 'controller.content-index-embed-futian',

    module: 'content-index-embed-futian',

    control: {
        'content-index-embed-futian button[action=edit]':{
            click: 'onClickedEdit'
        },
        'content-index-embed-futian button[action=release]':{
            click: 'onClickedRelease'
        },
        'content-index-embed-futian button[action=refresh]':{
            click: 'onClickedRefresh'
        }
    },

    onClickedRelease: function () {
        // 广种福田
        Ext.Ajax.request({
            method: 'POST',
            url: '/cn/article/create/embed',
            success: function (response) {
                var data = response.responseText;
                data = JSON.parse(data);
                if(data.success){
                    Ext.ux.Msg.info('发布成功', function () {
                    });
                }else{
                    Ext.ux.Msg.info('发布失败', function () {
                    });
                }
            }
        });
    },

    /**
     * 刷新
     * @param button
     */
    onClickedRefresh: function (button) {
        var grid = button.up().up().down('grid');
        var store = grid.getStore();
        store.reload();
    },

    /**
     * 保存
     * @param button
     */
    onClickedEdit: function (button) {
        var grid = button.up().up().down('grid'),
            form = button.up().up().down('form');

        var formDepict = form.query('[name=depict]')[0].value;
        var selectCount = grid.getSelection();
        if(selectCount.length == 0){
            selectCount = grid.setSelection(1, true).getSelection();
        }
        var selectData = selectCount[0].data;
        selectData.depict = formDepict;

        Ext.Ajax.request({
            url: '/cn/article/updateFutian',
            method: 'POST',
            waitMsg: '正在修改中，请等待片刻...',
            params: {
                depict: selectData.depict.trim(),
                use: selectData.use,
                bank: selectData.bank,
                user: selectData.user,
                card: selectData.card
            },
            success: function (response, opts) {
                console.log(response);
                var data = Ext.decode(response.responseText);
                var success = data.success;
                if (success){
                    Ext.MessageBox.show({
                        title: '操作提示',
                        closable: 'true',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        align: 'center',
                        message: '修改成功',
                        fn: function (buttonId) {
                            var store = grid.getStore();
                            store.reload();
                        }
                    });
                }
            }
        });


    }


});