let rectList = [];
let qTree;
function setup () {
    createCanvas(600, 600);
    let rect = new Rect(0, 0, width, height);
    for (let i = 0; i < 550; i++) {
        // rectList.push(new Rect(random(10, width - 30), random(10, height - 30), 20 + random(20), 20 + random(20)));
        rectList.push(new Particle(createVector(random(10, width - 30), random(10, height - 30)), 6));
    }
    qTree = new QuadTree(rect, 0);
    for (let i = 0; i < rectList.length; i++) {
        qTree.insert(rectList[i]);
    }
    console.log();
}

function draw () {
    background(51);
    qTree.show();
    qTree.refresh();
    TestCollision(rectList, qTree);
    for (let i = 0; i < rectList.length; i++) {
        let r = rectList[i];
        r.update();
        r.checkBoard(width, height);
        r.show();
    }
    // mouseCurrent();
    mouseClicked();
}
function mouseCurrent () {
    qTree.findCurrent(mouseX, mouseY);
}
function mouseClicked () {
    let rect_ = new Rect(mouseX - 10, mouseY - 10, 20, 20);
    rect(rect_.x, rect_.y, rect_.w, rect_.h);
    qTree.retrieve(rect_);
}