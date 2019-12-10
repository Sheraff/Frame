export default class IdleStack {

	static PADDING = 5

	constructor() {
		this.stack = []
	}

	push(task, options) {
		this.stack.push({task, options})
		if(!this.idleCallbackId)
			this.start()
	}

	start() {
		this.idleCallbackId = requestIdleCallback(idleDeadline => {
			while (this.stack.length && idleDeadline.timeRemaining() > IdleStack.PADDING) {
				const {task, options} = this.stack.shift()
				this.lastResult = task(this.lastResult)
			}
			if(this.stack.length)
				this.start()
		})
	}

	finish() {
		if(this.idleCallbackId)
			cancelIdleCallback(this.idleCallbackId)
		while (this.stack.length) {
			const {task, options} = this.stack.shift()
			this.lastResult = task(this.lastResult)
		}
		return this.lastResult
	}
}