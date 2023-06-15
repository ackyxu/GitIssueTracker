import {expect, use} from "chai";
import chaiAsPromised from "chai-as-promised";
import GitAPI from '../../src/GitAPI'
import Bisection from '../../src/Bisection'
import IssueTrackController from '../../src/IssueTrackController'


use(chaiAsPromised);

describe("Unit Tests",  function() {

	describe("GitAPI Tests", function() {
		console.log('Current directory: ' + process.cwd());
		const gitAPI = new GitAPI("./tests/resource");
		const numExpected = 3457;

		it("Should import the correct amount of logs (CommitHashList), from start of the repo to when it was cloned", () => {
			let result = (gitAPI.getCommitHashList()).length;
			return expect(result).to.equal(numExpected)
		}) 

		it("Should import the correct amount of logs (CommitMessageDict), from start of the repo to when it was cloned", () => {
			let result = Object.keys((gitAPI.getCommitMessageDict())).length;
			return expect(result).to.equal(numExpected)
		})

		it("Should contain the following hash, with specific comment, p1" , () => {
			let resultObj = gitAPI.getCommitMessageDict();
			return expect(resultObj['4328e76f7ee9b613623ba30753c0a2aef8b27c97']).to.equal('Remove unnecessary warnings')


		})

		it("Should contain the following hash, with specific comment, p2" , () => {
			let resultObj = gitAPI.getCommitMessageDict();
			return expect(resultObj['d641d8583b32fc3dbb6eecdecc7a00d64f046b24']).to.equal('tag: clang-format v1.4.0')
		})


		it("Should contain the following hash, with specific comment, p3" , () => {
			let resultObj = gitAPI.getCommitMessageDict();
			return expect(resultObj['ea296ef350714fb6f105b420fb0bc321d9997ffd']).to.equal('Cleanup deprecated compressed_ten_bit_format signal')
		})
	
		it("Should contain the following hash, with specific comment, p4" , () => {
			let resultObj = gitAPI.getCommitMessageDict();
			return expect(resultObj['47e6f527c4f3bf82cfaccf688068f5dfa52dad6e']).to.equal('svt-av1 initial commit')
		})
			
		
	})

	describe("Bisect Test", () => {
		let controller: IssueTrackController;
		let commitHastList: string[];
		beforeEach(() => {
			controller = new IssueTrackController("./tests/resource");
			commitHastList = controller.getCommitHashList()
		})

		it("should terminate with the hash begining d641d858", () => {
			const index = commitHastList.indexOf('d641d8583b32fc3dbb6eecdecc7a00d64f046b24')
			let result = -1;
			let currHash: number = 0;
			let i: number;
			for(i = 0; i <= 20; i++){
				currHash = controller.runBisectionStep();
				if (index >= currHash ){
					result =controller.runBisection(true);
					console.log(`${(controller.getCurrCommitHash()).slice(0,7)}\t\t\tGood`)
				} else {
					result = controller.runBisection(false);
					console.log(`${(controller.getCurrCommitHash()).slice(0,7)}\t\t\tBad`)
				}
			
			}

			return expect(commitHastList[currHash]).to.equal('d641d8583b32fc3dbb6eecdecc7a00d64f046b24')
				
		})

		it("should terminate with the hash begining 47e6f527 (first commit)", () => {
			const index = commitHastList.indexOf('47e6f527c4f3bf82cfaccf688068f5dfa52dad6e')
			let result = -1;
			let currHash: number = 0;
			let i: number;
			for(i = 0; i <= 20; i++){
				currHash = controller.runBisectionStep();
				if (index >= currHash ){
					result =controller.runBisection(true);
				} else {
					result = controller.runBisection(false);
				}
			
			}
			return expect(currHash).to.equal(0)
				
		})


		it("should terminate with the hash begining ea296ef3 (last commit)", () => {
			const index = commitHastList.indexOf('ea296ef350714fb6f105b420fb0bc321d9997ffd')
			let result = -1;
			let currHash: number = 0;
			let i: number;
			for(i = 0; i <= 20; i++){
				currHash = controller.runBisectionStep();
				if (index >= currHash ){
					result =controller.runBisection(true);
				} else {
					result = controller.runBisection(false);
				}
			
			}
			return expect(currHash).to.equal(commitHastList.length-1)
				
		})

		it("should fail with the hash begining dj84j6ty", () => {
			const index = commitHastList.indexOf('dj84j6tyc4f3bf82cfaccf688068f5dfa52dad6e')
			let result = -1;
			let currHash: number = 0;
			let i: number;
			for(i = 0; i <= 20; i++){
				currHash = controller.runBisectionStep();
				if (index >= currHash ){
					result =controller.runBisection(true);
				} else {
					result = controller.runBisection(false);
				}
			
			}
			return expect(result).to.equal(2)
				
		})

		})

	})
