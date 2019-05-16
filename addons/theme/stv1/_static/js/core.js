/**
 * ThinkSNS核心Js对象
 * @author jason <yangjs17@yeah.net>
 * @version TS3.0
 */
var _core = function() {
	// 核心通用的加载源函数
	var obj = this;
	// 加载文件方法
	this._coreLoadFile = function() {
		var temp = new Array();
		var tempMethod = function(url, callback) {
			// 第二次调用的时候就不=0了
			var flag = 0;
			for(i in temp) {
				if(temp[i] == url) {
					flag = 1;
				}
			}
			if(flag == 0) {
				// 未载入过
				temp[temp.length] = url;
				// JQuery的ajax载入文件方式，如果有样式文件，同理在此引入相关样式文件
				$.getScript(url, function() {
					if("undefined" != typeof(callback)) {
						if("function" == typeof(callback)) {
							callback();
						} else {
							eval(callback);
						}
					}
				});
			} else {
				if("undefined" != typeof(callback)) {
					// 利用setTimeout 避免未定义错误
					setTimeout(callback, 200);
				}
			}
		};
		// 返回内部包函数，供外部调用并可以更改temp的值
		return tempMethod;
	};
	// 加载CSS文件
	this._loadCss = function() {
		var temp = new Array();
		var tempMethod = function(url) {
			// 第二次调用的时候就不=0了
			var flag = 0;
			for(i in temp) {
				if(temp[i] == url) {
					flag = 1;
				}
			}
			if(flag == 0) {
				// 未载入过
				temp[temp.length] = url;
				var css = '<link href="'+THEME_URL+'/js/tbox/box.css" rel="stylesheet" type="text/css">';
				$('head').append(css);
			}
		};
		// 返回内部包函数,供外部调用并可以更改temp的值
		return tempMethod;
	};
	/**
	 * 时间插件源函数
	 * 利用必包原理只载入一次js文件,其他类似功能都可以参照此方法
	 * 需要提前引入jquery.js文件
	 * @author yangjs
	 */
	this._rcalendar = function(text, mode, refunc) {
		// 标记值
		var temp = 0;
		var tempMethod = function(t, m, r) {
			// 第二次调用的时候就不=0了
			if(temp == 0) {
				// JQuery的ajax载入文件方式，如果有样式文件，同理在此引入相关样式文件
				$.getScript(THEME_URL+'/js/rcalendar.js', function() {
					rcalendar(t, m, r);
				});
			} else {
				rcalendar(t, m, r);
			}
			temp++;
		};
		// 返回内部包函数，供外部调用并可以更改temp的值
		return tempMethod;
	};
	/**
	 * 生成IMG的html块
	 */
	this._createImageHtml = function() {
		var _imgHtml = '';
		var _c = function() {
			if(_imgHtml == '') {
				$.post(U('basic/Public/getSmile'), {}, function(data) {
					for(var k in data) {
						_imgHtml += '<a href="javascript:void(0)" title="'+data[k].title+'" onclick="core.face.face_chose(this)";><img src="'+ THEME_URL +'/images/expression/'+data[k].type+'/'+ data[k].filename +'" width="24" height="24" /></a>';
					}
					_imgHtml += '<div class="c"></div>';
					$('#emot_content').html(_imgHtml);
				}, 'json');
			} else {
				$('#emot_content').html(_imgHtml);
			}
		};
		return _c;
	};
}

// 核心对象
var core = new _core();

/**
 * 核心的插件列表
 */

//微博加载文件，支持回调函数 调用方式core.loadFile(url,callback)
core.loadFile = core._coreLoadFile();
core.loadCss = core._loadCss();

/**
 * 核心插件自动生成的工厂函数
 * 这里用到了js的工厂模式等设计模式
 *
 * 使用方法：将ｊｓ插件写到plugins/下的对应文件下，文件名必须与插件对象同名，如core.at.js
 * JS 插件里面需要有一个_init 函数，根据传入参数真正调用 init函数
 *
 * 如：core.plugInit('searchUser',$(this))；
 * 其中searchUser表示插件的名称是core.searchUser.js
 * $(this) 为 init的第一个参数
 *
 * @author yangjs
 */
