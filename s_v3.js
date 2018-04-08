var gPuzzleObj = {};
var gMoleculeObj = {};
var gBgMolecule = {};

var gSelectedPrimeType = "salt";
var gSelectedBondType = {"n" : false, "r": false, "k": false, "y": false};

var gEditMode = {
	"research" : true,
	"production" : false,
	"pipeShape" : false,
	"pipeIO" : false
};
var gSelectedProductionTool = null;
var gSelectedPipe = null;
var gProductionBgMolecule = null;

function init() {
	// a complete sample puzzle object in json format.
	gPuzzleObj = {
		"name" : "SAMPLE",
		"steamID" : "76561198375746173",
		"inst" : {
			"arm" : true,
			"multiarm" : true,
			"piston" : true,
			"track" : true,
			"bonding" : true,
			"unbonding" : true,
			"multibonding" : true,
			"triplex" : false,
			"calcification" : true,
			"duplication" : false,
			"projection" : false,
			"purification" : false,
			"animismus" : false,
			"disposal" : false,
			"quintessence" : false,
			"grabturn" : true,
			"drop" : true,
			"turnback" : true,
			"repeat" : true,
			"pivot" : true,
			"berlo" : false
		},
		"reagents" : [{
			"primes" : [{
				"type" : "fire",
				"x" : 0,
				"y" : 0
			}, {
				"type" : "air",
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
				"type" : "air",
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
		"outputTargetScale" : 1,
		"isProduction" : false,
		"productionInfo" : {
			"shrinkLeft" : false,
			"shrinkRight" : false,
			"isolateIO" : false,
			"regions" : [{
				"x" : 0,
				"y" : 0,
				"type" : "Large"
			},{
				"x" : 10,
				"y" : 0,
				"type" : "Large"
			}],
			"pipes" : [{
				"x1": 0,
				"y1": 0,
				"x2": 10,
				"y2": 0,
				"offsets": [{
					"x": 0,
					"y": 0
				}]
			}],
			"vials" : [{
				"x" : 5,
				"y" : -3,
				"isTop" : false,
				"count" : 1
			}]
		}
	};

	// load steamID from localstorage, in case i want to share this with someone else
	if(typeof localStorage == 'object' && typeof localStorage.getItem == 'function' && localStorage.getItem("steamID-of-this-player")) {
		gPuzzleObj.steamID = localStorage.getItem("steamID-of-this-player");
	}

	// initialization
	gBgMolecule = generateBGMolecule(15);

	$I("puzzle-name").value = gPuzzleObj.name;
	$I("steam-id").value = gPuzzleObj.steamID;

	generateField(gBgMolecule);
	generateMetaCallbacks();
	generateToolbox();

	updateReagents();
	updateOutputs();
	updateInsts();

	updateMolecule(gPuzzleObj.outputs[0]);

	$Q(".toolbox-salt").click();
	$Q(".toolbox-n").click();

	// production stage
	initProduction();
}