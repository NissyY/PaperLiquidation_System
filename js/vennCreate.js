$(function(){
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
                    $('<a></a>').text(paperTitle[i])
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
});