Ext.define('classic.expand.overrides.data.proxy.Ajax', {
    override: 'Ext.data.proxy.Ajax',

    config: {
        simpleFilterMode: true,// 组合filters普通参数
        pagination: true // 默认分页
    },

    getParams: function(operation) {
        if(!operation.isReadOperation) {
            return {};
        }

        var me = this,
            params = {},
            grouper = operation.getGrouper(),
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit(),
            pagination = me.getPagination(),
            simpleFilterMode = me.getSimpleFilterMode(),
            simpleSortMode = me.getSimpleSortMode(),
            simpleGroupMode = me.getSimpleGroupMode(),
            pageParam = me.getPageParam(),
            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            groupParam = me.getGroupParam(),
            groupDirectionParam = me.getGroupDirectionParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam(),
            directionParam = me.getDirectionParam(),
            hasGroups, index;

        if(pagination) {

            if(pageParam && page) {
                params[pageParam] = page;
            }

            if(startParam && (start || start === 0)) {
                params[startParam] = start;
            }

            if(limitParam && limit) {
                params[limitParam] = limit;
            }

        }

        hasGroups = groupParam && grouper;
        if(hasGroups) {
            // Grouper is a subclass of sorter, so we can just use the sorter method
            if(simpleGroupMode) {
                params[groupParam] = grouper.getProperty();
                params[groupDirectionParam] = grouper.getDirection();
            } else {
                params[groupParam] = me.encodeSorters([grouper], true);
            }
        }

        if(sortParam && sorters && sorters.length > 0) {
            if(simpleSortMode) {
                index = 0;
                // Group will be included in sorters, so grab the next one
                if(sorters.length > 1 && hasGroups) {
                    index = 1;
                }
                params[sortParam] = sorters[index].getProperty();
                params[directionParam] = sorters[index].getDirection();
            } else {
                params[sortParam] = me.encodeSorters(sorters);
            }

        }

        if(filterParam && filters && filters.length > 0) {
            if(simpleFilterMode) {
                delete params[filterParam];

                var filter, param;

                for(var i = 0; i < filters.length; i++) {
                    filter = filters[i];

                    param = filter.getProperty();

                    params[param] = filter.getValue();
                }
            } else {
                params[filterParam] = me.encodeFilters(filters);
            }

        }

        return params;
    }


});;Ext.define('expand.overrides.data.proxy.Proxy', {
    override: 'Ext.data.proxy.Proxy',

    listeners: {
        exception: function (proxy, response, operation) {

            var error = operation.getError();

            if (error) {

                var status = error['status'];

                if (proxy.isAjaxProxy) {

                    Ext.ux.Msg.error(
                        '错误状态：' + status + '<br/>' +
                        '错误信息：' + error['statusText'] + '<br/>' +
                        'AjaxURL：' + proxy['url'], 'Load Store Error');

                } else {

                    Ext.ux.Msg.error(
                        '错误状态：' + status + '<br/>' +
                        'AjaxURL：' + proxy['url'] + '<br/>', 'Load Store Error');
                }

                return;
            }


            var obj = Ext.decode(response.responseText),
                msg = obj['msg'] ? obj['msg'] : '系统异常';


            Ext.ux.Msg.error(msg, '错误提示');

        }

    }
});
;Ext.define("Ext.locale.zh_CN.ux.TabCloseMenu", {
    override: "Ext.ux.TabCloseMenu",
    closeAllTabsText: '关闭所有',
    closeOthersTabsText: '关闭其它',
    closeTabText: '关闭'
});
// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.zh_CN.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "读取中..."
});;Ext.define('expand.ux.AdvancedVType', {
    override: 'Ext.form.field.VTypes',

    daterange: function(val, field) {
        var date = field.parseDate(val);

        if(!date) {
            return false;
        }
        if(field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up().down('#' + field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if(field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up().down('#' + field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    },

    daterangeText: 'Start date must be less than end date',

    password: function(val, field) {
        if(field.initialPassField) {
            var pwd = field.up('form').down('#' + field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText: 'Passwords do not match'
});
;/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, browser:true */
/*global Ext, tinymce, tinyMCE */

/*-------------------------------------------------------------------
 Ext.ux.form.TinyMCETextArea

 ExtJS form field - a text area with integrated TinyMCE WYSIWYG Editor

 Version: 5.1
 Release date: 27.09.2014
 ExtJS Version: 5.0.0
 TinyMCE Version: 4.1.5
 License: LGPL v3 or later, Sencha License

 Author: Oleg Schildt
 E-Mail: Oleg.Schildt@gmail.com

 Copyright (c) 2014 Oleg Schildt

 Following issues are covered:

 - Initialization in an initially visible and in an initially invisible tab.
 - Correct place occupation by the initialization in any ExtJS layout.
 - Correct resizing by the resizing of the underlying text area.
 - Activation and deactivation of the WYSIWYG editor.
 - Enabling and disabling of the WYSIWYG editor control.
 - ReadOnly state support.
 - Changing of WYSIWYG settings and CSS file for the editable contents on the fly.
 - Pre-formatting of the HTML text in visible and invisible modus.
 - Focusing of the WYSIWYG editor control.
 - Marking invalid.
 - Tracking dirty state.
 - Storing and restoring cursor position by inserting of a place holder over a popup window.
 -------------------------------------------------------------------*/

Ext.define('Ext.ux.form.TinyMCETextArea', {

    extend: 'Ext.form.field.TextArea',
    alias: ['widget.tinymce_textarea', 'widget.tinymce_field'],

    //-----------------------------------------------------------------

    /*
     Flag for tracking the initialization state
     */
    wysiwygIntialized: false,
    intializationInProgress: false,
    
    lastHeight: null,
    lastFrameHeight: null,

    /*
     This properties enables starting without WYSIWYG editor.
     The user can activate it later if he wants.
     */
    noWysiwyg: false,

    /*
     Config object for the TinyMCE configuration options
     */
    tinyMCEConfig: {},

    /*
     In the ExtJS 5.x, the liquid layout is used if possible. 
     The liquid layout means that the component is rendered
     with the help of pure CSS without any JavaScript. In this 
     case, no sizing events are fired.
     
     However, the event 'resize' is essential for the 
     Ext.ux.form.TinyMCETextArea. For that reason, we set 
     liquidLayout to false.
     */
    liquidLayout: false,
    
    //-----------------------------------------------------------------
    afterRender: function () {
        var me = this;
        
        me.callParent(arguments);
        
        me.on('blur', function (elm, ev, eOpts) {

            var ctrl = document.getElementById(me.getInputId());

            if (me.wysiwygIntialized) {
                var ed = tinymce.get(me.getInputId());

                // In the HTML text modus, the contents should be
                // synchronized upon the blur event.
                if (ed && ed.isHidden()) {
                    if (ctrl) {
                        me.positionBeforeBlur = { start: ctrl.selectionStart, end: ctrl.selectionEnd };
                    }

                    ed.load();
                }
            }
            else {
                if (ctrl) {
                    me.positionBeforeBlur = { start: ctrl.selectionStart, end: ctrl.selectionEnd };
                }
            }
        }, me);
        
        me.on('resize', function (elm, width, height, oldWidth, oldHeight, eOpts) {
             
             /*
             alert('width:' + width + '\n' +
             'height:' + height + '\n' +
             'oldWidth:' + oldWidth + '\n' +
             'oldHeight:' + oldHeight
             );*/

            if (!me.noWysiwyg && !me.wysiwygIntialized) {
                me.initEditor(height);
            }
            else
            {
                me.syncEditorHeight(height);
            }
        }, me);
    },
    //-----------------------------------------------------------------
    syncEditorHeight: function (height) {
        var me = this;
        
        me.lastHeight = height;
        
        if (!me.wysiwygIntialized || !me.rendered) { return; }
        
        var ed = tinymce.get(me.getInputId());

        // if the editor is hidden, we do not syncronize
        // because the size values of the hidden editor
        // are calculated wrong.

        if (ed.isHidden()) { return; }
        
        var edIframe = Ext.get(me.getInputId() + "_ifr");
        
        var parent = edIframe.up(".mce-edit-area");
        parent = parent.up(".mce-container-body");
        
        var newHeight = height;
        
        var edToolbar = parent.down(".mce-toolbar-grp");
        if(edToolbar) 
          newHeight -= edToolbar.getHeight();
        
        var edMenubar = parent.down(".mce-menubar");
        if(edMenubar) 
          newHeight -= edMenubar.getHeight();

        var edStatusbar = parent.down(".mce-statusbar");
        if(edStatusbar) 
          newHeight -= edStatusbar.getHeight();
        
        me.lastFrameHeight = newHeight - 3;
        
        edIframe.setHeight(newHeight - 3);
        
        return newHeight - 3;
    },
    //-----------------------------------------------------------------
    showBorder: function(state) {
        var me = this;
        
        var elm = Ext.getDom(me.getId() + "-inputWrap");
        if(!elm) return;
        
        if(state) elm.classList.remove("tinymce-hide-border");
        else      elm.classList.add("tinymce-hide-border");

        var elm = Ext.getDom(me.getId() + "-triggerWrap");
        if(!elm) return;
        
        if(state) elm.classList.remove("tinymce-hide-border");
        else      elm.classList.add("tinymce-hide-border");
    },
    //-----------------------------------------------------------------
    initEditor: function (height) {
        
        var me = this;

        if (me.noWysiwyg || me.intializationInProgress || me.wysiwygIntialized) { return; }

        me.intializationInProgress = true;

        if (!me.tinyMCEConfig) {
            me.tinyMCEConfig = {};
        }
        else {
            // We need clone, not reference.
            // The configuration of the wysiwyg might be passed as an object to
            // many editor instances. Through cloning, we prevent
            // side effects on other editors upon internal modifications
            // of the tinyMCEConfig
            var tmp_cfg = me.tinyMCEConfig;
            me.tinyMCEConfig = {};
            Ext.Object.merge(me.tinyMCEConfig, tmp_cfg);
        }

        me.tinyMCEConfig.mode = "exact";
        me.tinyMCEConfig.resize = false;
        me.tinyMCEConfig.elements = me.getInputId();
        
        if(me.lastFrameHeight) {
            me.tinyMCEConfig.height = me.lastFrameHeight;
        }
        else
        {
            me.tinyMCEConfig.height = 30;
        }
        
        if (me.readOnly) {
            me.tinyMCEConfig.readonly = true;
        }
        
        if (me.isDisabled()) { 
            me.tinyMCEConfig.readonly = true;
        }
        
        // This provides that the editor get focus 
        // by click on the label
        
        if (me.labelEl) {
            me.labelEl.on('click', function (ev, elm, opts) {
                me.focus(false);
            }, me.labelEl);
        }
        
        // We have to override the setup method of the TinyMCE.
        // If the user has define own one, we shall not loose it.
        // Store it and call it after our specific actions.
        var user_setup = null;

        if (me.tinyMCEConfig.setup) { user_setup = me.tinyMCEConfig.setup; }
        
        // BEGIN: setup
        me.tinyMCEConfig.setup = function (ed) {
        
            ed.on('init', function(e) {
                me.wysiwygIntialized = true;
                me.intializationInProgress = false;
                
                me.showBorder(false);
                
                // This piece of code solves the problem of change propagation so that
                // there is no need to call triggerSave
                
                var setContent = ed.setContent;
                ed.setContent = function () {
                    setContent.apply(ed, arguments);
                    ed.fire('change', {});
                };
                
                if(height) {
                  // setTimeout is a hack. The problem is that the editor
                  // it not realle ready, when init fires.
                  setTimeout(function () { me.syncEditorHeight(height); }, 200);
                }
            });
            
            // Catch and propagate the change event 
            
            ed.on('change', function(e) {
                var oldval = me.getValue();
                var newval = ed.getContent();

                ed.save();

                me.fireEvent('change', me, newval, oldval, {});
                me.checkDirty();

                if (me.validateOnChange) {
                    me.validate();
                }
            });

            // This ensures that the focusing the editor
            // bring the parent window to front
            
            ed.on('focus', function(e) {
                var w = me.findParentByType('window');
                if(w) w.toFront(true);
            });
            
            if (user_setup) { user_setup(ed); }
            
        };
        // END: setup
        
        
        tinymce.init(me.tinyMCEConfig);
        
        me.intializationInProgress = false;
        me.wysiwygIntialized = true;
    },
    //-----------------------------------------------------------------
    getEditor: function () {
        var me = this;
    },
    //-----------------------------------------------------------------
    isEditorHidden: function () {
        var me = this;

        if (!me.wysiwygIntialized) { return true; }

        var ed = tinymce.get(me.getInputId());
        if (!ed) { return true; }

        return ed.isHidden();
    },
    //-----------------------------------------------------------------
    showEditor: function () {
        var me = this;

        me.storedCursorPosition = null;

        if (!me.wysiwygIntialized) {
            me.noWysiwyg = false;
            me.initEditor(me.getHeight());
            return;
        }

        var ed = tinymce.get(me.getInputId());
        if (!ed) { return; }

        ed.show();
        
        me.showBorder(false);

        ed.nodeChanged();

        if(me.lastHeight)
        {
          me.syncEditorHeight(me.lastHeight);
        }
        
        me.focus(); 
    },
    //-----------------------------------------------------------------
    hideEditor: function () {
        var me = this;

        if (!me.wysiwygIntialized) { return; }

        var ed = tinymce.get(me.getInputId());
        if (!ed) { return; }
        
        var node = ed.selection.getNode();
        
        if (!node || node.nodeName === "#document" || node.nodeName === "BODY" || node.nodeName === "body") {
            ed.hide();
            me.showBorder(true);

            return;
        }

        // otherwise try to position the cursor

        var marker = '<a id="_____sys__11223___"></a>';
        ed.selection.collapse(true);
        ed.execCommand('mceInsertContent', 0, marker);
        
        ed.hide();
        me.showBorder(true);
        
        var ctrl = document.getElementById(me.getInputId());

        var pos = -1;
        var txt = "";

        if (ctrl) {
            txt = ctrl.value;
            pos = txt.indexOf(marker);
        }

        if (pos !== -1) {
            var re = new RegExp(marker, "g");
            txt = txt.replace(re, "");
            ctrl.value = txt;

            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos, pos);
            }
        }
    },
    //-----------------------------------------------------------------
    toggleEditor: function () {
        var me = this;

        if (!me.wysiwygIntialized) {
            me.showEditor();
            return;
        }

        var ed = tinymce.get(me.getInputId());

        if (ed.isHidden()) {
            me.showEditor();
        }
        else {
            me.hideEditor();
        }
    },
    //-----------------------------------------------------------------
    removeEditor: function () {
        var me = this;

        if (me.intializationInProgress) {return me; }

        if (!me.wysiwygIntialized) { return me; }

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            ed.save();
            ed.destroy(false);

            var edIframe = Ext.get(me.getInputId() + "_ifr");
            if (edIframe) edIframe.destroy();
            
            me.showBorder(true);
        }

        me.wysiwygIntialized = false;

        return me;
    }, //removeEditor
    //-----------------------------------------------------------------
    // Sometimes, the editor should be reinitilized on the fly, e.g.
    // if the body css has been changed (in a CMS the user changed
    // the design template of a page opened in the editor).
    // This method removes the editor from the textarea, adds the
    // changed properties to the core config object and initializes
    // the editor again.
    //-----------------------------------------------------------------
    reinitEditor: function (cfg) {
        var me = this;

        if (me.noWysiwyg || me.intializationInProgress) { return me; }

        if (!me.tinyMCEConfig) { me.tinyMCEConfig = {}; }
        if (!cfg) { cfg = {}; }


        Ext.apply(me.tinyMCEConfig, cfg);

        if (!me.wysiwygIntialized) { return me; }

        var hidden = true;

        var ed = tinymce.get(me.getInputId());
        if (ed) {
            hidden = ed.isHidden();
            ed.save();

            var edIframe = Ext.get(me.getInputId() + "_ifr");
            if (edIframe) edIframe.destroy();
            
            ed.destroy(false);
        }
        
        me.wysiwygIntialized = false;

        if (!hidden) { me.initEditor(me.getHeight()); }

        return me;
    },
    //-----------------------------------------------------------------
    setValue: function (v) {
        var me = this;

        var res = me.callParent(arguments);

        if (me.wysiwygIntialized) {
            // The editor does some preformatting of the HTML text
            // entered by the user.
            // The method setValue sets the value of the textarea.
            // We have to load the text into editor for the
            // preformatting and then to save it back to the textarea.

            var ed = tinymce.get(me.getInputId());
            if (ed) {
                ed.load();
                ed.save();
            }
        }

        return res;
    },
    //-----------------------------------------------------------------
    focus: function (selectText, delay) {
        var me = this;

        if (me.isDisabled()) { return me; }

        if (delay) {
            if (isNaN(delay)) { delay = 10; }

            setTimeout(function () {
                me.focus.call(me, selectText, false);
            }, delay);
            return me;
        }

        if (!me.wysiwygIntialized) {
            return me.callParent(arguments);
        }

        var ed = tinymce.get(me.getInputId());

        if (ed && !ed.isHidden()) {
            me.callParent(arguments);

            ed.focus();
        }
        else {
            return me.callParent(arguments);
        }

        return me;
    },
    //-----------------------------------------------------------------
    enable: function (silent) {
        var me = this;
        var result = me.callParent(arguments);
        
        if(!result) { return result; }
        
        if (me.tinyMCEConfig.readonly) {
            me.reinitEditor({
                readonly: false
            });
        }
        
        return result;
    },
    //-----------------------------------------------------------------
    disable: function (silent) {
        var me = this;
        var result = me.callParent(arguments);
        
        if(!result) { return result; }
        
        if (!me.tinyMCEConfig.readonly) {
            me.reinitEditor({
                readonly: true
            });
        }
        
        return result;
    },
    //-----------------------------------------------------------------
    setReadOnly: function (readOnly) {
        var me = this;

        var result = me.callParent(arguments);

        if (readOnly !== me.tinyMCEConfig.readonly) {
            me.reinitEditor({
                readonly: readOnly
            });
        }

        return result;
    }, // setReadOnly
    //-----------------------------------------------------------------
    storeCurrentSelection: function () {
        var me = this;

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) { wwg_mode = true;}
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            me.storedCursorPosition = ed.selection.getBookmark('simple');
        }
        else if (ctrl) {
            me.storedCursorPosition = me.positionBeforeBlur;
        }
    }, // storeCurrentSelection
    //-----------------------------------------------------------------
    restoreCurrentSelection: function () {
        var me = this;

        if (!me.storedCursorPosition) {
            return;
        }

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) {
                wwg_mode = true;
            }
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            ed.selection.moveToBookmark(me.storedCursorPosition);
        }
        else if (ctrl) {
            ctrl.setSelectionRange(me.storedCursorPosition.start, me.storedCursorPosition.end);
        }
    }, // restoreCurrentSelection
    //-----------------------------------------------------------------
    insertText: function (txt) {
        var me = this;

        var wwg_mode = false;

        var ed = tinymce.get(me.getInputId());

        if (me.wysiwygIntialized) {
            if (ed && !ed.isHidden()) {
                wwg_mode = true;
            }
        }

        var ctrl = document.getElementById(me.getInputId());

        if (wwg_mode) {
            ed.focus();
            ed.execCommand('mceInsertContent', 0, txt);
        }
        else if (ctrl) {
            ctrl.focus();

            var start = ctrl.selectionStart + txt.length;

            ctrl.value = ctrl.value.slice(0, ctrl.selectionStart) + txt + ctrl.value.slice(ctrl.selectionEnd);

            ctrl.setSelectionRange(start, start);
        }
    }, // insertText
    //-----------------------------------------------------------------
    beforeDestroy: function () {
        var me = this;
        
        var ed = tinymce.get(me.getInputId());
        
        if(ed) ed.destroy(false);
    },
    //-----------------------------------------------------------------
    renderActiveError: function () { 

        var me = this,
            activeError = me.getActiveError(),
            hasError = !!activeError;

        var edIframe = Ext.get(me.getInputId() + "_ifr");
        if (!edIframe) { return me.callParent(arguments); }
        
        var ed = tinymce.get(me.getInputId());
        if (!ed) { return me.callParent(arguments); }
        
        var parent = edIframe.up(".mce-edit-area");
        parent = parent.up(".mce-container-body");

        if (!parent) { return me.callParent(arguments); }

        parent = parent.up(".mce-tinymce");

        if (!parent) { return me.callParent(arguments); }
        
        if (me.rendered && !me.isDestroyed && !me.preventMark) {

            var evHandler = function (args) {
                me.clearInvalid();
            };
        
            // Add/remove invalid class
            if (hasError) {
                parent.addCls('tinymce-error-field');
                
                ed.on('keydown', evHandler);                
                ed.on('change', evHandler);                
            }
            else {
                parent.removeCls('tinymce-error-field');
                
                ed.off('keydown', evHandler);                
                ed.off('change', evHandler);                
            }
        }

        return true;
    }
    //-----------------------------------------------------------------
});
;Ext.define('Ext.ux.form.KindEditorField', {
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
});;Ext.define('Ext.ux.Msg', {
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