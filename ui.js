
// svg props
var svgWidth = 2400;//d3.select("#transmutation").node().offsetWidth;
var svgHeight = 2400;//d3.select("#transmutation").node().offsetHeight;
var scale = d3.scaleLinear().domain([0,2400]).range([0, Math.min(svgHeight * 4/3, svgWidth)]).nice();

// prime/bond image files
function primeImg(d) {
	return "img/" + d.type + ".png";
}
function bondImg(d) {
	if(d.type.n) {
		return "img/normal.png";
	}
	else if(d.type.r && d.type.k && d.type.y) {
		return "img/triplex.png";
	}
	else if(!d.type.r && !d.type.k && !d.type.y) {
		return "img/nobond.png";
	}
	return "img/" + (d.type.r ? "r" : "") + (d.type.k ? "k" : "") + (d.type.y ? "y" : "") + ".png";
}

// prime/bond transformation functions
var primeX = function(d) {
	return scale(60 * d.x + 30 * d.y + 1200 - 20);
};
var primeY = function(d) {
  return scale(0.9 * 60 * -d.y + 1200 - 20);
};
var bondWidth = 27;
var bondHeight = 18;
var bondX = function(d) {
	return scale(60 * (d.x1 + d.x2) / 2 + 30 * (d.y1 + d.y2) / 2 + 1200 - bondWidth/2);
};
var bondY = function(d) {
	return scale(0.9 * 60 * -(d.y1 + d.y2) / 2 + 1200 - bondHeight/2 - 1);
};
var bondTransform = function(d) {
	if(d.y2 == d.y1) {
		return "";
	}
	else if(d.y2 != d.y1 && d.x2 != d.x1) {
		return "rotate(60 " + (bondX(d) + scale(bondWidth/2)) + " " + (bondY(d) + scale(bondHeight/2)) + ")";
	}
	else {
		return "rotate(120 " + (bondX(d) + scale(bondWidth/2)) + " " + (bondY(d) + scale(bondHeight/2)) + ")";
	}
};

// prime/bond event functions
var primeClick = function(d) {
	if(gSelectedPrimeType == d.type) {
		var ind = gMoleculeObj.primes.indexOf(d);
		gMoleculeObj.primes.splice(ind, 1);
	}
	else {
		d.type = gSelectedPrimeType;
	}
	updateMolecule(gMoleculeObj);
};
var bprimeClick = function(d) {
	var prime = new Prime(gSelectedPrimeType, d.x, d.y);
	gMoleculeObj.primes.push(prime);
	updateMolecule(gMoleculeObj);
};
var bondClick = function(d) {
	var ind = gMoleculeObj.bonds.indexOf(d);
	gMoleculeObj.bonds.splice(ind, 1);
	updateMolecule(gMoleculeObj);
};
var bbondClick = function(d) {
	var bond = new Bond(gSelectedBondType, d.x1, d.y1, d.x2, d.y2);
	gMoleculeObj.bonds.push(bond);
	updateMolecule(gMoleculeObj);
};
var eventNothing = function() {
	d3.event.preventDefault();
};

// init field
function generateField(bg) {
	
	var backgroundObj = bg;
	
	// summon svg element
	var svg = d3.select("#transmutation-svg").attr("width",svgWidth).attr("height",svgHeight)
	.style("position", "absolute")
	.style("left", "0px")
	.style("top", "0px")
	.on("dragstart", eventNothing)
	.on("drag", eventNothing)
	.on("dragend", eventNothing)
	.on("dragout", eventNothing);
	
	// scroll the container to the center of board
	var containerWidth = 800;
	var containerHeight = 600;
	d3.select("#transmutation").property("scrollTop", svgHeight / 2 - containerHeight / 2).property("scrollLeft", svgWidth / 2 - containerWidth / 2);
	
  // background primes
	var svgBackgroundPrimes = svg.selectAll(".bpr")
  .data(backgroundObj.primes)
  .enter()
  .append("image")
  .attr("class", "bpr")
  .attr("width", scale(40))
  .attr("height", scale(40))
  .attr("x", primeX)
  .attr("y", primeY)
  .attr("xlink:href", function(d) {
  	if(d.x == 0 && d.y == 0) {
  		// use the red panel at (0,0)
  		return "img/bprime0.png";
  	}
  	return "img/bprime.png";
  })
  .on("click", bprimeClick);
	
  // background bonds
	var svgBackgroundPrimes = svg.selectAll(".bbo")
  .data(backgroundObj.bonds)
  .enter()
  .append("image")
  .attr("class", "bbo")
  .attr("xlink:href", "img/bbond.png")
  .attr("x", bondX)
  .attr("y", bondY)
  .attr("transform", bondTransform)
  .attr("width", scale(bondWidth))
  .attr("height", scale(bondHeight))
	.on("click", bbondClick);
}

