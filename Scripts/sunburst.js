/* 
    Function that transforms the obtained data about agony resist and armor pieces and combines them into a
    structure that is suitable for a sunburst visualization. This needs to be done after since the item object itself and
    the agony resist are not retrieved at the same time, so making this can only occur after calculating AR is done.
    Request is done on a per character basis because sunburst is only made once a specific bar is clicked. However,
    the result is stored  after creating it once so it does not need to be remade every time after.  
*/
function transformDataForSunburst(character) {

    // Set loading spinner.
    $('#sunburstloading').show();
    var sunburstObject = new SunburstBase();

    // Check if the data has been cached to avoid recreating the object for nothing.
    if (account.characterDictionary[character].sunburstDataCache == undefined) {

        // Get the equipment array containing objects form the character dictionary.
        var equipment = account.characterDictionary[character].equipmentRarity;

        // Loop over the equipment pieces and construct data accordingly.
        for (var piece in equipment) {
            var currentPiece = equipment[piece]; // TODO but wtf why then

            // If it's an armor piece but not an underwater piece
            if (currentPiece.type == "Armor" && currentPiece.slot != "HelmAquatic") {
                sunburstObject.children[0].children.push(currentPiece);
            }
            // If it's a trinket or backpiece
            else if (currentPiece.type == "Trinket" || currentPiece.type == "Back") {
                sunburstObject.children[1].children.push(currentPiece);
            }
            // If it's a weapon but not an underwater weapon
            else if (currentPiece.type == "Weapon" && !(currentPiece.slot == "Trident" || currentPiece.slot == "Harpoon" || currentPiece.slot == "Speargun")) {
                sunburstObject.children[2].children.push(currentPiece);
            }
            // If it's an underwater equipment piece
            else if (currentPiece.slot == "HelmAquatic" || currentPiece.slot == "Trident" || currentPiece.slot == "Harpoon" || currentPiece.slot == "Speargun") {
                sunburstObject.children[3].children.push(currentPiece);
            }
        }

        // Cache it so that it does not need to be remade if we reclick this character.
        account.characterDictionary[character].sunburstDataCache = sunburstObject;

    }
	else {
        sunburstObject = account.characterDictionary[character].sunburstDataCache;
    }

    // Create the sunburst visualization with this data.
    makeSunburst(sunburstObject);
    showCharacterData(character);

}

