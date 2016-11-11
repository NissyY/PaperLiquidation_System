$(function() {
	$('#tagme').tagify();
	var dataCount;
	// var val = [];
//フォーム > addボタンクリック時
	$("#addBtn").click(function(){
		var spans = $('div[class="tagify-container"] span');
		var spanLength = spans.length;
		var paper = {};
		paper['title'] = $("#title").val();
		paper['author'] = $("#author").val();
		paper['comment'] = $("#comment").val();
		
		var tags = transformInputtedTagTextToTexts(spanLength, spans);

		//論文情報追加フォーム内で同じタグが設定されていないかの確認
		for(var i = 0; i < spanLength; i++){
			if (isIdentifier(i, tags, spanLength)) {
				// かぶっていない場合
				//追加されたタグと既存タグが重複していればデータ数を増やす
				addTags(i, tags);
				createJsonFile(i, tags[i]);
				console.log("ok");	 
			} else {
				// 同じものがあった場合
				alert("同じタグが設定されています");
				clearTagData();
				return;
			}     
		}
		reloadVenn();
	});

//論文情報追加フォーム消えたり出たり
    $("#addData").click(function(){
        $("#form-main").toggle();
        clearValue();
    });

    $("#exitBtn").click(function(){
        $("#form-main").toggle();
        clearValue();
    });

//関数   
//フォーム入力情報クリア
    function clearValue(){
        $("#form-div").each(function(){
            $(this).find("input#title").val('');
            $(this).find("input#author").val('');
            $(this).find("textarea#comment").val('');
        	$(this).find("div.tagify-container > span").remove();
        });
    }

    function clearTagData(tags){
        $("#form-div").each(function(){
        	$(this).find("div.tagify-container > span").remove();
        });

    }

//jsonパース
    function createJsonFile(a, tagName){
    	dataCount = sets.length + 1;
    	var test = JSON.stringify(
							{
								"sets": [dataCount], 
								"label": tagName, 
								"size": 1,
								"title": $("#title").val()
							}
						);
    	var testJson = JSON.parse(test);
    	sets.push(testJson);
    }

//図描画画面再読み込み
    function reloadVenn(){
    	var chart = venn.VennDiagram()
                     .width(500)
                     .height(600);

    	var div = d3.select("#venn")
    	div.datum(sets).call(chart);

    var tooltip;
    tooltip = d3.select("body")
        .append("div")
        .attr("class", "venntooltip");

    div.select("svg")
        .attr("class","center-block");

    div.selectAll("path")
        .style("stroke-opacity", 0)
        .style("stroke", "#fff")
        .style("stroke-width", 3)

    div.selectAll("g")
        .on("mouseover", function(d, i) {
            // sort all the areas relative to the current item
            venn.sortAreas(div, d);
            // Display a tooltip with the current size
            // tooltip.transition().duration(400).style("opacity", .9);
            // tooltip.text(d.size + " users");

            // highlight the current path
            var selection = d3.select(this).transition("tooltip").duration(400);
            selection.select("path")
                .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                .style("stroke-opacity", 1);

            $('#tooltip')
                .css('left', event.pageX  + 'px')
                .css('top', event.pageY + 'px');

            $('[name="label"]').text(d.size + "users");

            $('#tooltip').removeClass('hidden');
        })

        .on("mousemove", function() {
            $('#tooltip')
                .css('left', (event.pageX + 10) + 'px')
                .css('top', (event.pageY + 10) + 'px');
        })

        .on("mouseout", function(d, i) {
            tooltip.transition().duration(400).style("opacity", 0);
            var selection = d3.select(this).transition("tooltip").duration(400);
            selection.select("path")
                .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                .style("stroke-opacity", 0);

                $('#tooltip').addClass('hidden');
        })

        .on("click",function(d, i) {
            console.log(d);
            // var titleText = d.title[0];
            var paperTitle = dataObjectOfTitleToText(d);
            
            var aLength =  paperTitle.length;
            for(var i = 0; i < aLength; i ++){
                console.log(paperTitle[i]);
                $('#themeInformationArea').append(
                    $('<p></p>').text(paperTitle[i])
                );
            }
            

        });


        //関数
        function dataObjectOfTitleToText(objectData){
            var dataLength = objectData.title.length;
            var titleText = [];
            for(var i = 0; i < dataLength; i++){
                titleText[i] = objectData.title[i];
            }
            return titleText;
        }

    	
    }

    function transformInputtedTagTextToTexts(len, tags) {
    	var res = [];
		for(var i = 0 ; i < len; i++) {
			res[i] = ($(tags[i]).text()).split("x")[0];
		}
		return res;
    }

    function isIdentifier(target, tags, len) {
		for(var i = target + 1; i < len; i++){
			if(tags[target] == tags[i]){
				return false;
			}
		}
		return true;
    }

    function addTags(target, tags) {
    	var len = sets.length;
    	for(var i = 0; i < len; i++){
			if(tags[target] == sets[i].label){
				sets[i].size++;
			}
		}
    }
});