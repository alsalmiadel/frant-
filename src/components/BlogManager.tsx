import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, 
  Plus, 
  Eye, 
  Trash2, 
  Calendar, 
  Tag, 
  Search, 
  Filter,
  ArrowLeft,
  Save,
  X,
  Image,
  Link,
  Bold,
  Italic,
  List,
  Hash,
  Globe,
  Clock,
  User,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt?: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime: number;
  views: number;
}

interface BlogManagerProps {
  onBack: () => void;
}

const BlogManager: React.FC<BlogManagerProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // بيانات تجريبية للمقالات
  useEffect(() => {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'دليل شامل لبدء مشروع مطعم ناجح في السعودية',
        slug: 'restaurant-guide-saudi',
        excerpt: 'كل ما تحتاج معرفته لبدء مشروع مطعم مربح في المملكة العربية السعودية، من التراخيص إلى التسويق.',
        content: `# دليل شامل لبدء مشروع مطعم ناجح في السعودية

## مقدمة
قطاع المطاعم في المملكة العربية السعودية يشهد نمواً مستمراً، مما يجعله خياراً جذاباً للمستثمرين ورواد الأعمال...

## التراخيص المطلوبة
- ترخيص البلدية
- ترخيص وزارة الصحة
- ترخيص الدفاع المدني
- السجل التجاري

## اختيار الموقع المناسب
الموقع هو أحد أهم عوامل نجاح المطعم...`,
        author: 'فريق حور',
        publishedAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        status: 'published',
        tags: ['مطاعم', 'ريادة أعمال', 'تراخيص'],
        category: 'دليل الأعمال',
        featuredImage: '/images/restaurant-guide.jpg',
        seoTitle: 'كيف تبدأ مطعم ناجح في السعودية - دليل شامل 2024',
        seoDescription: 'دليل متكامل لبدء مشروع مطعم مربح في السعودية مع جميع التراخيص والخطوات المطلوبة.',
        readingTime: 8,
        views: 1250
      },
      {
        id: '2',
        title: 'أفضل القطاعات للاستثمار في السعودية 2024',
        slug: 'best-investment-sectors-2024',
        excerpt: 'تعرف على القطاعات الأكثر ربحية ونمواً في المملكة العربية السعودية لعام 2024.',
        content: `# أفضل القطاعات للاستثمار في السعودية 2024

رؤية السعودية 2030 فتحت آفاقاً جديدة للاستثمار...`,
        author: 'د. أحمد المالكي',
        publishedAt: '2024-01-12T14:30:00Z',
        updatedAt: '2024-01-12T14:30:00Z',
        status: 'published',
        tags: ['استثمار', 'رؤية 2030', 'قطاعات'],
        category: 'تحليل السوق',
        readingTime: 6,
        views: 980
      },
      {
        id: '3',
        title: 'كيفية إعداد دراسة جدوى احترافية',
        slug: 'professional-feasibility-study',
        excerpt: 'خطوات عملية لإعداد دراسة جدوى شاملة ومقنعة للمستثمرين والبنوك.',
        content: `# كيفية إعداد دراسة جدوى احترافية

دراسة الجدوى هي الخطوة الأولى والأهم في أي مشروع...`,
        author: 'سارة الأحمدي',
        updatedAt: '2024-01-18T09:15:00Z',
        status: 'draft',
        tags: ['دراسة جدوى', 'تخطيط', 'مشاريع'],
        category: 'أدوات ريادية',
        readingTime: 10,
        views: 0
      }
    ];

    setTimeout(() => {
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // تصفية المقالات
  useEffect(() => {
    let filtered = posts;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(post => post.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(post => post.category === filterCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [posts, filterStatus, filterCategory, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'draft': return 'مسودة';
      case 'archived': return 'مؤرشف';
      default: return 'غير محدد';
    }
  };

  const createNewPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'مقال جديد',
      slug: 'new-post',
      excerpt: '',
      content: '',
      author: 'فريق حور',
      updatedAt: new Date().toISOString(),
      status: 'draft',
      tags: [],
      category: 'عام',
      readingTime: 1,
      views: 0
    };
    setSelectedPost(newPost);
    setIsEditing(true);
  };

  const savePost = (post: BlogPost) => {
    if (posts.find(p => p.id === post.id)) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...post, updatedAt: new Date().toISOString() } : p));
      toast.success('تم حفظ المقال بنجاح');
    } else {
      setPosts(prev => [...prev, { ...post, updatedAt: new Date().toISOString() }]);
      toast.success('تم إنشاء المقال بنجاح');
    }
    setIsEditing(false);
    setSelectedPost(null);
  };

  const deletePost = (postId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('تم حذف المقال');
    }
  };

  const publishPost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, status: 'published' as const, publishedAt: new Date().toISOString() }
        : p
    ));
    toast.success('تم نشر المقال');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saudi-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-almarai">جاري تحميل المقالات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* رأس الصفحة */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-almarai">
                  إدارة المدونة
                </h1>
                <p className="text-gray-600 font-almarai">
                  إنشاء وإدارة محتوى المدونة والمقالات
                </p>
              </div>
            </div>
            <button
              onClick={createNewPost}
              className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
            >
              <Plus className="h-4 w-4" />
              مقال جديد
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* أدوات التصفية */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                البحث
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث في المقالات..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              >
                <option value="all">جميع الحالات</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
                <option value="archived">مؤرشف</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                التصنيف
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              >
                <option value="all">جميع التصنيفات</option>
                <option value="دليل الأعمال">دليل الأعمال</option>
                <option value="تحليل السوق">تحليل السوق</option>
                <option value="أدوات ريادية">أدوات ريادية</option>
                <option value="قصص نجاح">قصص نجاح</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600 font-almarai">
                <span className="font-medium">{filteredPosts.length}</span> من أصل{' '}
                <span className="font-medium">{posts.length}</span> مقال
              </div>
            </div>
          </div>
        </div>

        {/* قائمة المقالات */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900 font-almarai">
                        {post.title}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                        {getStatusText(post.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 font-almarai mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-almarai">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString('ar-SA')
                          : 'غير منشور'
                        }
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readingTime} دقائق قراءة
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views} مشاهدة
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-almarai"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setIsEditing(false);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="معاينة"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="تحرير"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {post.status === 'draft' && (
                      <button
                        onClick={() => publishPost(post.id)}
                        className="p-2 text-gray-600 hover:text-saudi-green hover:bg-green-50 rounded-lg transition-colors"
                        title="نشر"
                      >
                        <Globe className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Edit className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-almarai mb-2">
              لا توجد مقالات مطابقة للبحث
            </h3>
            <p className="text-gray-600 font-almarai">
              جرب تغيير معايير البحث أو إنشاء مقال جديد
            </p>
          </div>
        )}
      </div>

      {/* محرر/معاينة المقال */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setSelectedPost(null);
              setIsEditing(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 font-almarai">
                  {isEditing ? 'تحرير المقال' : 'معاينة المقال'}
                </h2>
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <button
                      onClick={() => savePost(selectedPost)}
                      className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
                    >
                      <Save className="h-4 w-4" />
                      حفظ
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      setIsEditing(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {isEditing ? (
                  <BlogEditor 
                    post={selectedPost} 
                    onChange={setSelectedPost}
                  />
                ) : (
                  <BlogPreview post={selectedPost} />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// مكون محرر المقال
const BlogEditor: React.FC<{ post: BlogPost; onChange: (post: BlogPost) => void }> = ({ post, onChange }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
            عنوان المقال
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => onChange({ ...post, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
            placeholder="أدخل عنوان المقال..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
            الرابط (Slug)
          </label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => onChange({ ...post, slug: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
            placeholder="article-url-slug"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
          الملخص
        </label>
        <textarea
          value={post.excerpt}
          onChange={(e) => onChange({ ...post, excerpt: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai h-24 resize-none"
          placeholder="ملخص مختصر عن المقال..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
          المحتوى (Markdown)
        </label>
        <textarea
          value={post.content}
          onChange={(e) => onChange({ ...post, content: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai font-mono text-sm"
          style={{ height: '400px', resize: 'vertical' }}
          placeholder="اكتب محتوى المقال بصيغة Markdown..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
            التصنيف
          </label>
          <select
            value={post.category}
            onChange={(e) => onChange({ ...post, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
          >
            <option value="دليل الأعمال">دليل الأعمال</option>
            <option value="تحليل السوق">تحليل السوق</option>
            <option value="أدوات ريادية">أدوات ريادية</option>
            <option value="قصص نجاح">قصص نجاح</option>
            <option value="أخبار">أخبار</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
            الحالة
          </label>
          <select
            value={post.status}
            onChange={(e) => onChange({ ...post, status: e.target.value as BlogPost['status'] })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
          >
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
            وقت القراءة (دقائق)
          </label>
          <input
            type="number"
            value={post.readingTime}
            onChange={(e) => onChange({ ...post, readingTime: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
            min="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
          الوسوم (مفصولة بفاصلة)
        </label>
        <input
          type="text"
          value={post.tags.join(', ')}
          onChange={(e) => onChange({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
          placeholder="ريادة أعمال, استثمار, مشاريع"
        />
      </div>
    </div>
  );
};

// مكون معاينة المقال
const BlogPreview: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <div className="p-6">
      <article className="prose prose-lg max-w-none font-almarai" dir="rtl">
        <header className="mb-8 pb-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>بواسطة {post.author}</span>
            <span>•</span>
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ar-SA') : 'غير منشور'}</span>
            <span>•</span>
            <span>{post.readingTime} دقائق قراءة</span>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>
        
        <div className="whitespace-pre-line text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </article>
    </div>
  );
};

export default BlogManager;
