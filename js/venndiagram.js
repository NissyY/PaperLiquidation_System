function VennDiagram(themes, papers) {
    var flg = 0;
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

    tooltipUpdate();

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

        if(checkDataOfTitleOverlap(papers, title, papers.length)){
            alert('このタイトルは既に登録されています');
            return;
        }

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
        
// 実験用
        removeFirstTheme();
        
        div.datum(themes).call(chart);
        tooltipUpdate(themes, papers);

        $("#form-div").each(function(){
            $(this).find("input#title").val('');
            $(this).find("input#author").val('');
            $(this).find("input#society").val('');
            $(this).find("input#date").val('');
            $(this).find("textarea#comment").val('');
            $(this).find("div.tagify-container > span").remove();
        });

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

    function getThemeName(d){
        var res = [];
        for(var i = 0; i < d.sets.length; i++){
            for(var j = 0; j < themes.length; j++){
                if(d.sets[i] == themes[j].sets){
                    res.push(themes[j].label);
                }
            }
        }
        return res;
    }

    function tooltipUpdate(){
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

            var num = count(themes, d, papers);
            // $('[name="label"]').text("Paper : " + paperCountOfTheme(d.sets) + "本 ,　Theme : " + getThemeName(d));
            $('[name="label"]').text("Paper : " + num + "本 ,　Theme : " + getThemeName(d));
            
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
            displayMetadata(themes, d, papers);
            paperCountOfTheme(d.sets)
        });
    }

    function count(themes, theme, papers){
        var paperDatas = [];
        var themesLabel = [];

        themesLabel = getIndexDataHasMultipleTheme(theme, themes);
        if(theme.sets.length == 1){
            for(var i = 0; i < papers.length; i++){
                for(var j = 0; j < papers[i].theme.length; j++){
                    for(var k = 0; k < themesLabel.length; k++){
                        if(papers[i].theme[j] == themesLabel[k]){
                            paperDatas.push(papers[i]);
                        }
                    }
                }
            }
        }else if(theme.sets.length == 2){
            //papers全データ確認
            for(var i = 0; i < papers.length; i++){
                //papersのtemeが複数ある場合
                if(papers[i].theme.length == 2){
                    //選択したテーマの数まで回す
                    for(var j = 0; j < themesLabel.length; j++){
                        for(var k = 0; k < themesLabel.length; k++){
                            if(papers[i].theme[0] == themesLabel[j] && papers[i].theme[1] == themesLabel[k]){
                                paperDatas.push(papers[i]);
                            }
                        }
                    }
                }
            }
        }else{
            var b = 0;
            for(var i = 0; i < papers.length; i++){
                if(papers[i].theme.length > 2){
                    for(var j = 0; j < themesLabel.length; j++){
                        for(var k = 0; k < themesLabel.length; k++){
                            for(var a = 0; a < 2; a++){
                                if(papers[i].theme[a] == themesLabel[j]){
                                    b++;
                                    if(b == 3){
                                        paperDatas.push(papers[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var res = paperDatas.length;
        return res;
    }

    function paperCountOfTheme(sets){
        var paperTheme = [];
        for(var i = 0; i < sets.length; i++){
            for(var j = 0; j < themes.length; j++){
                if(sets[i] == themes[j].sets){
                    paperTheme.push(themes[j].label);
                }
            }
        }

        var res = 0;
        var count = 0;

        for(var i = 0; i < papers.length; i++){
            for(var j = 0; j < papers[i].theme.length; j++){
                if(paperTheme.length == 1){
                    if(paperTheme[0] == papers[i].theme[j]){
                        res++;
                    }
                }
                else if(paperTheme.length == 2){
                    if(papers[i].theme.length == 2){
                        if(paperTheme[0] == papers[i].theme[j]){
                            count++;
                            for(var k = 0; k < 2; k++){
                                if(paperTheme[1] == papers[i].theme[k]){
                                    count++;
                                    if(count == 2){
                                        res++;
                                    }   
                                }
                            }
                        }
                    }
                }
                else{
                    if(papers[i].theme.length == 3){
                        if(paperTheme[0] == papers[i].theme[j]){
                            count++;
                            for(var k = 0; k < 3; k++){    
                                if(paperTheme[1] == papers[i].theme[k]){
                                    count++;
                                    for(var l = 0; l < 3; l++){
                                        if(paperTheme[2] == papers[i].theme[l]){
                                            count++;
                                            if(count == 3){
                                                res++;
                                            }   
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return res;
    }

    //実験用
    function removeFirstTheme(){
        if(flg == 1){
            return;
        }
        themes.splice(0, 1);
        flg++;
    }
}