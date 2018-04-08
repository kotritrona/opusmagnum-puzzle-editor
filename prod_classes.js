'use strict';

function Vial(x, y, isTop, count) {
    this.x = x || 0;
    this.y = y || 0;
    this.isTop = isTop || false;
    this.count = (typeof count != 'undefined') ? count : 1;
}

function Region(x, y, type) {
    this.x = x || 0;
    this.y = y || 0;
    this.type = type || "Small";
}

function Pipe(x1, y1, x2, y2, offsets) {
    var undef;
    this.x1 = (x1 !== undef) ? x1 : -1;
    this.y1 = (y1 !== undef) ? y1 : 0;
    this.x2 = (x2 !== undef) ? x2 : 1;
    this.y2 = (y2 !== undef) ? y2 : 0;
    this.offsets = (offsets !== undef) ? offsets : [{"x": 0, "y": 0}];
}

function ProductionInfo(shrinkLeft, shrinkRight, isolateIO, regions, pipes, vials) {
    this.shrinkLeft = shrinkLeft || false;
    this.shrinkRight = shrinkRight || false;
    this.isolateIO = isolateIO || false;
    this.regions = regions || [];
    this.pipes = pipes || [];
    this.vials = vials || [];
}

function getProductionToolboxObjects() {
    return [{
        "is" : "region",
        "type" : "Small",
        "image" : "region-small.png"
    }, {
        "is" : "region",
        "type" : "SmallWide",
        "image" : "region-smallwide.png"
    }, {
        "is" : "region",
        "type" : "SmallWider",
        "image" : "region-smallwider.png"
    }, {
        "is" : "region",
        "type" : "Medium",
        "image" : "region-medium.png"
    }, {
        "is" : "region",
        "type" : "MediumWide",
        "image" : "region-mediumwide.png"
    }, {
        "is" : "region",
        "type" : "Large",
        "image" : "region-large.png"
    }, {
        "is" : "vial",
        "isTop" : true,
        "count" : 1,
        "image" : "vial-vt1.png"
    }, {
        "is" : "vial",
        "isTop" : true,
        "count" : 2,
        "image" : "vial-vt2.png"
    }, {
        "is" : "vial",
        "isTop" : true,
        "count" : 3,
        "image" : "vial-vt3.png"
    }, {
        "is" : "vial",
        "isTop" : false,
        "count" : 1,
        "image" : "vial-vb1.png"
    }, {
        "is" : "vial",
        "isTop" : false,
        "count" : 2,
        "image" : "vial-vb2.png"
    }, {
        "is" : "vial",
        "isTop" : false,
        "count" : 3,
        "image" : "vial-vb3.png"
    }, {
        "is" : "pipe",
        "type" : "shape",
        "image" : "pipe.png"
    }, {
        "is" : "pipe",
        "type" : "input",
        "image" : "pipe-red.png"
    }, {
        "is" : "pipe",
        "type" : "output",
        "image" : "pipe-blue.png"
    }, {
        "is" : "vial",
        "isTop" : true,
        "count" : 0,
        "image" : "vial-vt0.png"
    }, {
        "is" : "vial",
        "isTop" : false,
        "count" : 0,
        "image" : "vial-vb0.png"
    }];
}

function generatePipeMolecule(offsets) {
    var primes = offsets.map(function(d) {
        return new Prime("salt", d.x, d.y);
    });
    var bonds = fullBond(primes);
    return new Molecule(primes, bonds);
}