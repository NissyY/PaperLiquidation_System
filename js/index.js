$(function() {
	//情報提示エリアの表示切り替え用ボタンについて
	$("#showTheme").click(function(){
		$(this).addClass("disabled");
		$("#showPaper").removeClass("disabled");
	});

	$("#showPaper").click(function(){
		$(this).addClass("disabled");
		$("#showTheme").removeClass("disabled");
	});
});