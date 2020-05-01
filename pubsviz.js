// Global variables
var pubsYears = ["All years", "2006", "2007", "2008", "2011", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"];
var pubsTypes = ["All types", "Journal article", "Conference paper", "Book", "Book chapter", "Thesis", "Report", "Conference poster", "Blog post", "Magazine article", "Software"];


// http://bl.ocks.org/williaster/10ef968ccfdc71c30ef8




d3.json("data/data.json")
    .then(data => {
        var data2 = data;

        var articleCount = {
            "Journal article": 0,
            "Conference paper": 0,
            "Book": 0,
            "Book chapter": 0,
            "Thesis": 0,
            "Report": 0,
            "Conference poster": 0,
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

        // Explore the data and extract values
        data2.forEach(e => {
            // Overall count of articles by type
            for (article in articleCount) {
                if (e["type"] == article) {
                    articleCount[article]++;
                }
            }
            // Overall count of articles by year
            for (year in yearCount) {
                if (e["year"] == year) {
                    yearCount[year]++;
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
        var scientificArticles = parseInt(articleCount["Journal article"]) + parseInt(articleCount["Conference paper"]);
        statsText = "Massimo has published several publications so far, including " + scientificArticles + " scientific articles, " + articleCount["Book"] + " books, " + articleCount["Book chapter"] + " chapters, and more."
        d3.select("#short-pubs-overview").html(statsText);
        d3.select("#pubsviztext").append("p").html(statsText);
        // Update the chart in the page with the stats
        var vlSpec = {
            $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
            "width": 400,
            "height": 300,
            "config": {
                "font": "dosis"
            },
            "data": {
                "values": pubsStats
            },
            "mark": {
                "type": "line",
                "point": true
            },
            "encoding": {
                "x": {
                    "timeUnit": "year",
                    "field": "year",
                    "type": "temporal"
                },
                "y": {
                    "field": "articles",
                    "type": "quantitative"
                },
                "color": {
                    "field": "type",
                    "type": "nominal"
                }
            }
        };
        vegaEmbed('#pubsviz', vlSpec);
    }).catch(error => {
        console.error(error);
    });
