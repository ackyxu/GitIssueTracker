import GitAPI from "./GitAPI";
import Bisection from "./Bisection";


export default class IssueTrackController{

	private path: string;
	private gitAPI: GitAPI;
	private bisection: Bisection;
	private index: number = 0;

	constructor(path: string) {
		this.path = path
		this.gitAPI = new GitAPI(this.path)
		this.bisection = new Bisection((this.gitAPI.getCommitHashList()).length)
	}

	public runBisectionStep(){
		
		this.index = this.bisection.bisectionStep()
		return this.index
	}

	public runBisection(badCommit: boolean){
		return this.bisection.bisection(badCommit)
	
	}

	public setPath(path:string) {
		this.path = path;
		this.gitAPI.setPath(path);
		this.bisection = new Bisection((this.gitAPI.getCommitHashList()).length)
	}

	public getNextCurrCommit(){
		const hash = (this.gitAPI.getCommitHashList())[this.index]
		const msg = (this.gitAPI.getCommitMessageDict())[hash]

		return [hash, msg]

	}

	public getStartEnd(): number[]{
		return this.bisection.getStartEnd()
	}

	public getCommitHashList(): string[]{
		return this.gitAPI.getCommitHashList()
	}

	public getCurrCommitHash(): string{
		return (this.gitAPI.getCommitHashList())[this.index]
	}

	public getCurrHashList(): string[] {
		const startEnd = this.getStartEnd()
		return (this.gitAPI.getCommitHashList()).slice(startEnd[0],startEnd[1])
	}

	public getCommitMessageDict():{[index: string]: string}{
		return this.gitAPI.getCommitMessageDict()
	}
	
	public getPath() {
		return this.path
	}

} 