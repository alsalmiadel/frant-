import matter from "gray-matter";

const files = import.meta.glob("/content/blog/*.md", { as: "raw", eager: false }) as Record<string, () => Promise<{ default: string }>>;

export type Post = { 
  slug: string; 
  title: string; 
  date: string; 
  tags: string[]; 
  excerpt?: string; 
  image?: string; 
  content: string; 
  path: string; 
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const entries = Object.entries(files);
    const loaded = await Promise.all(entries.map(async ([path, loader]) => {
      try {
        const mod = await loader();
        const raw = mod.default;
        if (!raw || typeof raw !== 'string') return null;
        const { data, content } = matter(raw);
        const slug = String(data.slug || path.split("/").pop()?.replace(/\.md$/, ""));
        return {
          slug,
          title: String(data.title || slug),
          date: String(data.date || ""),
          tags: (data.tags || []) as string[],
          excerpt: data.excerpt,
          image: data.image,
          content,
          path
        } as Post;
      } catch (error) {
        console.error(`Error parsing ${path}:`, error);
        return null;
      }
    }));
    return (loaded.filter(Boolean) as Post[]).sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
};

export const getPost = async (slug: string): Promise<Post | undefined> => {
  const posts = await getAllPosts();
  return posts.find(p => p.slug === slug);
};