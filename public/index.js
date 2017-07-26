import {handleWebSocketFormSubmit} from './websocket';

export const websocketForm = document.querySelector('.websocket-wrapper > form');

websocketForm.addEventListener('submit', handleWebSocketFormSubmit, false);
