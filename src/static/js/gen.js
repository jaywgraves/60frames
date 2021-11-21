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
  params.color1 = select('#color1').elt.value
  params.color2 = select('#color2').elt.value
  params.txt = select('#inptext').elt.value
  params.fcolor = select('#fcolor').elt.value
  params.scolor = select('#scolor').elt.value
  params.txtstart = parseInt(select('#txtstart').elt.value)
  params.txtamp = parseInt(select('#txtamp').elt.value)
  params.rotamp = parseInt(select('#rotamp').elt.value)
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
  // background
  drawbackground(width / 2, height / 2, 300, idx*6, params.color1, 25, params.color2, 35);

  // text
  drawtext(width / 2, height / 2, idx, params.txt, params.fcolor, params.scolor, params.txtstart, params.txtamp, params.rotamp)

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

function drawtext(x, y, idx, txt, fcolor, scolor, txtstart, txtamp, rotamp ){
  textSize(get_tri(idx, txtamp, txtstart, 0));
  textAlign(CENTER, CENTER);
  stroke(scolor);
  strokeWeight(10);
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

function drawbackground(x, y, arcsize, step, color1, sm_angle, color2, lg_angle) {
  // draws 12 arcs, varying between color1/sm_angle and color2/lg_angle
  // starting at a specific angular degree of 'step'
  // and a circle of color2 in the middle of the canvas
  noStroke();
  let angle = 0;
  for (let i = 0; i < 6; i++) {
    fill(color1);
    arc(x, y, arcsize, arcsize, step + angle, step + angle + sm_angle);
    angle += sm_angle;
    fill(color2);
    arc(x, y, arcsize, arcsize, step + angle, step + angle + lg_angle);
    angle += lg_angle;
  }
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