// global variables
var gPuzzleObj = {};
var gMoleculeObj = {};
var gBgMolecule = {};

var gSelectedPrimeType = "salt";
var gSelectedBondType = {"n" : false, "r": false, "k": false, "y": false};

function init() {
	// a complete sample puzzle object in json format. could be newed in four lines but put here to help myself remember the format
	gPuzzleObj = {
		"name" : "PUDDING",
		"steamID" : "76561198375746173",
		"inst" : {
			"arm" : true,
			"multiarm" : true,
			"piston" : true,
			"track" : true,
			"bonding" : true,
			"unbonding" : true,
			"multibonding" : true,
			"triplex" : true,
			"calcification" : true,
			"duplication" : true,
			"projection" : true,
			"purification" : true,
			"animismus" : true,
			"disposal" : true,
			"quintessence" : true,
			"grabturn" : true,
			"drop" : true,
			"turnback" : true,
			"repeat" : true,
			"pivot" : true,
			"berlo" : true
		},
		"reagents" : [{
			"primes" : [{
				"type" : "salt",
				"x" : 0,
				"y" : 0
			}, {
				"type" : "salt",
				"x" : 1,
				"y" : 0
			}],
			"bonds" : [{
				"type" : {
					"n" : true,
					"r" : false,
					"k" : false,
					"y" : false
				},
				"x1" : 0,
				"y1" : 0,
				"x2" : 1,
				"y2" : 0
			}]
		}],
		"outputs" : [{
			"primes" : [{
				"type" : "earth",
				"x" : 0,
				"y" : 0
			}, {
				"type" : "fire",
				"x" : 1,
				"y" : 0
			}],
			"bonds" : [{
				"type" : {
					"n" : true,
					"r" : false,
					"k" : false,
					"y" : false
				},
				"x1" : 0,
				"y1" : 0,
				"x2" : 1,
				"y2" : 0
			}]
		}]
	};
	
	// load steamID from localstorage, in case i want to share this with someone else
	if(typeof localStorage == 'object' && typeof localStorage.getItem == 'function' && localStorage.getItem("steamID-of-this-player")) {
		gPuzzleObj.steamID = localStorage.getItem("steamID-of-this-player");
	}
	
	// the big thing to put all the primes on
	gBgMolecule = generateBGMolecule(15);
	
	// metadata
	$I("puzzle-name").value = gPuzzleObj.name;
	$I("steam-id").value = gPuzzleObj.steamID;
	
	// create svg for background molecule, activate callback funcs
	generateField(gBgMolecule);
	generateMetaCallbacks();
	generateToolbox();
	
	// d3.update everything bound to data
	updateReagents();
	updateOutputs();
	updateInsts();
	
	updateMolecule(gPuzzleObj.outputs[0]);
	
	// default types of prime/bondtype
	$Q(".toolbox-salt").click();
	$Q(".toolbox-n").click();
}
