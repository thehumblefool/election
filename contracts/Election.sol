pragma solidity ^0.4.2;

contract Election {

	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	event votedEvent (
        uint indexed _candidateID
    );

	mapping(uint => Candidate) public candidates;

	mapping(address => bool) public voters;

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

	function vote(uint _candidateID) public {

		require(!voters[msg.sender]);

		require(_candidateID > 0 && _candidateID <= candidatesCount);

		voters[msg.sender] = true;
		++candidates[_candidateID].voteCount;

		// trigger voted event
    	emit votedEvent(_candidateID);
	}
}
