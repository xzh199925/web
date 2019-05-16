/**
 * 后台JS操作对象 -
 *
 * 后台所有JS操作都集中在此
 */

var admin = {};
//var MY_JS_PATH = SITE_URL+'/apps/'+APPNAME+'/_static/';
var MY_JS_PATH = SITE_URL+'/apps/admin/_static/';
admin.pageBack = function(){
    window.history.back();
    return false;
};
/**
 * 收缩展开某个DOM
 */
admin.fold = function(id){
    $('#'+id).slideToggle('fast');
};

/**
 * 处理ajax返回数据之后的刷新操作
 */
admin.ajaxReload = function(obj,callback){
    if("undefined" == typeof(callback)){
        callback = "location.href = location.href";
    }else{
        callback = 'eval('+callback+')';
    }
    if(obj.status == 1){
        ui.success(obj.data);
        setTimeout(callback,1500);
    }else{
        ui.error(obj.data);
    }
};

/*
 * 上移对象
 */
admin.moveUp = function(obj,topList)
{
    var current=$(obj).parent().parent();
    var prev=current.prev();
    if(!topList || topList=='undefined'){
        topList = 1;
    }
    if(current.index()>1)
    {
        current.insertBefore(prev);
        return true;
    }else{
        ui.error('不可以再上移了');
        return false;
    }
}

/*
 * 下移对象
 */
admin.moveDown = function(obj)
{
    var current=$(obj).parent().parent();
    var next=current.next();
    if(next)
    {
        current.insertAfter(next);
        return true;
    }else{
        ui.error('不可以再下移了');
        return false;
    }
};

/**
 * 多选数据
 * @returns {Array}
 */
admin.getChecked = function() {
    var ids = new Array();
    $.each($('.table_dl input:checked,#list input:checked'), function(i, n){
        if($(n).val() !='0' && $(n).val()!='' ){
            ids.push( $(n).val() );
        }
    });
    return ids;
};

//绑定tr上的on属性
admin.bindTrOn = function(){
    $("tr[overstyle='on']").hover(
        function () {
            $(this).addClass("bg_hover");
        },
        function () {
            $(this).removeClass("bg_hover");
        }
    );
};

/**
 * 删除API
 * @Author   Martinsun<syh@sunyonghong.com>
 * @DateTime 2018-05-04
 */
admin.deleteApi = function(api_id){
    if(!api_id){
        return false;
    }
    ui.confirm('删除后不可恢复,确定要删除吗？', {
        yes:function(){
            $.post(U('admin/Api/deleteApi'),{api_id:api_id},function(res){
                if(res.status == 0){
                    ui.error(res.info);
                } else {
                    ui.success(res.info);
                    setTimeout(function(){
                        window.location.reload();
                    },1500);
                }
            },'json');
        }
    });
}

admin.upload = function(type,obj){
    if("undefined"  != typeof(core.uploadFile)){
        core.uploadFile.filehash = new Array();
    }
    core.plugInit('uploadFile',obj,function(data){
        $('.input-content').remove();
        $('#show_'+type).html('<img class="upload-pic-size" src="'+data.src+'">');
        $('#form_'+type).val(data.attach_id);
    },'image');
};

/**
 * 认证讲师驳回弹出框
 * @param integer id 驳回ID
 * @return void
 */
admin.getVerifyBox = function (id) {
    if (typeof id === 'undefined') {
        return false;
    }
    ui.box.load(U('classroom/AdminTeacher/getVerifyBox') + '&id='+id,  '驳回理由');
    return false;
};

/**
 * 认证通过
 * @param  integer id  认证ID
 * @param  integer status 认证状态
 * @param  string info 认证资料
 * @return void
 */
admin.verify = function(id){
    id = ("undefined" == typeof(id) || id == '') ? admin.getChecked() : id;
    if(id == ''){
        ui.error('请选择要通过认证的讲师');
        return false;
    }
    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post(U('classroom/AdminTeacher/doVerify'),{id:id,status:1},function(msg){
                admin.ajaxReload(msg);
            },'json');
        }
    });
};

