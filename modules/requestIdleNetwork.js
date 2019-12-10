let isWorkerReady = navigator.serviceWorker 
	&& navigator.serviceWorker.controller 
	&& navigator.serviceWorker.controller.state === 'activated'
const backlog = []
let isListening = false


if(!isWorkerReady) {
	navigator.serviceWorker.addEventListener('message', () => {
		isWorkerReady = true
		processBacklog()
	}, { once: true })
} else (
	processBacklog()
)

function processBacklog() {
	if(isListening)
		return 

	isListening = true
	navigator.serviceWorker.addEventListener('message', ({ data }) => {
		isListening = false
		if(data.idle)
			makeRequest()
		else
			processBacklog()
	}, {once: true})
	navigator.serviceWorker.controller.postMessage({ idleRequest: true })
}

function makeRequest() {
	if(!backlog.length)
		return
	const {request, callback, resolve, reject} = backlog.shift()
	if(typeof callback === 'function')
		fetch(request).then(callback).finally(processBacklog)
	else
		fetch(request).catch(reject).then(resolve).finally(processBacklog)
		
}

export function requestIdleNetwork (request, callback) {
	backlog.push({ request, callback })
	if (isWorkerReady)
		processBacklog()
}

export function idleFetch (request) {
	return new Promise((resolve, reject) => {
		backlog.push({ request, resolve, reject })
		if (isWorkerReady)
			processBacklog()
	})
}