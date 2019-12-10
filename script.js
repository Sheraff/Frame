import { requestIdleNetwork, idleFetch } from './modules/requestIdleNetwork.js'
import IdleStack from './modules/IdleStack.js'

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'))
}

idleFetch('/files/5.txt')

const stack = new IdleStack()