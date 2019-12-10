export default class IdleStack {

	static PADDING = 5

	constructor() {
		this.stack = []
	}

	push(task) {
		this.stack.push(task)
		if(!this.idleCallbackId)
			this.start()
	}

	start() {
		this.idleCallbackId = requestIdleCallback(async idleDeadline => {
			while (this.stack.length && idleDeadline.timeRemaining() > IdleStack.PADDING) {
				const task = this.stack.shift()
				this.lastResult = await task(this.lastResult)
			}
			if(this.stack.length)
				this.start()
		})
	}

	async finish() {
		if(this.idleCallbackId)
			cancelIdleCallback(this.idleCallbackId)
		while (this.stack.length) {
			const task = this.stack.shift()
			this.lastResult = await task(this.lastResult)
		}
		return this.lastResult
	}
}