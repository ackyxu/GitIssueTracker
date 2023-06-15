export default  class Bisection {
	private start = 0;
	private end: number;
	private curr = 0;

	public constructor(end: number) {
		this.end = end;
	}

	public bisectionStep(): number {
		this.nextCurrDet();
		return this.curr
	}

	public getStartEnd(): number[] {
		return [this.start, this.end]
	}


	protected nextCurrDet(): void {
		this.curr = Math.floor((this.end + this.start)/2);
	};

	protected nextCurrRan(): void {
		this.curr =  Math.floor(Math.random() * (this.end - this.start) + this.start);
	}

	public bisection(input: boolean): number {
		if (input){
			this.start = this.curr;
			if (this.end - 1 === this.start){
				return 1
			}

		} else {
			this.end = this.curr;
			// not found, problem might not exsist
			if (this.end - this.start == 0){
				return 2
			}
			
		}
		// more to come
		return 0
	}
}