function toolboxPrimeClick(prime) {
	d3.selectAll(".toolbox-prime").classed("toolbox-selected", false);
	d3.select(".toolbox-" + prime).classed("toolbox-selected", true);
	gSelectedPrimeType = prime;
}

function toolboxBondClick(bond) {
	if(gSelectedBondType[bond]) {
		gSelectedBondType[bond] = false;
		d3.select(".toolbox-" + bond).classed("toolbox-bond-selected", false);
	}
	else {
		gSelectedBondType[bond] = true;
		d3.select(".toolbox-" + bond).classed("toolbox-bond-selected", true);
	}
}

function generateMetaCallbacks() {
	d3.select("#puzzle-name").on("keyup", function(d) {
		gPuzzleObj.name = d3.select("#puzzle-name").property("value");
	});
	d3.select("#steam-id").on("keyup", function(d) {
		gPuzzleObj.steamID = d3.select("#steam-id").property("value");
	});
	d3.select("#reagent-add").on("click", function(d) {
		addReagent();
	});
	d3.select("#output-add").on("click", function(d) {
		addOutput();
	});
	d3.select("#savefile").on("click", makePuzzleFile);
}

function generateInsts() {
}

function generateToolbox() {
	var primeTypes = ["salt", "air", "earth", "fire", "water", "quicksilver", "gold", "silver", "copper", "iron", "tin", "lead", "vitae", "mors", "repeat", "quintessence"]
	primeTypes.forEach(function(prime) {
		d3.select("#toolbox-primes").append("div")
		.classed("toolbox-prime", true)
		.classed("toolbox-" + prime, true)
		.style("background", "url('img/" + prime + ".png')")
		.on("click", toolboxPrimeClick.bind(this, prime));
	});
	var bondTypes = ["n", "r", "k", "y"];
	bondTypes.forEach(function(bondType) {
		d3.select("#toolbox-bonds").append("div")
		.classed("toolbox-bond", true)
		.classed("toolbox-" + bondType, true)
		.style("background", "url('img/" + (bondType == 'n' ? 'normal' : bondType) + ".png')")
		.on("click", toolboxBondClick.bind(this, bondType));
	});
}

function addReagent() {
	gPuzzleObj.reagents.push(new Molecule());
	updateReagents();
}

function addOutput() {
	gPuzzleObj.outputs.push(new Molecule());
	updateOutputs();
}

function updateHighlightedMolecule() {
	var od1 = d3.select("#reagents").selectAll(".reagent-option").data(gPuzzleObj.reagents);
	var od2 = d3.select("#outputs").selectAll(".output-option").data(gPuzzleObj.outputs);
	
	od1.classed("molecule-highlight", function(d) {
		if(gMoleculeObj == d) {
			return true;
		}
		return false;
	});
	od2.classed("molecule-highlight", function(d) {
		if(gMoleculeObj == d) {
			return true;
		}
		return false;
	});
}

function updateReagents() {
	
	var od = d3.select("#reagents").selectAll(".reagent-option").data(gPuzzleObj.reagents);
	
	// --update
	od.select(".reagent-select")
	.html(function(d, i) {
		return "R#" + (1+i);
	})
	// --exit
	od.exit().remove();
	// --enter
	var ro = od.enter().append("div")
	.classed("reagent-option", true);
	ro.append("a")
	.classed("reagent-select", true)
	.html(function(d, i) {
		return "R#" + (1+i);
	})
	.on("click", function(d) {
		updateMolecule(d);
	});
	ro.append("a")
	.classed("reagent-remove", true)
	.html("(del)")
	.on("click", function(d) {
		gPuzzleObj.reagents.splice(gPuzzleObj.reagents.indexOf(d), 1);
		updateReagents();
		updateMolecule(new Molecule());
	});
}

function updateOutputs() {
	var od = d3.select("#outputs").selectAll(".output-option").data(gPuzzleObj.outputs);
	
	// --update
	od.select(".output-select")
	.html(function(d, i) {
		return "O#" + (1+i);
	})
	// --exit
	od.exit().remove();
	// --enter
	var ro = od.enter().append("div")
	.classed("output-option", true);
	ro.append("a")
	.classed("output-select", true)
	.html(function(d, i) {
		return "O#" + (1+i);
	})
	.on("click", function(d) {
		updateMolecule(d);
	});
	ro.append("a")
	.classed("output-remove", true)
	.html("(del)")
	.on("click", function(d) {
		gPuzzleObj.outputs.splice(gPuzzleObj.outputs.indexOf(d), 1);
		updateOutputs();
		updateMolecule(new Molecule());
	});
}

