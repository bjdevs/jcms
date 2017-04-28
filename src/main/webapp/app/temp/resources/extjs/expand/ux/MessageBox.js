Ext.define('Ext.ux.Msg', {
    extend: 'Ext.window.MessageBox',

    config: {
        title: '提示'
    },

    alert: function(msg, callback) {
        this.show({
            title: this.getTitle(),
            message: msg,
            buttons: this.OK,
            fn: callback
        });
    },
    info: function(msg, title, callback) {
        if(typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.INFO,
            fn: callback
        });
    },
    warning: function(msg, title, callback) {
        if(typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.WARNING,
            fn: callback
        });
    },
    question: function(msg, title, callback) {
        if(typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.QUESTION,
            fn: callback
        });
    },
    error: function(msg, title, callback) {
        if(typeof  title === 'function') {
            callback = title;
            title = '';
        }
        this.show({
            title: title || this.getTitle(),
            message: msg,
            buttons: this.OK,
            icon: this.ERROR,
            fn: callback
        });
    }

}, function(Msg) {
    Ext.onInternalReady(function() {
        Ext.ux.Msg = new Msg();
    });
});