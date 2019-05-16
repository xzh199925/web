
$(function(){
	$(document).ready(function() {
		$(".direction a").on("click",function(){
			$("#search_cate").val($(this).attr("attr"));
			var search_cate = $("search_cate").val();
			var opposite = $(this).index();
			$(".direction a").css({"background-color":"#fff"});
			$(".direction a").css({"color":"#5F5A5A"});
			$(".direction a").eq(opposite).css({"background-color":"#02C1D0"});
			$(".direction a").eq(opposite).css({"color":"#fff"});
		});
		$(".direction a").on("click",function(){
			var inputKey = $(this).index();
			if(inputKey==0){
				$(".lookup input").attr('placeholder','请输入您要搜索的课程');
			}else if(inputKey==1){
				$(".lookup input").attr('placeholder','请输入您要搜索的机构');
			}else if(inputKey==2){
				$(".lookup input").attr('placeholder','请输入您要搜索的老师');
			}
		});
		$('.notice-hd li').eq(0).addClass('on');
		$('.notice-item').hide().eq(0).show();
		$('.notice-hd li').hover(function(){
			if(!$(this).hasClass('selected')){
				$(this).addClass("on").siblings().removeClass("on");
				$('.notice-item').stop(true,true).hide().eq($(this).index()).show();
			}
		});

		$('.full-course').hover(function(){
			$(this).addClass('hover');
		},function(){
			$(this).removeClass('hover');
		});

		$('.sider_box_ul > .item').hover(function(){
		   $(this).addClass('hover');
		},function(){
		   $(this).removeClass('hover');
		});

		$('.sider_float > .close').click(function(){
			$(this).parent().parent().removeClass('hover');
			$(this).parent().hide();
		});
		$('').hide().eq(0).show();

		$('.ewm-hd li').click(function(){
			if(!$(this).hasClass('on')){
				$('.ewm-hd li').removeClass('on').eq($(this).index()).addClass('on');
				$('.ewm-bd .con').stop(true,true).hide().eq($(this).index()).show();
			}
		});

		$(".price_ara,.price_ara_box").hover(
			function () {
				$(".price_ara_box").stop(true,true).fadeIn(200);
			},
			function () {
				$(".price_ara_box").stop(true,true).fadeOut();
			}
		);

		$(".area_ara,.area_ara_box").hover(
			function () {
				$(".area_ara_box").stop(true,true).fadeIn(200);
			},
			function () {
				$(".area_ara_box").stop(true,true).fadeOut();
			}
		);

		$(document).ready(function(){
			$("[name='select-list'] li:first-child").addClass('selected');
			$("[name='select-box'] .classscon").hide();
			$("[name='select-box'] .classscon:first-child").show();
			$(document).on('mousemove','[name="select-list"] li',function(){
				$(this).addClass('selected').siblings().removeClass('selected');
				$(this).parent().parent().siblings().find('.classscon').stop(true,true).hide().eq($(this).index()).show();
			});
		});

		/* 详简切换通过添加on类名和css控制 */
		$(".ranking_bd li:first-child").addClass('on');
		$(".ranking_bd li").hover(function(){ $(this).addClass("on").siblings().removeClass("on")},function(){ });

		$(".indteacher li").hover(
			function () {
				$(this).children().stop(false,true);
				$(this).children("img").fadeOut("slow");
				$(this).children(".detail").fadeIn("slow");
				$(this).children(".line").css('background-color', '#1292f7');
				$(this).children(".dot").css('background-color', '#1292f7');
				$(this).children().children(".bot").animate({bottom:0},400);
			},
			function () {
				$(this).children().stop(false,true);
				$(this).children("img").fadeIn("slow")
				$(this).children(".detail").fadeOut("slow");
				$(this).children(".line").css('background-color', '#ddd');
				$(this).children(".dot").css('background-color', '#ddd');
				$(this).children().children(".bot").animate({bottom:-15},400);
			}
		);

		$(".select-list li").hover(
			function () {
				$(this).addClass('on');
			},
			function () {
				$(this).removeClass('on');
			}
		);

		$(function(){
			$('.backtop').hide();
			$(function(){
				$(window).scroll(function(){
					if($(window).scrollTop()>300){
						$('.backtop').fadeIn(300);
					}
					else{$('.backtop').fadeOut(200);}
				});
				$('.backtop').click(function(){

					$('body,html').animate({scrollTop:0},300);
					return false;

				});
			});
		});

		$('.support-online').click(function(){
			if(!$(this).hasClass('on')){
				$(this).addClass('on');
			}
			else{
				$(this).removeClass('on')
			}
		});

		$('.coursemainlist li label').on('click',function(){
			if(!$(this).hasClass('no')){
				$(this).addClass('no');
			}else{
				$(this).removeClass('no');

			}
		});

		$(".livetopbox .ewm").hover(
			function () {
				$('.ewm .ewmbox').fadeIn("slow");
			},
			function () {
				$('.ewm .ewmbox').fadeOut("slow");
			}
		);

		/* 使用js分组，每6个li放到一个ul里面 */
		jQuery(".multipleColumn .bd li").each(function(i){ jQuery(".multipleColumn .bd li").slice(i*8,i*8+8).wrapAll("<ul></ul>");});
		//小图左滚动切换
		$(document).on('click','body',function(){
			$('[name="slt-list"]').removeClass('focus');
			$('[name="slt-list"] .dropdown-menu').css('display','none');
		});

		$(document).on('click','[name="slt-list"] .btn-default',function(){
			$(this).parent().addClass('focus');
			$(this).parent().find('.dropdown-menu').css('display','block');
			return false;
		});

		$(document).on('click','[name="slt-list"] .dropdown-menu li',function(){
			var val = $(this).attr('data-value');
			$(this).addClass('active').siblings().removeClass('active');
			$(this).parent().siblings('.btn-default').find('.txt').text(val);
			$(this).parent().css('display','none');
			$(this).parent().parent().removeClass('focus');
			return false;
		});

		$(document).on('click','.question-conent-list li .answer',function(){
			$(this).addClass('selected').siblings().removeClass('selected');
		});
		$(document).on('click','[name="group-list"] li',function(){
			$(this).addClass('selected').siblings().removeClass('selected');
		});
		jQuery(".focusBox3").hover(function(){ jQuery(this).find(".prev,.next").stop(true,true).fadeTo("show",1) },function(){ jQuery(this).find(".prev,.next").fadeOut() });
		$(document).on('click','.class_order_card dt span',function(){
			if(!$('.class_order_card dt').hasClass('open')){
				$('.class_order_card dt').addClass('open').siblings().show(500);
			}else{
				$('.class_order_card dt').removeClass('open').siblings().hide(500);
			}
		});

		$(function() {
			var $div_ul = $(".class_order_hd li");
			$div_ul.click(function () {
				$(this).addClass("on")                  //当前<li>元素颜色
                .siblings().removeClass("on");    //去掉其它同辈<li>元素的颜色
			})
		});

        $('.class_order_bd .con').hide().eq(0).show();

        $('.class_order_hd li').click(function(){
            $('#pay_video_form').find('input:hidden[name="discount_type"]').val($(this).attr('val'));
            if(!$(this).hasClass('on')){
                $('.class_order_hd li').removeClass('on').eq($(this).index()).addClass('on');
                $('.class_order_bd .con').stop(true,true).hide().eq($(this).index()).show();
            }
        });

		$(document).on('click','.class_order_pay dd span',function(){
			$('#pay_video_form').find('input:hidden[name="pay"]').val($(this).attr('val'));
			$(this).addClass('selected').siblings().removeClass('selected');
		});

	});
});
