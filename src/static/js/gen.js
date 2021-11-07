var cnv;
var gif;
let idx = 0;
let sm_angle = 25;
let lg_angle = 35;
let interval_id = 0;
let font;

function get_sin(idx, a, k){
  x = ((2*Math.PI)/60)*idx;
  return a * Math.sin(x-Math.PI) + k;
}

function get_tri(idx, a, k){
  x = ((2*Math.PI)/60)*idx;
  return (2*a)/Math.PI * (Math.asin(Math.sin(x + Math.PI))) + k;
}

let sizex = [140, 139, 138, 137, 136, 135, 134, 133, 132, 131, 130, 129, 128, 127, 126,
             126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140,
             140, 139, 138, 137, 136, 135, 134, 133, 132, 131, 130, 129, 128, 127, 126,
             126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140]

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

function start() {
  color1 = select('#color1').elt.value
  color2 = select('#color2').elt.value
  txt = select('#text').elt.value
  fcolor = select('#fcolor').elt.value
  scolor = select('#scolor').elt.value
  size_delta = select('#size_delta').elt.value
  preview = true;
  function doit2(){
    doit(color1, color2, txt, fcolor, scolor, size_delta, preview)
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
  color1 = select('#color1').elt.value
  color2 = select('#color2').elt.value
  txt = select('#text').elt.value
  fcolor = select('#fcolor').elt.value
  scolor = select('#scolor').elt.value
  size_delta = select('#size_delta').elt.value
  preview = false;
  function doit2(){
    doit(color1, color2, txt, fcolor, scolor, size_delta, preview)
  }

  interval_id = setInterval(doit2, 40);
  interval_elem = select('#interval')
  interval_elem.elt.value = interval_id
}


function doit(color1, color2, txt, fcolor, scolor, size_delta, preview) {

  // background
  pinwheel(width / 2, height / 2, 300, idx*6, color1, color2);

  // text
  drawtext(width / 2, height / 2, idx, txt, fcolor, scolor, size_delta)

  
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





function drawtext(x, y, idx, txt, fcolor, scolor, size_delta){
  textSize(sizex[idx] - size_delta);
  textAlign(CENTER, CENTER);
  bbox = font.textBounds(txt, x, y - 10 )

  stroke(scolor);
  strokeWeight(10);
  fill(fcolor);
  push()
  dx = bbox.x + (bbox.w / 2)
  dy = bbox.y + (bbox.h / 2)
  translate(dx , dy)
  //rotate(get_sin(idx, 15, 0))
  rotate(get_tri(idx, 15, 0))
  translate(-dx , -dy)
  text(txt, x, y - 10);
  pop()
}

function pinwheel(x, y, arcsize, step, color1, color2) {
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
