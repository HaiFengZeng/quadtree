Particle.prototype.collision = function (p) {
    let d = this.pos.copy().sub(p.pos);
    return d.mag() <= p.radius + this.radius;
};
Particle.prototype.checkBoard = function (w, h) {
    if (this.pos.x + this.radius > w) {
        this.vel.x = -this.vel.x;
    }
    if (this.pos.x - this.radius < 0) {
        this.vel.x = -this.vel.x;
    }
    if (this.pos.y + this.radius > h) {
        this.vel.y = -this.vel.y;
    }
    if (this.pos.y - this.radius < 0) {
        this.vel.y = -this.vel.y;
    }
};
Particle.prototype.bound = function () {
    return new Rect(this.pos.x - this.radius, this.pos.y - this.radius,
        this.radius * 2, this.radius * 2);
};
function TestCollision(particles, qTree) {
    if (qTree === undefined) {
        for (let i = 0; i < particles.length; i++) {
            let collision = false;
            for (j = i + 1; j < particles.length; j++) {
                collision = particles[i].collision(particles[j]);
                if (collision) {
                    particles[i].show([255, 0, 255, 125]);
                    particles[j].show([255, 0, 255, 125]);
                    break;
                }
            }
        }
    }
    else {
        for (let i = 0; i < particles.length; i++) {
            let bound = particles[i].bound();
            bound.x -= 10;
            bound.y -= 10;
            bound.w += 20;
            bound.h += 20;
            let list = qTree.retrieve(bound);
            for (j = 0; j < list.length; j++) {
                if (particles[i] !== list[j]) {
                    let collision = particles[i].collision(list[j]);
                    if (collision) {
                        particles[i].show([0, 255, 255, 125]);
                        list[j].show([0, 255, 255, 125]);
                        break;
                    }
                }
            }
        }
    }
}