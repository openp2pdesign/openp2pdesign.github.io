d3.select("#pubs").style("background-color", "#cfedba");

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

        // Create a database of all articles
        var library = [];
        data.forEach(function(item) {
            library.push(item.bibtex);
        });
        console.log(library);
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
                    d3.select("#pubs").append('p').html(output);
                    d3.select("#pubs").append('p').append("pre").attr("class", "bibtex").html(bibcontent);
                });
        });
    })
    .catch(error => {
        console.error(error);
    });
