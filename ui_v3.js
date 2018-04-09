
// svg props
var svgWidth = 2400;//d3.select("#transmutation").node().offsetWidth;
var svgHeight = 2400;//d3.select("#transmutation").node().offsetHeight;
var svgContentSize = 2400;
var scale = d3.scaleLinear().domain([0,svgContentSize]).range([0, Math.min(svgHeight * 4/3, svgWidth)]).nice();

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
	return scale(60 * d.x + 30 * d.y + svgContentSize/2 - 20);
};
var primeY = function(d) {
	return scale(0.9 * 60 * -d.y + svgContentSize/2 - 20);
};
var bondWidth = 27;
var bondHeight = 18;
var bondX = function(d) {
	return scale(60 * (d.x1 + d.x2) / 2 + 30 * (d.y1 + d.y2) / 2 + svgContentSize/2 - bondWidth/2);
};
var bondY = function(d) {
	return scale(0.9 * 60 * -(d.y1 + d.y2) / 2 + svgContentSize/2 - bondHeight/2 - 1);
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

// toolbox event callbacks.
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

// attaches callbacks to all page elements
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
	d3.select("#reagent-dupe").on("click", function(d) {
		duplicateCurrentToReagent();
	});
	d3.select("#output-dupe").on("click", function(d) {
		duplicateCurrentToOutput();
	});
	d3.select("#output-multiplier-input").on("keyup", function(d) {
		gPuzzleObj.outputTargetScale = parseInt(d3.select("#output-multiplier-input").property("value"), 10);
	});
	d3.select("#savefile").on("click", makePuzzleFile);
	d3.select("#toolbox").on("dragover", eventNothing);
	d3.select("#toolbox").on("drop", toolboxDrop);
	d3.select("#loadfile").on("click", function(d) {
		d3.select("#file-input").node().click();
	});
	d3.select("#file-input").on("change", inputFileLoad);
}

// init function, fill the toolbox
function generateToolbox() {
	var primeTypes = ["salt", "air", "earth", "fire", "water", "quicksilver", "gold", "silver", "copper", "iron", "tin", "lead", "vitae", "mors", "repeat", "quintessence"]
	primeTypes.forEach(function(prime) {
		d3.select("#toolbox-primes").append("div")
		.classed("toolbox-prime", true)
		.classed("toolbox-" + prime, true)
		.style("background", "url('img/" + prime + ".png') 0 0 / 100% 100%")
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

// highlight the current molecule being edited
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

// update molecule lists
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
	.on("click", function(d, i) {
		gPuzzleObj.reagents.splice(i, 1);
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
	.on("click", function(d, i) {
		gPuzzleObj.outputs.splice(i, 1);
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

// update inst list
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

// text input fields
function updateTextInputs() {
	d3.select("#puzzle-name").property("value", gPuzzleObj.name);
	d3.select("#steam-id").property("value", gPuzzleObj.steamID);
	d3.select("#output-multiplier-input").property("value", gPuzzleObj.outputTargetScale);
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
	// save steamID into localstorage, in case i want to share this with someone else
	try {
		localStorage.setItem("steamID-of-this-player", gPuzzleObj.steamID);
	}
	catch(c) {
	}
}

// write puzzle data to global object, and refresh everything
function importPuzzleData(puz) {
	// transfer props to global object
	gPuzzleObj.name = puz.name || "";
	gPuzzleObj.steamID = puz.steamID || 0;
	["inst", "reagents", "outputs", "outputTargetScale", "isProduction", "productionInfo"].forEach(function(prop) {
		gPuzzleObj[prop] = puz[prop];
	});

	// update metadata
	updateTextInputs();

	// update lists
	updateReagents();
	updateOutputs();
	updateInsts();

    // remove pipe selection
    gSelectedPipe = null;

	// update production info
	updateProduction();
    updateProductionBoard();

	// update molecule
	if(gPuzzleObj.outputs.length == 0) {
		addOutput();
	}
	updateMolecule(gPuzzleObj.outputs[0]);
}

// toolbox drop handler
function toolboxDrop(d) {
	var evt = d3.event;
	evt.stopPropagation();
	evt.preventDefault();

	// find the file
	try {
		var file = d3.event.dataTransfer.files[0];
	}
	catch(c) {
		return;
	}

	// load the file
	try {
		loadFile(file);
	}
	catch(c) {
	}
}

// input file load handler
function inputFileLoad(d) {
	try {
		loadFile(d3.event.target.files[0]);
	}
	catch(c) {
	}
}

// load file from file obj
function loadFile(fp) {
	var fr = new FileReader();
	fr.onload = function(r) {
		try {
			importPuzzleData(loadPuzzle([].slice.call(new Uint8Array(r.target.result))));
		}
		catch(c) {
		}
	};
	fr.readAsArrayBuffer(fp);
}

// resize function
// contentSize in px, moleculeSize in molecule count
function resizeField(contentSize, moleculeSize) {
	// reset the constant and scale
	svgContentSize = contentSize;
	scale = d3.scaleLinear().domain([0,svgContentSize]).range([0, Math.min(svgHeight * 4/3, svgWidth)]).nice();

	// remove everything
	var svg = d3.select("#transmutation-svg");
	svg.selectAll("*").remove();

	// recreate everything
	gBgMolecule = generateBGMolecule(moleculeSize);
	generateField(gBgMolecule);
	updateMolecule(gPuzzleObj.outputs[0] || new Molecule());
}

function duplicateCurrentToReagent() {
	if(!gMoleculeObj) {
		return;
	}
	var molecule = duplicateMolecule(gMoleculeObj);
	gPuzzleObj.reagents.push(molecule);
	updateReagents();
}

function duplicateCurrentToOutput() {
	if(!gMoleculeObj) {
		return;
	}
	var molecule = duplicateMolecule(gMoleculeObj);
	gPuzzleObj.outputs.push(molecule);
	updateOutputs();
}