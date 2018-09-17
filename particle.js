var Particle = function (pos, r, vel) {
    this.pos = pos;
    this.acc = createVector(0, 0);
    this.vel = createVector(random(-1, 0), random(-1, 1));
    this.radius = r || 1;
    this.Mass = 1;
    this.show = function (color) {
        noStroke();
        if (color) {
            fill(color[0], color[1], color[2], color[3]);
        } else fill(255,50);
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
    };
    this.update = function () {

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    };
    this.applyForce = function (force) {
        this.acc.add(force);
    };
};