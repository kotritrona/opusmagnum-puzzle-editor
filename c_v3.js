// Opus Magnum puzzle editor script
// Opus Magnum is a game made by Zachtronics Industries.
// game link: http://store.steampowered.com/app/558990/Opus_Magnum/
'use strict';

// common functions
function $Q(i){return document.querySelector(i);}
function $A(i){return document.querySelectorAll(i);}
function $I(i){return document.getElementById(i);}
function $T(i){return document.getElementsByTagName(i);}
function $C(i){return document.createElement(i);}

// Inst constructor for arms, instructions, glyphs, berlo availabilities.
function Inst(instArray) {
	var self = this;
	instArray = instArray || [];
		Inst.instlist.forEach(function(_) {
		if(instArray.indexOf(_) != -1) {
			self[_] = true;
		}
		else {
			self[_] = false;
		}
	});
}

// common inst types
Inst.instlist = ["arm", "multiarm", "piston", "track", "bonding", "unbonding", "multibonding", "triplex", "calcification", "duplication", "projection", "purification", "animismus", "disposal", "quintessence", "grabturn", "drop", "turnback", "repeat", "pivot", "berlo"];
Inst.all = function() {
	return new Inst(Inst.instlist);
};
Inst.normal = function() {
	return new Inst(["arm", "multiarm", "track", "bonding", "unbonding", "multibonding", "calcification", "grabturn", "drop", "turnback", "repeat", "pivot"]);
};


// Molecule constructor. nothing more than writing object itself
function Molecule(primes, bonds) {
	this.primes = primes || [];
	this.bonds = bonds || [];
}

// Prime constructor. nothing more than writing object itself
function Prime(t, x, y) {
	this.type = t;
	this.x = x;
	this.y = y;
}
Prime.primeTypes = ["salt", "air", "earth", "fire", "water", "quicksilver", "gold", "silver", "copper", "iron", "tin", "lead", "vitae", "mors", "repeat", "quintessence"];

// Bond constructor. usage: new Bond(string BondType, x1, y1, x2, y2)
// BondType: normal, triplex, n, r, rk, ry, ky, rky
// also some alternative ways, like replacing string BondType to corresponding object
function Bond(arg1, arg2, arg3, arg4, arg5) {
	if(typeof arg1 == 'object' && typeof arg1.n != "undefined") {
		this.type = {"n" : !!arg1.n, "r" : !!arg1.r, "k" : !!arg1.k, "y" : !!arg1.y};
		this.x1 = arg2;
		this.y1 = arg3;
		this.x2 = arg4;
		this.y2 = arg5;
	}
	else if(typeof arg1 == 'string') {
		switch(arg1) {
			case 'normal':
			this.type = {"n" : true, "r": false, "k": false, "y": false};
			break;
			case 'triplex':
			this.type = {"n" : false, "r": true, "k": true, "y": true};
			break;
			default:
			this.type = {
				"n" : arg1.indexOf("n") != -1,
				"r" : arg1.indexOf("r") != -1,
				"k" : arg1.indexOf("k") != -1,
				"y" : arg1.indexOf("y") != -1
			};
		}
		this.x1 = arg2;
		this.y1 = arg3;
		this.x2 = arg4;
		this.y2 = arg5;
	}
	else if(typeof arg1 == 'object' && typeof arg2 == 'object' && typeof arg1.x == 'number') {
		this.type = arg3 || {"n" : true, "r": false, "k": false, "y": false};
		this.x1 = arg1.x;
		this.y1 = arg1.y;
		this.x2 = arg2.x;
		this.y2 = arg2.y;
	}
	else {
		this.type = arg5 || {"n" : true, "r": false, "k": false, "y": false};
		this.x1 = arg1;
		this.y1 = arg2;
		this.x2 = arg3;
		this.y2 = arg4;
	}
}

// common types of bonds
Bond.normal = function() {
	return { "n" : true, "r" : false, "k" : false, "y" : false };
};
Bond.triplex = function() {
	return { "n" : false, "r" : true, "k" : true, "y" : true };
};

function randomString(n, p) {
	p = p || "0123456789";
	var o = "";
	for(var i=0; i<n; i++) {
		o += p.charAt(Math.floor(Math.random() * p.length));
	}
	return o;
}

// convert BondType objects to binary data. returns number
function bondTypeBinary(bt) {
	if(!bt) {
		return 1;
	}
	return 1 * bt.n + 2 * bt.r + 4 * bt.k + 8 * bt.y;
}

