import React from 'react';
import { X, Shield, Eye, Database, Lock, CheckCircle } from 'lucide-react';

interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataPrivacyModal: React.FC<DataPrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const privacyPrinciples = [
    {
      icon: Shield,
      title: 'الحد الأدنى من البيانات',
      description: 'نجمع فقط البيانات الضرورية لتقديم الخدمة',
      color: 'text-saudi-green'
    },
    {
      icon: Eye,
      title: 'الشفافية الكاملة',
      description: 'نوضح بالتفصيل كيف نستخدم بياناتك',
      color: 'text-saudi-gold'
    },
    {
      icon: Database,
      title: 'التخزين المحلي',
      description: 'جميع البيانات محفوظة في خوادم سعودية آمنة',
      color: 'text-tech-blue'
    },
    {
      icon: Lock,
      title: 'التشفير المتقدم',
      description: 'تشفير من الطرف إلى الطرف لجميع البيانات الحساسة',
      color: 'text-green-600'
    }
  ];

  const dataTypes = [
    { type: 'البيانات الشخصية', usage: 'إنشاء الحساب والتواصل', retention: '5 سنوات' },
    { type: 'بيانات المشاريع', usage: 'تحليل وإنتاج دراسات الجدوى', retention: 'دائم (مع إمكانية الحذف)' },
    { type: 'التسجيلات الصوتية', usage: 'تحسين دقة التحليل', retention: '30 يوم' },
    { type: 'بيانات الاستخدام', usage: 'تحسين الخدمة', retention: '2 سنة' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-saudi-green to-tech-blue p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-almarai font-bold">سياسة الخصوصية وحماية البيانات</h2>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-white/90 font-almarai mt-2">
            ملتزمون بحماية خصوصيتك وفقاً لقانون حماية البيانات الشخصية (PDPL)
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* مبادئ الخصوصية */}
          <div className="mb-8">
            <h3 className="text-xl font-almarai font-bold text-gray-800 mb-6 text-right">
              مبادئ حماية البيانات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {privacyPrinciples.map((principle, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <principle.icon className={`h-6 w-6 ${principle.color}`} />
                    <h4 className="font-almarai font-bold text-gray-800">
                      {principle.title}
                    </h4>
                  </div>
                  <p className="text-gray-600 font-almarai text-sm text-right">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* أنواع البيانات */}
          <div className="mb-8">
            <h3 className="text-xl font-almarai font-bold text-gray-800 mb-6 text-right">
              أنواع البيانات المجمعة
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-right font-almarai font-bold text-gray-800 border-b">
                      فترة الاحتفاظ
                    </th>
                    <th className="p-4 text-right font-almarai font-bold text-gray-800 border-b">
                      الغرض من الاستخدام
                    </th>
                    <th className="p-4 text-right font-almarai font-bold text-gray-800 border-b">
                      نوع البيانات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataTypes.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 text-right font-almarai text-gray-600 border-b">
                        {data.retention}
                      </td>
                      <td className="p-4 text-right font-almarai text-gray-600 border-b">
                        {data.usage}
                      </td>
                      <td className="p-4 text-right font-almarai font-bold text-gray-800 border-b">
                        {data.type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* حقوق المستخدم */}
          <div className="mb-8">
            <h3 className="text-xl font-almarai font-bold text-gray-800 mb-6 text-right">
              حقوقك في البيانات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'الحق في الوصول لبياناتك',
                'الحق في تصحيح البيانات',
                'الحق في حذف البيانات',
                'الحق في نقل البيانات',
                'الحق في الاعتراض على المعالجة',
                'الحق في تقييد المعالجة'
              ].map((right, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-saudi-green" />
                  <span className="font-almarai text-gray-700">{right}</span>
                </div>
              ))}
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="bg-saudi-green/5 rounded-xl p-6">
            <h3 className="text-lg font-almarai font-bold text-saudi-green mb-4 text-right">
              للاستفسارات حول الخصوصية
            </h3>
            <div className="space-y-2 text-right">
              <p className="font-almarai text-gray-700">
                📧 البريد الإلكتروني: privacy@smartstart.sa
              </p>
              <p className="font-almarai text-gray-700">
                📞 الهاتف: 920012345
              </p>
              <p className="font-almarai text-gray-700">
                📍 العنوان: الرياض، المملكة العربية السعودية
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="bg-saudi-green text-white px-6 py-3 rounded-xl font-almarai font-bold hover:bg-saudi-green/90 transition-colors"
            >
              فهمت وأوافق
            </button>
            <p className="text-gray-500 font-almarai text-sm">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyModal;