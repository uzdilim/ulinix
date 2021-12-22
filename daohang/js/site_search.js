var	Search = {
	from_code:'1749a',
	defaultValue:'',
	think:function(keyword){
		keyword= encodeURIComponent(keyword);
		var url = 'http://m.baidu.com/su?p=3&ie=utf-8&from=wise_web&cb=searchThink&wd=' + keyword + '&t=' + Math.round(new Date().getTime() / 1000);
		M.getScript(url);
	},
	thinkCallback:function(data){
		/*var templete ='<li><a href="javascript:;"><span class="key">啊</span>里巴巴</a>'+
					'<div class="op"></div></li>';*/
		if (data.s.length > 0) {
			//搜索下拉推荐
			M.getScript('http://so.2345.com/index/searchForM.php?wd='+ encodeURIComponent(M("#J_search_input").val()));
			window.getRecommend = function(ret){
				var search_data = [];
				if(ret){
					search_data.push('<li><a style="font-weight:bold;color: #0e56a4;" href="'+ret.detailUrl+'" target="_blank">'+ret.name+'</a><div class="op" onclick = "changeKeyword(\'' + ret.name + '\')"></div></li>');
				}
				if(localStorage&&localStorage.getItem('history')) {
					var history = localStorage.getItem('history');
					var hisArray = history.split(',');
					for(var j=0;j<hisArray.length;j++){
						if(hisArray[j].indexOf(data['q'])!=-1){
							hisArray[j] = hisArray[j].replace(/@@@/g,',');
							search_data.push('<li><a href="http://m.baidu.com/s?from='+Search.from_code+'&word=' + encodeURIComponent(hisArray[j]) + '" target="_blank"><span class="key">'+data['q']+'</span>'+ hisArray[j].replace(data['q'],'') + '</a><div class="op" onclick = "changeKeyword(\'' + hisArray[j] + '\')"></div></li>');
							break;
						}
					}
				}
				for (var i = 0; i < data['s'].length; i++) {
					if (i < 5) {
						if(ret && ret.name){
							//避免百度联想的关键字跟从so.2345.com联想的关键字重复
							if(data['s'][i] != ret.name){
								search_data.push('<li><a href="http://m.baidu.com/s?from='+Search.from_code+'&word=' + encodeURIComponent(data['s'][i]) + '" target="_blank"><span class="key">'+data['q']+'</span>'+ data['s'][i].replace(data['q'],'') + '</a><div class="op" onclick = "changeKeyword(\'' + data['s'][i] + '\')"></div></li>');
							}
						}else{
							search_data.push('<li><a href="http://m.baidu.com/s?from='+Search.from_code+'&word=' + encodeURIComponent(data['s'][i]) + '" target="_blank"><span class="key">'+data['q']+'</span>'+ data['s'][i].replace(data['q'],'') + '</a><div class="op" onclick = "changeKeyword(\'' + data['s'][i] + '\')"></div></li>');
						}
					}
				}
				M('.J_search_list').html(search_data.join(''));					
			};
			M('.J_clearHistory').hide();
			M('.J_closeSearch').show();
			M('.m-serch-think').removeClass('m-serch-think-history');
			M('.m-serch-think').show();
		} else {
			M('.m-serch-think').hide();
		}
	},
	changeKeyword:function(keyword){
		M('.J_search_input').val(keyword);
		M('.J_search_clear').show();
    M('.J_search_input')[0].focus();
		Search.think(keyword);
	},
	setSearchHistory:function(){
		var in_array=function(k,arr){
			for(var i=0;i<arr.length;i++){
				if(arr[i]==k) return true;
			}
			return false;
		};
		var keyword = M('.J_search_input').val();
		keyword = M.trim(keyword);
		keyword = keyword.replace(/^\,+|\,+$/g,'');
		if(keyword){
			keyword = keyword.replace(/\,+/g,'@@@');
			if (window.localStorage) {
				if (localStorage.getItem('history')) {
					var history = localStorage.getItem('history');
					var hisArray = history.split(',');
					if (!in_array(keyword, hisArray)) {
						if (hisArray.length >= 5) {
							hisArray.splice(4, 1);
						}
						history = hisArray.join(',');
						localStorage.setItem('history', keyword + ',' + history);
					}
				} else {
					localStorage.setItem('history', keyword);
				}
			}
		}	
	},
	doSearch:function(){
		M('.m-serch-think').hide();
		if (M('.J_search_input').val() == '') {	
			if(navigator.userAgent.toLocaleLowerCase().indexOf('mb2345browser') != -1){
				window.location.href = 'http://m.baidu.com/?from='+Search.from_code;
			}else{
				window.open('http://m.baidu.com/?from='+Search.from_code);
			}	
		} else {
			M('.m-serch-think').hide();
			if(navigator.userAgent.toLocaleLowerCase().indexOf('mb2345browser') != -1){
				window.location.href = 'http://m.baidu.com/s?from='+Search.from_code+'&word='+encodeURIComponent(M('.J_search_input').val());
			}else{
				window.open('http://m.baidu.com/s?from='+Search.from_code+'&word='+encodeURIComponent(M('.J_search_input').val()));
			}	
			try{
				Search.setSearchHistory();
			}catch(e){
				return false;
			}
		}
		return false;
	},
	allCount:function ( vUrl ){
		var url = 'http://union2.50bang.org/web/ajax75?uId2=SPTNPQRLSX&r='+encodeURIComponent(document.location.href)+'&fBL='+screen.width+'*'+screen.height+'&lO='+encodeURIComponent(vUrl) + "?nytjsplit="+encodeURIComponent("http://"+location.hostname+"/neiye/");
		var _dh = document.createElement("script");
		_dh.setAttribute("type","text/javascript");
		_dh.setAttribute("src",url);
		document.getElementsByTagName("head")[0].appendChild(_dh);
		return true;
	},
	bindEvents:function(){
		var me = this;
		M('.m-serch-think').bind('click',function(){
			M('.m-serch-think').hide();//关闭历史记录
		});
		M('.J_search_input').bind('input', function (e) {
			var keyword = $(this).val();
			if (keyword == '') {
				M('.m-serch-think').hide();
				M('.J_search_clear').hide();
				M('.J_search_input').val('');
				M('.m-serch-think').addClass('m-serch-think-history');
				return;
			}
			M('.J_search_clear').show();
			me.think(keyword);
		}).bind('keyup',function(e){
			e = e|| window.event;				
			if(e.keyCode ==13){
				me.doSearch();
				return;
			}	
		});
		M('.J_search_btn').click(function () {
			M('.m-serch-think').hide();
			var inputValue = M('.J_search_input',this.parentNode).val();
			if (inputValue == '') {	
				if(navigator.userAgent.toLocaleLowerCase().indexOf('mb2345browser') != -1){
					window.location.href = 'http://m.baidu.com/?from='+me.from_code;
				}else{
					window.open('http://m.baidu.com/?from='+me.from_code);
				}	
			} else {			
				M('.m-serch-think').hide();
				if(navigator.userAgent.toLocaleLowerCase().indexOf('mb2345browser') != -1){
					window.location.href = 'http://m.baidu.com/s?from='+me.from_code+'&word='+encodeURIComponent(inputValue);
				}else{
					window.open('http://m.baidu.com/s?from='+me.from_code+'&word='+encodeURIComponent(inputValue));
				}
				me.setSearchHistory();
			}
		});
		M('.J_search_input').bind('click',function(){
      this.placeholder = '';
			M('.J_clearSearch').removeClass('m-serch-close').addClass('m-serch-clear');
			var keyword = M('.J_search_input').val();
			if(keyword ==''&& (M('.m-serch-think').css('display')=='none' )){
				var search_data = [];
				var history = localStorage.getItem('history');
				if(history){
					var data = history.split(',');
					if (data.length > 0) {
						for (var i = 0; i < data.length; i++) {
							if (search_data.length < 6 && (data[i] && M.trim(data[i]))) {		
								data[i] = data[i].replace(/@@@/g,',');
								search_data.push('<li><a href="http://m.baidu.com/s?from='+Search.from_code+'&word=' + encodeURIComponent(data[i]) + '" target="_blank">'+ data[i] + '</a><div class="op" onclick = "changeKeyword(\'' + data[i] + '\')"></div></li>');
							}
						}
					}						
				}
				if(history){
					M('.J_search_list').html(search_data.join(''));
					M('.J_clearHistory').show();
					M('.m-serch-think').show(); 
				}
			}
		});
    M('.J_search_input').bind('blur',function() {
      if (M('.J_search_input').val() == '') {
        this.placeholder = '搜索或输入网址';
      }     
    });
		M('.J_search_clear').click(function () {
			M('.J_search_input').val('');
      M('.J_search_input')[0].placeholder = '搜索或输入网址';
			M('.m-serch-think').hide();
			M('.J_search_clear').hide();
			M('.m-serch-think').addClass('m-serch-think-history');
		});
		M('.J_clearSearch').click(function () {
			M('.m-serch-think').hide();	
		});
		M('.J_clearHistory').click(function () {
			if (confirm('清除全部查询历史记录？')) {
				if (window.localStorage) {
					localStorage.removeItem('history');
					M('.m-serch-think').hide();
					M(".J_search_list").html('');
				}
			}
		});
		document.onclick = function(e)//兼容IE,FF,OPERA
		{
			e = e || window.event;
			var sE = e.target || e.srcElement ;
			if( sE.tagName == "A" && sE.href != ""){
				me.allCount(sE.href);	
			}else{
				sE = sE.parentNode;
				if(sE.parentNode && sE.parentNode.tagName == "A"){
					sE = sE.parentNode;
				}				
				if(sE.tagName == "A" && sE.href != ""){
					me.allCount(sE.href);
				}
			}
		};
	},
	init:function(){
		this.from_code = location.search == '?tg1' ? '1009928a' : '1749a';
		window.searchThink = Search.thinkCallback;
		window.changeKeyword = Search.changeKeyword;
		window.submitSearch = Search.doSearch;
		this.bindEvents();
	}
};
Search.init();	