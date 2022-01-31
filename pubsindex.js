// Global variables
var previousYear = "2005";
var yearSelection = "All years";
var typeSelection = "All types";
var pubsYears = ["All years", "2006", "2007", "2008", "2011", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
var pubsTypes = ["All types", "Journal article", "Conference paper", "Book", "Book chapter", "Thesis", "Report", "Blog post", "Magazine article", "Software"];
var pubsYearsChart = ["2006", "2007", "2008", "2011", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
var pubsTypesChart = ["Journal article", "Conference paper", "Book", "Book chapter", "Thesis", "Report", "Blog post", "Magazine article", "Software"];

d3.json("data/data.json")
    .then(data => {

        var data2 = data;
        pubsPlot();

        // Function for filtering publications by year and type
        function yearTypeFilter() {
            if (yearSelection == "All years" && typeSelection == "All types") {
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
            previousYear = "2005";
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
            previousYear = "2005";
            pubsPlot();
        }

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
                "2020": 0,
                "2021": 0,
                "2022": 0,
                "2023": 0,
                "2024": 0,
                "2025": 0
            }

            // Create the structure of the pubsStats variable
            var pubsStats = []
            for (i = 0; i < pubsYearsChart.length; i++) {
                for (j = 0; j < pubsTypesChart.length; j++) {
                    pubsStats.push({
                        "year": pubsYearsChart[i],
                        "articles": 0,
                        "type": pubsTypesChart[j]
                    });
                }
            }
            // Create the structure of the articlesCountStats variable
            var articlesCountStats = [];
            for (i = 0; i < pubsTypesChart.length; i++) {
                articlesCountStats.push({
                    "articles": 0,
                    "type": pubsTypesChart[i]
                });
            }
            // Create the structure of the yearsCountStats variable
            var yearsCountStats = [];
            for (i = 0; i < pubsYearsChart.length; i++) {
                yearsCountStats.push({
                    "articles": 0,
                    "year": pubsYearsChart[i]
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
            statsText = "Massimo Menichinelli has published several publications so far, including " + scientificArticles + " scientific articles, " + articlesCount["Book"] + " books, " + articlesCount["Book chapter"] + " chapters and more. This section contains a selection of the most relevant publications.";
            d3.select("#pubsviztext").html("");
            d3.select("#pubsviztext").append("p").html(statsText);

        }

    })
    .catch(error => {
        console.error(error);
    });