core.plugInit = function() {
	if(arguments.length > 0) {
		var arg = arguments;
		var back = function() {
			eval("var func = core." + arg[0] + ";");
			if("undefined" != typeof(func)) {
				func._init(arg);
			}
		};
		var file = THEME_URL + '/js/plugins/core.' + arguments[0] + '.js';
		core.loadFile(file, back);
	}
};
//与上面方法类似 只不过可以自己写回调函数（不主动执行init）
core.plugFunc = function(plugName,callback){
	var file = THEME_URL+'/js/plugins/core.'+plugName+'.js';
	core.loadFile(file,callback);
};

/**
 * 优化setTimeout函数
 * @param func
 * @param time
 */
core.setTimeout = function(func,time){
//	var type = typeof(func);
//	if("undefined" == type){
		setTimeout(func, time);
//	}else{
//		if("string" == type){
//			eval(func);
//		}else{
//			func();
//		}
//	}

};
// 获取对象编辑框内的可输入数字
core.getLeftNums = function(obj) {
	var str = obj.innerHTML;
	// 替换br标签
	var imgNums = $(obj).find('img').size();
	// 判断是否为空
	var _str = str.replace(new RegExp("<br>","gm"),"");
	_str = _str.replace(/[ ]|(&nbsp;)*/g, "");
	// 判断字数是否超过，一个空格算一个字
	_str = str.replace(/<[^>]*>/g, "");		// 去掉所有HTML标签
	_str = trim(_str,' ');

	if(imgNums <1 ) {
		var emptyStr = _str.replace(/&nbsp;/g,"").replace(/\s+/g,"");
		if(emptyStr.length == 0) {
			return initNums;
		}
	}
	_str = _str.replace(/&nbsp;/g,"a"); 	// 由于可编辑DIV的空格都是nbsp 所以这么算

	return initNums - getLength(_str) - imgNums;
};
core.getLength = function(str, shortUrl) {
	str = str + '';
	if (true == shortUrl) {
		// 一个URL当作十个字长度计算
		return Math.ceil(str.replace(/((news|telnet|nttp|file|http|ftp|https):\/\/){1}(([-A-Za-z0-9]+(\.[-A-Za-z0-9]+)*(\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\.[0-9]{1,3}){3}))(:[0-9]*)?(\/[-A-Za-z0-9_\$\.\+\!\*\(\),;:@&=\?\/~\#\%]*)*/ig, 'xxxxxxxxxxxxxxxxxxxx')
							.replace(/^\s+|\s+$/ig,'').replace(/[^\x00-\xff]/ig,'xx').length/2);
	} else {
		return Math.ceil(str.replace(/^\s+|\s+$/ig,'').replace(/[^\x00-\xff]/ig,'xx').length/2);
	}
};
// 一些自定义的方法
// 生成表情图片
core.createImageHtml = core._createImageHtml();
//日期控件,调用方式 core.rcalendar(this,'full')
//this 也可以替换为具体ID,full表示时间显示模式,也可以参考rcalendar.js内的其他模式
core.rcalendar = core._rcalendar();


//临时存储机制 适用于分割开存储的内容

core.stringDb = function(obj,inputname,tags){
    this.inputname = inputname;
    this.obj  = obj;
    if(tags != ''){
    	this.tags = tags.split(',');
    }else{
    	this.tags = new Array();
    }
    this.taglist = $(obj).find('ul');
    this.inputhide = $(obj).find("input[name='"+inputname+"']");
};

core.stringDb.prototype = {
	init:function(){
		if(this.tags.length > 0){
			var html = '';
			for(var i in this.tags){
				if(this.tags[i] != ''){
					html +='<li><label>'+this.tags[i]+'</label><em>X</em></li>';
				}
			}
			this.taglist.html(html);
			this.bindUl();
		}
	},
	bindUl:function(){
		var _this = this;
		this.taglist.find('li').click(function(){
			_this.remove($(this).find('label').html());
		});
	},
    add:function(tag){
    	var _tag = tag.split(',');
    	var _this = this;
    	var add = function(t){
    		for(var i in _this.tags){
    			if(_this.tags[i] == t){
    				return false;
    			}
    		}
    		var html = '<li><label>'+t+'</label><em>X</em></li>';
    		_this.tags[_this.tags.length] = t;
    		_this.taglist.append(html);
    	};

    	for(var ii in _tag){
    		if(_tag[ii] != ''){
    			add(_tag[ii]);
    		}
    	}

    	this.inputhide.val(this.tags.join(','));
    	this.bindUl();
    },
    remove:function(tag){
    	var del = function(arr,n){
    		if(n<0){
    			return arr;
    		}else{
    			return arr.slice(0,n).concat(arr.slice(n+1,arr.length))
    		}
    	}

    	for(var i in this.tags){
    		if(this.tags[i] == tag){
    			this.tags = del(this.tags,parseInt(i));
    			this.taglist.find('li').eq(i).remove();
    			this.inputhide.val(this.tags.join(','));
    		}
    	}
    }
};

/*** 核心Js函数库 ***/
/**
 * 模拟TS的U函数，需要预先定义JS全局变量SITE_URL和APPNAME
 * @param string url 链接地址
 * @param array params 链接参数
 * @return string 组装后的链接地址
 */
var U = function(url, params) {
	var website = SITE_URL+'/index.php';
	url = url.split('/');
	if(url[0]=='' || url[0]=='@')
		url[0] = APPNAME;
	if (!url[1])
		url[1] = 'Index';
	if (!url[2])
		url[2] = 'index';
	website = website+'?app='+url[0]+'&mod='+url[1]+'&act='+url[2];
	if(params) {
		params = params.join('&');
		website = website + '&' + params;
	}
	return website;
};


//使用沙箱模式防止污染外面的变量
; (function () {
    //让外面可以只能访问到require变量
    window.requireJS = require;
    //定义一个加载模块的方法
    function require(moduleName, callback) {
    	var callback = $.isFunction(callback) ? callback : function(){}; 
        //创建加载模块的具体实现类
        var requireHelper = new RequireHelper(moduleName, callback);
        //调用加载模块类的load方法加载模块
        requireHelper.load();
    }
    //存储已加载模块的信息
    moduleList = [];

    //创建一个实体类,给传进来的属性赋值
    function RequireHelper(moduleName, callback) {
        this.moduleName = moduleName;
        this.callback = callback;
    }

    //给模块加载实现类的原型添加方法
    RequireHelper.prototype = {
        //加载模块
        load: function () {
            var that = this;
            var moduleName = that.moduleName;
            if (that.isLoad()) {//模块已被加载(资源优化:已经请求的模块不要再次加载)
                var moduleInfo = that.getModuleInfo();//获取模块的描述信息
                if (moduleList.isLoad) {//如果模块资源已加载完成
                    that.callback();//可以放心的调用模块对应的回调函数
                } else {//模块资源没加载完
                    var oldCallback = moduleInfo.callback;//取出之前的回调函数
                    moduleInfo.callback = function () {//追加回调函数
                        oldCallback();
                        that.callback();
                    };
                }
            } else {//模块没有加载
                var script = document.createElement("script");
                script.src = that.moduleName;
                document.getElementsByTagName("head")[0].appendChild(script);//加载模块
                var moduleInfo = {
                    moduleName: that.moduleName, isLoad: false, callback: function () {
                        that.callback();
                    }
                };//添加模块的描述信息
                script.onload = function () {
                    moduleInfo.callback();//执行模块对应的回调函数
                    moduleInfo.isLoad = true;//标识模块资源被加载完成
                }
            }
        },
        //判断指定模块是否加载
        isLoad: function () {
            return this.getModuleInfo() == null ? false : true;
        },
        //根据模块名称获取模块信息
        getModuleInfo: function () {
            for (var i = 0; i < moduleList.length; i++) {
                if (that.moduleName == moduleList[i].name) {
                    return moduleList;
                }
            }
            return null;
        }
    };

})(window);

/*处理返回json，转为object*/
function getResponseData(response){
    if(typeof(response) != 'object'){
        try{
            var response = JSON.parse(response);
        }catch(e){
            var response = {status:0,data:'操作失败,请重新尝试'};
        }
    }
    return response;
}
