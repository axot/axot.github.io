import { loadPosts } from '../../lib/content.mjs';

export default function () {
  const topics = new Map();
  for (const post of loadPosts()) {
    if (!topics.has(post.categorySlug)) {
      topics.set(post.categorySlug, { slug: post.categorySlug, name: post.topic, posts: [] });
    }
    topics.get(post.categorySlug).posts.push(post);
  }
  return [...topics.values()];
}
