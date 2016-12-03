function clearTagData(tags){
    $("#form-div").each(function(){
        $(this).find("div.tagify-container > span").remove();
    });
}

function NotIsIdentifier(tags, len) {
    for(var i = 0; i < len - 1; i++){
        for(var j = i + 1; j < len; j ++){
            if(tags[i] == tags[j]){
            return true;
            }
        }
    }
    return false;
}

function checkDataOfTitleOverlap(papers, title, len){
    for(var i = 0; i < len; i ++){
        if (title == papers[i].title) {
            return true;
        }
    }
    return false;
}

function transformInputtedTagTextToTexts(len, tags) {
    var res = [];
    for(var i = 0 ; i < len; i++) {
        res[i] = ($(tags[i]).text()).split("x")[0];
    }
    return res;
}

function removeSpanOfTag(){
    $('span[style="display: none;"]').remove();
}

//jsonパース
function addNewPaperDataSet(papers,authorsName, tags){
    papers.push({
        "title":$("#title").val(),
        "author":(authorsName),
        "theme":(tags),
        "date":$("#date").val(),
        "society":$("#society").val(),
        "comment":$("#comment").val(),
        "link":""
    });
}

//クリックしたテーマに関するデータを表示する
function displayMetadata(themes, theme, papers){
    var author = [];
    var index = [];
    var paperDatas = [];
    var themesLabel = [];

    themesLabel = getIndexDataHasMultipleTheme(theme, themes);
    if(theme.sets.length == 1){
        for(var i = 0; i < papers.length; i++){
            for(var j = 0; j < papers[i].theme.length; j++){
                for(var k = 0; k < themesLabel.length; k++){
                    if(papers[i].theme[j] == themesLabel[k]){
                        paperDatas.push(papers[i]);
                        author.push(papers[i].author);
                    }
                }
            }
        }
    }else if(theme.sets.length == 2){
        //papers全データ確認
        console.log('ok')
        for(var i = 0; i < papers.length; i++){
            //papersのtemeが複数ある場合
            if(papers[i].theme.length == 2){
                //選択したテーマの数まで回す
                for(var j = 0; j < themesLabel.length; j++){
                    for(var k = 0; k < themesLabel.length; k++){
                        if(papers[i].theme[0] == themesLabel[j] && papers[i].theme[1] == themesLabel[k]){
                            paperDatas.push(papers[i]);
                            author.push(papers[i].author);
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
                                    author.push(papers[i].author);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log(paperDatas)
    var authorDataOfTheme = authorData(author);
    removeData();
    outputDataOfTheme(papers, authorDataOfTheme);
    outputDataOfPaper(papers, paperDatas);
}

function getIndexDataHasMultipleTheme(theme, themes){
    var res = [];
    for(var i = 0; i < theme.sets.length; i++){
        for(var j = 0; j < themes.length; j++){
            if(theme.sets[i] == themes[j].sets){
                res.push(themes[j].label);
            }
        }
    }
    return res;
}

function searchAuthorToData(papers, theme){
    var author = [];
    for(var i = 0; i < papers.length; i++){
        if(theme.label == papers[i].theme){
            author.push(papers[i].author)
        }
    }
    return author;
}

function getArrayIndexOfPapersData(themes, theme, papers){
    var tmp = [];
    var themeSets = [];
    var themeSetsLength;
    var a = 0;

//クリックしたテーマのsetsインデックス番号をthemeSetsに格納
    for(var i = 0; i < theme.sets.length; i++){
        themeSets.push(theme.sets[i]);
    }
    themeSetsLength = themeSets.length;

    if(themeSetsLength == 1){
        for(var i = 0; i < papers.length; i++){
            for(var j = 0; j < papers[i].theme.length; j++){
                if(themes[themeSets[0]].label == papers[i].theme[j]){
                    a++;
                    if(a > 0){
                        tmp.push(i);
                    }
                }    
            }
        }
    }
    else if(themeSetsLength == 2){
        tmp = searchPaperData(themes, themeSets, themeSetsLength, papers);
    }else{
        tmp = searchPaperData(themes, themeSets, themeSetsLength, papers);
    }

    return tmp;    
}

function searchPaperData(themes, target, len, papers){
    var res = [];
    var tmp = 0;
    for(var i = 0; i < len; i++){
        for(var j = 0; j < papers.length; j++){
            if(papers[j].theme.length == len){
                for(var k = 0; k < len; k++){
                    if(themes[target[i]].label == papers[j].theme[k]){
                        tmp++;
                        if(tmp == len){
                            res.push(j);
                        }
                    }
                }
            }
        }
    }
    return res;
}

function outputDataOfTheme(papers, authorDataOfTheme){
    authorSizeDescendingSort(authorDataOfTheme);

    d3.select('#themeInformationArea table tbody').selectAll('tr')
        .data(authorDataOfTheme)
        .enter()
        .append('tr')
        .attr({
            'class' : 'bs-docs-popover',
            'role' : 'button',
            'data-toggle' : 'popover',
            'data-triger' : 'focus',
            'data-placement' : 'top',
            'title' : 'Other Theme',
        })
        .selectAll('td')
        .data(function(row){
            return d3.entries(row)
        })
        .enter()
        .append('td')
        .text(function(d){
            // console.log(d)
            return d.value;
        })
        .on('click', function(d, i){
            var themeBySelectAuthor = [];
            var result;
            for(var i = 0; i < papers.length; i++){
                for(var j = 0; j < papers[i].author.length; j++){
                    if(d.value == papers[i].author[j]){
                        for(var k = 0; k < papers[i].theme.length; k++){
                            themeBySelectAuthor.push(papers[i].theme[k]);
                        }
                    }
                }
            }
            sameWordRemove(themeBySelectAuthor);
            result = sameWordRemove(themeBySelectAuthor).join(', ')

            $('tr').attr({
                'data-content' : result
            })
        })
}

function sameWordRemove(themes){
    for(var i = 0; i < themes.length; i++){
        for(var j = 0; j < themes.length; j++){
            if(i == j){continue;}
            if(themes[i] == themes[j]){
                themes.splice(j, 1);
                j--;
            }
        }
    }
    return themes;
}

function outputDataOfPaper(papers, paperDatas){
    var paperDataOfTheme = paperData(papers, paperDatas);
    paperDateDescendingSort(paperDataOfTheme);

    d3.select('#paperInformationArea table tbody').selectAll('tr')
        .data(paperDataOfTheme)
        .enter()
        .append('tr')
        .attr({
            'role' : 'button',
            'data-toggle' : 'popover',
            'data-triger' : 'hover',
            'data-placement' : 'top',
            'title' : 'Comment & Link',
        })
        .selectAll('td')
        .data(function(row){
            return d3.entries(row)
        })
        .enter()
        .append('td')
        .text(function(d){
            return (d.value);
        })
        .on('click', function(d, i){
            var showComment;
            var link;
            for(var i = 0; i < papers.length; i++){
                if(d.value == papers[i].title){
                    link = papers[i].link
                }
            }
            // console.log(d)
            for(var i = 0; i < papers.length; i++){
                if(d.value == papers[i].title){
                    showComment = papers[i].comment;
                }
            }
            
            $('tr').attr({
                'data-content' : showComment,
            })
        })

        $(function () {
            $('[data-toggle="popover"]').popover();
        });
}

function removeData(){
    d3.select('#themeInformationArea table tbody')
        .selectAll('tr')
        .remove()
    d3.select('#paperInformationArea table tbody')
        .selectAll('tr')
        .remove()
}

function authorSizeDescendingSort(papersData){
    papersData.sort(function(a, b) {
        return (a.size > b.size) ? -1 : 1;
    });
}

function paperDateDescendingSort(papersData){
    papersData.sort(function(a, b) {
        return (a.date > b.date) ? -1 : 1;
    });
}

function paperData(papers, paper){
    var tmp = [];
    for(var i = 0; i < paper.length; i++){
        for(var j = 0; j < papers.length; j++){
            if(paper[i].title == papers[j].title){
                tmp.push({
                    'date' : papers[j].date,
                    'title' : papers[j].title
                });
            }
        }
    }
    return tmp;
}

//著者情報の整理
function authorData(author){
    var allAuthorName = [];
    var showAuthor = [];
    var count = 1;

    //authorNameに１人ずつの名前を格納（被っててもお構いなし）
    for(var i = 0; i < author.length; i++){
        for(var j = 0; j < author[i].length; j++){
            allAuthorName.push(author[i][j]);
        }
    }

    for(var i = 0; i < allAuthorName.length; i++){
        for(var j = 0; j < allAuthorName.length; j++){
            if(i == j){
                continue;
            }
            if(allAuthorName[i] == allAuthorName[j]){
                allAuthorName.splice(j, 1);
                count++;
                j--;
            }
        }
        showAuthor.push({
            'authorName': allAuthorName[i],
            'size': count
        });
        count = 1;
    }
    return showAuthor;
}