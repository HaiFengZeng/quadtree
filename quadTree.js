var Rect = function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

};
Rect.prototype.show = function (toFill) {
    if (toFill) {
        // noStroke();
        fill(toFill[0], toFill[1], toFill[2], toFill[3]);
        rect(this.x, this.y, this.w, this.h);
    } else {
        stroke(255, 100);
        rect(this.x, this.y, this.w, this.h);
    }
};
//判断一个矩形是否在另一个矩形里
Rect.prototype.isInner = function (bound) {
    return this.x > bound.x && this.y > bound.y &&
        this.x + this.w < bound.x + bound.w && this.y + this.h < bound.y + bound.h;
};
Rect.prototype.carve = function (bound) {
    //return several rects split by the boundary
    var mx = bound.x + bound.w / 2,
        my = bound.y + bound.h / 2;
    var rect_list = [];
    var left_right = this.x < mx && mx < this.x + this.w;
    var up_down = this.y < my && my < this.y + this.h;
    if (left_right && up_down) {
        rect_list.push(new Rect(this.x, this.y, mx - this.x, my - this.y));
        rect_list.push(new Rect(mx, this.y, this.x + this.w - mx, my - this.y));
        rect_list.push(new Rect(this.x, my, mx - this.x, this.y + this.h - my));
        rect_list.push(new Rect(mx, my, this.x + this.w - mx, this.y + this.h - my));
    }
    if (left_right && !up_down) {
        rect_list.push(new Rect(this.x, this.y, mx - this.x, this.h));
        rect_list.push(new Rect(mx, this.y, this.x + this.w - mx, this.h));
    }
    if (!left_right && up_down) {
        rect_list.push(new Rect(this.x, this.y, this.w, my - this.y));
        rect_list.push(new Rect(this.x, my, this.w, this.y + this.h - my));
    }
    return rect_list;

};
var QuadTree = function (bound, level) {
    this.objs = [];
    this.MAX_OBJS = 8;
    this.MAX_LEVEL = 10;
    this.nodes = [];
    this.bound = bound;
    this.level = level || 0;
    this.getIndex = function (rect) {
        var halfWidth = this.bound.w / 2,
            halfHeight = this.bound.h / 2,
            x = this.bound.x,
            y = this.bound.y;
        var onTop = rect.y + rect.h <= y + halfHeight,
            onBottom = rect.y >= y + halfHeight,
            onLeft = rect.x + rect.w <= x + halfWidth,
            onRight = rect.x >= x + halfWidth;
        if (onTop) {
            if (onRight) return 0;
            if (onLeft) return 1;
        }
        if (onBottom) {
            if (onLeft) return 2;
            if (onRight) return 3;
        }
        return -1;
    };

};
QuadTree.prototype.split = function () {
    var halfWidth = this.bound.w / 2,
        halfHeight = this.bound.h / 2,
        x = this.bound.x,
        y = this.bound.y;
    this.nodes[0] = new QuadTree(new Rect(x + halfWidth, y, halfWidth, halfHeight), this.level + 1);//0
    this.nodes[1] = new QuadTree(new Rect(x, y, halfWidth, halfHeight), this.level + 1);//1
    this.nodes[2] = new QuadTree(new Rect(x, y + halfWidth, halfWidth, halfHeight), this.level + 1);//2
    this.nodes[3] = new QuadTree(new Rect(x + halfWidth, y + halfHeight, halfWidth, halfHeight), this.level + 1);//3
};
QuadTree.prototype.insert = function (obj) {
    //rect is the boundary of the obj
    if (this.nodes.length > 0) {
        var index = this.getIndex(obj.bound());
        if (index !== -1) {
            this.nodes[index].insert(obj);
            return;
        }
    }
    this.objs.push(obj);
    if (this.objs.length >= this.MAX_OBJS && this.level < this.MAX_LEVEL) {
        if (this.nodes.length === 0)
            this.split();
        for (var i = this.objs.length - 1; i >= 0; i--) {
            index = this.getIndex(this.objs[i].bound());
            if (index >= 0)
                this.nodes[index].insert(this.objs.splice(i, 1)[0]);
        }

    }

};
//show test
QuadTree.prototype.show = function () {
    stroke(255, 0, 0, 125);
    noFill();
    rect(this.bound.x, this.bound.y, this.bound.w, this.bound.h);
    if (this.nodes.length > 0) {
        //draw the boundary and the split lines
        stroke(255, 0, 0, 125);
        noFill();
        var x = this.bound.x,
            y = this.bound.y,
            w = this.bound.w,
            h = this.bound.h;
        // line(x + w / 2, y, x + w / 2, y + h);
        // line(x, y + h / 2, x + w, y + h / 2);
        for (var i = 0; i < this.nodes.length; i++) {
            this.nodes[i].show();
        }
    }
};
QuadTree.prototype.count = function () {
    var count = this.objs.length;
    for (var i = 0; i < this.nodes.length; i++) {
        count += this.nodes[i].count();
    }
    return count;
};
QuadTree.prototype.findCurrent = function (x, y) {
    var rect1 = new Rect(x, y, 0, 0);
    var index = this.getIndex(rect1);
    if (this.nodes.length > 0) {
        if (index >= 0)
            this.nodes[index].findCurrent(x, y);
    } else {
        console.log(this.count());
        for (var j = 0; j < this.objs.length; j++) {
            var obj = this.objs[j];
            fill(125, 125, 0, 50);
            rect(this.bound.x, this.bound.y, this.bound.w, this.bound.h);
            obj.show([255, 255, 0, 75]);
        }
    }

};
QuadTree.prototype.refresh = function (root) {
    root = root || this;
    for (var i = this.objs.length - 1; i >= 0; i--) {
        if (this.objs[i]) {
            var rect = this.objs[i].bound();
            if (!rect.isInner(this.bound)) {//不属于该象限
                root.insert(this.objs.splice(i, 1)[0]);
            } else {//属于该象限
                var index = this.getIndex(rect);
                if (this.nodes.length > 0 && index > 0)
                    this.nodes[index].insert(this.objs.splice(i, 1)[0]);//
            }
        }

    }
    if (this.count() < this.MAX_OBJS && this.nodes.length > 0) {
        for (var i = 0; i < this.nodes.length; i++) {
            for (var j = this.nodes[i].objs.length - 1; j >= 0; j--)
                this.objs.push(this.nodes[i].objs.splice(j, 1)[0]);
        }
        this.nodes = [];
    }
    if (this.nodes.length > 0) {
        for (var j = 0; j < this.nodes.length; j++) {
            this.nodes[j].refresh(root);
        }
    }

};
QuadTree.prototype.retrieve = function (rect) {
    //return objs near the react
    //先找到rect所在的区域
    var result = [];
    var index = this.getIndex(rect);
    if (this.nodes.length === 0) {
        return this.objs;
    }
    if (index !== -1) {
        return result.concat(this.nodes[index].retrieve(rect));
    } else {
        result = result.concat(this.objs);
        var rect_list = rect.carve(this.bound);
        if (rect_list.length > 0) {
            for (var i = 0; i < rect_list.length; i++) {
                var rs = this.retrieve(rect_list[i]);
                result = result.concat(rs);
            }
        }
    }

    //draw the result
    // for (var i = 0; i < result.length; i++) {
    //     result[i].show([0, 0, 255, 125]);
    // }
    return result;
};



