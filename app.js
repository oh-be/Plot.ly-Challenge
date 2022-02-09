// option change update
function optionChanged(id) {
    updatePlotly2(id);
    updateDemoInfo(id)
  };
  
  // init / loads 1st option / loads data into 'names'
  function init() {
    d3.json("samples.json").then((data) => {
        var names = data.samples.map(x=>x.id)
        // append options per name/id
        names.forEach(function(name) {
            d3.select('#selDataset')
                .append('option')
                .text(name);
            });
    // arrays for each category       
    var sample_values = data.samples.map(x=> x.sample_values);
    var otu_ids = data.samples.map(x=> x.otu_ids);
    var otu_label = data.samples.map(x=> x.otu_labels);
    
    // top 10's
    // values
    var sorted_test = sample_values.sort(function(a, b){return b-a});
    var top_ten = sorted_test.map(x => x.slice(0,10));
    // otu ids / labels
    var sorted_ids = otu_ids.sort(function(a, b){return b-a});
    var top_ids = sorted_ids.map(x =>x.slice(0,10));
    // otu labels / hovertext
    var sorted_labels = otu_label.sort(function(a, b){return b-a});
    var top_labels = sorted_labels.map(x =>x.slice(0,10));
  
    // load first ID as default when firing up browser
    var firstID = data.metadata[0]
    var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
    
    // demographic information chart for first id / default
    var sampleMetadata = sampleMetadata1.data(d3.entries(firstID))
    sampleMetadata.enter()
                    .append('h1')
                    .merge(sampleMetadata)
                    .text(d => `${d.key} : ${d.value}`)
                    .style('font-size','12px')
  
    sampleMetadata.exit().remove()
    
    // Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual
    // 1. Use sample_values as the values for the bar chart
    // 2. Use otu_ids as the labels for the bar chart
    // 3. Use otu_labels as the hovertext for the chart
  
    // bar chart trace
    var trace1 = {
        x : top_ten[0],
        y : top_ids[0].map(x => "OTU" + x),
        text : top_labels[0],
        type : 'bar',
        orientation : 'h',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
        }]
    };
    // bar chart layout
    var layout1 = {
        title : '<b>Top 10 OTU</b>'
    };
  
    // load data into bar chart / Plotly
    var data = [trace1];
    var config = {responsive:true}
    Plotly.newPlot('bar', data, layout1,config);
  
    // Create a bubble chart that displays each sample.
    // 1. Use otu_ids for the x values.
    // 2. Use sample_values for the y values.
    // 3. Use sample_values for the marker size.
    // 4. Use otu_ids for the marker colors.
    // 5. Use otu_labels for the text values
  
    // bubble chart trace
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
  
    // bubble chart layout
    var layout2 = {
        title: '<b>Bubble Chart</b>',
        automargin: true,
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

    // load data into bubble chart / Plotly
    var data2 = [trace2];
    var config = {responsive:true}
    Plotly.newPlot('bubble',data2,layout2,config);
  
    //Advanced Challenge Assignment (Optional)
  
    // first id load / washFrequency
    var firstWFreq = firstID.wfreq;
  
    // gauge needle configurations
    var firstWFreqDeg = firstWFreq * 20;
    var degrees = 180 - firstWFreqDeg;
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(degrees * Math.PI / 180);
    var y = radius * Math.sin(degrees * Math.PI / 180);
  
    // gauge needle path, per Plotly docs
    var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
    var mainPath = path1,
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
    // gauge chart trace (includes point config)
    var dataGauge = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: firstWFreq,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "#0000FF",
              "#007FFF",
              "#00FFFF",
              "#7FFFD4",
              "#66FF00",
              "#39FF14",
              "#4FFFB0",
              "#1CAC78",
              "#00693E",
              "#ffffff"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          // use half of pie chart for gauge chart / to reflect example / referenced examples are for speed smh
          type: "pie",
          showlegend: false
        }
      ];
  
    // gauge chart layout
    var layoutGauge = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      };
      var config = {responsive:true}
      // Plot the gauge chart
      Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
    
  
    }); //close d3.json
  }; // close init() function
  
  
  // call init to refresh on updated selection
  init();
  
  
  // Update charts (bar and bubble)
  function updatePlotly2(id) {
    d3.json("samples.json").then((data) => {
        // select ID in the dropdown menu
        var test = data.samples.filter(x => x.id === id);
  
        // Get the top 10 sample values update
        var sample_values = test.map(x => x.sample_values).sort(function(a, b){return b-a});
        var top_values = sample_values.map(x => x.slice(0,10));
  
        // top
        var otu_ids = test.map(x=> x.otu_ids).sort(function(a, b){return b-a});
        var top_ids = otu_ids.map(x => x.slice(0,10));
  
        // Get the top ten labels update
        var otu_label = test.map(x=> x.otu_labels).sort(function(a, b){return b-a});
        var top_labels = otu_label.map(x => x.slice(0,10));

        // trace update / bar
        var trace = {
            x : top_values[0],
            y : top_ids[0].map(x => "OTU" + x),
            text : top_labels[0],
            type : 'bar',
            orientation : 'h',
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
              }]
        };
  
        // layout update / bar
        var layout1 = {
            title: "<b>Top 10 OTU</b>"
        };
        var data1 = [trace];
        var config = {responsive:true}
  
        // render updated chart / bar
        Plotly.newPlot('bar', data1,layout1,config);
  
        // trace update / bubble
        var trace2 = {
            x : test.map(x=> x.otu_ids)[0],
            y : test.map(x => x.sample_values)[0],
            text : test.map(x=> x.otu_labels),
            mode : 'markers',
            marker : {
                color : test.map(x=> x.otu_ids)[0],
                size : test.map(x => x.sample_values)[0]
            }   
        };
  
        // layout update / bubble
        var layout2 = {
            title: '<b>Bubble Chart</b>',
            automargin: true,
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
  
        // render updated chart / bubble
        var data2 = [trace2];
        var config = {responsive:true}
        Plotly.newPlot('bubble', data2,layout2,config)
    });
  };
  
  // demographic and gauge update on new ID selection
  function updateDemoInfo(id) {
    d3.json("samples.json").then((data) => {
  
        // new filter for the selected ID
        var metadataSamples = data.metadata.filter(x => x.id === +id)[0];
  
        // update demographic information for the selected ID
        var sampleMetadata1 = d3.select("#sample-metadata").selectAll('h1')
        var sampleMetadata = sampleMetadata1.data(d3.entries(metadataSamples))
        sampleMetadata.enter().append('h1').merge(sampleMetadata).text(d => `${d.key} : ${d.value}`).style('font-size','12px');
  
        // update wash frequency info for the current ID            
        var wFreq = metadataSamples.wfreq;
        var wFreqDeg = wFreq * 20;
  
        // render pointer / gauge chart
        var degrees = 180 - wFreqDeg;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(degrees * Math.PI / 180);
        var y = radius * Math.sin(degrees * Math.PI / 180);
  
        // update pointer path
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
        // render gauge chart
        var dataGauge = [
            {
            type: "scatter",
            x: [0],
            y: [0],
            marker: { size: 12, color: "850000" },
            showlegend: false,
            name: "Freq",
            text: wFreq,
            hoverinfo: "text+name"
            },
            {
            values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
            rotation: 90,
            text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                  "#0000FF",
                  "#007FFF",
                  "#00FFFF",
                  "#7FFFD4",
                  "#66FF00",
                  "#39FF14",
                  "#4FFFB0",
                  "#1CAC78",
                  "#00693E",
                  "#ffffff"
                ]
            },
            labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
            hoverinfo: "label",
            hole: 0.5,
            type: "pie",
            showlegend: false
            }
        ];
        // update layout / gauge
        var layoutGauge = {
            shapes: [
            {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                color: "850000"
                }
            }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            },
            yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
            }
        };
        var config = {responsive:true}
  
        // update gauge chart
        Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
  
    });
  };