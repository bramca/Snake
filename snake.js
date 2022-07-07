function Snake(startpos, startsize, color, weight, colorrgb) {
    this.color = color;
    this.colorrgb = colorrgb;
    this.size = startsize;
    this.coordinates = [[startpos.x, startpos.y]];
    this.weight = weight;
    this.xdir = 1;
    this.ydir = 0;
    this.isAI = false;
    this.turning = false;
    this.searchMethods = {
        0: searchClosestPossible,
        1: searchNewestBest
    };

    for (var i = 1; i < this.size; i++) {
        this.coordinates.push([this.coordinates[0][0] - i * this.weight * this.xdir, this.coordinates[0][1] - i * this.weight * this.ydir]);
    }

    this.render = function (p) {
        p.push();
        p.stroke(this.colorrgb);
        p.fill(this.colorrgb);
        for (var i = 0; i < this.coordinates.length; i++) {
            p.rect(this.coordinates[i][0], this.coordinates[i][1], this.weight, this.weight);
        }
        p.pop();
    }

    this.updatecoordinates = function () {
        this.coordinates.pop();
        this.coordinates.unshift([this.coordinates[0][0] + this.xdir * this.weight, this.coordinates[0][1] + this.ydir * this.weight]);
    }

    this.eat = function (food) {
        for (var i = 0; i < food.points; i++) {
            this.coordinates.push(this.coordinates[2]);
        }
        this.size += food.points;
    }

    this.checkOverFood = function (food) {
        if (this.coordinates[0].every(function (e, i, a) {
            return e === food.coordinates[i];
        })) {
            return true;
        } else {
            return false;
        }
    }

    this.checkEdges = function (p) {
        if (this.coordinates[0][0] >= Math.floor(p.width / this.weight) * this.weight) {
            this.coordinates[0][0] = 0;
        } else if (this.coordinates[0][0] + this.weight <= 0) {
            this.coordinates[0][0] = Math.floor(p.width / this.weight) * this.weight;
        } else if (this.coordinates[0][1] >= Math.floor(p.height / this.weight) * this.weight) {
            this.coordinates[0][1] = 0;
        } else if (this.coordinates[0][1] + this.weight <= 0) {
            this.coordinates[0][1] = Math.floor(p.height / this.weight) * this.weight;
        }
    }

    this.checkSelfCollision = function () {
        var snake = this;
        for (var i = 1; i < this.coordinates.length; i++) {
            if (this.coordinates[0].every(function (e, j, a) {
                return e === snake.coordinates[i][j];
            })) {
                return true;
            }
        }
        return false;
    }

    this.checkEnemyCollision = function (enemy) {
        for (var i = 0; i < enemy.coordinates.length; i++) {
            if (this.coordinates[0].every(function (e, j, a) {
                return e === enemy.coordinates[i][j];
            })) {
                return true;
            }
        }
        return false;
    }

    this.changeXDir = function (xdir) {
        if (this.xdir === 0) {
            this.xdir = xdir;
            this.ydir = 0;
        }
    }

    this.changeYDir = function (ydir) {
        if (this.ydir === 0) {
            this.ydir = ydir;
            this.xdir = 0;
        }
    }

    this.searchObject = function (snake, food, p, type) {
        var t = this;
        var closestobject = this.searchMethods[type](food, p, t);
        if (!closestobject) {
            if (distance(this.coordinates[0][0], this.coordinates[0][1], snake.coordinates[0][0], snake.coordinates[0][1]) < Math.min(p.width, p.height) / 2) {
                closestobject = { coordinates: [snake.coordinates[0][0], snake.coordinates[0][1]] };
            } else {
                var closestobject = { coordinates: [Math.floor(Math.random() * Math.floor(p.width / this.weight)) * this.weight - this.coordinates[0][0], Math.floor(Math.random() * Math.floor(p.height / this.weight)) * this.weight - this.coordinates[0][1]] };
            }
        }

        var arr = [{ bool: this.coordinates[0][0] < closestobject.coordinates[0], func: (function () { t.changeXDir(1); }) }
            , { bool: this.coordinates[0][0] > closestobject.coordinates[0], func: (function () { t.changeXDir(-1); }) }
            , { bool: this.coordinates[0][1] < closestobject.coordinates[1], func: (function () { t.changeYDir(1); }) }
            , { bool: this.coordinates[0][1] > closestobject.coordinates[1], func: (function () { t.changeYDir(-1); }) }];
        if (Math.random() < 0.1) {
            arr = shuffle(arr);
        }
        arr.some(function (e, i, a) {
            if (e.bool) {
                e.func();
            }
            return e.bool;
        });
        
        var copy = JSON.parse(JSON.stringify(this));
        copy.updatecoordinates = this.updatecoordinates;
        copy.checkEnemyCollision = this.checkEnemyCollision;
        copy.updatecoordinates();
        if (copy.checkEnemyCollision(snake) || this.turning) {
            if (copy.ydir === 0) {
                if (copy.xdir === 1) {
                    this.changeYDir(-1);
                } else {
                    this.changeYDir(1);
                }
            } else {
                if (copy.ydir === 1) {
                    this.changeXDir(1);
                } else {
                    this.changeXDir(-1);
                }
            } 
            this.turning = !this.turning;
        }

        this.updatecoordinates();
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    function shuffle(arr) {
        var ctr = arr.length, temp, index;

        // While there are elements in the array
        while (ctr > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * ctr);
            // Decrease ctr by 1
            ctr--;
            // And swap the last element with it
            temp = arr[ctr];
            arr[ctr] = arr[index];
            arr[index] = temp;
        }
        return arr;
    }

    function searchClosestPossible(food, p, t) {
        var visible_objects = [];
        var closestobject;
        for (var i = 0; i < food.length; i++) {
            if (distance(t.coordinates[0][0], t.coordinates[0][1], food[i].coordinates[0], food[i].coordinates[1]) < Math.min(p.width, p.height) / 2) {
                visible_objects.push(food[i]);
            }
        }
        for (var i = 0; i < visible_objects.length; i++) {
            if (!closestobject) {
                closestobject = visible_objects[i];
            } else {
                if (distance(closestobject.coordinates[0], closestobject.coordinates[1], t.coordinates[0][0], t.coordinates[0][1])
                    > distance(visible_objects[i].coordinates[0], visible_objects[i].coordinates[1], t.coordinates[0][0], t.coordinates[0][1])) {
                    closestobject = visible_objects[i];
                }
            }
        }
        return closestobject;
    }

    function searchNewestBest(food, p, t) {
        var closestobject;
        for (var i = 0; i < food.length; i++) {
            if (distance(t.coordinates[0][0], t.coordinates[0][1], food[i].coordinates[0], food[i].coordinates[1]) < Math.min(p.width, p.height) / 2) {
                if (food[i].points > 1) {
                    return food[i];
                } else {
                    closestobject = food[i];
                }
            }
        }
        return closestobject;
    }
}
