var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

	it("Initializes with three Candidates", function() {
		return Election.deployed().then(function(instance) {
			return instance.candidatesCount();
		}).then(function(count) {
			assert.equal(count, 3);
		});
	});

	var electionInstance;
	it("Initializes the Candidates with correct values", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate) {
			assert.equal(candidate[0], 1, "Correct ID");
			assert.equal(candidate[1], "Karan Mittal", "Correct Name");
			assert.equal(candidate[2], 0, "Correct Vote Count");
			return electionInstance.candidates(2);
		}).then(function(candidate) {
			assert.equal(candidate[0], 2, "Correct ID");
			assert.equal(candidate[1], "Rohit Dangi", "Correct Name");
			assert.equal(candidate[2], 0, "Correct Vote Count");
			return electionInstance.candidates(3);
		}).then(function(candidate) {
			assert.equal(candidate[0], 3, "Correct ID");
			assert.equal(candidate[1], "Sai Pavan Nelavalli", "Correct Name");
			assert.equal(candidate[2], 0, "Correct Vote Count");
		});
	}) ;

});