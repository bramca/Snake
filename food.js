function Food(coordinates, color, points, weight) {
    this.coordinates = coordinates;
    this.color = color;
    this.points = points;
    this.weight = weight;

    this.render = function (p) {
        p.push();
        p.stroke(this.color);
        p.fill(this.color);
        p.rect(this.coordinates[0], this.coordinates[1], this.weight, this.weight);
    }
}