admin.checkMessage = function(form){

    if(!admin.checkEditor(Editor_content,form.content)){
        return false;
    }
    return true;
};

admin.checkEditor = function(editor,content){
    
    var html = editor.getContent();
    content.value =  html;

    var t =$('<div></div>');
    t.html(html);
    
    var imgnums = t.find('img').size();

    html = html.replace(/&nbsp;/g,"").replace(/\s+/g,"").replace(/<.*?>/g,"");

    if(getLength(html)<1 && imgnums <1 ){

        ui.error('请输入内容');
        return false;
    }
    
    return true;
};

//彻底删除登录日志
admin.delLoginRecord = function(){
    var ids=admin.getChecked();
    ids = ("undefined"== typeof(ids)|| ids=='') ? admin.getChecked() : ids;
    if(ids==''){
        ui.error('请选择要删除的登录日志');
        return false;
    }
    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post(U('admin/AdminLoginRecord/delAdminLoginRecord'), {ids: ids}, function (msg) {
                if (msg.status == 0) {
                    ui.error(msg.info);
                } else {
                    ui.success(msg.info);
                    window.location.href = window.location.href;
                }
            }, 'json');
        }
    });
};

admin.checkon = function(o){
    if( o.checked == true ){
        $(o).parents('tr').addClass('bg_on');
    }else{
        $(o).parents('tr').removeClass('bg_on');
    }
};

//内容管理用到的JS
admin.ContentEdit = function(_id,action,title,type){
    var id = ("undefined"== typeof(_id)|| _id=='') ? admin.getChecked() : _id;
    if(id==''){
        ui.error('请选择要操作的内容');
        return false;
    }

    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post(U('admin/Content/'+action),{id:id},function(msg){
                admin.ajaxReload(msg);
            },'json');
        }
    });
};

/**
 * 注册配置验证
 */
admin.checkRegisterConfig = function(){
    if($('#dl_tag_open input:checked').val() == 1){
        var tag_num = $('#form_tag_num').val();
        if(getLength(tag_num) < 1){
            ui.error('请输入允许设置标签数量');
            return false;
        }
        if(isNaN(tag_num)){
            ui.error('允许设置标签数量必须为数字');
            return false;
        }
        if(tag_num < 0){
            ui.error('允许设置标签数量不能小于0');
            return false;
        }
    }
    if(!$('#dl_default_user_group input:checked').val()){
        ui.error('请选择默认用户组');
        return false;
    }
    return true;

}

// 表单信息验证
admin.checkNavInfo = function(form) {
    if(form.navi_name.value.replace(/^ +| +$/g,'')==''){
        ui.error( '导航名称不能为空');
        return false;
    }
    if(form.app_name.value.replace(/^ +| +$/g,'')==''){
        ui.error('英文名称不能为空');
        return false;
    }
    if(form.url.value.replace(/^ +| +$/g,'')==''){
        ui.error('链接地址不能为空');
        return false;
    }
    if(form.position.value.replace(/^ +| +$/g,'')==''){
        ui.error('导航位置不能为空');
        return false;
    }
    if(form.order_sort.value.replace(/^ +| +$/g,'')==''){
        ui.error('应用排序不能为空');
        return false;
    }
    return true;
};

/**
 *
 * @param id
 * @returns {boolean}
 * seo记录操作
 */
admin.doaction = function(id,action,type,status){
    id = ("undefined" == typeof(id) || id == '') ? admin.getChecked() : id;
    if(id == ''){
        ui.error( '请选择要操作的记录' );return false;
    }
    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post(U('admin/Seo/doaction'+action),{id:id,type:type,status:status},function(obj){
                if(obj.status == 1){
                    ui.success(obj.info,3);
                    window.location.reload();
                }else{
                    ui.error(obj.info,3);
                }
            },'json');
        }
    });
};

//验证应用信息
admin.checkAppInfo = function(form){
    if(form.app_name.value=='' || getLength(form.app_name.value) < 1 ){
        ui.error('应用名称不能为空');
        return false;
    }
    if(form.app_alias.value=='' || getLength(form.app_alias.value) < 1){
        ui.error('应用名称不能为空');
        return false;
    }
    if(form.app_entry.value=='' || getLength(form.app_alias.value) < 1){
        ui.error('应用前台入口不能为空');
        return false;
    }
     return true;
};

