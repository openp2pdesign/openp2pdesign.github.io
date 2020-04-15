d3.select("#pubs").style("background-color", "#fff");

d3.json("data/data.json")
    .then(data => {
        // Filter publications
        $("#link_metadesign").click(function() {
            console.log("Link on meta-design publications clicked.");
        });
        $("#link_platforms").click(function() {
            console.log("Link on platforms publications clicked.");
        });
        $("#link_processes").click(function() {
            console.log("Link on processes publications clicked.");
        });
        $("#link_networks").click(function() {
            console.log("Link on networks publications clicked.");
        });
        $("#link_organizations").click(function() {
            console.log("Link on organizations publications clicked.");
        });
        $("#link_governance").click(function() {
            console.log("Link on governance publications clicked.");
        });
        $("#link_socinno").click(function() {
            console.log("Link on social innovation publications clicked.");
        });
        $("#link_socent").click(function() {
            console.log("Link on social entrepreneurship publications clicked.");
        });
        $("#link_impact").click(function() {
            console.log("Link on impact publications clicked.");
        });
        $("#link_openp2pddd").click(function() {
            console.log("Link on open,p2p,ddd systems publications clicked.");
        });
        $("#link_local").click(function() {
            console.log("Link on local publications clicked.");
        });
        $("#link_community").click(function() {
            console.log("Link on community publications clicked.");
        });
        $("#link_sustainability").click(function() {
            console.log("Link on sustainability publications clicked.");
        });
        $("#link_sustainability").click(function() {
            console.log("Link on sustainability publications clicked.");
        });

        // Create a database of all publication
        var library = [];
        data.forEach(function(item) {
            library.push(item.bibtex);
        });
        // For each item in the data array
        data.forEach(function(item) {
            // load the bibtex
            d3.text("data/" + item.bibtex)
                .then(bibtex => {
                    let bibcontent = bibtex;
                    let example = new Cite(bibtex);
                    let output = example.format('bibliography', {
                        format: 'html',
                        template: 'apa',
                        lang: 'en-US'
                    });
                    // Add the div of the publication
                    pubDiv = d3.select("#pubs").append('div').attr("class","pubdiv");
                    // Add the image
                    pubDiv.append("p").append("img").attr("src","data/"+item.image);
                    console.log(item.image);
                    // Add the citation in APA style
                    pubDiv.append("p").html(output);
                    // Add the type
                    pubDiv.append("p").html('<span class="normal-icons"><i class="fas fa-book"></i> '+item.type+'</span>');
                    // Add the keywords
                    pubDiv.append("p").html('<span class="normal-icons"><i class="fas fa-tags"></i> '+item.keywords+'</span>');
                    // Add the description
                    pubDiv.append("p").attr("class","pub-description").html(item.description);
                    // Button for downloading the publication
                    pubDiv.append('a').attr("href","data/"+item.pdf).html('<button type="button" class="btn btn-primary">Text <i class="fas fa-file-pdf"></i></button>');
                    // Button for downloading the reference
                    pubDiv.append('a').attr("href","data/"+item.bibtex).html('<button type="button" class="btn btn-primary">Reference file <i class="fas fa-download"></i></button>');
                    // Button for collapsible reference
                    idToCollapse = "iD"+item.bibtex.replace('.','');
                    pubDiv.append('button').attr("class","btn btn-primary").attr("type","button").attr("data-toggle","collapse").attr("data-target", "#"+idToCollapse).attr("aria-expanded","false").attr("aria-controls",idToCollapse).html('Reference code <i class="fas fa-code"></i>');
                    // Collapsible reference
                    pubDiv.append("div").attr("class","collapse-separator");
                    pubDiv.append("div").attr("class","collapse").attr("id",idToCollapse).append("div").attr("class","card card-body").append("pre").attr("class", "bibtex").html(bibcontent);
                });

        });
    })
    .catch(error => {
        console.error(error);
    });
