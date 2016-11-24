function VennDiagram(themes, papers) {
    var chart = venn.VennDiagram()
                     .width(500)
                     .height(566);

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
        //入力された著者名の解析
        var spans2 = $('.inputPaperAuthor > div[class="tagify-container"] span');
        var span2Length = spans2.length; 
        var authors = transformInputtedTagTextToTexts(span2Length, spans2);
        //入力されたテーマの解析
        var spans = $('.inputPaperTheme > div[class="tagify-container"] span');
        var spanLength = spans.length;
        var tags = transformInputtedTagTextToTexts(spanLength, spans);
        
        var tagsLength = tags.length;
        var title = $("#title").val();
        var singleSetsNum;

        if(tagsLength == 0){
            alert('タグを設定してください');
            return;
        }else if(tagsLength >3){
            alert('タグは3つまでにしてください');
            return;
        }

        var test = checkDataOfTitleOverlap(papers, title, papers.length);
//最後に復活　確認の際面倒だから
        // if(checkDataOfTitleOverlap(papers, title, papers.length)){
        //     alert('このタイトルは既に登録されています');
        //     return;
        // }

        if(NotIsIdentifier(tags, spanLength)){
            alert('同じタグが設定されています');
            clearTagData();     
            return;
        }else{
            upSizeVenn(tags);
            singleSetsNum = singleSetsCount();
            addNewVenn(tags, singleSetsNum);
            addNewOverlapTagsToVenn(tags, spanLength, singleSetsNum);
        }
        
        addNewPaperDataSet(papers,authors, tags);
        // これ呼べば更新される．(themesの中身に変更があった場合のみ)
        div.datum(themes).call(chart);
        tooltipUpdate(themes, papers);
    });


//関数---------------------------------------------------------------

    function addNewOverlapTagsToVenn(tags, spanLength, singleSetsNum){
        if(spanLength <= 1){ return; }

        var tagSets = [];

        var setsNum = [];
        for(var i = 0; i < themes.length; i ++){
            for(var j = 0; j < spanLength; j ++){
                if(themes[i].label == tags[j]){
                    setsNum.push(themes[i].sets);
                }
            }
        }

        for(var i = 0; i < themes.length; i ++){
            tagSets = compareThemeWithTags(themes[i], tags, spanLength, tagSets);
        }

        var overlapNum;

        if(tagSets.length == 2){
            overlapNum = twoOverlapSizeUp(tagSets)
        }
        if(tagSets.length == 3){
            overlapNum = threeOverlapUpSize(tagSets)
        }

        if(overlapNum){
            themes.push({"sets":tagSets, "size": 1});    

            if(tagSets.length == 3){
                combinationOf(tagSets);
            }
        }
    }

    function twoOverlapSizeUp(tag){
        var res = true;
        var tmp = 0;

        for(var i = 0; i < themes.length; i++){
            if(themes[i].sets.length == 2){
                tmp = overlapConfirmation(i, tag);
                if(tmp >= 2){
                    res = false;
                    themes[i].size++;
                }
            }
        }
        return res;
    }

    function threeOverlapUpSize(tag){
        var res = true;
        var tmp = 0;

        for(var i = 0; i < themes.length; i++){
            if(themes[i].sets.length == 3){
                tmp = overlapConfirmation(i, tag);
            }
            if(tmp >= 3){
                res = false;
                themes[i].size++;
            }
        }
        return res;
    }

    function overlapConfirmation(i, tag, a){
        var res = 0;
        for(var j = 0; j < tag.length; j++){
            if(tag[j] == themes[i].sets[j]){
                res++;
            }
        }
        return res;
    }


//見直し不要 既存データと入力データの比較 → 重なっていたら新規sets生成
    function compareThemeWithTags(theme, tags, tagsLen, tagSets) {
        for(var i = 0; i < tagsLen; i ++){
            if(theme.label == tags[i]){
                tagSets.push(theme.sets[0]);
            }
        }
        return tagSets;
    }

//見直し不要 3つ重なりがある場合 2つの組み合わせ(3通り)を生成
    function combinationOf(tagSets) {
        for(var i = 0; i <= 2; i ++){
            for(var j = i + 1; j <= 2; j ++){
                themes.push({"sets":[tagSets[i], tagSets[j]], "size": 1});
            }
        }
    }

//setsをthemes.lengthにするとあとあとバグでない？singleSetsNum使うとおかしくなる
    function addNewVenn(tags, singleSetsNum) {
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

//見直し不要 追加されたタグと既存タグが重複していればデータ数を増やす
    function upSizeVenn(tags){
        var tmp = [];
        var l = 0;
        themes.forEach(function(v, i, a) {
            if (tags.indexOf(v.label) >= 0) {
                a[i].size += 1;
                tmp[l] = v.sets;
                l ++;
            }
        });  
    }

//見直し不要 themesのsets[i]の数
    function singleSetsCount(){
        var count = 0;
        for (var i = 0; i < themes.length; i++) {
            if('label' in themes[i]){
                count++;
            }
        }
        return count;
    }

    function tooltipUpdate(theme, paper){
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

            $('[name="label"]').text(d.size + "users" + " " + d.sets);

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
            // console.log(d)
            displayMetadata(themes, d, papers);
        });
    }
}