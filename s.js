var gPuzzleObj = {};
var gMoleculeObj = {};
var gBgMolecule = {};

var gSelectedPrimeType = "salt";
var gSelectedBondType = {"n" : false, "r": false, "k": false, "y": false};

function init() {
	// a complete sample puzzle object in json format.
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
}