// convert BondType objects to binary data. returns array
function instBinary(inst) {
	return [0x01 * inst.arm
	      + 0x02 * inst.multiarm
	      + 0x04 * inst.piston
	      + 0x08 * inst.track,
	        0x01 * inst.bonding
	      + 0x02 * inst.unbonding
	      + 0x04 * inst.multibonding
	      + 0x08 * inst.triplex
	      + 0x10 * inst.calcification
	      + 0x20 * inst.duplication
	      + 0x40 * inst.projection
	      + 0x80 * inst.purification,
	        0x01 * inst.animismus
	      + 0x02 * inst.disposal
	      + 0x04 * inst.quintessence
	      + 0x40 * inst.grabturn
	      + 0x80 * inst.drop,
	        0x01 * inst.turnback
	      + 0x02 * inst.repeat
	      + 0x04 * inst.pivot
	      + 0x10 * inst.berlo];
}

// convert Molecule objects to binary data. returns array
function moleculeBinary(m) {
	var primeTypes = Prime.primeTypes;
	var d = [];
	// primes
	d.push(m.primes.length & 255,
	       m.primes.length >> 8 & 255,
	       m.primes.length >> 16 & 255,
	       m.primes.length >> 24 & 255
	);
	m.primes.forEach(function(p) {
		d.push(primeTypes.indexOf(p.type) + 1, p.x & 255, p.y & 255);
	});
	// bonds
	d.push(m.bonds.length & 255,
	       m.bonds.length >> 8 & 255,
	       m.bonds.length >> 16 & 255,
	       m.bonds.length >> 24 & 255
	);
	m.bonds.forEach(function(p) {
		d.push(bondTypeBinary(p.type), p.x1 & 255, p.y1 & 255, p.x2 & 255, p.y2 & 255);
	});
	return d;
}

// builds up entire uint8array from a "Puzzle" object. returns unconverted array
// according to steam guide http://steamcommunity.com/sharedfiles/filedetails/?id=1185668197
function constructFile(obj) {
	var d = [];

	// puzzle format version
	d.push(3, 0, 0, 0);

	// puzzle name
	var puzzleName = utf16to8(obj.name);
	d.push(puzzleName.length);
	d = d.concat(puzzleName.split("").map(function(_) { return _.charCodeAt(0); }));

	// steam ID little endian
	d = d.concat(new BigInteger(obj.steamID, 10).toByteArray().map(function(_) { return _ < 0 ? 256 + _ : _}).reverse().concat([0, 0, 0, 0, 0, 0, 0, 0]).slice(0, 8));

	// instructions/glyphs
	d = d.concat(instBinary(obj.inst));

	// padding
	d.push(0, 0, 0, 0);

	// reagents
	d.push(obj.reagents.length, 0, 0, 0);
	obj.reagents.forEach(function(_) {
		d = d.concat(moleculeBinary(_));
	});

	// outputs
	d.push(obj.outputs.length, 0, 0, 0);
	obj.outputs.forEach(function(_) {
		d = d.concat(moleculeBinary(_));
	});

	// target scale
	d = d.concat(int32Binary(obj.outputTargetScale));

	// production
	if(obj.isProduction) {
		d.push(1);
		d = d.concat(constructProductionInfo(obj.productionInfo));
	}
	else {
		d.push(0);
	}

	return d;
}

// puzzle v3.0 production info serialization
function int32Binary(int32) {
	return [int32 & 255, (int32 >> 8) & 255, (int32 >> 16) & 255, (int32 >> 24) & 255];

}

function stringBinary(str) {
	return [str.length].concat(str.split("").map(function(_) { return _.charCodeAt(0); }));
}

function productionRegionBinary(region) {
	return [region.x & 255, region.y & 255].concat(stringBinary(region.type));
}

function productionPipeBinary(pipe) {
	var offsets = [pipe.offsets.length, 0, 0, 0];
	pipe.offsets.forEach(function(_) {
		offsets.push(_.x, _.y);
	});
	return [pipe.x1 & 255, pipe.y1 & 255, pipe.x2 & 255, pipe.y2 & 255].concat(offsets);
}

function productionVialBinary(vial) {
	return [vial.x & 255, vial.y & 255, vial.isTop ? 1 : 0, vial.count, 0, 0, 0];
}

function constructProductionInfo(info) {
	var d = [];

	// shrinks, isolate
	d.push(info.shrinkLeft ? 1 : 0, info.shrinkRight ? 1 : 0, info.isolateIO ? 1 : 0);

	// regions
	d.push(info.regions.length, 0, 0, 0);
	info.regions.forEach(function(_) {
		d = d.concat(productionRegionBinary(_));
	});

	// pipes
	d.push(info.pipes.length, 0, 0, 0);
	info.pipes.forEach(function(_) {
		d = d.concat(productionPipeBinary(_));
	});

	// vials
	d.push(info.vials.length, 0, 0, 0);
	info.vials.forEach(function(_) {
		d = d.concat(productionVialBinary(_));
	});

	return d;
}

