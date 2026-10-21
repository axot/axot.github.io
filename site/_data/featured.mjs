import { loadPosts } from '../../lib/content.mjs';

export default function () {
  return loadPosts().find(post => post.slug === 'can-you-crack-it-solution');
}
