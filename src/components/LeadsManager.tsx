import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  FileText, 
  Star, 
  Clock,
  Filter,
  Search,
  Download,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Building,
  DollarSign,
  ArrowLeft,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  budget?: string;
  location: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  source: string;
  notes: string;
  createdAt: string;
  lastContact?: string;
  nextFollowUp?: string;
}

interface LeadsManagerProps {
  onClose: () => void;
}

const LeadsManager: React.FC<LeadsManagerProps> = ({ onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddLead, setShowAddLead] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // بيانات تجريبية
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'أحمد محمد السعيد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        company: 'شركة النور للتجارة',
        projectType: 'مطعم',
        budget: '200000-500000',
        location: 'الرياض - حي النرجس',
        status: 'new',
        priority: 'high',
        source: 'الموقع الإلكتروني',
        notes: 'مهتم بفتح مطعم في شمال الرياض، لديه خبرة في المجال',
        createdAt: '2024-01-15T10:30:00Z',
        nextFollowUp: '2024-01-20T14:00:00Z'
      },
      {
        id: '2',
        name: 'فاطمة علي الزهراني',
        email: 'fatima@example.com',
        phone: '+966502345678',
        projectType: 'صالون تجميل',
        budget: '100000-300000',
        location: 'جدة - حي الروضة',
        status: 'contacted',
        priority: 'medium',
        source: 'إعلانات جوجل',
        notes: 'تريد دراسة جدوى لصالون نسائي راقي',
        createdAt: '2024-01-14T09:15:00Z',
        lastContact: '2024-01-16T11:30:00Z',
        nextFollowUp: '2024-01-22T16:00:00Z'
      },
      {
        id: '3',
        name: 'خالد عبدالله المطيري',
        email: 'khalid@example.com',
        phone: '+966503456789',
        company: 'مجموعة المطيري',
        projectType: 'مركز تسوق صغير',
        budget: '1000000+',
        location: 'الدمام - الكورنيش',
        status: 'proposal',
        priority: 'high',
        source: 'إحالة من عميل',
        notes: 'مستثمر جاد، يريد تحليل مفصل للسوق والمنافسين',
        createdAt: '2024-01-10T14:20:00Z',
        lastContact: '2024-01-18T10:00:00Z',
        nextFollowUp: '2024-01-25T13:30:00Z'
      }
    ];
    
    setTimeout(() => {
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setIsLoading(false);
    }, 1000);
  }, []);

  // تصفية البيانات
  useEffect(() => {
    let filtered = leads;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(lead => lead.priority === filterPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLeads(filtered);
  }, [leads, filterStatus, filterPriority, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'proposal': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'won': return 'bg-green-100 text-green-800 border-green-200';
      case 'lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const exportLeads = () => {
    const csvContent = [
      'الاسم,البريد الإلكتروني,الهاتف,الشركة,نوع المشروع,الميزانية,الموقع,الحالة,الأولوية,المصدر,تاريخ الإنشاء',
      ...filteredLeads.map(lead => 
        `"${lead.name}","${lead.email}","${lead.phone}","${lead.company || ''}","${lead.projectType}","${lead.budget || ''}","${lead.location}","${lead.status}","${lead.priority}","${lead.source}","${new Date(lead.createdAt).toLocaleDateString('ar-SA')}"`
      )
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('تم تصدير بيانات العملاء المحتملين بنجاح');
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, lastContact: new Date().toISOString() } : lead
    ));
    toast.success('تم تحديث حالة العميل');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saudi-green mx-auto mb-4"></div>
          <p className="text-gray-600 font-almarai">جاري تحميل بيانات العملاء...</p>
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
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-almarai">
                  إدارة العملاء المحتملين
                </h1>
                <p className="text-gray-600 font-almarai">
                  متابعة وإدارة طلبات دراسات الجدوى
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportLeads}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-almarai"
              >
                <Download className="h-4 w-4" />
                تصدير CSV
              </button>
              <button
                onClick={() => setShowAddLead(true)}
                className="flex items-center gap-2 px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai"
              >
                <Users className="h-4 w-4" />
                عميل جديد
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* أدوات التصفية والبحث */}
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
                  placeholder="ابحث بالاسم أو البريد..."
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
                <option value="new">جديد</option>
                <option value="contacted">تم التواصل</option>
                <option value="qualified">مؤهل</option>
                <option value="proposal">عرض مقدم</option>
                <option value="won">تم الإنجاز</option>
                <option value="lost">ملغي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                الأولوية
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent font-almarai"
              >
                <option value="all">جميع الأولويات</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600 font-almarai">
                <span className="font-medium">{filteredLeads.length}</span> من أصل{' '}
                <span className="font-medium">{leads.length}</span> عميل
              </div>
            </div>
          </div>
        </div>

        {/* قائمة العملاء */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">العميل</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">المشروع</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">الميزانية</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">الحالة</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">الأولوية</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 font-almarai">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-saudi-green to-saudi-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 font-almarai">{lead.name}</div>
                          <div className="text-sm text-gray-600 font-almarai">{lead.email}</div>
                          <div className="text-sm text-gray-600 font-almarai">{lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 font-almarai">{lead.projectType}</div>
                      <div className="text-sm text-gray-600 font-almarai flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {lead.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 font-almarai">
                        {lead.budget ? `${lead.budget} ريال` : 'غير محدد'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)} font-almarai`}
                      >
                        <option value="new">جديد</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="qualified">مؤهل</option>
                        <option value="proposal">عرض مقدم</option>
                        <option value="won">تم الإنجاز</option>
                        <option value="lost">ملغي</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 ${getPriorityColor(lead.priority)}`}>
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium font-almarai">
                          {lead.priority === 'high' ? 'عالية' : lead.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-almarai">
                      {new Date(lead.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 text-gray-600 hover:text-saudi-green hover:bg-green-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="إرسال رسالة"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="اتصال هاتفي"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 font-almarai mb-2">
              لا توجد عملاء مطابقين للبحث
            </h3>
            <p className="text-gray-600 font-almarai">
              جرب تغيير معايير البحث أو إضافة عميل جديد
            </p>
          </div>
        )}
      </div>

      {/* نافذة تفاصيل العميل */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 font-almarai">
                    تفاصيل العميل
                  </h2>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-saudi-green to-saudi-gold rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 font-almarai">{selectedLead.name}</h3>
                    {selectedLead.company && (
                      <p className="text-gray-600 font-almarai">{selectedLead.company}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-almarai mb-1">
                        البريد الإلكتروني
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 font-almarai">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {selectedLead.email}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-almarai mb-1">
                        رقم الهاتف
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 font-almarai">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {selectedLead.phone}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-almarai mb-1">
                        الموقع
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 font-almarai">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {selectedLead.location}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-almarai mb-1">
                        نوع المشروع
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 font-almarai">
                        <Building className="h-4 w-4 text-gray-400" />
                        {selectedLead.projectType}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-almarai mb-1">
                        الميزانية المتوقعة
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 font-almarai">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        {selectedLead.budget ? `${selectedLead.budget} ريال` : 'غير محدد'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-almarai mb-1">
                        المصدر
                      </label>
                      <div className="flex items-center gap-2 text-gray-900 font-almarai">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        {selectedLead.source}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedLead.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-almarai mb-2">
                      ملاحظات
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-900 font-almarai">
                      {selectedLead.notes}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 font-almarai">
                    تم الإنشاء: {new Date(selectedLead.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-almarai">
                      إرسال عرض
                    </button>
                    <button className="px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition-colors font-almarai">
                      بدء دراسة الجدوى
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadsManager;
