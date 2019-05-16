requireJS(THEME_URL + '/js/layer/layer.js');
// 操作成功
// ui.success('操作成功');
// ui.error('操作失败');
// 操作成功并跳转到指定地址;
// ui.success('操作成功',{
//     end:function(){
//         window.location.href = '跳转的地址'
//     }
// });
// 默认提示信息在1.8s后消失,可以指定时间,单位秒,为0时不消失
// 操作成功,且在5s后消失
// ui.success('操作成功',{
//     time:5
// });
// 默认的提示框不具有按钮,可以使用btn参数设置按钮
// ui.success('操作成功',{
//     btn:['好的知道了']
// });
// 询问弹出层,默认存在两个按钮,['确定','取消'],可以使用btn参数自行指定
// ui.confirm('是否确定删除?',{
//     yes:function(){
//         ui.success('你确定了');
//     },
//     btn2:function(){
//         ui.error('你取消了');
//     }
// });
/**
 * PC窗体对象，全站使用，统一窗体接口
 */
var ui = {
    open: function(config) {
        layer.open(config);
    },
    /**
     *  操作成功显示API
     * @param string message 信息内容
     * @param integer time 展示时间
     * @return void
     */
    success: function(message, config) {
        var _config = {
            offset:'300px',
            icon: 1,
            time: 1.8,
            btn: false,
            title: '',
            closeBtn: 0,
            content: typeof(message) == 'null' ? '服务器走神了' : message 
        };
        var config = config ? $.extend(_config, config) : _config;
        config.time = config.time * 1000;
        layer.open(config);
    },
    /**
     * 操作出错显示API
     * @param string message 信息内容
     * @param integer time 展示时间
     * @return void
     */
    error: function(message, config) {
        var _config = {
            offset:'300px',
            icon: 2,
            time: 1.8,
            btn: false,
            title: '',
            closeBtn: 0,
            content: typeof(message) == 'null' ? '服务器走神了' : message
        };
        var config = config ? $.extend(_config, config) : _config;
        config.time = config.time * 1000;
        layer.open(config);
    },
    /**
     * 确认弹框显示API - 浮窗型
     * @example
     * 可以加入callback，回调函数
     * @param object o 定位对象
     * @param string text 提示语言
     * @param string|function _callback 回调函数名称
     * @return void
     */
    confirm: function(message, config) {
        var _config = {
            icon: 3,
            btn: ['确定', '取消'],
            offset:'300px',
            title: '',
            closeBtn: 0,
            content: message,
            yes:function(index){
                layer.close(index);
            }
        };
        var config = config ? $.extend(_config, config) : _config;
        var callback = $.isFunction(config.yes) ? config.yes : function(){};
        config.yes = function(index){
            callback(index);
            layer.close(index);
        }
        layer.open(config);
    },
    /**
     * 私信弹窗API
     * @param string touid 收件人ID
     * @return void
     */
    sendmessage: function(touid, editable) {
        if (MID == '0') {
            reg_login();
            return;
        }
        if (typeof(editable) == "undefined") {
            editable = 1;
        }
        touid = touid || '';
        this.box.load(U('basic/Message/post') + '&touid=' + touid + '&editable=' + editable, '发私信');
    },
    /**
     * @Me弹窗API
     * @param string touid @人ID
     * @return void
     */
    sendat: function(touid) {
        touid = touid || '';
        this.box.load(U('basic/Mention/at') + '&touid=' + touid, '@TA');
    },
    /**
     * 弹窗发布微博
     * @param string title 弹窗标题
     * @param string initHTML 插入内容
     * @return void
     */
    sendbox: function(title, initHtml, channelID) {
        if ($.browser.msie) {
            initHtml = encodeURI(initHtml);
        }
        initHtml = initHtml.replace(/\#/g, "%23");
        this.box.load(U('basic/Index/sendFeedBox') + '&initHtml=' + initHtml + '&channelID=' + channelID, title, function() {
            $('#at-view').hide();
        });
    },
    /**
     * 回复弹窗API
     * @param integer comment_id 评论ID
     * @return void
     */
    reply: function(comment_id) {
        this.box.load(U('basic/Comment/reply') + '&comment_id=' + comment_id, '回复', function() {
            $('#at-view').hide();
        });
    },
    groupreply: function(comment_id, gid) {
        this.box.load(U('group/Group/reply') + '&gid=' + gid + '&comment_id=' + comment_id, "回复", function() {
            $('#at-view').hide();
        });
    },
    /**
     * 选择部门弹窗API - 暂不使用
     */
    changeDepartment: function(hid, showname, sid, nosid, notop) {
        this.box.load(U('widget/Department/change') + '&hid=' + hid + '&showName=' + showname + '&sid=' + sid + '&nosid=' + nosid + '&notop=' + notop, '部门选择');
    },
    /**
     * 自定弹窗API接口
     */
    box: {
        /**
         * 关闭窗口
         * @param function fn 回调函数名称
         * @return void
         */
        close: function() {
            layer.closeAll();
        },
        /**
         * 载入弹窗API
         * @param string requestUrl 请求地址
         * @param string title 弹窗标题
         * @param string callback 窗口关闭后的回调事件
         * @param object requestData requestData
         * @param string type Ajax请求协议，默认为GET
         * @return void
         */
        load: function(requestUrl, title, callback, requestData, type,config) {
            var ajaxType = "undefined" != typeof(type) ? type : 'GET';
            var requestData = "undefined" != typeof(requestData) ? requestData : {};
            var callback = $.isFunction(callback) ? callback : null;
            window.config = config;
            $.ajax({
                url: requestUrl,
                type: ajaxType,
                data: requestData,
                cache: false,
                dataType: 'html',
                async:false,
                success: function(html) {
                    var _config = {
                        type: 1,
                        content: html,
                        title: title,
                        end: callback,
                        btn: false,
                        time: 0,
                        area:['auto','auto'],
                        scrollbar:false
                    };
                    if(!title){
                        _config.closeBtn = 0;
                    }
                    var config = window.config ? $.extend(_config, window.config) : _config;
                    layer.open(config);
                }
            });
        }
    }
};
