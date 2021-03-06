import * as d3 from "d3";

export const grafokres = ({
  elem, data, btnFn,
  yFormat = "x", yMin = 0, yMax = 100,
  ...parameters
}) => {
  const hiddenFrom = parameters.cutoff;
  const interval = (parameters.interval === "decade") ? 10 : 1;
  const precision = (yMax > 100) ? 1 : 10;

  const clamp = (a, b, c) => Math.max(a, Math.min(b, c));

  const width = Math.min(d3.select(elem).node().offsetWidth, 600);
  const height = 250;
  const svg = d3.select(elem)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(50,50)");

  const btn = d3.select(elem)
    .append("button")
    .attr("class", "grafbtn disabled")
    .attr("id", `${elem.substring(1)}btn`)
    .text("Potvrdit");

  const xscale = d3.scaleLinear()
    .domain([d3.min(data.map((x) => x.year)), d3.max(data.map((x) => x.year))])
    .range([0, width - 100]);

  const yscale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);

  const x_axis = d3.axisBottom()
    .scale(xscale)
    .ticks((window.innerWidth < 600) ? 5 : 10)
    .tickFormat((x) => x);

  const y_axis = d3.axisLeft()
    .scale(yscale)
    .ticks(5)
    .tickFormat((x) => eval(yFormat));

  svg.append("g")
    .call(y_axis);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(x_axis);

  const valueDisplay = svg.append("g")
    .attr("class", "valuedisplay")
    .append("text")
    .attr("x", xscale(d3.max(data.map((x) => x.year))));

  const introText = svg.append("g")
    .attr("class", "introtext")
    .append("text")
    .attr("y", height / 2)
    .attr("text-anchor", "middle");

  introText.append("tspan")
    .attr("x", width - 100 - (width - xscale(hiddenFrom) + 1) / 4)
    .text("Sem nakreslete");

  introText.append("tspan")
    .attr("x", width - 100 - (width - xscale(hiddenFrom) + 1) / 4)
    .attr("dy", "18")
    .text("svůj odhad.");

  const area = d3.area().x((x) => xscale(x.year) + 1).y0((x) => yscale(x.value)).y1(height);
  const line = d3.area().x((x) => xscale(x.year) + 1).y((x) => yscale(x.value));

  const clipRect = svg
    .append("clipPath")
    .attr("id", `${elem.substring(1)}clip`)
    .append("rect")
    .attr("width", xscale(hiddenFrom) + 1)
    .attr("height", height);

  const correctSel = svg.append("g").attr("clip-path", `url(${elem}clip)`);

  correctSel.append("path")
    .attr("class", "area")
    .attr("d", area(data));
  correctSel.append("path")
    .attr("class", "line")
    .attr("d", line(data));
  const yourDataSel = svg.append("path").attr("class", "your-line");

  const yourData = data
    .map((d) => ({ year: d.year, value: d.value, defined: 0 }))
    .filter((d) => {
      if (d.year === hiddenFrom) d.defined = true;
      return d.year >= hiddenFrom;
    });

  let completed = false;

  const drag = d3.drag()
    .on("drag", function (){
      introText.style("display", "none");

      if (!completed) {
        const pos = d3.mouse(this);
        const year = clamp(hiddenFrom + (1 * interval), d3.max(data.map((x) => x.year)) + 1, xscale.invert(pos[0]));
        const value = clamp(0, yscale.domain()[1], yscale.invert(pos[1]));
        yourData.forEach((d) => {
          if (Math.abs(d.year / interval - year / interval) < .5){
            d.value = value;
            d.defined = true;
          }
        });

        const definedData = yourData.filter((x) => x.defined === true);
        const latestDefined = d3.max(definedData.map((x) => x.year));

        const latestValue =  Math.round( (yourData.filter((x) => x.year === latestDefined)[0].value * precision) ) / precision;
        function latestValueFormat(x) { return eval(yFormat); }

        valueDisplay.text(`● ${latestValueFormat(latestValue.toString().replace(".", ","))}`)
          .attr("y", yscale(latestValue) + 5);

        yourDataSel.attr("d", line.defined((x) => x.defined)(yourData));
      }

      if (!completed && (d3.mean(yourData, (x) => x.defined == 1) === 1)) {
        btn.attr("class", "grafbtn")
          .attr("data-entered", yourData.map((x) => Math.round(x.value * precision) / precision));
      }
    });

  btn.on("click", btnClick);

  function btnClick() {
    if (!btn.classed("disabled")) {
      completed = true;
      btn.style("visibility", "hidden");
      clipRect.transition().duration(1000).attr("width", xscale(d3.max(data.map((x) => x.year))));
      btnFn(btn);
    }
  }

  svg.call(drag);
};

export default grafokres;
