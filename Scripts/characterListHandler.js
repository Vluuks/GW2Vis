let app;

function initialize() {
    app = new Vue({
        el: '#charoverview-container',
        data: {
            characters: [],
            search: "",
            checkedProfessions: [],
            selected : "none"
        },
        computed: {
            filteredCharacters() {
                return filter(this.characters, this.search, this.selected);
            }
        },
        methods : {
            
        }

    });
}

function addCharacter(character) {
    let char = character; // if i push character directly, it does not work?
    Vue.set(app.characters, app.characters.length, char)

}


function drawGearProgress(percentage, character) {
    var svg = d3.select("#progressbar-"+ character)
    let percentages = [15, 60, 25];
    let colors = ["#8119d1", "#dd1a7f", "#d3d3d3"]

    var g = svg.append("g")
        .attr("width", 250)
        .attr("height", 20)

    let offset = 0;
    percentages.forEach(function(prct, i){
        
        g.append("rect")
            .attr("width", prct*2)
            .attr("height", 20)
            .style("fill", colors[i])
            .attr("x", offset)      
            
        offset+=(prct*2)
    })
}


function matchStringNoCase(source, comparison){
    return source.toUpperCase().match(comparison.toUpperCase());
}

/*
    Filters items in the collection based on the selected category and search field input. Compares against
    tags, description and item name. 
*/
function filter(collection, searchTerm, criterion) {

    if(criterion != "none") {
        sort(collection, criterion);
    }
    
    return collection.filter((item) => {

        // Apply category filter
        if(app.checkedProfessions.length > 0)
            return app.checkedProfessions.includes(item.profession.toLowerCase())  && (matchStringNoCase(item.name, searchTerm))

        return matchStringNoCase(item.name, searchTerm) ;
    });

}

function sort(collection, criterion) {
    collection.sort(function(a, b){

        switch(criterion) {

            case "name":
                return a.name.localeCompare(b.name);
            case "race":
                return a.race.localeCompare(b.race);
            case "profession":
                let toCheck = (a.profession === b.profession && (a.eliteSpec != undefined && b.eliteSpec != undefined)) ? "eliteSpec" : "profession";
                return a[toCheck].localeCompare(b[toCheck]);
            case "level":
                return a.level < b.level;
            case "age" :
                break;
            case "playtime" :
                return +a.hoursPlayed < +b.hoursPlayed;
            case "deaths" :
                return +a.deaths < +b.deaths;
            case "bispercentage" :
                return +a.bestInSlot.percentage < +b.bestInSlot.percentage;
            
        }
    })
} 