const scenes = [
    function scene1() {
        d3.select("#visualization").html("");
   
    },
    function scene2() {
        d3.select("#visualization").html("");

    },
    function scene3() {
        d3.select("#visualization").html("");
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
updateScene(); 

function addAnnotation(svg, text, x, y) {
    svg.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("class", "annotation")
        .text(text);
}

function scene1() {
    const svg = d3.select("#visualization").append("svg")
        .attr("width", "100%")
        .attr("height", "100%");


    addAnnotation(svg, "This is an annotation", 50, 50);
}

