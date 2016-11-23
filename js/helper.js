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
        "theme":(tags),//TODO: tagsのままだとオブジェクトとして格納されるからなんとかする
        "date":$("#date").val(),
        "society":$("#society").val(),
        "comment":$("#comment").val(),
        "link":""
    });
}

//クリックしたテーマに関するデータを表示する
function displayMetadata(themes, theme, papers){
    var title = [];
    var author = [];

    for(var i = 0; i < papers.length; i++){
        if(theme.label == papers[i].theme){
            title.push(papers[i].title);
            author.push(papers[i].author)
        }
    }

    var paperIndexes = getArrayIndexOfPapersData(themes, theme, papers);
    var targetedPapers = searchPapers(paperIndexes, papers);

    var authorDataOfTheme = authorData(author);

    removeData();
    outputDataOfTheme(authorDataOfTheme);
    outputDataOfPaper(targetedPapers);
}

function getArrayIndexOfPapersData(themes, theme, papers){
    var tmp = [];
    var tmp2 = [];
    var tmp2Length;
    var a = 0;

    for(var i = 0; i < theme.sets.length; i++){
        tmp2.push(theme.sets[i]);
    }
    tmp2Length = tmp2.length;

    if(tmp2Length == 1){
        for(var i = 0; i < papers.length; i++){
            for(var j = 0; j < papers[i].theme.length; j++){
                if(themes[tmp2[0]].label == papers[i].theme[j]){
                    a++;
                    if(a > 0){
                        tmp.push(i);
                    }
                }    
            }
        }
    }else if(tmp2Length == 2){
        for(var i = 0; i < tmp2Length; i++){
            for(var j = 0; j < papers.length; j++){
                if(papers[j].theme.length == tmp2Length){
                    for(var k = 0; k < tmp2Length; k++){
                        if(themes[tmp2[i]].label == papers[j].theme[k]){
                            a++;
                            if(a == tmp2Length){
                                tmp.push(j);
                            }
                        }
                    }
                }
            }
        }
    }else{
        for(var i = 0; i < tmp2Length; i++){
            for(var j = 0; j < papers.length; j++){
                if(papers[j].theme.length == tmp2Length){
                    for(var k = 0; k < tmp2Length; k++){
                        if(themes[tmp2[i]].label == papers[j].theme[k]){
                            a++;
                            if(a == tmp2Length){
                                tmp.push(j);
                            }
                        }
                    }
                }
            }
        }
    }

    return tmp;    
}

function searchPapers(indexes, papers){
    var tmp = [];
    for(var j = 0; j < indexes.length; j++){
        tmp.push(papers[indexes[j]]);
    }
    return tmp;
}

function outputDataOfTheme(authorDataOfTheme){
    d3.select('#themeInformationArea').selectAll('p')
        .data(authorDataOfTheme)
        .enter()
        .append('p')
        .text(function(d, i){
            return d.authorName + ' : ' + d.size;
        })
        .on('click', function(d, i){
            console.log(d);
        })
}

function outputDataOfPaper(papers){
    d3.select('#paperInformationArea').selectAll('p')
        .data(papers)
        .enter()
        .append('p')
        .text(function(d, i){
            return d.title;
        })
}

function removeData(){
    d3.select('#themeInformationArea').selectAll('p')
        .remove()
    d3.select('#paperInformationArea').selectAll('p')
        .remove()
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