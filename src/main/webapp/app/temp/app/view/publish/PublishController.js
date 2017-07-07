Ext.define('Admin.view.publish.publishController', {
    extend: 'Admin.controller.ViewController',

    alias: 'controller.publish',

    control: {
        'publish-mgrid button[action=publish]': {
            click: 'onClickBtnPublish'
        },
        'publish-mgrid button[action=refresh]': {
            click: 'onRefreshBtnClicked'
        },
        'publish-mgrid button[action=redirect]': {
            click: 'onRedirectBtnClicked'
        }
        ,'publish-mgrid button[action=rebuildallpublishindex]': {
            click: 'onReBuildALLPublishIndexBtnClicked'
        }
    },

    onRedirectBtnClicked: function () {
        window.open("http://www.hmlzs.cn");
    },

    onReBuildALLPublishIndexBtnClicked: function (button) {
        var grid = button.up().up().up().down('grid');
        Ext.Ajax.request({
            url: '/cn/admin/reBuildALLPublishIndex',
            method: 'POST',
            waitMsg: '正在重建所有已发文章索引，请稍候...',
            success: function (response) {
                var data = JSON.parse(response.responseText);
                console.log(data);
                if (data.success) {
                    if (data.result == 'true') {
                        Ext.ux.Msg.info('重建所有已发文章索引完成', function () {
                            grid.getStore().reload();
                            grid.getSelectionModel().deselectAll();
                        });
                    } else {
                        Ext.Msg.alert("重建索引失败", data.message).setIcon(Ext.Msg.WARNING);
                    }
                } else {
                    Ext.ux.Msg.info('发布失败，请稍候再试...', function () {
                        grid.getStore().reload();
                        grid.getSelectionModel().deselectAll();
                    });
                }
            }
        });
    }
});