import React, { useMemo } from 'react';
import { Calendar, Tag, ArrowRight, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

interface BlogIndexProps {
  onOpenPost: (slug: string) => void;
}

const BlogIndex: React.FC<BlogIndexProps> = ({ onOpenPost }) => {
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const blog = await import('../lib/blog');
        const data = await blog.getAllPosts();
        if (mounted) setPosts(data);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    })();
    return () => { mounted = false };
  }, []);

  // تتبع عرض المدونة
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'blog_view', {
        event_category: 'Blog',
        event_label: 'User viewed blog index',
        custom_parameters: {
          page_type: 'blog_index'
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green p-6">
      <div className="max-w-6xl mx-auto">
        {/* رأس المدونة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-almarai font-bold text-gray-900 mb-6">
            📚 مدونة الاستثمار والتجارة
          </h1>
          <p className="text-xl text-gray-600 font-almarai max-w-3xl mx-auto">
            نصائح وإرشادات عملية لرواد الأعمال في السوق السعودي
          </p>
        </motion.div>

        {/* شبكة المقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => onOpenPost(post.slug)}
            >
              {/* صورة المقال */}
              {post.image && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}

              <div className="p-6">
                {/* العنوان */}
                <h2 className="text-xl font-almarai font-bold text-gray-800 mb-3 text-right line-clamp-2 group-hover:text-saudi-green transition-colors">
                  {post.title}
                </h2>

                {/* الملخص */}
                <p className="text-gray-600 font-almarai text-sm mb-4 text-right leading-relaxed line-clamp-3">
                  {post.excerpt || (post.content.slice(0, 120) + "...")}
                </p>

                {/* التاريخ والتصنيفات */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500 font-almarai text-sm">
                      {new Date(post.date).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="bg-saudi-green/10 text-saudi-green px-2 py-1 rounded-full text-xs font-almarai font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* زر القراءة */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-saudi-green/10 to-saudi-gold/10 text-saudi-green border border-saudi-green/20 py-3 rounded-xl font-almarai font-bold hover:bg-gradient-to-r hover:from-saudi-green hover:to-saudi-gold hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  اقرأ المزيد
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* إحصائيات المدونة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <h3 className="text-2xl font-almarai font-bold text-center text-gray-800 mb-8">
            إحصائيات المدونة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-saudi-green mb-2">{posts.length}</div>
              <div className="text-gray-600 font-almarai">مقال منشور</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-saudi-gold mb-2">15K+</div>
              <div className="text-gray-600 font-almarai">قارئ شهرياً</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-tech-blue mb-2">4.8/5</div>
              <div className="text-gray-600 font-almarai">تقييم المحتوى</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600 font-almarai">معدل الفائدة</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogIndex;