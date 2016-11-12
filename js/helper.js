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

//jsonパース
function createPaperDataSetJsonFile(tagName){
    var metadata = JSON.stringify(
        {
            "title":$("#title").val(),
            "author":$("#author").val(),
            "theme":tagName,
            "date":$("#date").val(),
            "society":$("#society").val(),
            "comment":$("#comment").val(),
            "link":""
        }
    );
    var tmp = JSON.parse(metadata);
    // paperDataSet.push(tmp); //TODO: グローバル参照
    return tmp;
}

// function createThemeJsonFile(tag, len){
//     var metadata = JSON.stringify(
//     {
//         "sets":[len + 1], //TODO: themes.lengthをlenの引数として渡すこと
//         "label": tag, 
//         "size": 1
//     });

//     var tmp = JSON.parse(metadata);
//     return tmp;
// }

// function dataObjectOfTitleToText(objectData){
//     var dataLength = objectData.title.length;
//     var titleText = [];
//     for(var i = 0; i < dataLength; i++){
//         titleText[i] = objectData.title[i];
//     }
//     return titleText;
// }

