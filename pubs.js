// Global variables
var previousYear = "2005";
var yearSelection = "All years";
var typeSelection = "All types";

d3.json("data/data.json")
    .then(data => {

        var data2 = data;
        pubsPlot();

        // Function for filtering publications by year and type
        function yearTypeFilter() {
            if (yearSelection == "All years" && typeSelection == "All types") {
                console.log("pi");
                var filtered = data;
            } else if (yearSelection == "All years" && typeSelection !== "All types") {
                var filtered = data.filter(function(d) {
                    return d.type == typeSelection;
                });
            } else if (typeSelection == "All types" && yearSelection !== "All years") {
                var filtered = data.filter(function(d) {
                    return d.year == yearSelection;
                });
            } else {
                var filtered = data.filter(function(d) {
                    return d.type == typeSelection && d.year == yearSelection;
                });
            }
            data2 = filtered;
            previousYear = "2005"
            pubsPlot();
        }

        // Function for filtering publications by keyword
        function keywordFilter(keyword) {
            keywords = [keyword]
            var filtered = data.filter(function(pub) {
                return pub.keywords.some(function(tag) {
                    return keywords.includes(tag);
                });
            });
            data2 = filtered;
            previousYear = "2005"
            pubsPlot();
        }

        // Add a filter for years
        var pubsYears = ["All years", "2006", "2007", "2008", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];

        var select = d3.select('#pubsfilter')
            .append('select')
            .attr('class', 'select')
            .attr('class', "form-control")
            .on('change', onYearsChange)

        var options = select
            .selectAll('option')
            .data(pubsYears).enter()
            .append('option')
            .text(function(d) {
                return d;
            });

        function onYearsChange() {
            yearSelection = d3.select(this).property('value');
            yearTypeFilter();
        };

        // Add a filter for type
        var pubsType = ["All types", "Journal article", "Conference paper", "Book", "Book chapter", "Thesis", "Report", "Conference poster", "Blog post", "Magazine article", "Software"];

        var select = d3.select('#pubsfilter')
            .append('select')
            .attr('class', 'select')
            .attr('class', "form-control")
            .on('change', onTypeChange)

        var options = select
            .selectAll('option')
            .data(pubsType).enter()
            .append('option')
            .text(function(d) {
                return d;
            });

        function onTypeChange() {
            typeSelection = d3.select(this).property('value');
            yearTypeFilter();
        };

        // Filter publications
        $("#link_metadesign").click(function() {
            keywordFilter("metadesign");
        });
        $("#link_platforms").click(function() {
            keywordFilter("platforms");
        });
        $("#link_processes").click(function() {
            keywordFilter("processes");
        });
        $("#link_networks").click(function() {
            keywordFilter("networks");
        });
        $("#link_organizations").click(function() {
            keywordFilter("organizations");
        });
        $("#link_governance").click(function() {
            keywordFilter("governance");
        });
        $("#link_socinno").click(function() {
            keywordFilter("socinno");
        });
        $("#link_socent").click(function() {
            keywordFilter("socent");
        });
        $("#link_impact").click(function() {
            keywordFilter("impact");
        });
        $("#link_openp2pddd").click(function() {
            keywordFilter("openp2pdddd");
        });
        $("#link_local").click(function() {
            keywordFilter("local");
        });
        $("#link_community").click(function() {
            keywordFilter("community");
        });
        $("#link_sustainability").click(function() {
            keywordFilter("sustainability");
        });

        // Create a database of all publication
        var library = [];
        data.forEach(function(item) {
            library.push(item.bibtex);
        });

        function pubsPlot() {
            // Reset
            d3.select("#pubs").html("");

            // For each item in the data array
            data2.forEach(function(item) {
                // load the bibtex
                d3.text("data/" + item.bibtex)
                    .then(bibtex => {
                        thisYear = item.year;
                        let bibcontent = bibtex;
                        let example = new Cite(bibtex);
                        let output = example.format('bibliography', {
                            format: 'html',
                            template: 'apa',
                            lang: 'en-US'
                        });
                        // Add the div of the year
                        if (thisYear !== previousYear) {
                            pubYearDiv = d3.select("#pubs").append('div').attr("class", "pubyeardiv");
                            pubYearDiv.append("h2").html(thisYear);
                        }
                        // Add the div of the publication
                        pubDiv = d3.select("#pubs").append('div').attr("class", "pubdiv");
                        // Add the image
                        if (item.image) {
                            pubDiv.append("p").append("img").attr("src", "data/" + item.image);
                        }
                        // Add the citation in APA style
                        pubDiv.append("p").html(output);
                        // Add the type
                        pubDiv.append("p").html('<span class="normal-icons"><i class="fas fa-book"></i> ' + item.type + '</span>');
                        // Add the keywords
                        pubDiv.append("p").html('<span class="normal-icons"><i class="fas fa-tags"></i> ' + item.keywords + '</span>');
                        // Add the description
                        pubDiv.append("p").attr("class", "pub-description").html(item.description);
                        // Button for downloading the publication
                        if (item.pdf) {
                            pubDiv.append('a').attr("href", "data/" + item.pdf).html('<button type="button" class="btn btn-primary">Text <i class="fas fa-file-pdf"></i></button>');
                        }
                        // Button for downloading the reference
                        pubDiv.append('a').attr("href", "data/" + item.bibtex).html('<button type="button" class="btn btn-primary">Reference file <i class="fas fa-download"></i></button>');
                        // Button for collapsible reference
                        idToCollapse = "iD" + item.bibtex.replace('.', '');
                        pubDiv.append('button').attr("class", "btn btn-primary").attr("type", "button").attr("data-toggle", "collapse").attr("data-target", "#" + idToCollapse).attr("aria-expanded", "false").attr("aria-controls", idToCollapse).html('Reference code <i class="fas fa-code"></i>');
                        // Collapsible reference
                        pubDiv.append("div").attr("class", "collapse-separator");
                        pubDiv.append("div").attr("class", "collapse").attr("id", idToCollapse).append("div").attr("class", "card card-body").append("pre").attr("class", "bibtex").html(bibcontent);

                        if (previousYear !== thisYear) {
                            previousYear = thisYear;
                        }
                    });

            });
        };




    })
    .catch(error => {
        console.error(error);
    });
