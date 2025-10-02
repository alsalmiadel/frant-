import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, Tag, Share2, Bookmark, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import React from 'react';

interface BlogPostPageProps {
  slug: string;
  onBack: () => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onBack }) => {
  const [post, setPost] = React.useState<any | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const blog = await import('../lib/blog');
        const data = await blog.getPost(slug);
        if (mounted) setPost(data || null);
      } catch (error) {
        console.error('Error loading post:', error);
        if (mounted) setPost(null);
      }
    })();
    return () => { mounted = false };
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | SmartStartAI`;
      
      // تتبع فتح المقال
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'blog_post_open', {
          event_category: 'Blog',
          event_label: 'User opened blog post',
          custom_parameters: {
            post_slug: post.slug,
            post_title: post.title
          }
        });
      }
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-almarai font-bold text-gray-800 mb-2">
            المقال غير موجود
          </h2>
          <p className="text-gray-600 font-almarai mb-6">
            لم نتمكن من العثور على المقال المطلوب
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-6 py-3 rounded-xl font-almarai font-bold"
          >
            العودة للمدونة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-light-green">
      {/* رأس المقال */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-600 hover:text-saudi-green transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-almarai">العودة للمدونة</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-right"
          >
            <h1 className="text-3xl md:text-4xl font-almarai font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-end gap-6 text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-almarai text-sm">
                  {new Date(post.date).toLocaleDateString('ar-SA')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-almarai text-sm">
                  {Math.ceil(post.content.length / 1000)} دقائق قراءة
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-almarai text-sm">فريق SmartStartAI</span>
              </div>
            </div>

            {/* التصنيفات */}
            <div className="flex items-center justify-end gap-2 mb-6">
              <Tag className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-saudi-green/10 text-saudi-green px-3 py-1 rounded-full text-sm font-almarai font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* محتوى المقال */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* صورة المقال */}
          {post.image && (
            <div className="relative h-64 md:h-80 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          )}

          <div className="p-8">
            {/* محتوى المقال */}
            <div 
              className="prose prose-lg max-w-none text-right font-almarai leading-relaxed"
              style={{ direction: 'rtl' }}
              dangerouslySetInnerHTML={{ 
                __html: marked.parse(post.content) as string 
              }} 
            />

            {/* تنبيه مهني */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div className="text-right">
                  <h4 className="font-almarai font-bold text-yellow-800 mb-2">
                    تنبيه مهني
                  </h4>
                  <p className="text-yellow-700 font-almarai text-sm leading-relaxed">
                    هذا المحتوى للأغراض التعليمية والتوعوية فقط وليس استشارة قانونية أو مالية. 
                    يُنصح بمراجعة مختص قبل اتخاذ قرارات استثمارية.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* أزرار المشاركة */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-saudi-green text-white px-4 py-2 rounded-lg font-almarai text-sm hover:bg-saudi-green/90 transition-colors">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </button>
                  <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-almarai text-sm hover:bg-gray-200 transition-colors">
                    <Bookmark className="h-4 w-4" />
                    حفظ
                  </button>
                </div>
                
                <p className="text-gray-500 font-almarai text-sm">
                  هل كان هذا المقال مفيداً؟
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        {/* مقالات ذات صلة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
        >
          <h3 className="text-2xl font-almarai font-bold text-gray-800 mb-6 text-right">
            مقالات ذات صلة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getAllPosts()
              .filter(p => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.slug}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onOpenPost(relatedPost.slug)}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <h4 className="font-almarai font-bold text-gray-800 mb-2 text-right group-hover:text-saudi-green transition-colors">
                    {relatedPost.title}
                  </h4>
                  <p className="text-gray-600 font-almarai text-sm text-right line-clamp-2">
                    {relatedPost.excerpt || (relatedPost.content.slice(0, 100) + "...")}
                  </p>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;