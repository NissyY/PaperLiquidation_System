function clearTagData(tags){
    $("#form-div").each(function(){
        $(this).find("div.tagify-container > span").remove();
    });
}

//addフォームに入力したタグが重複していないかの確認
function NotIsIdentifier(target, tags, len) {
    for(var i = target + 1; i < len; i++){
        if(tags[target] == tags[i]){
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
function createPaperDataSetJsonFile(papers){
    papers.push({
            "title":$("#title").val(),
            "author":$("#author").val(),
            // "theme":tagName,
            "date":$("#date").val(),
            "society":$("#society").val(),
            "comment":$("#comment").val(),
            "link":""
    });
    console.log(papers);
}