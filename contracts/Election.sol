pragma solidity ^0.4.2;

contract Election {

	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	mapping(uint => Candidate) public candidates;

	uint public candidatesCount;

	constructor() public {
		addCandidate("Karan Mittal");
		addCandidate("Rohit Dangi");
		addCandidate("Sai Pavan Nelavalli");
	}

	function addCandidate(string _name) private {
		++candidatesCount;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

}
