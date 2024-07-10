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

            // Sort data by AverageHighwayMPG in ascending order
            data.sort((a, b) => d3.ascending(a.AverageHighwayMPG, b.AverageHighwayMPG));

            const svg = d3.select("#visualization").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0 0 960 500");

            const margin = { top: 20, right: 30, bottom: 40, left: 200 },
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
                .style("font-size", "12px") // Adjust font size here
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
                .attr("x", width / 2)
                .attr("y", height + margin.top + 30)
                .text("Average Highway MPG");

            // Add y-axis title
            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height / 2))
                .attr("y", -margin.left + 20)
                .text("Make and Fuel");
        }).catch(function(error) {
            console.error("Error loading the data: ", error);
        });
    },
    function scene2() {
        d3.select("#visualization").html("");

        d3.csv("https://flunky.github.io/cars2017.csv").then(function(data) {
            // Parse data and filter out entries with Fuel type "Electricity"
            data = data.filter(d => d.Fuel !== "Electricity");

            // Parse MPG values as numbers
            data.forEach(d => {
                d.AverageHighwayMPG = +d.AverageHighwayMPG;
                d.AverageCityMPG = +d.AverageCityMPG;
                d.AverageBothMPG = (d.AverageHighwayMPG + d.AverageCityMPG) / 2;
            });

            // Initial metric
            let selectedMetric = "AverageCityMPG";

            // Create the SVG container
            const svg = d3.select("#visualization").append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0 0 960 500");

            const margin = { top: 20, right: 30, bottom: 40, left: 200 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            const x = d3.scaleLinear()
                .range([0, width]);

            const y = d3.scaleBand()
                .range([height, 0])
                .padding(0.1);

            function updateChart(metric) {
                // Sort data by selected metric in ascending order
                data.sort((a, b) => d3.ascending(a[metric], b[metric]));

                x.domain([0, d3.max(data, d => d[metric])]);
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
                    .attr("width", d => x(d[metric]))
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
                .attr("x", width / 2)
                .attr("y", height + margin.top + 30)
                .text("MPG");

            // Add y-axis title
            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height / 2))
                .attr("y", -margin.left + 20)
                .text("Make and Fuel");

            updateChart(selectedMetric);

            d3.select("#metric").on("change", function() {
                selectedMetric = d3.select(this).property("value");
                updateChart(selectedMetric);
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

            const margin = { top: 20, right: 30, bottom: 40, left: 200 },
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
                filteredData.sort((a, b) => d3.ascending(a[selectedMetric], b[selectedMetric]));

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
                .attr("x", width / 2)
                .attr("y", height + margin.top + 30)
                .text("MPG");

            // Add y-axis title
            svg.append("text")
                .attr("class", "axis-title")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -(height / 2))
                .attr("y", -margin.left + 20)
                .text("Make and Fuel");

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

