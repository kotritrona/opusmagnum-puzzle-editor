var gPuzzleObj = {};
var gMoleculeObj = {};
var gBgMolecule = {};

var gSelectedPrimeType = "salt";
var gSelectedBondType = {"n" : false, "r": false, "k": false, "y": false};

function init() {
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