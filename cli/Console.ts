import IssueTrackController from "../src/IssueTrackController";
import readline from "readline"
// ./tests/resource
export default class Console{
	path: string | null = null;
	continue: boolean = true;
	trackController: IssueTrackController = new IssueTrackController("");
	
	rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	 public async runConsole(){
		this.path =  await this.startState()
		// this.trackController.setPath(this.path);
		this.trackController.setPath("./tests/resource");
		// while(this.continue){
		// 	this.middleState()
		// }

		const midStatus = await this.middleState()

		// this.endState()

		this.rl.close()
	}



	private async startState(): Promise<string>{

		return new Promise((resolve) => {
			this.rl.question("Enter the path of the git repository:\n", (path: string) => {
				// this.rl.close();
				resolve(path)
			})
		})
		
	}

	private async middleState(): Promise<number> {

		let badCommit: boolean = false;
		let cont = true;
		while(cont){
			this.trackController.runBisectionStep()
			const currCommit = this.trackController.getCurrCommitHash();
			console.log(`Current Commit To Test: ${currCommit}`)

			let innerLoopCont = true
			while(innerLoopCont){
				const answer = await this.processBisectInput();
				if (answer === 'y'){
					badCommit = true;
					innerLoopCont = false;
				} else if (answer === 'n'){
					badCommit = false;
					innerLoopCont = false;
				} else if (answer === "quit"){
					innerLoopCont = false;
					cont = false
				} else {
					console.log('Did not understand the input, please enter "y"  or "n"')
				}
			}
			let status = this.trackController.runBisection(badCommit)
			if (status === 1) {
				console.log("Start of Bad Commits Found!")
				console.log(`The bad commit is: ${currCommit}`)
				cont = false
			} else if (status === 2) {
				console.log("Hmm, there might be an error as the last commit tested is not a bad commit")
				cont = false
			} else if (status === 3) {
				console.log("One more commit to test")

			} else if (status === 0){
				continue
			}



		}

		return new Promise((resolve, rejects) => {
			resolve(1);
		})

			

	}

		// let status = this.trackController.runBisection(badCommit)
	

	private async processBisectInput(): Promise<string> {
		return new Promise((resovle, reject) => {
			this.rl.question("Was this a bad commit? (y/n)", (answer: string) => { 
				resovle(answer);
			})
		})

	}

	endState() {
		throw new Error("Method not implemented.");
	}

}




