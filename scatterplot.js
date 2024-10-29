let width = 800;
let height = 600;
const padding = 60;

// Select the SVG and set up dimensions
const svg = d3.select("#myCanvas");

// Define tooltip using D3 and set it to hidden initially
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

// Load data and draw the scatter plot
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(data => {
  // Parse date and time
  data.forEach(d => {
    d.Year = new Date(d.Year, 0);  // Convert year to a Date object
    d.Time = new Date(1970, 0, 1, 0, ...d.Time.split(':').map(Number)); // Convert time to a Date object
  });

  // Set up scales
  const xScale = d3.scaleTime()
                    .domain(d3.extent(data, d => d.Year))
                    .range([padding, width - padding]);

  const yScale = d3.scaleTime()
                    .domain(d3.extent(data, d => d.Time))
                    .range([height - padding, padding]);

  // Draw x and y axes
  svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y")));

  svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")));

  // Draw each data point as an SVG circle
  svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(d.Time))
      .attr("r", 5)
      .attr("fill", "steelblue")
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
