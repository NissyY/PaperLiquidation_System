$(function() {

	main();

	function main() {
		// 読み込みたい外部ファイルを記述
		var loadFiles = [
			// readJsonFile("theme_new"),
			readJsonFile("theme"),
			// readJsonFile("paper_new"),
			readJsonFile("paper"),
		]

		Promise.all(loadFiles).then(function(files) {
			// すべてのファイルがロードできた場合
			VennDiagram(files[0]['themes'], files[1]['papers']);//filesってなに？？
		}, onRejected);		
	}

	$('#author').tagify({
		addTagPrompt: 'Author'
	});

	$('#tagme').tagify({
		//テキストボックスの名前
		addTagPrompt: 'Theme'
	});

	$('div.tagify-container')
			.css('margin-bottom', '10px');

    $('#toggleForm').click(function(){
        // $('#form-div').toggle();
        clearValue();
    });

    $('#exitBtn').click(function(){
        // $("#form-div").toggle();
        clearValue();
    });

    function clearValue(){
        $("#form-div").each(function(){
            $(this).find("input#title").val('');
            $(this).find("input#author").val('');
            $(this).find("input#society").val('');
            $(this).find("input#date").val('');
            $(this).find("textarea#comment").val('');
        	$(this).find("div.tagify-container > span").remove();
        });
    }

    // ここから下はうまく整理して

	$("#showThemeBtn").click(function(){
		$(this).addClass('disabled btn-info');
		$('#paperInformationArea').toggle();
		$('#themeInformationArea').toggle();
		$("#showPaperBtn").prop("disabled", false);
		$("#showThemeBtn").prop("disabled", true);
		$('#showPaperBtn').removeClass('disabled btn-info');
	});

	$("#showPaperBtn").click(function(){
		$(this).addClass("disabled btn-info");
		$('#themeInformationArea').toggle();
		$('#paperInformationArea').toggle();
		$("#showThemeBtn").prop("disabled", false);
		$("#showPaperBtn").prop("disabled", true);
		$('#showThemeBtn').removeClass("disabled btn-info");
	});
});