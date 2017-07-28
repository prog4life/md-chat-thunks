import {handleWebSocketFormSubmit} from './websocket';

export const websocketForm = document.querySelector('.websocket-wrapper > form');

websocketForm.addEventListener('submit', handleWebSocketFormSubmit, false);

// TODO: research changing timeout for xhr longpoll request
