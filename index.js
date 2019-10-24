const stamp = Date.now() + Math.floor(Math.random() * 10000);

const data = [
  {
    year: 1800,
    value: 30.46,
  },
  {
    year: 1810,
    value: 30.62,
  },
  {
    year: 1820,
    value: 30.81,
  },
  {
    year: 1830,
    value: 30.91,
  },
  {
    year: 1840,
    value: 30.98,
  },
  {
    year: 1850,
    value: 31.1,
  },
  {
    year: 1860,
    value: 29.91,
  },
  {
    year: 1870,
    value: 31.09,
  },
  {
    year: 1880,
    value: 31.59,
  },
  {
    year: 1890,
    value: 32.01,
  },
  {
    year: 1900,
    value: 32.04,
  },
  {
    year: 1910,
    value: 34.29,
  },
  {
    year: 1920,
    value: 34.46,
  },
  {
    year: 1930,
    value: 38.64,
  },
  {
    year: 1940,
    value: 40.74,
  },
  {
    year: 1950,
    value: 47.72,
  },
  {
    year: 1960,
    value: 49.92,
  },
  {
    year: 1970,
    value: 59.19,
  },
  {
    year: 1980,
    value: 62.55,
  },
  {
    year: 1990,
    value: 65.1,
  },
  {
    year: 2000,
    value: 66.82,
  },
  {
    year: 2010,
    value: 70.33,
  },
  {
    year: 2020,
    value: 73.34,
  },
];

const data2 = [
  { year: 2001, value: 31.4 },
  { year: 2002, value: 32.6 },
  { year: 2003, value: 34.5 },
  { year: 2004, value: 35.5 },
  { year: 2005, value: 35.6 },
  { year: 2006, value: 35.3 },
  { year: 2007, value: 35.2 },
  { year: 2008, value: 39.3 },
  { year: 2009, value: 52.3 },
  { year: 2010, value: 60.9 },
  { year: 2011, value: 65.9 },
  { year: 2012, value: 70.4 },
  { year: 2013, value: 72.6 },
  { year: 2014, value: 74.4 },
  { year: 2015, value: 73.6 },
];

grafokres.grafokres({
  elem: "#graf1",
  data: data,
  cutoff: 1940,
  interval: "decade",
  btnFn: postResult,
});

grafokres.grafokres({
  elem: "#graf2",
  data: data2,
  cutoff: 2008,
  interval: "year",
  btnFn: postResult,
  yFormat: "x + ' %'",
});

function postResult(btn) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", response);
  xhr.open("POST", "https://9x274i2n0k.execute-api.eu-central-1.amazonaws.com/prod/");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify({ user_id: stamp, q_id: btn.attr("id").substring(0, btn.attr("id").length - 3), data: btn.attr("data-entered").split(",") }));
  function response() { console.log(this.response); }
}