/* 
    Function that creates a sunburst visualization with data about a character. The data contains
    information about all the gear that a character has on them, and the rarity and name of these
    items. 
*/
function makeSunburst(data) {

    // Hide the information message.
    $('#sunburstwait').hide();
    $('#sunburstloading').hide();
    $('#tooltipcontent').hide();

    // Check if there was already a sunburst, if so then remove it.
    var svgChart = $("#sunburstsvg");
    if (svgChart !== undefined)
        svgChart.remove();

    // Set dimensions of the visualization.
    var width = 530,
        height = 530,
        radius = Math.min(width, height) / 2;

    // Make x and y scales.
    var x = d3.scale.linear()
        .range([0, 2 * Math.PI]);

    var y = d3.scale.linear()
        .range([0, radius]);

    // Add svg to webpage.
    var svg = d3.select("#piechartpart").append("svg")
        .attr("width", width)
        .attr("height", height + 20)
        .attr("id", "sunburstsvg")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

	// Tooltip.
	var tooltip = d3.select("#piechartpart").append("div")
	  .attr("class", "tooltip")
	  .style("opacity", 0);

    var partition = d3.layout.partition()
        .value(function(d) {
            return d.size;
        });

    var arc = d3.svg.arc()
        .startAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
        })
        .endAngle(function(d) {
            return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
        })
        .innerRadius(function(d) {
            return Math.max(0, y(d.y));
        })
        .outerRadius(function(d) {
            return Math.max(0, y(d.y + d.dy));
        });

    // Add data to the svg.
    var g = svg.selectAll("g")
        .data(partition.nodes(data))
        .enter().append("g");

    var path = g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {

            // Determine the color of the data point.
            if (d.name == "Weapons" || d.name == "Armor" || d.name == "Aquatic" || d.name == "Trinkets") {
                return colorDictionary[(d.children ? d : d.parent).name];
            }
            if (d.name == "Equipment") {
                return "#DDDDDD";
            }
			else {
                return colorDictionary[d.rarity];
            }
        })
        .on("click", click)
		.on("mouseover", function(d) {

            showItemTooltip(d);

			tooltip
				.text(d.name)
				.style("opacity", 1)
				.style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");

		})
		.on("mouseout", function(d) {
            // hideItemTooltip();
			tooltip.style("opacity", 0);
		});

    // Append text to  each block of the sunburst.
    var text = g.append("text")
        .attr("class", "sunbursttext")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
        .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
        .attr('dx', function (d) { return computeTextRotation(d) > 180 ? "35" : "-35"; }) // higher is more to the inside of sunburst
        .attr("dy", ".35em")
        .text(function(d) {
            if (d.name == "Equipment") {
                return "";
            }
            else if (d.name.length > 12) {
                return d.name.substring(0, 12) + "...";
            }
            else {
                return d.name;
            }
        })
        .on("click", click)
		.on("mouseover", function(d) {
            showItemTooltip(d);
			tooltip
				.text(d.name)
				.style("opacity", 1)
				.style("left", (d3.event.pageX) + 0 + "px")
                .style("top", (d3.event.pageY) - 0 + "px");

		})
		.on("mouseout", function(d) {
            hideItemTooltip();
			tooltip.style("opacity", 0);
		});

    // Function that handles clicks on the sunburst so that it can zoom.
    function click(d) {
        
        showItemTooltip(d);

        // Fade out text elements.
        text.transition()
            .attr("opacity", 0);

        // Make a transition to the new view.
        path.transition()
            .duration(750)
            .attrTween("d", arcTween(d))
            .each("end", function(e, i) {

                // Check if it lies within the angle span.
                if (e.x >= d.x && e.x < (d.x + d.dx)) {

                    // Get a selection of the associated text element.
                    var arcText = d3.select(this.parentNode).select("text");

                    // Fade in the text element and recalculate positions.
                    arcText.transition().duration(300)
                        .attr("opacity", 1)
                        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
                        .attr('text-anchor', function (d) { return computeTextRotation(d) > 180 ? "end" : "start"; })
                        .attr('dx', function (d) { return computeTextRotation(d) > 180 ? "40" : "-40"; })
                }
            });
    }

    // Interpolate the scales.
    function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(d, i) {
            return i ?
                function(t) {
                    return arc(d);
                } :
                function(t) {
                    x.domain(xd(t));
                    y.domain(yd(t)).range(yr(t));
                    return arc(d);
                };
        };
    }

    function computeTextRotation(d) {
        var ang = (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
        return (ang > 90) ? 180 + ang : ang;
    }
}

/* 
    Shows details about the item currently selected in the sunburst. 
*/
function showItemTooltip(item) {

    $('#tooltipcontent').hide();

    // If it's an actual item proceed to show tooltip
    if (item.slot != undefined) {

        // Only show AR for items where it is not NaN
        // TODO add check for whether item has slots at all?
        let agonyPart = isNaN(item.agonyResist) ? "0 Agony Resist" : '<p class=\"itemagonyresist\">' + item.agonyResist + ' Agony Resist</p>';

        $('#tooltipcontent').html(
            '<p class=\"itemname\">' + item.name + '</p>' +
            '<p class=\"itemrarity\" style=\"color:' + colorDictionary[item.rarity] + ' \">' + item.rarity + '</p>' +
            '<p class=\"itemtype\">' + item.slot + '</p>' +
            agonyPart
        );
        $('#tooltipcontent').show();
    }
}

function hideItemTooltip() {
    $('#tooltipcontent').hide();
}

/* 
    Show data about the character to accompany the sunburst. 
*/
function showCharacterData(characterName) {

    // Determine whether to display vanilla class or elitespec
    var character = account.characterDictionary[characterName];
    var profession = character.profession;

    if(character.eliteSpec != "" && character.eliteSpec != undefined) {
        profession = character.eliteSpec;
    }

    // Select the div and append html.
    $('#sunburstextra').html(
        '<p class=\"charname\">' + characterName + '</p>' +
        '<p class=\"charage"> Level ' + character.level + '</p>' +
        '<p class =\"charprofession\" style=\"color:' + colorDictionary[character.profession] + ' \">' +
        '<img class="profimg" src="Static/Professions/' + professionImageDictionary[profession] + '.png" alt="Achievements">' + profession + '</p>' +
        '<p class =\"charage\"> Played for <b>' + character.hoursPlayed + '</b> hours </p>' +
        '<p class =\"charage\"> <b>' + character.deaths + '</b> deaths </p>'
    );

    // Show div that contains this data
    $('#sunburstextra').show();
}