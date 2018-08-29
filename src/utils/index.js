// with 1st method then do: import { somewhat } from 'Utilities';
// export {default as someWhat} from './someWhere'; // OR:
// export * from './someWhere';

// eslint-disable-next-line import/prefer-default-export
export const toJSON = obj => JSON.stringify(obj);
