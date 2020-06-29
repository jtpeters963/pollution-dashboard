function init() {
    //  dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the fake county data coming from a json, we need to eventually populate with real data 
    d3.json("static/data/fakecountynames.json").then((data)=> {
        console.log("inside the init function");
        console.log(data);

        // get the id data to the dropdwown menu
        data.county_names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
      
    });
}

init();