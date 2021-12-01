
var sketch = function(p) {
  p.cnv = null;
  p.gif = null;
  p.idx = 0;
  p.interval_id = 0;
  p.font = null;

  p.get_sin = function(idx, a, k, h){
    x = ((2*Math.PI)/60)*idx;
    return a * Math.sin(x+h) + k;
  }

  p.get_tri = function(idx, a, k, h){
    x = ((2*Math.PI)/60)*idx;
    return (2*a)/Math.PI * (Math.asin(Math.sin(x + h))) + k;
  }

  p.preload = function(){
    p.font = p.loadFont('static/fonts/Ubuntu-B.ttf');
  }

  p.setup = function() {
    p.noLoop();
    p.cnv = p.createCanvas(200, 200);
    p.cnv.parent('gifcanvas');
    p.textFont(p.font);
    p.angleMode(p.DEGREES);
    p.setupGIF();
    p.setindex();
  }

  p.get_params = function() {
    params = {};
    // text
    params.fcolor = p.select('#fcolor').elt.value
    params.scolor = p.select('#scolor').elt.value
    params.txt = p.select('#inptext').elt.value
    params.ssize= p.select('#ssize').elt.value
    params.txtstart = parseInt(p.select('#txtstart').elt.value)
    params.txtamp = parseInt(p.select('#txtamp').elt.value)
    params.rotamp = parseInt(p.select('#rotamp').elt.value)
    // background
    params.colorcnt = parseInt(p.select('#colorcnt').elt.value)
    params.sectioncnt = parseInt(p.select('#sectioncnt').elt.value)
    params.angles = []
    params.colors = []
    for (i=0; i < params.colorcnt; i++) {
      params.angles.push(parseInt(p.select('#angle' + (i+1)).elt.value))
      params.colors.push(p.select('#color' + (i+1)).elt.value)
    }
    return params
  }

  p.start = function() {
    preview = true;
    p.doit2 =function(){
      p.doit(null, preview)
    }
    p.interval_id = setInterval(p.doit2, 40);
    p.interval_elem = p.select('#interval')
    p.interval_elem.elt.value = p.interval_id
  }

  p.stop = function() {
    p.interval_elem = p.select('#interval')
    p.interval_id = p.interval_elem.elt.value
    clearInterval(p.interval_id)
  }

  p.saveemoji = function() {
    p.stop()
    p.idx = 0
    p.params = p.get_params();
    preview = false;
    p.doit2 = function(){
      p.doit(params, preview)
    }

    p.interval_id = setInterval(p.doit2, 40);
    p.interval_elem = p.select('#interval')
    p.interval_elem.elt.value = p.interval_id
  }

  p.setindex = function(x) {
    p.stop()
    if (typeof x == 'undefined') {
      idx = parseInt(document.querySelector('#frameidx').value)
    } else {
      idx += x
    }
    p.params = p.get_params();
    p.doit(p.params, true)
  }


  p.doit = function(params, preview) {
    if (!params) {
      params = p.get_params()
    }
    p.clear();
    // background
    p.drawbackground(p.width / 2, p.height / 2, p.idx*6, params)

    // text
    p.drawtext(p.width / 2, p.height / 2, p.idx, params)

    if (!preview) {
    p.gif.addFrame(p.cnv.elt, {
              delay: 40,
              copy: true
          });
    }
    p.idx += 1;
    if (p.idx >= 60 ) {
      p.idx = 0;
      if (!preview) {
        clearInterval(p.interval_id)
        p.gif.render();
      }
    }
    document.querySelector("#frameidx").value = p.idx;
  }

  p.drawtext = function(x, y, idx, params){
    if (!params.txt) { return ;}
    scolor = p.color(params.scolor)
    //scolor.setAlpha(params.scoloralpha)
    fcolor = p.color(params.fcolor)
    //fcolor.setAlpha(params.fcoloralpha)
    p.textSize(p.get_tri(idx, params.txtamp, params.txtstart, 0));
    p.textAlign(p.CENTER, p.CENTER);
    if (params.ssize > 0) {
      p.stroke(scolor);
      p.strokeWeight(params.ssize);
    } else {
      p.noStroke();
    };
    p.fill(fcolor);
    bbox = p.font.textBounds(params.txt, x, y)
    p.push()
    dx = bbox.x + (bbox.w / 2)
    dy = bbox.y + (bbox.h / 2)
    p.translate(dx , dy)
    p.rotate(p.get_tri(idx, params.rotamp, 0, 0))
    p.translate(-dx , -dy)
    //p.rect(bbox.x, bbox.y, bbox.w, bbox.h)  //debug bounding box
    p.text(params.txt, x, y);
    p.pop()
  }

  p.drawbackground = function(x, y, startangle, params){
    // startangle = idx * 6 which is the starting spot of the arc
    p.noStroke();
    params.arcsize = 300;
    angle = 0;
    for (let i = 0; i < params.sectioncnt; i++) {
        p.fill(params.colors[i % params.colors.length]);
        arcbeg = startangle + angle
        arcend = arcbeg + params.angles[i % params.angles.length]
        p.arc(x, y, params.arcsize, params.arcsize, arcbeg, arcend);
        angle += params.angles[i % params.angles.length];
      }

    p.fill(params.colors[0]);
    p.ellipse(x, y, 50, 50);
  }

  p.setupGIF = function() {
    p.gif = new GIF({
        workers: 5,
        quality: 20,
        workerScript: "static/js/gif.worker.js"
    });
    p.gif.on('finished', function(blob) {
        window.open(URL.createObjectURL(blob));
        p.gif.abort();
        p.gif.frames = [];
        delete p.gif.imageParts;
        delete p.gif.finishedFrames;
        delete p.gif.nextFrame;
    });
  }
}

var sf = new p5(sketch);

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

resetUI = function() {
  //document.querySelector("#frameidx").value = idx;
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
