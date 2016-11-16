function VennDiagram(themes, papers) {
    var chart = venn.VennDiagram()
                     .width(500)
                     .height(600);

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "venntooltip");

    var div = d3.select("#venn")
    div.datum(themes).call(chart);

    div.select("svg")
        .attr("class","center-block");

    div.selectAll("path")
        .style("stroke-opacity", 0)
        .style("stroke", "#fff")
        .style("stroke-width", 3)

    tooltipUpdate(themes);

    $('#addPaper').click(function() {
        removeSpanOfTag();
        var spans = $('div[class="tagify-container"] span');
        var spanLength = spans.length;
        var tags = transformInputtedTagTextToTexts(spanLength, spans);
        var tagsLength = tags.length;

        if(tagsLength == 0){
            alert('タグを設定してください');
            return;
        }

        for(var i = 0; i < spanLength; i++){
            if (NotIsIdentifier(i, tags, spanLength)) {
                // 被っている場合
                alert('同じタグが設定されています');
                clearTagData();     
                return;
            }
            // console.log(tags[i]);
            upSizeVenn(tags[i]);
            addNewVenn(tags);
            // console.log(themes[0].size);
            //TODO: なんでおるかわからんけど，とりあえずおいとく(動作OK)
            var res = createPaperDataSetJsonFile(papers);
        }

        // これ呼べば更新される．(themesの中身に変更があった場合のみ)
        div.datum(themes).call(chart);
        tooltipUpdate(themes);
    });

//追加されたタグと既存タグが重複していればデータ数を増やす
    function upSizeVenn(tags) {
        themes.forEach(function(v, i, a) {
            if (tags.indexOf(v.label) >= 0) {
                a[i].size += 1;
                console.log(themes[0].size);
                papers.push({
                    "title":$("#title").val(),
                    "author":$("#author").val(),
                    // "theme":tags.text(),
                    "date":$("#date").val(),
                    "society":$("#society").val(),
                    "comment":$("#comment").val(),
                    "link":""
                });
            }
        });
    }

    function addNewVenn(tags) {
        var labels = [];
        themes.forEach(function(v, i, a) {
            labels.push(v.label);
        });

        tags.forEach(function(v, i, a) {
            if (!(labels.indexOf(v) >= 0)) {
                themes.push({
                    "sets": [themes.length],
                    "label": v,
                    "size": 1
                });
            }
        });
    }

    function tooltipUpdate(theme){
        div.selectAll("g")
        .on("mouseover", function(d, i) {
            venn.sortAreas(div, d);
            var selection = d3.select(this).transition("tooltip").duration(400);
            selection.select("path")
                .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                .style("stroke-opacity", 1);

            $('#tooltip')
                .css('left', event.pageX  + 'px')
                .css('top', event.pageY + 'px');

            $('[name="label"]').text(d.label + "users");

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
        });
    }
}