admin.delSingle = function(id){
    var ids = id ? id : admin.getChecked();

    ids = ("undefined"== typeof(ids)|| ids=='') ? admin.getChecked() : ids;
    if(ids==''){
        ui.error("请选择要删除的单页");
        return false;
    }
    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post(U('admin/Single/del'), {ids: ids}, function (msg) {
                admin.ajaxReload(msg);
            }, 'json');
        }
    });
};

//检查公告表单提交
admin.checkNotice=function(form) {
    if(form.content.value.replace(/^ +| +$/g,'')==''){
        ui.error('发布内容不能为空');
        return false;
    }
    return true;
};
/**
 * 彻底删除公告
 * @param integer id 公告ID
 * @return void
 */
admin.delNotice = function(id){
    id = ("undefined" == typeof(id) || id == '') ? admin.getChecked() : id;
    if( id=='' ){
        ui.error('请选择要删除的公告!');
        return false;
    }

    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post(U('admin/Notice/delNotice'),{id:id},function(msg){
                if(msg.status==0){
                    ui.error(msg.info);
                }else{
                    ui.success(msg.info);
                    window.location.href = window.location.href;
                }
            },'json');
        }
    });
}

/**
 * 彻底删除意见反馈
 * @param integer id 反馈ID
 * @return void
 */
admin.delSuggest = function(id){
    id = ("undefined" == typeof(id) || id == '') ? admin.getChecked() : id;
    if( id==''  ){
        ui.error('请选择要删除的反馈');
        return false;
    }

    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post( U('admin/Suggest/delSuggest' ),{id:id},function(msg){
                if(msg.status==0){
                    ui.error(msg.info);
                }else{
                    ui.success(msg.info);
                    window.location.href = window.location.href;
                }
            },'json');
        }
    });

}

//处理系统消息
admin.SystemMessage = function(_id,action,title,type){
    var id = ("undefined"== typeof(_id)|| _id=='') ? admin.getChecked() : _id;
    if(id==''){
        ui.error('请选择要处理的消息');
        return false;
    }
    ui.confirm('确定要'+title+'选中的'+type+'？', {
        yes: function () {
            $.post(U('admin/SystemMessage/'+action),{id:id},function(msg){
                admin.ajaxReload(msg);
            },'json');
        }
    });
}

//删除留言板消息
admin.delMsg = function(id, truedel){
    id = ("undefined" == typeof(id) || id == '') ? admin.getChecked() : id;
    if( id==''  ){
        ui.error('请选择要删除的留言');
        return false;
    }

    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post( U('admin/MessageBoard/delMsg' ),{id:id,truedel:truedel},function(msg){
                if(msg.status==0){
                    ui.error(msg.info);
                }else{
                    ui.success(msg.info);
                    window.location.href = window.location.href;
                }
            },'json');
        }
    });
}

//恢复留言板消息
admin.recMsg = function(id){
    id = ("undefined" == typeof(id) || id == '') ? admin.getChecked() : id;

    ui.confirm('确定要进行此操作吗？', {
        yes: function () {
            $.post( U('admin/MessageBoard/recMsg' ),{id:id},function(msg){
                if(msg.status==0){
                    ui.error(msg.info);
                }else{
                    ui.success(msg.info);
                    window.location.href = window.location.href;
                }
            },'json');
        }
    });
}

//彻底删除验证码
admin.delVerify = function(id){
    var id = ("undefined" == typeof(id) || id == '') ? admin.getChecked() : id;
    if( id=='' ){
        ui.error('请选择你要删除的验证码');
        return false;
    }

    ui.confirm('确定删除选中的验证码？', {
        yes: function () {
            $.post(U('admin/Verify/delVerify'),{id:id},function(msg){
                if(msg.status==0){
                    ui.error(msg.info);
                }else{
                    ui.success(msg.info);
                    window.location.href = window.location.href;
                }
            },'json');
        }
    });
};

