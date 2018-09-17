var img;
var img_target;
var qt;
var cmp;
var c;
function preload() {
    img_target = loadImage('test1.jpg');
}
function setup() {
    createCanvas(200, 200);
    var r = new Rect(0, 0, width, height);
    qt = new QuadTreeImage(r, avg(img_target, r));
    qt.compress(img_target);
}


function writePixels(img, bound, color) {
    img.loadPixels();
    for (var i = bound.x; i < bound.x + bound.w; i++) {
        for (var j = bound.y; j < bound.y + bound.h; j++) {
            var index = 4 * (i + img.width * j);
            img.pixels[index] = color[0];
            img.pixels[index + 1] = color[1];
            img.pixels[index + 2] = color[2];
            img.pixels[index + 3] = color[3];
        }
    }
    img.updatePixels();
}
function draw() {
    background(255);
    qt.show();
}