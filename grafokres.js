module.exports = grafokres;
function grafokres(parameters) {
	const d3 = Object.assign({}, require("d3-selection"), require("d3-axis"), require("d3-scale"), require("d3-array"),
		require("d3-shape"), require("d3-drag"), require("d3-transition"));

	const elem = parameters.elem;
	const data = parameters.data;
	const hiddenFrom = parameters.cutoff;

	
	const width = Math.min(d3.select(elem).node().offsetWidth, 600);
	const height = 400;
	const svg = d3.select(elem)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate(50,50)");

	const xscale = d3.scaleLinear()
		.domain([d3.min(data.map(x => x.year)), d3.max(data.map(x => x.year))])
		.range([0, width - 100]);

	const yscale = d3.scaleLinear()
		.domain([0, 100])
		.range([height, 0]);

	const x_axis = d3.axisBottom()
		.scale(xscale)
		.ticks(window.innerWidth < 600 ? 8 : 10)
		.tickFormat(x => x);

	const y_axis = d3.axisLeft()
		.scale(yscale)
		.ticks(5)
		.tickFormat(x => x + " %");

	svg.append("g")
		.call(y_axis);

	svg.append("g")
		.attr("transform", "translate(0, " + height  +")")
		.call(x_axis);

	const area = d3.area().x(x => xscale(x.year)+1).y0(x => yscale(x.debt)).y1(height);
	const line = d3.area().x(x => xscale(x.year)+1).y(x => yscale(x.debt));

	const clipRect = svg
		.append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", xscale(hiddenFrom) + 1)
		.attr("height", height);

	const correctSel = svg.append("g").attr("clip-path", "url(#clip)");

	correctSel.append("path")
		.attr("class", "area")
		.attr("d", area(data));
	correctSel.append("path")
		.attr("class","line")
		.attr("d", line(data));
	const yourDataSel = svg.append("path").attr("class","your-line");

	const yourData = data
		.map(d => ({year: d.year, debt: d.debt, defined: 0}) )
		.filter(function(d){
			if (d.year == hiddenFrom) d.defined = true;
			return d.year >= hiddenFrom;
		});

	let completed = false;

	const drag = d3.drag()
		.on("drag", function(){

			if (!completed) {
				var pos = d3.mouse(this);
				var year = clamp(2009, 2016, xscale.invert(pos[0]));
				var debt = clamp(0, yscale.domain()[1], yscale.invert(pos[1]));

				yourData.forEach(function(d){
					if (Math.abs(d.year - year) < .5){
						d.debt = debt;
						d.defined = true;
					}
				});
				
				yourDataSel.attr("d", line.defined(x => x.defined)(yourData));
			}
			
			if (!completed && (d3.mean(yourData, x => x.defined == 1) === 1)){
				completed = true;
				clipRect.transition().duration(1000).attr("width", xscale(d3.max(data.map(x => x.year))));
				//onsole.log(yourData.map(x => Math.round(x.debt*10)/10));
			}
		});

	svg.call(drag);

	function clamp(a, b, c){ return Math.max(a, Math.min(b, c)); }
}