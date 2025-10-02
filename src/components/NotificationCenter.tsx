import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Star, Calendar, Eye, Trash2, Settings, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const { user } = useAuth();

  // تحميل الإشعارات عند فتح المركز
  useEffect(() => {
    if (isOpen && user) {
      loadNotifications();
    }
  }, [isOpen, user]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل الإشعارات من الخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'تم إكمال دراسة الجدوى',
          message: 'دراسة جدوى مشروع "تطبيق توصيل الطعام" جاهزة للتحميل مع نموذج مالي تفاعلي',
          time: 'منذ 5 دقائق',
          read: false,
          priority: 'high',
          action: {
            label: 'تحميل التقرير',
            onClick: () => {
              toast.success('جاري تحميل التقرير...');
              markAsRead('1');
            }
          }
        },
        {
          id: '2',
          type: 'achievement',
          title: 'إنجاز جديد! 🏆',
          message: 'حصلت على شارة "محلل خبير" لإكمال 10 مشاريع بنجاح. تهانينا!',
          time: 'منذ ساعة',
          read: false,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'system',
          title: 'تحديث في النظام',
          message: 'تم إضافة مميزات جديدة للمحادثة الصوتية وتحسين دقة التحليل بنسبة 15%',
          time: 'منذ 3 ساعات',
          read: true,
          priority: 'low'
        },
        {
          id: '4',
          type: 'warning',
          title: 'انتباه: اشتراكك ينتهي قريباً',
          message: 'باقة "النمو" تنتهي خلال 7 أيام. جدد الآن للاستمرار في الاستفادة من جميع المميزات المتقدمة',
          time: 'منذ يوم',
          read: true,
          priority: 'high',
          action: {
            label: 'تجديد الاشتراك',
            onClick: () => {
              window.location.href = '#pricing';
              markAsRead('4');
            }
          }
        },
        {
          id: '5',
          type: 'info',
          title: 'نصيحة: تحسين دراسة الجدوى',
          message: 'أضف المزيد من التفاصيل حول المنافسين والسوق المستهدف لتحسين دقة التحليل',
          time: 'منذ يومين',
          read: false,
          priority: 'medium'
        },
        {
          id: '6',
          type: 'success',
          title: 'تم إنشاء كود التطبيق',
          message: 'كود React Native لتطبيق "متجر إلكتروني" جاهز مع جميع الميزات المطلوبة',
          time: 'منذ 3 أيام',
          read: true,
          priority: 'medium',
          action: {
            label: 'عرض الكود',
            onClick: () => {
              if (typeof window !== 'undefined') {
                window.location.hash = 'results';
              }
              markAsRead('6');
            }
          }
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('خطأ في تحميل الإشعارات');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast.success('تم وضع علامة قراءة على جميع الإشعارات');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    setSelectedNotifications(prev => prev.filter(selectedId => selectedId !== id));
    toast.success('تم حذف الإشعار');
  };

  const deleteAllRead = () => {
    const readCount = notifications.filter(n => n.read).length;
    if (readCount === 0) {
      toast.info('لا توجد إشعارات مقروءة للحذف');
      return;
    }

    setNotifications(prev => prev.filter(notif => !notif.read));
    toast.success(`تم حذف ${readCount} إشعار مقروء`);
  };

  const handleBulkDelete = () => {
    if (selectedNotifications.length === 0) {
      toast.error('يرجى اختيار إشعارات للحذف');
      return;
    }

    setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
    toast.success(`تم حذف ${selectedNotifications.length} إشعار`);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'achievement':
        return <Star className="h-6 w-6 text-saudi-gold" />;
      case 'system':
        return <Settings className="h-6 w-6 text-blue-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-r-4 border-red-500';
      case 'medium':
        return 'border-r-4 border-yellow-500';
      default:
        return 'border-r-4 border-gray-300';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = (() => {
      switch (filter) {
        case 'unread':
          return !notification.read;
        case 'important':
          return notification.priority === 'high';
        default:
          return true;
      }
    })();

    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const importantCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[80vh] overflow-hidden"
        >
          {/* رأس مركز الإشعارات */}
          <div className="bg-gradient-to-r from-saudi-green to-saudi-gold p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h2 className="text-xl font-almarai font-bold">مركز الإشعارات</h2>
                <p className="text-white/90 font-almarai text-sm">
                  {unreadCount} إشعار جديد
                  {importantCount > 0 && ` • ${importantCount} مهم`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* أدوات التحكم والفلترة */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            {/* البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث في الإشعارات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg font-almarai text-right text-sm focus:border-saudi-green focus:outline-none"
              />
            </div>

            {/* فلاتر */}
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'الكل', count: notifications.length },
                { id: 'unread', label: 'غير مقروء', count: unreadCount },
                { id: 'important', label: 'مهم', count: importantCount }
              ].map(filterOption => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-3 py-1 rounded-full text-sm font-almarai transition-colors ${
                    filter === filterOption.id
                      ? 'bg-saudi-green text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label} ({filterOption.count})
                </button>
              ))}
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-saudi-green font-almarai font-bold hover:text-saudi-gold transition-colors flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="h-4 w-4" />
                  قراءة الكل
                </button>
                
                <button
                  onClick={deleteAllRead}
                  className="text-red-600 font-almarai font-bold hover:text-red-700 transition-colors flex items-center gap-1 text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف المقروء
                </button>
              </div>
              
              <span className="text-gray-500 font-almarai text-sm">
                {filteredNotifications.length} إشعار
              </span>
            </div>

            {/* إجراءات مجمعة */}
            <AnimatePresence>
              {selectedNotifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-saudi-green/5 rounded-lg p-3 border border-saudi-green/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-almarai text-saudi-green font-bold text-sm">
                      {selectedNotifications.length} محدد
                    </span>
                    <button
                      onClick={handleBulkDelete}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg font-almarai text-xs hover:bg-red-600 transition-colors"
                    >
                      حذف المحدد
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* قائمة الإشعارات */}
          <div className="overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-saudi-green border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="font-almarai text-gray-600">جاري تحميل الإشعارات...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-saudi-green/5' : ''
                      } ${getPriorityColor(notification.priority)}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (e.target.checked) {
                              setSelectedNotifications(prev => [...prev, notification.id]);
                            } else {
                              setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                            }
                          }}
                          className="w-4 h-4 text-saudi-green border-gray-300 rounded focus:ring-saudi-green mt-1"
                        />
                        
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 text-right">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                              
                              {notification.priority === 'high' && (
                                <motion.div 
                                  className="w-2 h-2 bg-red-500 rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                            </div>
                            
                            <h3 className={`font-almarai font-bold ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-600 font-almarai text-sm mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {notification.action && (
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.action!.onClick();
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-saudi-green text-white px-3 py-1 rounded-lg font-almarai text-xs hover:bg-saudi-green/90 transition-colors"
                              >
                                {notification.action.label}
                              </motion.button>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 font-almarai text-xs">
                                {notification.time}
                              </span>
                              {!notification.read && (
                                <motion.div 
                                  className="w-2 h-2 bg-saudi-green rounded-full"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-almarai font-bold text-gray-800 mb-2">
                  {searchTerm ? 'لا توجد نتائج' :
                   filter === 'unread' ? 'لا توجد إشعارات غير مقروءة' :
                   filter === 'important' ? 'لا توجد إشعارات مهمة' :
                   'لا توجد إشعارات'}
                </h3>
                <p className="text-gray-600 font-almarai">
                  {searchTerm ? 'جرب كلمات بحث أخرى' :
                   filter === 'all' ? 'ستظهر إشعاراتك هنا عند توفرها' : 'جرب فلتر آخر'}
                </p>
              </motion.div>
            )}
          </div>

          {/* تذييل مركز الإشعارات */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  onClose();
                  window.location.href = '#profile';
                }}
                className="text-gray-600 font-almarai hover:text-saudi-green transition-colors flex items-center gap-2 text-sm"
              >
                <Settings className="h-4 w-4" />
                إعدادات الإشعارات
              </button>
              
              <button 
                onClick={() => {
                  onClose();
                }}
                className="text-saudi-green font-almarai font-bold hover:text-saudi-gold transition-colors flex items-center gap-2 text-sm"
              >
                <Calendar className="h-4 w-4" />
                عرض الكل
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationCenter;