const scenes = [
    function scene1() {
        d3.select("#visualization").html("");

        d3.csv("https://flunky.github.io/cars2017.csv").then(function(data) {
            // Parse data and sort by highway mpg
            data.forEach(d => {
                d.AverageHighwayMPG = +d.AverageHighwayMPG;
            });
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

            // Add an annotation
            g.append("text")
                .attr("class", "annotation")
                .attr("x", x(data[0].AverageHighwayMPG) + 10)
                .attr("y", y(data[0].Make + ' ' + data[0].Fuel) + y.bandwidth() / 2)
                .text(`Highest MPG: ${data[0].Make} ${data[0].Fuel} (${data[0].AverageHighwayMPG})`);
        }).catch(function(error) {
            console.error("Error loading the data: ", error);
        });
    }
];

let currentScene = 0;

function updateScene() {
    scenes[currentScene]();
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

updateScene(); // Initialize the first scene
