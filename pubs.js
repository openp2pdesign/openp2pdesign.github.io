// Global variables
var previousYear = "2005";
var yearSelection = "All years";
var typeSelection = "All types";
var pubsYears = ["All years", "2006", "2007", "2008", "2011", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
var pubsTypes = ["All types", "Journal article", "Conference paper", "Book", "Book chapter", "Thesis", "Report", "Blog post", "Magazine article", "Software"];

d3.json("data/data.json")
    .then(data => {

        var data2 = data;
        pubsPlot();
        pubsText();


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
        var select = d3.select('#pubsfilter')
            .append('select')
            .attr('class', 'select')
            .attr('class', "form-control")
            .on('change', onTypeChange)

        var options = select
            .selectAll('option')
            .data(pubsTypes).enter()
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
        $("#makermovement").click(function() {
            keywordFilter("makermovement");
        });
        $("#link_impact").click(function() {
            keywordFilter("impact");
        });
        $("#link_openp2pddd").click(function() {
            keywordFilter("openp2pddd");
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

        function pubsText() {
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
                        pubDiv.append("p").html('<span class="normal-icons"><i class="fas fa-tags"></i> ' + item.keywords.join(', ') + '</span>');
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

        function pubsPlot() {
            var articlesCount = {
                "Journal article": 0,
                "Conference paper": 0,
                "Book": 0,
                "Book chapter": 0,
                "Thesis": 0,
                "Report": 0,
                "Blog post": 0,
                "Magazine article": 0,
                "Software": 0
            }

            var yearCount = {
                "2006": 0,
                "2007": 0,
                "2008": 0,
                "2011": 0,
                "2013": 0,
                "2014": 0,
                "2015": 0,
                "2016": 0,
                "2017": 0,
                "2018": 0,
                "2019": 0,
                "2020": 0
            }

            // Remove the "all" values
            pubsYears.shift();
            pubsTypes.shift();
            // Create the structure of the pubsStats variable
            var pubsStats = []
            for (i = 0; i < pubsYears.length; i++) {
                for (j = 0; j < pubsTypes.length; j++) {
                    pubsStats.push({
                        "year": pubsYears[i],
                        "articles": 0,
                        "type": pubsTypes[j]
                    });
                }
            }
            // Create the structure of the articlesCountStats variable
            var articlesCountStats = [];
            for (i = 0; i < pubsTypes.length; i++) {
                articlesCountStats.push({
                    "articles": 0,
                    "type": pubsTypes[i]
                });
            }
            // Create the structure of the yearsCountStats variable
            var yearsCountStats = [];
            for (i = 0; i < pubsYears.length; i++) {
                yearsCountStats.push({
                    "articles": 0,
                    "year": pubsYears[i]
                });
            }

            // Explore the data and extract values
            data2.forEach(e => {
                // Overall count of articles by type
                for (article in articlesCount) {
                    if (e["type"] == article) {
                        articlesCount[article]++;
                        for (l = 0; l < articlesCountStats.length; l++) {
                            if (articlesCountStats[l]["type"] == e["type"]) {
                                articlesCountStats[l]["articles"]++;
                            }
                        }
                    }
                }
                // Overall count of articles by year
                for (year in yearCount) {
                    if (e["year"] == year) {
                        yearCount[year]++;
                        for (l = 0; l < yearsCountStats.length; l++) {
                            if (yearsCountStats[l]["year"] == e["year"]) {
                                yearsCountStats[l]["articles"]++;
                            }
                        }
                    }
                }
                // Count of articles by type and year
                for (k = 0; k < pubsStats.length; k++) {
                    if (pubsStats[k]["year"] == e["year"] && pubsStats[k]["type"] == e["type"]) {
                        pubsStats[k]["articles"]++;
                    }
                }
            });
            // Update text in the page with the stats
            // Overview 0
            var scientificArticles = parseInt(articlesCount["Journal article"]) + parseInt(articlesCount["Conference paper"]);
            statsText = "Massimo Menichinelli has published several publications so far, including " + scientificArticles + " scientific articles, " + articlesCount["Book"] + " books, " + articlesCount["Book chapter"] + " chapters and more."
            d3.select("#short-pubs-overview").html(statsText);
            // Overview 1
            statsText = "Massimo Menichinelli has published several publications so far, including " + scientificArticles + " scientific articles, " + articlesCount["Book"] + " books, " + articlesCount["Book chapter"] + " chapters and more. This section contains a selection of the most relevant publications."
            d3.select("#pubsviztext").append("p").html(statsText);
            // Update the chart in the page with the stats of articles per year
            var vlSpec = {
                $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
                "width": "container",
                "height": 400,
                "autosize": {
                    "type": "fit-x",
                    "resize": "true",
                    "contains": "content"
                },
                "config": {
                    "font": "dosis",
                    "legend": {
                        "labelFontSize": 15,
                        "titleFontSize": 22,
                        "title": null,
                        "orient": "bottom"
                    },
                },
                "data": {
                    "values": pubsStats
                },
                "mark": {
                    "type": "line",
                    "strokeWidth": 3,
                    "point": {
                    "filled": true
                }
                },
                "selection": {
                    "publicationType": {
                        "type": "multi",
                        "fields": ["type"],
                        "bind": "legend"
                    }
                },
                "encoding": {
                    "opacity": {
                        "condition": {
                            "selection": "publicationType",
                            "value": 1
                        },
                        "value": 0.07
                    },
                    "x": {
                        "timeUnit": "year",
                        "field": "year",
                        "type": "temporal",
                        "axis": {
                            "labelFontSize": 15,
                            "titleFontSize": 22,
                            "title": "Time"
                        }
                    },
                    "y": {
                        "field": "articles",
                        "type": "quantitative",
                        "axis": {
                            "labelFontSize": 15,
                            "titleFontSize": 22,
                            "title": "Publications"
                        }
                    },
                    "color": {
                        "field": "type",
                        "type": "nominal"
                    }
                }
            };
            vegaEmbed('#pubsviz1', vlSpec);
            // Update the chart in the page with the stats of articles
            var vlSpec2 = {
                $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
                "width": "container",
                "height": 300,
                "autosize": {
                    "type": "fit-x",
                    "resize": "true",
                    "contains": "content"
                },
                "config": {
                    "font": "dosis"
                },
                "data": {
                    "values": articlesCountStats
                },
                "mark": {
                    "type": "bar"
                },
                "encoding": {
                    "y": {
                        "field": "type",
                        "type": "nominal",
                        "axis": {
                            "labelFontSize": 15,
                            "titleFontSize": 22,
                            "title": "Type"
                        }
                    },
                    "x": {
                        "field": "articles",
                        "type": "quantitative",
                        "axis": {
                            "labelFontSize": 15,
                            "titleFontSize": 22,
                            "title": "Number"
                        },
                    },
                    "color": {
                        "field": "type",
                        "type": "nominal",
                        "legend": null
                    }
                }
            };
            vegaEmbed('#pubsviz2', vlSpec2);
            // Update the chart in the page with the stats of articles
            var vlSpec3 = {
                $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
                "width": "container",
                "height": 300,
                "autosize": {
                    "type": "fit-x",
                    "resize": "true",
                    "contains": "content"
                },
                "config": {
                    "font": "dosis"
                },
                "data": {
                    "values": yearsCountStats
                },
                "mark": {
                    "type": "area",
                    "interpolate": "monotone",
                    "point": {
                        "filled": false,
                        "fill": "#fff"
                    },
                    "color": {
                        "x1": 1,
                        "y1": 1,
                        "x2": 1,
                        "y2": 0,
                        "gradient": "linear",
                        "stops": [{
                                "offset": 0,
                                "color": "white"
                            },
                            {
                                "offset": 1,
                                "color": "#ff6600"
                            }
                        ]
                    }
                },
                "encoding": {
                    "x": {
                        "field": "year",
                        "type": "temporal",
                        "axis": {
                            "labelFontSize": 15,
                            "titleFontSize": 22,
                            "title": "Time"
                        },
                    },
                    "y": {
                        "legend": null,
                        "field": "articles",
                        "type": "quantitative",
                        "axis": {
                            "labelFontSize": 15,
                            "titleFontSize": 22,
                            "title": "Publications"
                        },
                    },
                }
            };
            vegaEmbed('#pubsviz3', vlSpec3);
        }

    })
    .catch(error => {
        console.error(error);
    });
