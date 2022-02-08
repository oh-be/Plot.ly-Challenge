// funtion optionChanged(id) {
//     updatePlotly2(id);
//     updateDemoInfo(id)
// };

// Step 1: Plotly
// Use the D3 library to read in samples.json.
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.

function init() {
    d3.json("samples.json").then((data) => {
        var names = data.samples.map(x=>x.id)
        names.forEach(function(name) {
            d3.select('#selDataset')
                .append('option')
                .text(name);
        });
    // pulldata
    var sample_values = data.samples.map(x=> x.sample_values);
    var otu_ids = data.samples.map(x=> x.otu_ids);
    var otu_label = data.samples.map(x=> x.otu_labels);
    // top10
    var sorted_test = sample_values.sort(function(a, b) {return b-a});
    var top_ten = sorted_test.map(x => x.slice(0,10));
    var sorted_ids = otu_ids.sort(function(a, b) {return b-a});
    var top_ids = sorted_ids.map(x => x.slice(0,10));
    var sorted_labels = otu_label.sort(function(a, b) {return b-a});
    var top_labels = sorted_labels.map(x => x.slice(0,10));
    // Display the sample metadata, i.e., an individual's demographic information.
    // Display each key-value pair from the metadata JSON object somewhere on the page.
    //1stID
    var firstID = data.metadata[0]
    var sampleMetadata1 = d3.select('#sample-metadata').selectAll('h1')
    // demographic info for above pull / 1stID
    var sampleMetadata = sampleMetadata1.data(d3.entries(firstID))
    sampleMetadata.enter()
        .append('h1')
        .merge(sampleMetadata)
        .text(d => `${d.key} : ${d.value}`)
        .style(`font-size`,'12px')
    sampleMetadata.exit().remove()
    // trace for barchart
    var trace1 = {
        x : top_ten[0],
        y : top_ids[0].map(x => "OTU" + x),
        text : top_labels[0],
        type : 'bar',
        orientation : 'h',
        transforms : [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]
    };
    // barchart layout
    var layout1 = {
        title: '<b>Top 10 OTUs</b>'
    };
    // barchart
    var data = [trace1];
    var config = {responsive:true}
    Plotly.newPlot('bar', data, layout1, config);
    // Create a bubble chart that displays each sample.
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.
    // bubble trace2
    var trace2 = {
        x : otu_ids[0],
        y : sample_values[0],
        text : otu_label[0],
        mode : 'markers',
        marker : {
            color : otu_ids[0],
            size : sample_values[0]
        }
    };
    // bubble layout
    var layout2 = {
        title : '<b>Bubble Chart</b>',
        automargin : true,
        autosize: true,
        showlegend: false,
        margin: {
            l: 150,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        }
    };
    var config = {responsive:true}
    // bubble chart
    var data2 = [trace2];
    Plotly.newPlot('bubble', data2, layout2, config);
    // bonus-gauge chart
    // 1st ID wash frequency
    var firstWFreq = firstID.wfreq;
    // needle calc
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L';
    var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
    // gauge chart trace
    var dataGauge = [{
        type: 'scatter',
        x: [0],
        y: [0],
        marker: { 
            size: 12,
            color: '850000'},
        showlegend: false,
        name: 'Freq',
        text: firstWFreq,
        hoverinfo: 'text+name'
    },
    {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: [
                'rgba(0, 105, 11, .5)',
                'rgba(10, 120, 22, .5)',
                'rgba(14, 127, 0, .5)',
                'rgba(110, 154, 22, .5)',
                'rgba(170, 202, 42, .5)',
                'rgba(202, 209, 95, .5)',
                'rgba(210, 206, 145, .5)',
                'rgba(232, 226, 202, .5)',
                'rgba(240, 105, 215, .5)',
                'rgba(255, 255, 255, 0)'
            ]
        },
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: 0.5,
        type: 'pie',
        showlegend: false
    }
];
    var layoutGauge = {
        
    }
    })
    
    
}