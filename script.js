const scenes = [
    function scene1() {
        d3.select("#visualization").html("");

        d3.csv("https://flunky.github.io/cars2017.csv").then(function(data) {
            // Parse data and filter out entries with Fuel type "Electricity"
            data = data.filter(d => d.Fuel !== "Electricity");

            // Parse AverageHighwayMPG as a number
            data.forEach(d => {
                d.AverageHighwayMPG = +d.AverageHighwayMPG;
            });

            // Sort data by AverageHighwayMPG in descending order
            data.sort((a, b) => d3.descending(a.AverageHighwayMPG, b.AverageHighwayMPG));

            const svg = d3.select("#visualization").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0 0 960 500");

            const margin = { top: 20, right: 30, bottom: 40, left: 220 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(data, d => d.AverageHighwayMPG)]);

            const y = d3.scaleBand()
                .range([height, 0])
                .padding(0.1)
                .domain(data.map(d => d.Make + ' ' + d.Fuel));

            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .style("font-size", "8px") // Adjust font size here
                .attr("x", 0)
                .attr("y", d => y(d.Make + ' ' + d.Fuel))
                .attr("width", d => x(d.AverageHighwayMPG))
                .attr("height", y.bandwidth());

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(10));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y));

            // Add x-axis title
            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + width / 2)
                .attr("y", height + margin.top + 30)
                .text("Average Highway MPG");

            // Add y-axis title
            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height / 2))
                .attr("y", 10)
                .text("Make, Fuel");
           // add annotation 
            const annotationX = x(d3.max(data, d => d.AverageHighwayMPG)) + margin.left;
            const annotationY = y("Mitsubishi Gasoline") + margin.top;

            svg.append("line")
                .attr("x1", annotationX)
                .attr("y1", annotationY)
                .attr("x2", annotationX)
                .attr("y2", annotationY - 120)
                .attr("stroke", "black");

            svg.append("text")
                .attr("x", annotationX - 30)
                .attr("y", annotationY - 140)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .selectAll("tspan")
                .data(["Mitsubishi seems to be", "leading in fuel efficiency"])
                .enter()
                .append("tspan")
                .attr("x", annotationX - 30)
                .attr("dy", (d, i) => i * 15)
                .text(d => d);
        }).catch(function(error) {
            console.error("Error loading the data: ", error);
        });
    },
    function scene2() {
        d3.select("#visualization").html("");

        d3.csv("https://flunky.github.io/cars2017.csv").then(function(data) {
            data = data.filter(d => d.Fuel !== "Electricity");

            data.forEach(d => {
                d.AverageHighwayMPG = +d.AverageHighwayMPG;
                d.AverageCityMPG = +d.AverageCityMPG;
                d.AverageBothMPG = (d.AverageHighwayMPG + d.AverageCityMPG) / 2;
            });

            let selectedMetric = "AverageCityMPG";

            const svg = d3.select("#visualization").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0 0 960 500");

            const margin = { top: 20, right: 30, bottom: 40, left: 220 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .range([0, width]);

            const y = d3.scaleBand()
                .range([height, 0])
                .padding(0.1);

            function updateChart() {
                data.sort((a, b) => d3.descending(a[selectedMetric], b[selectedMetric]));

                x.domain([0, d3.max(data, d => d[selectedMetric])]);
                y.domain(data.map(d => d.Make + ' ' + d.Fuel));

                const bars = g.selectAll(".bar")
                    .data(data, d => d.Make + ' ' + d.Fuel);

                bars.enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", 0)
                    .attr("y", d => y(d.Make + ' ' + d.Fuel))
                    .attr("height", y.bandwidth())
                    .merge(bars)
                    .transition()
                    .duration(1000)
                    .attr("width", d => x(d[selectedMetric]))
                    .attr("y", d => y(d.Make + ' ' + d.Fuel));

                bars.exit().remove();

                g.select(".axis--x")
                    .transition()
                    .duration(1000)
                    .call(d3.axisBottom(x).ticks(10));

                g.select(".axis--y")
                    .transition()
                    .duration(1000)
                    .call(d3.axisLeft(y));
                
            }

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(10));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y));

            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + width / 2)
                .attr("y", height + margin.top + 30)
                .text("MPG");

            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height / 2))
                .attr("y", 10)
                .text("Make, Fuel");
            updateChart();
            // add annotation
            const maxCityMPGData = data[0];
            const annotationX = x(maxCityMPGData.AverageCityMPG) + margin.left;
            const annotationY = y(maxCityMPGData.Make + ' ' + maxCityMPGData.Fuel) + margin.top;

                    svg.append("line")
                        .attr("class", "annotation")
                        .attr("x1", annotationX)
                        .attr("y1", annotationY)
                        .attr("x2", annotationX)
                        .attr("y2", annotationY - 120)
                        .attr("stroke", "black");

                     svg.append("text")
                        .attr("class", "annotation")
                        .attr("x", annotationX - 60)
                        .attr("y", annotationY - 140)
                        .attr("dy", ".35em")
                        .attr("text-anchor", "middle")
                        .style("font-size", "10px")
                        .selectAll("tspan")
                        .data(["When looking at MPG in the", "city, Lexus takes the lead."])
                        .enter()
                        .append("tspan")
                        .attr("x", annotationX - 60)
                        .attr("dy", (d, i) => i * 15)
                        .text(d => d);
            d3.select("#metric").on("change", function() {
                selectedMetric = d3.select(this).property("value");
                g.selectAll(".annotation").remove();
                updateChart();
            });
        }).catch(function(error) {
            console.error("Error loading the data: ", error);
        });
    },
    function scene3() {
        d3.select("#visualization").html("");

        d3.csv("https://flunky.github.io/cars2017.csv").then(function(data) {
            // Parse data and filter out entries with Fuel type "Electricity"
           // data = data.filter(d => d.Fuel !== "Electricity");

            // Parse MPG values as numbers
            data.forEach(d => {
                d.AverageHighwayMPG = +d.AverageHighwayMPG;
                d.AverageCityMPG = +d.AverageCityMPG;
                d.AverageBothMPG = (d.AverageHighwayMPG + d.AverageCityMPG) / 2;
            });

            // Initial metric and fuel types
            let selectedMetric = "AverageCityMPG";
            let selectedFuelTypes = ["Gasoline", "Diesel", "Electricity"];

            // Create the SVG container
            const svg = d3.select("#visualization").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0 0 960 500");

            const margin = { top: 20, right: 30, bottom: 40, left: 220 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .range([0, width]);

            const y = d3.scaleBand()
                .range([height, 0])
                .padding(0.1);

            function updateChart() {
                // Filter and sort data by selected metric and fuel types
                const filteredData = data.filter(d => selectedFuelTypes.includes(d.Fuel));
                filteredData.sort((a, b) => d3.descending(a[selectedMetric], b[selectedMetric]));

                x.domain([0, d3.max(filteredData, d => d[selectedMetric])]);
                y.domain(filteredData.map(d => d.Make + ' ' + d.Fuel));

                const bars = g.selectAll(".bar")
                    .data(filteredData, d => d.Make + ' ' + d.Fuel);

                bars.enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", 0)
                    .attr("y", d => y(d.Make + ' ' + d.Fuel))
                    .attr("height", y.bandwidth())
                    .merge(bars)
                    .transition()
                    .duration(1000)
                    .attr("width", d => x(d[selectedMetric]))
                    .attr("y", d => y(d.Make + ' ' + d.Fuel));

                bars.exit().remove();

                g.select(".axis--x")
                    .transition()
                    .duration(1000)
                    .call(d3.axisBottom(x).ticks(10));

                g.select(".axis--y")
                    .transition()
                    .duration(1000)
                    .call(d3.axisLeft(y));
            }

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(10));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y));

            // Add x-axis title
            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("x", margin.left + width / 2)
                .attr("y", height + margin.top + 30)
                .text("MPG");

            // Add y-axis title
            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height / 2))
                .attr("y", 10)
                .text("Make, Fuel");

            updateChart();

            d3.select("#metric").on("change", function() {
                selectedMetric = d3.select(this).property("value");
                updateChart();
            });

            const fuelCheckboxes = ["#fuel-gasoline", "#fuel-diesel", "#fuel-hybrid"];
            fuelCheckboxes.forEach(selector => {
                d3.select(selector).on("change", function() {
                    const checked = d3.select(this).property("checked");
                    const value = d3.select(this).property("value");
                    if (checked) {
                        selectedFuelTypes.push(value);
                    } else {
                        selectedFuelTypes = selectedFuelTypes.filter(fuel => fuel !== value);
                    }
                    updateChart();
                });
            });
        }).catch(function(error) {
            console.error("Error loading the data: ", error);
        });
    }
];

let currentScene = 0;

function updateScene() {
    scenes[currentScene]();
    if (currentScene === 1 || currentScene === 2) {
        d3.select("#metric-selection").style("display", "block");
    } else {
        d3.select("#metric-selection").style("display", "none");
    }
    if (currentScene === 2) {
        d3.select("#fuel-selection").style("display", "block");
    } else {
        d3.select("#fuel-selection").style("display", "none");
    }
}


d3.select("#prev").on("click", () => {
    if (currentScene > 0) {
        currentScene--;
        updateScene();
    }
});

d3.select("#next").on("click", () => {
    if (currentScene < scenes.length - 1) {
        currentScene++;
        updateScene();
    }
});

updateScene();
