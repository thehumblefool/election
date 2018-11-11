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
	});

	var candidateID;
	it("Cast a vote", function () {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			candidateID = 1;
			return electionInstance.vote(1, { from : accounts[0] });
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, "An event was triggered");
    		assert.equal(receipt.logs[0].event, "votedEvent", "Correct Event");
    		assert.equal(receipt.logs[0].args._candidateID.toNumber(), candidateID, "Correct CandidateID");
    		return electionInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "Voter was marked as voted");
			return electionInstance.candidates(candidateID);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "Karan Mittal's voteCount incremented");
		});
	});

	it("Throws an exception for invalid candidates", function() {
		return Election.deployed().then(function(instance) {
      		electionInstance = instance;
      		return electionInstance.vote(66, { from: accounts[1] });
    	}).then(assert.fail).catch(function(error) {
    		assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
      		return electionInstance.candidates(1);
    	}).then(function(candidate1) {
      		var voteCount = candidate1[2];
      		assert.equal(voteCount, 1, "Karan Mittal did not receive extra votes");
      		return electionInstance.candidates(2);
    	}).then(function(candidate2) {
      		var voteCount = candidate2[2];
      		assert.equal(voteCount, 0, "Rohit Dangi did not receive extra votes");
      		return electionInstance.candidates(3);
    	}).then(function(candidate3) {
    		var voteCount = candidate3[2];
    		assert.equal(voteCount, 0, "Sai Pavan Nelavalli did not receive extra votes");
    	});
  	});


	it("Throws an exception for double voting", function() {
    	return Election.deployed().then(function(instance) {
      		electionInstance = instance;
      		candidateId = 3;
      		electionInstance.vote(candidateId, { from: accounts[1] });
      		return electionInstance.candidates(candidateId);
    	}).then(function(candidate) {
      		var voteCount = candidate[2];
      		assert.equal(voteCount, 1, "Accepts first vote");
      		// Try to vote again
      		return electionInstance.vote(candidateId, { from: accounts[1] });
    	}).then(assert.fail).catch(function(error) {
      		assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
      		return electionInstance.candidates(1);
    	}).then(function(candidate1) {
      		var voteCount = candidate1[2];
      		assert.equal(voteCount, 1, "Karan Mittal did not receive extra votes");
      		return electionInstance.candidates(2);
    	}).then(function(candidate2) {
      		var voteCount = candidate2[2];
      		assert.equal(voteCount, 0, "Rohit Dangi did not receive extra votes");
      		return electionInstance.candidates(3);
    	}).then(function(candidate3) {
    		var voteCount = candidate3[2];
    		assert.equal(voteCount, 1, "Sai Pavan Nelavalli did not receive extra votes");
    	});
  	});

});