// updates reagent/output molecule, does not change background molecule
function updateMolecule(molecule) {
	
	gMoleculeObj = molecule;
	updateHighlightedMolecule();
	
	// summon svg element
	var svg = d3.select("#transmutation-svg");
	
  // update primes
  var svgPrimes = svg.selectAll(".pr").data(gMoleculeObj.primes);
  
  // --update
  svgPrimes.attr("x", primeX).attr("y", primeY).attr("xlink:href", primeImg);
  // --exit
  svgPrimes.exit().remove();
  // --enter
  svgPrimes.enter()
  .append("image")
  .attr("class", "pr")
  .attr("width", scale(40))
  .attr("height", scale(40))
  .attr("x", primeX)
  .attr("y", primeY)
  .attr("xlink:href", primeImg)
  .on("click", primeClick);
  
  // update bonds
  var svgBonds = svg.selectAll(".bo").data(gMoleculeObj.bonds);
  
  // --update
  svgBonds
  .attr("xlink:href", bondImg)
  .attr("x", bondX)
  .attr("y", bondY)
  .attr("transform", bondTransform);
  // --exit
  svgBonds.exit().remove();
  // --enter
  svgBonds.enter()
  .append("image")
  .attr("class", "bo")
  .attr("xlink:href", bondImg)
  .attr("x", bondX)
  .attr("y", bondY)
  .attr("transform", bondTransform)
  .attr("width", scale(bondWidth))
  .attr("height", scale(bondHeight))
	.on("click", bondClick);
}

function updateInsts() {
	var insts = gPuzzleObj.inst;
	var instlist = Inst.instlist;
	
	var od = d3.select("#inst-box").selectAll(".inst-option").data(instlist);
	od.select(".inst-checkbox")
	.style("background", function(d) {
		if(gPuzzleObj.inst[d]) {
			return "url('img/ch1.png')";
		}
		return "url('img/ch0.png')";
	})
	.style("background-size", function(d) {
		return "100% 100%"
	});
	
	od.exit().remove();
	
	var bd = od.enter()
	.append("div")
	.classed("inst-option", true);
	bd.append("div")
	.classed("inst-checkbox", true)
	.style("background", function(d) {
		if(gPuzzleObj.inst[d]) {
			return "url('img/ch1.png')";
		}
		return "url('img/ch0.png')";
	})
	.style("background-size", function(d) {
		return "100% 100%"
	})
	.on("click", function(d) {
		gPuzzleObj.inst[d] = !gPuzzleObj.inst[d];
		updateInsts();
	});
	bd.append("div")
	.classed("inst-label", true)
	.html(function(d) {
		return d;
	});
}

// saves file to disk (needs to click the link)
// args: unconverted uint8array, file name, mimetype (should be omitted)
function saveFile(binary_data, fn, tp) {
	fn = fn || "c455310010962974.puzzle";
	tp = tp || "application/opus-magnum-puzzle";
	var blob1 = new Blob([new Uint8Array(binary_data)], { "type" : tp });
	$I("dl").href = URL.createObjectURL(blob1);
	$I("dl").download = fn;
	$I("dl").click();
}

// idk how the game calculates the filename, but it recognizes anything
// so randomly make a prng here
function notRandom(str1, str2) {
	var o = "";
	var h = 0;
	var seed1 = 8888882;
	var seed2 = 6666677;
	var str = str1 + str2;
	for(var i=0; i<str.length; i++) {
		var c = str.charCodeAt(i);
		h = (h + c) % 9;
		seed1 = (seed1 * 2223331 + seed2 * c * 1117771 + h * 6111111) % 8677777;
		seed2 = (seed1 * 5566777 + seed2 * c * 8899227 + h * 5554441) % 6555557;
		seed1 += 1000000;
		seed2 += 1000000;
	}
	return h.toString() + seed1.toString() + seed2.toString();
}

// create binary file from "Puzzle" object
function makePuzzleFile() {
	var num = notRandom(gPuzzleObj.steamID, gPuzzleObj.name);
	saveFile(constructFile(gPuzzleObj), "c" + num + ".puzzle", "application/opus-magnum-puzzle");
}