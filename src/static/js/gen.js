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
  setindex();
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
  params.colorcnt = parseInt(select('#colorcnt').elt.value)
  params.sectioncnt = parseInt(select('#sectioncnt').elt.value)
  params.angles = []
  params.colors = []
  for (i=0; i < params.colorcnt; i++) {
    params.angles.push(parseInt(select('#angle' + (i+1)).elt.value))
    params.colors.push(select('#color' + (i+1)).elt.value)
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

function setindex(x) {
  stop()
  if (typeof x == 'undefined') {
    idx = parseInt(document.querySelector('#frameidx').value)
  } else {
    idx += x
  }
  params = get_params();
  doit(params, true)
}


function doit(params, preview) {
  if (!params) {
    params = get_params()
  }
  clear();
  // background
  drawbackground(width / 2, height / 2, idx*6, params)

  // text
  drawtext(width / 2, height / 2, idx, params)

  if (!preview) {
  gif.addFrame(cnv.elt, {
            delay: 40,
            copy: true
        });
  }
  idx += 1;
  if (idx >= 60 ) {
    idx = 0;
    if (!preview) {
      clearInterval(interval_id)
      gif.render();
    }
  }
  document.querySelector("#frameidx").value = idx;
}

function drawtext(x, y, idx, params){
  if (!params.txt) { return ;}
  scolor = color(params.scolor)
  //scolor.setAlpha(params.scoloralpha)
  fcolor = color(params.fcolor)
  //fcolor.setAlpha(params.fcoloralpha)
  textSize(get_tri(idx, params.txtamp, params.txtstart, 0));
  textAlign(CENTER, CENTER);
  if (params.ssize > 0) {
    stroke(scolor);
    strokeWeight(params.ssize);
  } else {
    noStroke();
  };
  fcolor = color(fcolor)
  fcolor.setAlpha(128)
  fill(fcolor);
  WEIRD_Y = -10
  bbox = font.textBounds(params.txt, x, y+WEIRD_Y)
  push()
  dx = bbox.x + (bbox.w / 2)
  //if (dx > 100) {
  //  j = dx - 100
  //  dx = dx - j;
  //} else {
  //  j = 100 - dx
  //  dx = dx + j;
  //}
  dy = bbox.y + (bbox.h / 2)
  //if (dy > 100) {
  //  j = dy - 100
  //  dy = dy - j;
  //} else {
  //  j = 100 - dy
  //  dy = dy + j;
  //}
  //console.log(idx, bbox.x, bbox.y, bbox.w, bbox.h , dx,dy)
  dy = dy + WEIRD_Y
  circle(dx,dy,10)
  translate(dx , dy)
  rotate(get_tri(idx, params.rotamp, 0, 0))
  translate(-dx , -dy)
  rect(bbox.x, bbox.y, bbox.w, bbox.h)  //debug bounding box
  text(params.txt, x, y+WEIRD_Y);
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
colorcfg = {
  1 : {default:1, enabled: [1]},
  2 : {default:8, enabled: [2,4,6,8,10,12]},
  3 : {default:9, enabled: [3,6,9,12]},
  4 : {default:8, enabled: [4,8,12]},
  5 : {default:5, enabled: [5,10]},
  6 : {default:6, enabled: [6,12]},
  8 : {default:8, enabled: [8]},
  9 : {default:9, enabled: [9]},
  10 : {default:10, enabled: [10]},
  12 : {default:12, enabled: [12]}
}

function resetUI() {
  document.querySelector("#frameidx").value = idx;
  var colorcnt = parseInt(document.querySelector("#colorcnt").value);
  var last_colorcnt_elem = document.querySelector("#last_colorcnt");
  var last_colorcnt = parseInt(last_colorcnt_elem.value);
  var sectioncnt_elem = document.querySelector("#sectioncnt");
  var sectioncnt = parseInt(sectioncnt_elem.value);
  var last_sectioncnt_elem = document.querySelector("#last_sectioncnt");
  var last_sectioncnt = parseInt(last_sectioncnt_elem.value);
  cfg = colorcfg[colorcnt];
  if (colorcnt != last_colorcnt) {
    last_sectioncnt = -1
    for (i=0; i < sectioncnt_elem.options.length; i++) {
      o = sectioncnt_elem.options[i]
      if (cfg.enabled.includes(parseInt(o.value))) {
        o.disabled = false;
      } else {
        o.disabled = true;
      }
      if (o.value === String(cfg.default)) {
        o.selected = true;
      }
    }
  }

  sectioncnt = parseInt(sectioncnt_elem.value);
  a = 360 / sectioncnt;
  for (i=1; i<13; i++) {
    color_elem = document.querySelector("#color" + i);
    angle_elem = document.querySelector("#angle" + i);
    if (i <= colorcnt) {
      color_elem.parentNode.style.visibility = 'visible'
      if (sectioncnt != last_sectioncnt) {
        angle_elem.value = a;
      }
    } else {
      color_elem.parentNode.style.visibility = 'hidden'
      if (sectioncnt != last_sectioncnt) {
        angle_elem.value = 0;
      }
    }
  last_sectioncnt_elem.value  = sectioncnt;
  last_colorcnt_elem.value  = colorcnt;
  }
}