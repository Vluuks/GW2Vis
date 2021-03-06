function showAccountInfo() {

    // Hide loading spinner.
    $('#accountloading').hide();

    // Select account data paragraph and set the text.
    $('#accname').text(account.name);
    $('#chars').text(account.characterAmount + " characters");
    $('#accage').text(account.hoursPlayed + " hours played");
    $('#fraclevel').text("Fractal Level " + account.fractalLevel);

}

function showCurrencies() {

    $('#fractalrelics').text("Relics " + account.fractalRelics);
    $('#pristinerelics').text("Pristines " + account.fractalPristine);
}


/*
    Draws pie charts based on general account statistics, such as gender/class/race. 
    Is horribly inefficient for now, needs fixing asap.
*/
function makePieChart() {

    var w = 298;
    var h = 298;
    var r = h/2;

    var data = account.professionDictionary, 
        data_account = account.raceDictionary,
        data_gender = account.genderDictionary;


    var vis = d3.select('#piesvgpart')
    .append("svg:svg")
    .data([data])
    .attr("width", w)
    .attr("height", h + 200)
    .attr("id", "piesvg")
    .attr("class", "piesvg")
    .append("svg:g")
    .attr("id", "svggroup-1")
    .attr("transform", "translate(" + r + "," + r + ")");

    // Tooltip.
	var tooltip = d3.select("#piesvgpart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var pie = d3.layout.pie().value(function(d) { return d.value; });

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie).enter()
        .append("svg:g")
        .attr("class", "slice");
        arcs.append("svg:path")
        .attr("fill", function(d, i){ return colorDictionary[data[i].label]; })
        .attr("d", function (d) { return arc(d); })
        .on("mouseover", function(d) {
            tooltip
                .text(d.data.label)
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");
        
        })
        .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
        })
        .on("click", function(d) { 
            console.log("click");
            pieSectionClicked(d) });

    // Add the text
    arcs.append("svg:text")
        .attr("transform", function(d) {
            d.innerRadius = 100;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}
        )
        .attr("text-anchor", "middle")
        .text( function(d, i) { return data[i].value; });
    
        d3.select("#svggroup-1")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "pie-title")
        .attr("transform", "translate( 0, 200 )")
        .text("Profession");

    // ------

    var vis = d3.select('#piesvgpart')
    .append("svg:svg")
    .data([data_account])
    .attr("width", w)
    .attr("height", h + 200)
    .attr("id", "piesvg")
    .attr("class", "piesvg")
    .append("svg:g")
    .attr("id", "svggroup-2")
    .attr("transform", "translate(" + r + "," + r + ")");

    var pie = d3.layout.pie().value(function(d) { return d.value; });

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie).enter()
        .append("svg:g")
        .attr("class", "slice");
    arcs.append("svg:path")
        .attr("fill", function(d, i){ return colorDictionary[data_account[i].label]; })
        .attr("d", function (d) { return arc(d); })
        .on("mouseover", function(d) {
            tooltip
                .text(d.data.label)
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");
        
        })
        .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
        });

    // Add the text
    arcs.append("svg:text")
        .attr("transform", function(d) {
            d.innerRadius = 100;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}
        )
        .attr("text-anchor", "middle")
        .text( function(d, i) { return data_account[i].value; });

        d3.select("#svggroup-2")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "pie-title")
        .attr("transform", "translate( 0, 200 )")
        .text("Race");

    // ------

    var vis = d3.select('#piesvgpart')
        .append("svg:svg")
        .data([data_gender])
        .attr("width", w)
        .attr("height", h + 200)
        .attr("id", "piesvg")
        .attr("class", "piesvg")
        .append("svg:g")
        .attr("id", "svggroup-3")
        .attr("transform", "translate(" + r + "," + r + ")");
        

    var pie = d3.layout.pie().value(function(d) { return d.value; });

    // Declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);

    // Select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie).enter()
        .append("svg:g")
        .attr("class", "slice");
    arcs.append("svg:path")
        .attr("fill", function(d, i){ return colorDictionary[data_gender[i].label]; })
        .attr("d", function (d) { return arc(d); })
        .on("mouseover", function(d) {
            tooltip
                .text(d.data.label)
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");
        
        })
        .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
        });


    // Add the text
    arcs.append("svg:text")
        .attr("transform", function(d) {
            d.innerRadius = 100;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";}
        )
        .attr("text-anchor", "middle")
        .text( function(d, i) { return data_gender[i].value; });

    d3.select("#svggroup-3")
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "pie-title")
        .attr("transform", "translate( 0, 200 )")
        .text("Gender");

}

function pieSectionClicked(d) {

    let charactersMatch = [];

    let profession = d.data.label;
    console.log(profession);
    for(character in account.characters) {

        console.log(character);
        if(character.profession == profession) {
            console.log(character.name);
            charactersMatch.append(character)
            // append
        }
    }

    // get relevant data from account variable
    // cache?

    // then render list of characters that belong in that category

    // improve data structure to index by profession on loading? (optional)
    // could be slow to parse at run time when clicked

}