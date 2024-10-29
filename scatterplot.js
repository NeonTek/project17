// Initial dimensions based on viewport size
let width = Math.min(window.innerWidth * 0.9, 800);
let height = Math.min(window.innerHeight * 0.56, 600);
let padding = Math.min(window.innerWidth * 0.1, 60);

// Select SVG and set dimensions
const svg = d3.select("#myCanvas")
              .attr("width", width)
              .attr("height", height);

// Define tooltip using D3 and set to hidden initially
const tooltip = d3.select("body")
                .append("div")
                .attr("id", "tooltip")
                .style("position", "absolute")
                .style("background-color", "#fff")
                .style("padding", "8px")
                .style("border-radius", "4px")
                .style("box-shadow", "0px 0px 5px rgba(0, 0, 0, 0.3)")
                .style("opacity", 0)
                .style("pointer-events", "none");

// Load data and draw scatter plot
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(data => {
  data.forEach(d => {
    d.Year = new Date(d.Year, 0);
    d.Time = new Date(1970, 0, 1, 0, ...d.Time.split(':').map(Number));
  });

  // Set up scales
  const xScale = d3.scaleTime()
                    .domain(d3.extent(data, d => d.Year))
                    .range([padding, width - padding]);

  const yScale = d3.scaleTime()
                    .domain(d3.extent(data, d => d.Time))
                    .range([height - padding, padding]);

  // Set up responsive year format
  const formatYear = window.innerWidth < 650 ? d3.timeFormat("'%y") : d3.timeFormat("%Y");

  // Draw x and y axes
  svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(d3.axisBottom(xScale).tickFormat(formatYear));

  svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));
  
  // Draw data points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", Math.max(5 * (width / 800), 3))
    .attr("fill", d => d.Doping ? "orange" : "steelblue")
    .attr("data-xvalue", d => d.Year.getFullYear())
    .attr("data-yvalue", d => d.Time)
    .on("mouseover", (event, d) => {
        tooltip.style("opacity", 1)
               .attr("data-year", d.Year.getFullYear())
               .html(`Year: ${d.Year.getFullYear()}<br>Time: ${d3.timeFormat("%M:%S")(d.Time)}`)
               .style("left", `${event.pageX + 10}px`)
               .style("top", `${event.pageY + 10}px`);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
})
.catch(error => console.log("Error:", error));
