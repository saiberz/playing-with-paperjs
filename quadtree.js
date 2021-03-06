// QuadTree example, see http://bl.ocks.org/mbostock/4343214 and Wikipedia
// Script generates points, and splits box based on these points
// Cells are _not_ hierarchical (which would be good if used for selection)
var nrObjects = 2000;
var maxLevel = 8;
var maxObjects = 2;
var objects = new Array;
var size = 600;

//// Draw cicles ////
var mainBox = new Path.Rectangle([0,0],[size,size]);
mainBox.strokeColor = 'black';

for (var i = 0; i < nrObjects; i++) {
  var circle = new Path.Circle(new Point(Math.round(Math.random()*size), Math.round(Math.random()*size)), 2)
  circle.fillColor = 'red';
  circle.opacity = 0.3;
  circle.data.centerX = circle.bounds.x + circle.bounds.width/2;
  circle.data.centerY = circle.bounds.y + circle.bounds.height/2;
  objects.push(circle);
}

////
var intermediateCells = new Array;
var finalCells = new Array;

//// Cell class ////
function Cell(x, y, width, height, level, name) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.level = level;
  this.name = name;
  this.objects = new Array;
  intermediateCells.push(this);
}

Cell.prototype.split = function() {
  if ( this.objects.length <= maxObjects || this.level == maxLevel ) {
    finalCells.push(this);
    for ( var i=0; i < intermediateCells.length; i++ ) {
      if ( intermediateCells[i].name == this.name ) {
        intermediateCells.splice(i, 1);  //removes 1 element at position i
        break;
      }
    }
  } else {
    var cellNW = new Cell(this.x, this.y, this.width/2, this.height/2, this.level+1, this.name + '-NW');
    var cellNE = new Cell(this.x + this.width/2, this.y, this.width/2, this.height/2, this.level+1, this.name + '-NE');
    var cellSW = new Cell(this.x, this.y + this.height/2, this.width/2, this.height/2, this.level+1, this.name + '-SW');
    var cellSE = new Cell(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/2, this.level+1, this.name + '-SE');

    for ( var i = 0; i < this.objects.length; i++ ) {
      if ( this.objects[i].data.centerX <= (this.x + this.width/2) && this.objects[i].data.centerY <= (this.y + this.height/2) ) {
        cellNW.objects.push(this.objects[i]);
      } else if ( this.objects[i].data.centerX <= (this.x + this.width/2) && (this.y + this.height/2) < this.objects[i].data.centerY ) {
        cellSW.objects.push(this.objects[i]);
      } else if ( (this.x + this.width/2) < this.objects[i].data.centerX && this.objects[i].data.centerY <= (this.y + this.height/2) ) {
        cellNE.objects.push(this.objects[i]);
      } else if ( (this.x + this.width/2) < this.objects[i].data.centerX && (this.y + this.height/2) < this.objects[i].data.centerY ) {
        cellSE.objects.push(this.objects[i]);
      }
    }
    cellNW.split();
    cellNE.split();
    cellSW.split();
    cellSE.split();
  }
}

Cell.prototype.draw = function() {
  var rectangle = new Path.Rectangle({
    x: this.x,
    y: this.y,
    width: this.width,
    height: this.height
  })
  rectangle.strokeColor = 'blue';
  rectangle.strokeWidth = 0.4;
  rectangle.sendToBack();
}

////
var mousePositionText;
function onMouseMove(event) {
  if ( mousePositionText ) { mousePositionText.remove() };
  mousePositionText = new PointText(new Point(50,size + 50));
  mousePositionText.fillColor = 'black';
  mousePositionText.fontSize = 14;
  mousePositionText.content = Math.round(event.point.x) + " . " + Math.round(event.point.y);
}


//////

var cell1 = new Cell(0,0,size,size,0,'');
cell1.objects = objects;
cell1.split();
for ( var i = 0; i < finalCells.length; i++ ) {
  finalCells[i].draw();
}
