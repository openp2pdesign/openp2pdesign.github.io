d3.select("#pubs").style("background-color", "#cfedba");

d3.json("data/data.json")
    .then(data => {
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
                    d3.select("#pubs").append('p').append("pre").attr("class","bibtex").html(bibcontent);
                });
        });
    })
    .catch(error => {
        console.error(error);
    });
