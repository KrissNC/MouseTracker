// target
var targetEndSegX;
var targetEndSegY;
var targetSegmentLength;

var targetAngle;

var virtualCenterX;
var virtualCenterY;

var DOUBLEPI;

var nbGuns = 4;
var gunArray = new Array(nbGuns);
var sensitivity = 0.03;
var i;

function Gun(x, y, l, a) {
  this.draw = function () {
    line(this.OrigX, this.OrigY, this.EndX, this.EndY);
    ellipse(this.OrigX, this.OrigY, 4, 4);
  };

  this.update = function () {
    if (this.moving) {
      if (abs(this.targetAngle) < sensitivity) {
        // on a atteint la cible
        this.targetAngle = 0;
        this.moving = false;
        // console.log("done");
      } else {
        if (this.targetAngle > 0) {
          // angle is positive let's move towards it
          this.Angle += sensitivity;
          this.targetAngle -= sensitivity;
        } else {
          // angle is negative let's move towards it by substrancting
          this.Angle -= sensitivity;
          this.targetAngle += sensitivity;
        }

        // update segment coordinates due to new angle
        this.EndX = this.OrigX + this.Length * cos(this.Angle);
        this.EndY = this.OrigY + this.Length * sin(this.Angle);
        this.Vect = createVector(
          this.Length * cos(this.Angle),
          this.Length * sin(this.Angle)
        );
      }
    }
  };

  this.setNewTarget = function (targetEndSegX, targetEndSegY) {
    var deltaX = 1 + targetEndSegX - this.OrigX;
    var deltaY = 1 + targetEndSegY - this.OrigY;
    var v2 = createVector(deltaX, deltaY);
    this.Vect = createVector(
      this.Length * cos(this.Angle),
      this.Length * sin(this.Angle)
    );
    this.targetAngle = getDirectedAngle(this.Vect, v2);
    if (abs(this.targetAngle) > sensitivity) {
      console.log(
        "moving from " +
          radToDeg(this.Angle) +
          " to " +
          radToDeg(this.Angle + this.targetAngle)
      );
      this.moving = true;
      // console.log(radToDeg(this.targetAngle));
    }
  };

  this.OrigX = x;
  this.OrigY = y;
  this.Length = l;
  this.Angle = a;

  this.moving = false;
  this.AngleStep = 0;
  this.targetAngle = 0;

  this.EndX = this.OrigX + this.Length * cos(this.Angle);
  this.EndY = this.OrigY + this.Length * sin(this.Angle);
}

function setup() {
  createCanvas(600, 400);

  virtualCenterX = width / 2;
  virtualCenterY = height / 2;

  DOUBLEPI = 2 * Math.PI;

  i = 0;
  for (i = 0; i < nbGuns; i++) {
    // let's start a segment inside a 300width 120height rectangle
    var P1x = virtualCenterX + floor(random(300) - 150);
    var P1y = virtualCenterY + floor(random(120) - 60);
    var P1SegmentLength = 40 + floor(random(20) - 10);
    var vect1Angle = degToRad(floor(random(360)));

    gunArray[i] = new Gun(P1x, P1y, P1SegmentLength, vect1Angle);
  }

  // console.log(gunArray);
}

function draw() {
  background(220);

  for (i = 0; i < nbGuns; i++) gunArray[i].update();

  strokeWeight(1);
  stroke("red");
  rect(virtualCenterX - 150, virtualCenterY - 60, 300, 120);

  strokeWeight(1);
  stroke("green");

  for (i = 0; i < nbGuns; i++) gunArray[i].draw();

  /*
  if (targetEndSegX > 0) {
    stroke("blue");
    strokeWeight(1);
    for (i = 0; i < nbGuns; i++) {
      // ellipse(targetEndSegX, targetEndSegY, 1, 1);
      line(gunArray[i].OrigX, gunArray[i].OrigY, targetEndSegX, targetEndSegY);
    }
  }
  */
}

function mousePressed() {
  targetEndSegX = mouseX;
  targetEndSegY = mouseY;

  for (i = 0; i < nbGuns; i++)
    gunArray[i].setNewTarget(targetEndSegX, targetEndSegY);
}

function getDirectedAngle(v1, v2) {
  //let angleV1 = (Math.atan2(v1.y, v1.x)+ DOUBLEPI) %PI;
  let angleV1 = Math.atan2(v1.y, v1.x);
  let angleV2 = Math.atan2(v2.y, v2.x);

  let diffAngle = angleV2 - angleV1;

  if (angleV1 <= 0) {
    // -PI to 0, upper half
    if (diffAngle >= PI) diffAngle -= DOUBLEPI;
  } else {
    // 0+ to PI
    if (diffAngle <= -PI) diffAngle += DOUBLEPI;
  }

  return diffAngle;
}

// linear lerp
function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

function approx(v) {
  // return 2 decimal casted number
  let dec2 = Math.floor(v * 100) / 100;
  return dec2;
}

function radToDeg(rad) {
  // 2PI*rad = 360 deg; PI.rad = 180 deg => 1 rad = 180/PI deg
  // 30 rad = 30 * 180/PI deg
  return (180 / Math.PI) * rad;
}

function degToRad(rad) {
  // 2PI * 1rad = 360 deg; PI.rad = 180 deg => 1 deg = PI/180 rad
  // > 360 deg = 360 (PI /180) * 1rad => 360deg = 2PI *1rad
  return (Math.PI / 180) * rad;
}
