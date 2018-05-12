import { schema } from 'normalizr';

export const post = new schema.Entity('posts');
// export const postsList = new schema.Array(post); // OR with shorthand:
export const postsList = [post];
