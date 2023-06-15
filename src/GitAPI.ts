import {execSync} from "child_process"

export default class GitAPI {
	private path:string = "";
	private cmd: string = `git -C ${this.path} log --pretty=%H:%s`;
	private commitHastList: string[] = [];
	private commitMessageDict: {[index: string]: string} = {};
	
	public constructor(path: string|null){
		if (path === null){
			console.log("WARNING: Path has not been set yet")
		} else {
			this.path = path;
			this.cmd = `git -C ${this.path} log --pretty=%H:%s`
			this.getGitLog();
		}


	}

	public setPath(path: string) {
		this.path = path;
		this.cmd = `git -C ${this.path} log --pretty=%H:%s`
		this.getGitLog();
	}

	public getGitLog(): number {
		if (this.path === ""){
			return 0
		} else {
			let output = ((execSync(this.cmd)).toString()).split(/\r?\n/)
			for (let i = output.length-2; i >=0; i--){
				let split =  output[i].split(/:(.*)/s)
				let hash = split[0];
				let msg =  split[1];
				this.commitHastList.push(hash);
				this.commitMessageDict[hash] = msg
			}
			return 1
		}
	}

	public getCommitHashList(): string[]{
		return this.commitHastList;
	}

	public getCommitMessageDict(): {[index: string]: string}{
		return this.commitMessageDict;
	}



}


