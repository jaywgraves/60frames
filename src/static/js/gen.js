var cnv;
var gif;
let idx = 0;
let interval_id = 0;
let font;

function get_sin(idx, a, k, h){
  x = ((2*Math.PI)/60)*idx;
  return a * Math.sin(x+h) + k;
}

function get_tri(idx, a, k, h){
  x = ((2*Math.PI)/60)*idx;
  return (2*a)/Math.PI * (Math.asin(Math.sin(x + h))) + k;
}

function preload(){
  font = loadFont('static/fonts/Ubuntu-B.ttf');
}

function setup() {
  noLoop();
  cnv = createCanvas(200, 200);
  cnv.parent('gifcanvas');
  textFont(font);
  angleMode(DEGREES);
  setupGIF();
}

function get_params() {
  params = {};
  // text
  params.fcolor = select('#fcolor').elt.value
  params.scolor = select('#scolor').elt.value
  params.txt = select('#inptext').elt.value
  params.ssize= select('#ssize').elt.value
  params.txtstart = parseInt(select('#txtstart').elt.value)
  params.txtamp = parseInt(select('#txtamp').elt.value)
  params.rotamp = parseInt(select('#rotamp').elt.value)
  // background
  params.sectioncnt = parseInt(select('#sectioncnt').elt.value)
  params.angles = []
  params.colors = []
  angle = 360 / params.sectioncnt
  for (i=0; i < params.sectioncnt; i++) {
    params.angles.push(angle)
    params.colors.push(select('#color' + (i +1)).elt.value)
  }
  return params
}

function start() {
  preview = true;
  function doit2(){
    doit(null, preview)
  }
  interval_id = setInterval(doit2, 40);
  interval_elem = select('#interval')
  interval_elem.elt.value = interval_id
}

function stop() {
  interval_elem = select('#interval')
  interval_id = interval_elem.elt.value
  clearInterval(interval_id)
}

function saveemoji() {
  stop()
  idx = 0
  params = get_params();
  preview = false;
  function doit2(){
    doit(params, preview)
  }

  interval_id = setInterval(doit2, 40);
  interval_elem = select('#interval')
  interval_elem.elt.value = interval_id
}


function doit(params, preview) {
  if (!params) {
    params = get_params()
  }
  clear();
  // background
  drawbackground(width / 2, height / 2, idx*6, params)

  // text
  drawtext(width / 2, height / 2, idx, params.txt, params.fcolor, params.scolor, params.ssize, params.txtstart, params.txtamp, params.rotamp)

  if (!preview) {
  gif.addFrame(cnv.elt, {
            delay: 40,
            copy: true
        });
  }
  idx += 1;
  if (idx === 60 ) {
    idx = 0;
    if (!preview) {
      clearInterval(interval_id)
      gif.render();
    }
  }
}

function drawtext(x, y, idx, txt, fcolor, scolor, ssize, txtstart, txtamp, rotamp ){
  if (!txt) { return ;}
  textSize(get_tri(idx, txtamp, txtstart, 0));
  textAlign(CENTER, CENTER);
  stroke(scolor);
  if (ssize > 0) {
    strokeWeight(ssize);
  } else {
    noStroke();
  };
  fill(fcolor);
  bbox = font.textBounds(txt, x, y)
  push()
  dx = bbox.x + (bbox.w / 2)
  dy = bbox.y + (bbox.h / 2)
  translate(dx , dy)
  rotate(get_tri(idx, rotamp, 0, 0))
  translate(-dx , -dy)
  //rect(bbox.x, bbox.y, bbox.w, bbox.h)  //debug bounding box
  text(txt, x, y);
  pop()
}

function drawbackground(x, y, startangle, params){
  // startangle = idx * 6 which is the starting spot of the arc
  noStroke();
  params.arcsize = 300;
  angle = 0;
  for (let i = 0; i < params.sectioncnt; i++) {
      fill(params.colors[i % params.colors.length]);
      arcbeg = startangle + angle
      arcend = arcbeg + params.angles[i % params.angles.length]
      arc(x, y, params.arcsize, params.arcsize, arcbeg, arcend);
      angle += params.angles[i % params.angles.length];
    }

  fill(params.colors[0]);
  ellipse(x, y, 50, 50);
}

function setupGIF() {
  gif = new GIF({
      workers: 5,
      quality: 20,
      workerScript: "static/js/gif.worker.js"
  });
  gif.on('finished', function(blob) {
      window.open(URL.createObjectURL(blob));
      gif.abort();
      gif.frames = [];
      delete gif.imageParts;
      delete gif.finishedFrames;
      delete gif.nextFrame;
  });
}

function resetUI() {
  var sectioncnt = document.querySelector("#sectioncnt").value;
  for (i=1; i<13; i++) {
    color_elem = document.querySelector("#color" + i);
    if (i <= sectioncnt) {
      color_elem.parentNode.style.visibility = 'visible'
    } else {
      color_elem.parentNode.style.visibility = 'hidden'
    }
  }
}