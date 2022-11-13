import './app.css';
import App from './App.svelte';

const app = new App({
	target: document.querySelector('#app') as Element,
});

export default app;
