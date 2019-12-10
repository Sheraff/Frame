import { requestIdleNetwork, idleFetch } from './modules/requestIdleNetwork.js'

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'))
}

fetch('/files/5.txt').then(console.log)