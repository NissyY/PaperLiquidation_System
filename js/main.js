$(function() {

	main();

	function main() {
		// 読み込みたい外部ファイルを記述
		var loadFiles = [
			readJsonFile("theme_new"),
			readJsonFile("paper_new"),
		]

		Promise.all(loadFiles).then(function(files) {
			// すべてのファイルがロードできた場合
			VennDiagram(files[0]['themes']);
		}, onRejected);		
	}

	$('#tagme').tagify({
		//テキストボックスの名前
		addTagPrompt: 'Theme'
	});

    $('#toggleForm').click(function(){
        $('#form-main').toggle();
        clearValue();
    });

    $('#exitBtn').click(function(){
        $("#form-main").toggle();
        clearValue();
    });

    function clearValue(){
        $("#form-div").each(function(){
            $(this).find("input#title").val('');
            $(this).find("input#author").val('');
            $(this).find("textarea#comment").val('');
        	$(this).find("div.tagify-container > span").remove();
        });
    }

    // ここから下はうまく整理して

	$("#showTheme").click(function(){
		$(this).addClass("disabled");
		$("#showPaper").removeClass("disabled");
	});

	$("#showPaper").click(function(){
		$(this).addClass("disabled");
		$("#showTheme").removeClass("disabled");
	});
});