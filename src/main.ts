import { init } from './modules/sockets';
import App from './App.svelte';

init();

const app = new App({
    target: document.body,
    props: {},
});

export default app;
