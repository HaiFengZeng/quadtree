function gray (img, bound) {
    let x = floor(bound.x), y = floor(bound.y), w = floor(bound.w) + 1, h = floor(bound.h) + 1;
    let mean = 0;
    for (let i = x; i < x + w; i++) {
        for (let j = y; j < y + h; j++) {
            let c = img.get(i, j);
            mean += (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11);
        }
    }
    return mean / (w * h);
}
function std (img, bound) {
    let _avg = gray(img, bound);
    let x = floor(bound.x), y = floor(bound.y), w = floor(bound.w) + 1, h = floor(bound.h) + 1;
    let std_mean = 0;
    let sr = 0,
        sg = 0,
        sb = 0,
        sa = 0;
    for (let i = x; i < x + w; i++) {
        for (let j = y; j < y + h; j++) {
            let c = img.get(i, j);
            let g = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11);
            std_mean += (g - _avg) * (g - _avg);
        }
    }
    return std_mean / (w * h);
}

function avg (img, bound) {
    let x = floor(bound.x), y = floor(bound.y), w = floor(bound.w) + 1, h = floor(bound.h) + 1;
    let sr = 0,
        sg = 0,
        sb = 0,
        sa = 0;
    for (let i = x; i < x + w; i++) {
        for (let j = y; j < y + h; j++) {
            let c = img.get(i, j);
            sr += c[0];
            sg += c[1];
            sb += c[2];
            sa += c[3];
        }
    }
    let n = w * h;
    return [floor(sr / n), floor(sg / n), floor(sb / n), floor(sa / n)]
}
let QuadTreeImage = function (bound, c) {
    this.c = c;
    this.nodes = [];
    this.bound = bound;
};
QuadTreeImage.prototype.split = function (img) {
    let halfWidth = this.bound.w / 2,
        halfHeight = this.bound.h / 2,
        x = this.bound.x,
        y = this.bound.y;
    let r0 = new Rect(x + halfWidth, y, halfWidth, halfHeight),
        r1 = new Rect(x, y, halfWidth, halfHeight),
        r2 = new Rect(x, y + halfWidth, halfWidth, halfHeight),
        r3 = new Rect(x + halfWidth, y + halfHeight, halfWidth, halfHeight);

    this.nodes[0] = new QuadTreeImage(r0, avg(img, r0));//0
    this.nodes[1] = new QuadTreeImage(r1, avg(img, r1));//1
    this.nodes[2] = new QuadTreeImage(r2, avg(img, r2));//2
    this.nodes[3] = new QuadTreeImage(r3, avg(img, r3));//3
};
QuadTreeImage.prototype.compress = function (img) {
    let _std = std(img, this.bound);
    if (_std > 100) {
        this.split(img);
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].compress(img);
        }
    }

};
QuadTreeImage.prototype.show = function () {
    if (this.nodes.length === 0) {
        noStroke();
        fill(this.c[0], this.c[1], this.c[2], this.c[3]);
        rect(floor(this.bound.x), floor(this.bound.y), floor(this.bound.w) + 1, floor(this.bound.h) + 1);
    } else {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].show();
        }
    }
};