// create all possible bonds for given primes
function fullBond(primes) {
	var bonds = [];
	primes.forEach(function(prime) {
		if(primes.some(function(anotherPrime) {
			if(anotherPrime.x == prime.x + 1
			&& anotherPrime.y == prime.y) {
				return true;
			}
			return false;
		})) {
			bonds.push(new Bond("normal", prime.x, prime.y, prime.x+1, prime.y));
		}
		if(primes.some(function(anotherPrime) {
			if(anotherPrime.x == prime.x
			&& anotherPrime.y == prime.y - 1) {
				return true;
			}
			return false;
		})) {
			bonds.push(new Bond("normal", prime.x, prime.y, prime.x, prime.y-1));
		}
		if(primes.some(function(anotherPrime) {
			if(anotherPrime.x == prime.x + 1
			&& anotherPrime.y == prime.y - 1) {
				return true;
			}
			return false;
		})) {
			bonds.push(new Bond("normal", prime.x, prime.y, prime.x+1, prime.y-1));
		}
	});
	return bonds;
}

// the background molecule
function generateBGMolecule(range) {
	var primes = [];
	// from vertical line 1 - 10
	for(var y = -range; y < range; y++) {
		// horizontal
		for(var x = -range - Math.ceil(y/2); x < range - Math.ceil(y/2); x++) {
			primes.push(new Prime("salt", x, y));
		}
	}
	// make bonds
	var bonds = fullBond(primes);
	return new Molecule(primes, bonds);
}

// generate a piece of graphene
function generateGraphene() {
	var primes = [];
	var bonds = [];
	// from vertical line 1 - 10
	for(var y = 0; y < 9; y++) {
		// horizontal
		for(var x = 0 - Math.ceil(y/2); x < 15 - Math.ceil(y/2); x++) {
			if((y % 2 == 0 && (x + Math.ceil(y/2)) % 3 != 2)
			|| (y % 2 == 1 && (x + Math.ceil(y/2)) % 3 != 1)) {
				primes.push(new Prime("fire", x, y));
			}
		}
	}
	// make bonds
	bonds = fullBond(primes);

	return new Molecule(primes, bonds);
}

// parse binary insts from 3 input array
function instParse(ia) {
	return {
		"arm"            : !!(0x01 & ia[0]),
		"multiarm"       : !!(0x02 & ia[0]),
		"piston"         : !!(0x04 & ia[0]),
		"track"          : !!(0x08 & ia[0]),
		"bonding"        : !!(0x01 & ia[1]),
		"unbonding"      : !!(0x02 & ia[1]),
		"multibonding"   : !!(0x04 & ia[1]),
		"triplex"        : !!(0x08 & ia[1]),
		"calcification"  : !!(0x10 & ia[1]),
		"duplication"    : !!(0x20 & ia[1]),
		"projection"     : !!(0x40 & ia[1]),
		"purification"   : !!(0x80 & ia[1]),
		"animismus"      : !!(0x01 & ia[2]),
		"disposal"       : !!(0x02 & ia[2]),
		"quintessence"   : !!(0x04 & ia[2]),
		"grabturn"       : !!(0x40 & ia[2]),
		"drop"           : !!(0x80 & ia[2]),
		"turnback"       : !!(0x01 & ia[3]),
		"repeat"         : !!(0x02 & ia[3]),
		"pivot"          : !!(0x04 & ia[3]),
		"berlo"          : !!(0x10 & ia[3])
	};
}

function moleculeParse(arr) {
	var assert = function(_) { if(!_ ) throw "load failed"; };
	var primeTypes = Prime.primeTypes;
	var m = new Molecule();

	// read primes
	var primeCount = new BigInteger(arr.splice(0, 4).reverse()).intValue();
	assert(primeCount < 66666);
	for(var i=0; i< primeCount; i++) {
		var acut = arr.splice(0, 3).map(function(_) { return _ > 127 ? _ - 256 : _ });
		assert(acut[0] > 0 && acut[0] <= primeTypes.length);
		m.primes.push(new Prime(primeTypes[acut[0] - 1], acut[1], acut[2]));
	}

	// read bonds
	var bondCount = new BigInteger(arr.splice(0, 4).reverse()).intValue();
	assert(bondCount < 66666);
	for(var i=0; i< bondCount; i++) {
		var bcut = arr.splice(0, 5).map(function(_) { return _ > 127 ? _ - 256 : _ });
		m.bonds.push(new Bond({
			"n" : !!(bcut[0] & 1),
			"r" : !!(bcut[0] & 2),
			"k" : !!(bcut[0] & 4),
			"y" : !!(bcut[0] & 8)
		}, bcut[1], bcut[2], bcut[3], bcut[4]));
	}

	return m;
}