admin.checkAll = function(o){
    if( o.checked == true ){
        $('#list input[name="checkbox"]').attr('checked','true');
        $('tr[overstyle="on"]').addClass("bg_on"); 
    }else{
        $('#list input[name="checkbox"]').removeAttr('checked');
        $('tr[overstyle="on"]').removeClass("bg_on");
    }
};

//删除导航配置
admin.delnav = function(id){
    ui.confirm('该导航下若有子导航，将会同步删除！确定要删除吗？', {
        yes: function () {
            $.post(U('admin/Config/delNav'),{id:id},function(msg){
                admin.ajaxReload(msg);
            },'json');
        }
    });
}

//清理日志
admin.cleanLogs = function(m){
    if(m!=6 && m!=12){
        ui.error('时间不正确');
    }else{
        $.post(U('admin/Home/_cleanLogs'),{m:m},function(msg){
            admin.ajaxReload(msg);
        },'json');
    }
};

//日志归档
admin.logsArchive = function(){
    $.post(U('admin/Home/_logsArchive'),{},function(msg){
        admin.ajaxReload(msg);
    },'json') ;
};

//删除一条日志
admin.dellog = function(id,table){
    ui.confirm('确定删除此条日志记录？', {
        yes: function () {
            $.post(U('admin/Home/_delLogs'),{id:id,table:table},function(msg){
                admin.ajaxReload(msg,"$('#tr"+id+"').remove()");
            },'json');
        }
    });
};

admin.delselectLog = function(table){
    var id = admin.getChecked();
    if(id==''){
        ui.error('请先选择要操作的数据');
        return false;
    }else{
        ui.confirm('确定删除此条日志记录？', {
            yes: function () {
                $.post(U('admin/Home/_delLogs'), {id: id, table: table}, function (msg) {
                    admin.ajaxReload(msg);
                }, 'json');
            }
        });
    }
};

admin.addPageSubmitCheck = function(id){
    var title = $("input[name='title']").val();
    var key   = $("input[name='key']").val();
    if ( '' == title || '' == key ){
       ui.error('请输入标题和唯一标识');
       return false;
    }
    var checkKey = false;
    if( '' !== key && !id){
        $.ajaxSettings.async = false;
        $.post(U('admin/Single/checkSingleKey'), {key: key}, function (msg) {
            if( '0' == msg ){
                ui.error('唯一标识已经存在'); 
            }else{
                checkKey = true;
            } 
        }, 'json');
        $.ajaxSettings.async = true;
        if(!checkKey){
            return false;
        }
    }
};

admin.marqueeContent = function(){
    $('#form_content').on('input propertychange', function() {
        var val     = $(this).val();
        var len     = val.length;
        var strLen  = 0;
        for( var i = 0; i < len ; i++ ){
            if( val.charCodeAt(i) < 27 || val.charCodeAt(i) > 126 ){ //中文和中文字符
                strLen += 2;
            }else{
                strLen ++;
            }
        }
        if(strLen > 30){
            $(this).next('p').css('color','red');
            $('#form_submit').attr("disabled",true);
        }else{
            $(this).next('p').css('color','');
            $('#form_submit').attr("disabled",false);
        }
    });
};

admin.checkUserCenterNav = function(){
    var pc = '';
    var h5 = '';
    $("input[name='PC[]']:checked").each(function(){
        pc += $(this).val()+",";
    });
    $("input[name='H5[]']:checked").each(function(){
        h5 += $(this).val()+",";
    });
    var check = false;
    $.ajaxSettings.async = false;
    $.post(U('admin/Config/checkUserCenterNav'), {pc: pc, h5: h5}, function (msg) {
        console.log(msg);
        if( '0' == msg ){
            ui.error('修改失败'); 
        }else{
            check = true;
        } 
    }, 'json');
    $.ajaxSettings.async = true;
    return check;
};

//导入后台其他的JS
//配置控制器相关的js
document.write(unescape('%3Cscript src="'+MY_JS_PATH+'js/config.js"%3E%3C/script%3E'));
document.write(unescape('%3Cscript src="'+MY_JS_PATH+'js/admin.user.js"%3E%3C/script%3E'));
