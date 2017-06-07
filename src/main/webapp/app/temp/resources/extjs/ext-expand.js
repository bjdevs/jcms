/*! admin 2017-05-27 */

Ext.define("classic.expand.overrides.data.proxy.Ajax",{override:"Ext.data.proxy.Ajax",config:{simpleFilterMode:!0,pagination:!0},getParams:function(a){if(!a.isReadOperation)return{};var b,c,d=this,e={},f=a.getGrouper(),g=a.getSorters(),h=a.getFilters(),i=a.getPage(),j=a.getStart(),k=a.getLimit(),l=d.getPagination(),m=d.getSimpleFilterMode(),n=d.getSimpleSortMode(),o=d.getSimpleGroupMode(),p=d.getPageParam(),q=d.getStartParam(),r=d.getLimitParam(),s=d.getGroupParam(),t=d.getGroupDirectionParam(),u=d.getSortParam(),v=d.getFilterParam(),w=d.getDirectionParam();if(l&&(p&&i&&(e[p]=i),q&&(j||0===j)&&(e[q]=j),r&&k&&(e[r]=k)),b=s&&f,b&&(o?(e[s]=f.getProperty(),e[t]=f.getDirection()):e[s]=d.encodeSorters([f],!0)),u&&g&&g.length>0&&(n?(c=0,g.length>1&&b&&(c=1),e[u]=g[c].getProperty(),e[w]=g[c].getDirection()):e[u]=d.encodeSorters(g)),v&&h&&h.length>0)if(m){delete e[v];for(var x,y,z=0;z<h.length;z++)x=h[z],y=x.getProperty(),e[y]=x.getValue()}else e[v]=d.encodeFilters(h);return e}}),Ext.define("expand.overrides.data.proxy.Proxy",{override:"Ext.data.proxy.Proxy",listeners:{exception:function(a,b,c){var d=c.getError();if(d){var e=d.status;return void(a.isAjaxProxy?Ext.ux.Msg.error("错误状态："+e+"<br/>错误信息："+d.statusText+"<br/>AjaxURL："+a.url,"Load Store Error"):Ext.ux.Msg.error("错误状态："+e+"<br/>AjaxURL："+a.url+"<br/>","Load Store Error"))}var f=Ext.decode(b.responseText),g=f.msg?f.msg:"系统异常";Ext.ux.Msg.error(g,"错误提示")}}}),Ext.define("Ext.locale.zh_CN.ux.TabCloseMenu",{override:"Ext.ux.TabCloseMenu",closeAllTabsText:"关闭所有",closeOthersTabsText:"关闭其它",closeTabText:"关闭"}),Ext.define("Ext.locale.zh_CN.view.AbstractView",{override:"Ext.view.AbstractView",loadingText:"读取中..."}),Ext.define("expand.ux.AdvancedVType",{override:"Ext.form.field.VTypes",daterange:function(a,b){var c=b.parseDate(a);if(!c)return!1;if(!b.startDateField||this.dateRangeMax&&c.getTime()==this.dateRangeMax.getTime()){if(b.endDateField&&(!this.dateRangeMin||c.getTime()!=this.dateRangeMin.getTime())){var d=b.up().down("#"+b.endDateField);d.setMinValue(c),d.validate(),this.dateRangeMin=c}}else{var e=b.up().down("#"+b.startDateField);e.setMaxValue(c),e.validate(),this.dateRangeMax=c}return!0},daterangeText:"Start date must be less than end date",password:function(a,b){if(b.initialPassField){return a==b.up("form").down("#"+b.initialPassField).getValue()}return!0},passwordText:"Passwords do not match"}),Ext.define("Ext.ux.form.TinyMCETextArea",{extend:"Ext.form.field.TextArea",alias:["widget.tinymce_textarea","widget.tinymce_field"],wysiwygIntialized:!1,intializationInProgress:!1,lastHeight:null,lastFrameHeight:null,noWysiwyg:!1,tinyMCEConfig:{},liquidLayout:!1,afterRender:function(){var a=this;a.callParent(arguments),a.on("blur",function(b,c,d){var e=document.getElementById(a.getInputId());if(a.wysiwygIntialized){var f=tinymce.get(a.getInputId());f&&f.isHidden()&&(e&&(a.positionBeforeBlur={start:e.selectionStart,end:e.selectionEnd}),f.load())}else e&&(a.positionBeforeBlur={start:e.selectionStart,end:e.selectionEnd})},a),a.on("resize",function(b,c,d,e,f,g){a.noWysiwyg||a.wysiwygIntialized?a.syncEditorHeight(d):a.initEditor(d)},a)},syncEditorHeight:function(a){var b=this;if(b.lastHeight=a,b.wysiwygIntialized&&b.rendered){if(!tinymce.get(b.getInputId()).isHidden()){var c=Ext.get(b.getInputId()+"_ifr"),d=c.up(".mce-edit-area");d=d.up(".mce-container-body");var e=a,f=d.down(".mce-toolbar-grp");f&&(e-=f.getHeight());var g=d.down(".mce-menubar");g&&(e-=g.getHeight());var h=d.down(".mce-statusbar");return h&&(e-=h.getHeight()),b.lastFrameHeight=e-3,c.setHeight(e-3),e-3}}},showBorder:function(a){var b=this,c=Ext.getDom(b.getId()+"-inputWrap");if(c){a?c.classList.remove("tinymce-hide-border"):c.classList.add("tinymce-hide-border");var c=Ext.getDom(b.getId()+"-triggerWrap");c&&(a?c.classList.remove("tinymce-hide-border"):c.classList.add("tinymce-hide-border"))}},initEditor:function(a){var b=this;if(!(b.noWysiwyg||b.intializationInProgress||b.wysiwygIntialized)){if(b.intializationInProgress=!0,b.tinyMCEConfig){var c=b.tinyMCEConfig;b.tinyMCEConfig={},Ext.Object.merge(b.tinyMCEConfig,c)}else b.tinyMCEConfig={};b.tinyMCEConfig.mode="exact",b.tinyMCEConfig.resize=!1,b.tinyMCEConfig.elements=b.getInputId(),b.lastFrameHeight?b.tinyMCEConfig.height=b.lastFrameHeight:b.tinyMCEConfig.height=30,b.readOnly&&(b.tinyMCEConfig.readonly=!0),b.isDisabled()&&(b.tinyMCEConfig.readonly=!0),b.labelEl&&b.labelEl.on("click",function(a,c,d){b.focus(!1)},b.labelEl);var d=null;b.tinyMCEConfig.setup&&(d=b.tinyMCEConfig.setup),b.tinyMCEConfig.setup=function(c){c.on("init",function(d){b.wysiwygIntialized=!0,b.intializationInProgress=!1,b.showBorder(!1);var e=c.setContent;c.setContent=function(){e.apply(c,arguments),c.fire("change",{})},a&&setTimeout(function(){b.syncEditorHeight(a)},200)}),c.on("change",function(a){var d=b.getValue(),e=c.getContent();c.save(),b.fireEvent("change",b,e,d,{}),b.checkDirty(),b.validateOnChange&&b.validate()}),c.on("focus",function(a){var c=b.findParentByType("window");c&&c.toFront(!0)}),d&&d(c)},tinymce.init(b.tinyMCEConfig),b.intializationInProgress=!1,b.wysiwygIntialized=!0}},getEditor:function(){},isEditorHidden:function(){var a=this;if(!a.wysiwygIntialized)return!0;var b=tinymce.get(a.getInputId());return!b||b.isHidden()},showEditor:function(){var a=this;if(a.storedCursorPosition=null,!a.wysiwygIntialized)return a.noWysiwyg=!1,void a.initEditor(a.getHeight());var b=tinymce.get(a.getInputId());b&&(b.show(),a.showBorder(!1),b.nodeChanged(),a.lastHeight&&a.syncEditorHeight(a.lastHeight),a.focus())},hideEditor:function(){var a=this;if(a.wysiwygIntialized){var b=tinymce.get(a.getInputId());if(b){var c=b.selection.getNode();if(!c||"#document"===c.nodeName||"BODY"===c.nodeName||"body"===c.nodeName)return b.hide(),void a.showBorder(!0);var d='<a id="_____sys__11223___"></a>';b.selection.collapse(!0),b.execCommand("mceInsertContent",0,d),b.hide(),a.showBorder(!0);var e=document.getElementById(a.getInputId()),f=-1,g="";if(e&&(g=e.value,f=g.indexOf(d)),-1!==f){var h=new RegExp(d,"g");g=g.replace(h,""),e.value=g,e.setSelectionRange&&(e.focus(),e.setSelectionRange(f,f))}}}},toggleEditor:function(){var a=this;if(!a.wysiwygIntialized)return void a.showEditor();tinymce.get(a.getInputId()).isHidden()?a.showEditor():a.hideEditor()},removeEditor:function(){var a=this;if(a.intializationInProgress)return a;if(!a.wysiwygIntialized)return a;var b=tinymce.get(a.getInputId());if(b){b.save(),b.destroy(!1);var c=Ext.get(a.getInputId()+"_ifr");c&&c.destroy(),a.showBorder(!0)}return a.wysiwygIntialized=!1,a},reinitEditor:function(a){var b=this;if(b.noWysiwyg||b.intializationInProgress)return b;if(b.tinyMCEConfig||(b.tinyMCEConfig={}),a||(a={}),Ext.apply(b.tinyMCEConfig,a),!b.wysiwygIntialized)return b;var c=!0,d=tinymce.get(b.getInputId());if(d){c=d.isHidden(),d.save();var e=Ext.get(b.getInputId()+"_ifr");e&&e.destroy(),d.destroy(!1)}return b.wysiwygIntialized=!1,c||b.initEditor(b.getHeight()),b},setValue:function(a){var b=this,c=b.callParent(arguments);if(b.wysiwygIntialized){var d=tinymce.get(b.getInputId());d&&(d.load(),d.save())}return c},focus:function(a,b){var c=this;if(c.isDisabled())return c;if(b)return isNaN(b)&&(b=10),setTimeout(function(){c.focus.call(c,a,!1)},b),c;if(!c.wysiwygIntialized)return c.callParent(arguments);var d=tinymce.get(c.getInputId());return!d||d.isHidden()?c.callParent(arguments):(c.callParent(arguments),d.focus(),c)},enable:function(a){var b=this,c=b.callParent(arguments);return c?(b.tinyMCEConfig.readonly&&b.reinitEditor({readonly:!1}),c):c},disable:function(a){var b=this,c=b.callParent(arguments);return c?(b.tinyMCEConfig.readonly||b.reinitEditor({readonly:!0}),c):c},setReadOnly:function(a){var b=this,c=b.callParent(arguments);return a!==b.tinyMCEConfig.readonly&&b.reinitEditor({readonly:a}),c},storeCurrentSelection:function(){var a=this,b=!1,c=tinymce.get(a.getInputId());a.wysiwygIntialized&&c&&!c.isHidden()&&(b=!0);var d=document.getElementById(a.getInputId());b?a.storedCursorPosition=c.selection.getBookmark("simple"):d&&(a.storedCursorPosition=a.positionBeforeBlur)},restoreCurrentSelection:function(){var a=this;if(a.storedCursorPosition){var b=!1,c=tinymce.get(a.getInputId());a.wysiwygIntialized&&c&&!c.isHidden()&&(b=!0);var d=document.getElementById(a.getInputId());b?c.selection.moveToBookmark(a.storedCursorPosition):d&&d.setSelectionRange(a.storedCursorPosition.start,a.storedCursorPosition.end)}},insertText:function(a){var b=this,c=!1,d=tinymce.get(b.getInputId());b.wysiwygIntialized&&d&&!d.isHidden()&&(c=!0);var e=document.getElementById(b.getInputId());if(c)d.focus(),d.execCommand("mceInsertContent",0,a);else if(e){e.focus();var f=e.selectionStart+a.length;e.value=e.value.slice(0,e.selectionStart)+a+e.value.slice(e.selectionEnd),e.setSelectionRange(f,f)}},beforeDestroy:function(){var a=this,b=tinymce.get(a.getInputId());b&&b.destroy(!1)},renderActiveError:function(){var a=this,b=a.getActiveError(),c=!!b,d=Ext.get(a.getInputId()+"_ifr");if(!d)return a.callParent(arguments);var e=tinymce.get(a.getInputId());if(!e)return a.callParent(arguments);var f=d.up(".mce-edit-area");if(!(f=f.up(".mce-container-body")))return a.callParent(arguments);if(!(f=f.up(".mce-tinymce")))return a.callParent(arguments);if(a.rendered&&!a.isDestroyed&&!a.preventMark){var g=function(b){a.clearInvalid()};c?(f.addCls("tinymce-error-field"),e.on("keydown",g),e.on("change",g)):(f.removeCls("tinymce-error-field"),e.off("keydown",g),e.off("change",g))}return!0}}),Ext.define("Ext.ux.Msg",{extend:"Ext.window.MessageBox",config:{title:"提示"},alert:function(a,b){this.show({title:this.getTitle(),message:a,buttons:this.OK,fn:b})},info:function(a,b,c){"function"==typeof b&&(c=b,b=""),this.show({title:b||this.getTitle(),message:a,buttons:this.OK,icon:this.INFO,fn:c})},warning:function(a,b,c){"function"==typeof b&&(c=b,b=""),this.show({title:b||this.getTitle(),message:a,buttons:this.OK,icon:this.WARNING,fn:c})},question:function(a,b,c){"function"==typeof b&&(c=b,b=""),this.show({title:b||this.getTitle(),message:a,buttons:this.OK,icon:this.QUESTION,fn:c})},error:function(a,b,c){"function"==typeof b&&(c=b,b=""),this.show({title:b||this.getTitle(),message:a,buttons:this.OK,icon:this.ERROR,fn:c})}},function(a){Ext.onInternalReady(function(){Ext.ux.Msg=new a})});