function toSignedByte(n) {
	return n > 127 ? n - 256 : n;
}

// parse 4 bytes array as int32
function int32Parse(arr) {
	return arr[0] + (arr[1] << 8) + (arr[2] << 16) + (arr[3] << 24);
}

// production parts
function regionParse(arr) {
	var x = toSignedByte(arr.shift());
	var y = toSignedByte(arr.shift());
	var strLength = arr.shift();
	if(strLength > 0) {
		var type = arr.splice(0, strLength).map(function(_) { return String.fromCharCode(_); }).join("");
	}
	else {
		var type = "Small";
	}
	return new Region(x, y, type);
}

function pipeParse(arr) {
	var assert = function(_) { if(!_) throw "load failed"; };

	var cut = arr.splice(0, 4).map(toSignedByte);
	var offsets = [];
	var offsetCount = int32Parse(arr.splice(0, 4));
	assert(offsetCount < 5000);
	for(var i=0; i<	offsetCount; i++) {
		var ocut = arr.splice(0, 2).map(toSignedByte);
		offsets.push({"x": ocut[0], "y": ocut[1]});
	}
	return new Pipe(cut[0], cut[1], cut[2], cut[3], offsets);
}

function vialParse(arr) {
	var x = toSignedByte(arr.shift());
	var y = toSignedByte(arr.shift());
	var isTop = !!arr.shift();
	var vialCount = int32Parse(arr.splice(0, 4));
	return new Vial(x, y, isTop, vialCount);
}

// load puzzle from array
function loadPuzzle(arr) {
	var puz = {};

	// assert RLs are in reasonable range to prevent dead loops
	var assert = function(_) { if(!_) throw "load failed"; };

	// file version
	var version = arr.splice(0, 4);
	assert(version[0] == 2 || version[0] == 3);

	// puzzle name
	var nameLength = arr.shift();
	assert(nameLength > 0);
	puz.name = utf8to16(arr.splice(0, nameLength).map(function(_) { return String.fromCharCode(_); }).join(""));

	// steamID
	puz.steamID = new BigInteger(arr.splice(0, 8).reverse()).toRadix(10);

	// inst bits
	puz.inst = instParse(arr.splice(0, 8));

	// reagents
	var reagentCount = arr.shift();
	assert(arr.splice(0, 3).every(function(_) { return _ == 0; }));
	puz.reagents = [];
	for(var i=0; i< reagentCount; i++) {
		puz.reagents.push(moleculeParse(arr));
	}

	// outputs
	var outputCount = arr.shift();
	assert(arr.splice(0, 3).every(function(_) { return _ == 0; }));
	puz.outputs = [];
	for(var i=0; i< outputCount; i++) {
		puz.outputs.push(moleculeParse(arr));
	}

	// new format
	if(version[0] == 3) {
		// output scale
		puz.outputTargetScale = int32Parse(arr.splice(0, 4));

		// production flag
		puz.isProduction = !!arr.shift();

		if(puz.isProduction) {
			var prod = new ProductionInfo();

			// production flags
			prod.shrinkLeft = !!arr.shift();
			prod.shrinkRight = !!arr.shift();
			prod.isolateIO = !!arr.shift();

			// regions
			var regionCount = int32Parse(arr.splice(0, 4));
			assert(regionCount < 5000);
			prod.regions = [];
			for(var i=0; i< regionCount; i++) {
				prod.regions.push(regionParse(arr));
			}

			// pipes
			var pipeCount = int32Parse(arr.splice(0, 4));
			assert(pipeCount < 5000);
			prod.pipes = [];
			for(var i=0; i< pipeCount; i++) {
				prod.pipes.push(pipeParse(arr));
			}

			// vials
			var vialCount = int32Parse(arr.splice(0, 4));
			assert(vialCount < 5000);
			prod.vials = [];
			for(var i=0; i< vialCount; i++) {
				prod.vials.push(vialParse(arr));
			}

			puz.productionInfo = prod;
		}
		else {
			puz.productionInfo = new ProductionInfo();
		}
	}

	return puz;
}

function duplicateMolecule(molecule) {
	return new Molecule(molecule.primes.map(function(prime) {
		return new Prime(prime.type, prime.x, prime.y);
	}), molecule.bonds.map(function(bond) {
		return new Bond(bond.type, bond.x1, bond.y1, bond.x2, bond.y2);
	}));
}