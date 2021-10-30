var cnv;
var gif;
let idx = 0;
let sm_angle = 25;
let lg_angle = 35;
let interval_id = 0;
let font;
let rotatex = [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, -13, -14, -15,  
               -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 
              14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

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
  textFont(font);
  angleMode(DEGREES);
  interval_id = setInterval(doit, 40);
  setupGIF();
}

function doit() {
  color1 = "#009600"
  color2 = "#00ff00"
  txt = "TY"
  fcolor = "#ffffff"
  scolor = "#000000"
  size_delta = 20
  preview = true;

  // background
  pinwheel(width / 2, height / 2, 500, idx*6, color1, color2);

  // text
  drawtext(width / 2, height / 2, idx, txt, fcolor, scolor)

  
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





function drawtext(x, y, idx, txt, fcolor, scolor){
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
  rotate(rotatex[idx])
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
      quality: 20
  });
  gif.on('finished', function(blob) {
      window.open(URL.createObjectURL(blob));
  });
}
