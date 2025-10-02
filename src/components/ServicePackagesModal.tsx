import React, { useState } from 'react';
import { X, Download, FileText, BarChart3, Presentation, Database, CheckCircle, Clock, DollarSign, Users, Target, Zap, Star, Award, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceDepartment, ServicePackage, ServiceRequest } from '../types/services';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface ServicePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: ServiceDepartment;
  onRequestService: (request: ServiceRequest) => void;
}

const ServicePackagesModal: React.FC<ServicePackagesModalProps> = ({
  isOpen,
  onClose,
  department,
  onRequestService
}) => {
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
  const [showInputForm, setShowInputForm] = useState(false);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const getPackageIcon = (level: string) => {
    switch (level) {
      case 'foundation': return Star;
      case 'standard': return Award;
      case 'certified': return Shield;
      default: return FileText;
    }
  };

  const getPackageColor = (level: string) => {
    switch (level) {
      case 'foundation': return 'from-green-500 to-emerald-600';
      case 'standard': return 'from-saudi-gold to-yellow-500';
      case 'certified': return 'from-purple-600 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getOutputIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'spreadsheet': return BarChart3;
      case 'presentation': return Presentation;
      case 'dashboard': return Database;
      case 'template': return FileText;
      default: return FileText;
    }
  };

  const handlePackageSelect = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    setShowInputForm(true);
    setInputs({});
  };

  const handleSubmitRequest = async () => {
    if (!selectedPackage || !user) return;

    try {
      setIsSubmitting(true);

      const request: ServiceRequest = {
        departmentId: department.id,
        packageId: selectedPackage.id,
        inputs,
        projectContext: {
          name: inputs.projectName || 'مشروع جديد',
          sector: inputs.sector || 'عام',
          location: inputs.location || 'الرياض',
          budget: inputs.budget || 100000,
          timeline: inputs.timeline || '6 أشهر'
        }
      };

      await onRequestService(request);
      
      toast.success('تم إرسال طلب الخدمة بنجاح');
      onClose();
      
    } catch (error) {
      console.error('Service request error:', error);
      toast.error('خطأ في إرسال طلب الخدمة');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* رأس النافذة */}
          <div className={`bg-gradient-to-r ${department.color} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="text-right">
                <h2 className="text-2xl font-almarai font-bold flex items-center gap-3">
                  <span className="text-3xl">{department.icon}</span>
                  {department.name}
                </h2>
                <p className="text-white/90 font-almarai mt-2">
                  {department.nameEn} - حزم خدمات متكاملة
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

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {!showInputForm ? (
              <>
                {/* الأركان الأساسية */}
                <div className="mb-8">
                  <h3 className="text-xl font-almarai font-bold text-gray-800 mb-4 text-right">
                    الأركان الأساسية
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {department.pillars.map((pillar, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-3 text-center"
                      >
                        <span className="font-almarai text-gray-700 text-sm">{pillar}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* حزم الخدمات */}
                <div className="mb-8">
                  <h3 className="text-xl font-almarai font-bold text-gray-800 mb-6 text-right">
                    حزم الخدمات المتاحة
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {department.packages.map((pkg, index) => {
                      const PackageIcon = getPackageIcon(pkg.level);
                      
                      return (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className={`bg-white border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                            pkg.level === 'standard' ? 'border-saudi-gold scale-105 relative' : 'border-gray-200'
                          }`}
                          onClick={() => handlePackageSelect(pkg)}
                        >
                          {pkg.level === 'standard' && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <div className="bg-saudi-gold text-white px-4 py-1 rounded-full font-almarai font-bold text-sm">
                                الأكثر طلباً ⭐
                              </div>
                            </div>
                          )}
                          
                          <div className="text-center mb-6">
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${getPackageColor(pkg.level)} flex items-center justify-center`}>
                              <PackageIcon className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-xl font-almarai font-bold text-gray-900 mb-2">
                              {pkg.name}
                            </h4>
                            <p className="text-gray-500 font-poppins text-sm">
                              {pkg.nameEn}
                            </p>
                          </div>

                          <div className="text-center mb-6">
                            <div className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                              {pkg.price.toLocaleString()} ريال
                            </div>
                            <div className="flex items-center justify-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span className="font-almarai text-sm">{pkg.duration}</span>
                            </div>
                          </div>

                          <div className="mb-6">
                            <h5 className="font-almarai font-bold text-gray-800 mb-3 text-right">
                              المخرجات:
                            </h5>
                            <ul className="space-y-2">
                              {pkg.deliverables.map((deliverable, delIndex) => (
                                <li key={delIndex} className="flex items-center gap-2 text-right">
                                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  <span className="font-almarai text-gray-700 text-sm flex-1">
                                    {deliverable}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-3 rounded-xl font-almarai font-bold transition-all text-white bg-gradient-to-r ${getPackageColor(pkg.level)} hover:shadow-lg`}
                          >
                            اختر هذه الحزمة
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* KPIs والحوكمة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-almarai font-bold text-gray-800 mb-4 text-right flex items-center gap-2">
                      <Target className="h-5 w-5 text-saudi-green" />
                      مؤشرات الأداء الرئيسية
                    </h4>
                    <div className="space-y-2">
                      {department.kpis.map((kpi, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-saudi-green" />
                          <span className="font-almarai text-gray-700 text-sm">{kpi}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-almarai font-bold text-gray-800 mb-4 text-right flex items-center gap-2">
                      <Users className="h-5 w-5 text-tech-blue" />
                      الحوكمة والمراجعة
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-tech-blue" />
                        <span className="font-almarai text-gray-700 text-sm">
                          {department.governance.frequency}
                        </span>
                      </div>
                      {department.governance.reviews.map((review, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-tech-blue" />
                          <span className="font-almarai text-gray-700 text-sm">{review}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* نموذج طلب الخدمة */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-almarai font-bold text-gray-800 mb-2">
                    طلب خدمة: {selectedPackage?.name}
                  </h3>
                  <p className="text-gray-600 font-almarai">
                    {selectedPackage?.description}
                  </p>
                </div>

                {/* نموذج المدخلات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      اسم المشروع *
                    </label>
                    <input
                      type="text"
                      value={inputs.projectName || ''}
                      onChange={(e) => setInputs({...inputs, projectName: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                      placeholder="اسم مشروعك"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      القطاع *
                    </label>
                    <select
                      value={inputs.sector || ''}
                      onChange={(e) => setInputs({...inputs, sector: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                    >
                      <option value="">اختر القطاع</option>
                      <option value="تجارة إلكترونية">تجارة إلكترونية</option>
                      <option value="مطاعم وأغذية">مطاعم وأغذية</option>
                      <option value="تقنية وبرمجة">تقنية وبرمجة</option>
                      <option value="خدمات مهنية">خدمات مهنية</option>
                      <option value="صحة ولياقة">صحة ولياقة</option>
                      <option value="تعليم وتدريب">تعليم وتدريب</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      الموقع *
                    </label>
                    <select
                      value={inputs.location || ''}
                      onChange={(e) => setInputs({...inputs, location: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                    >
                      <option value="">اختر المدينة</option>
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                      الميزانية المتوقعة
                    </label>
                    <input
                      type="number"
                      value={inputs.budget || ''}
                      onChange={(e) => setInputs({...inputs, budget: Number(e.target.value)})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                      placeholder="100000"
                    />
                  </div>
                </div>

                {/* مدخلات خاصة بالقسم */}
                {department.id === 'strategy' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                        الأهداف الاستراتيجية
                      </label>
                      <textarea
                        value={inputs.strategicGoals || ''}
                        onChange={(e) => setInputs({...inputs, strategicGoals: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                        rows={3}
                        placeholder="اذكر أهدافك الاستراتيجية..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                        المنافسون الرئيسيون
                      </label>
                      <textarea
                        value={inputs.competitors || ''}
                        onChange={(e) => setInputs({...inputs, competitors: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                        rows={3}
                        placeholder="اذكر منافسيك الرئيسيين..."
                      />
                    </div>
                  </div>
                )}

                {department.id === 'marketing' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                        الجمهور المستهدف
                      </label>
                      <textarea
                        value={inputs.targetAudience || ''}
                        onChange={(e) => setInputs({...inputs, targetAudience: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                        rows={3}
                        placeholder="وصف الجمهور المستهدف..."
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-almarai font-bold mb-2 text-right">
                        ميزانية التسويق الشهرية
                      </label>
                      <input
                        type="number"
                        value={inputs.marketingBudget || ''}
                        onChange={(e) => setInputs({...inputs, marketingBudget: Number(e.target.value)})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-almarai text-right focus:border-saudi-green focus:outline-none"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                )}

                {/* ملخص الحزمة المختارة */}
                {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-saudi-green/5 border border-saudi-green/20 rounded-xl p-6"
                  >
                    <h4 className="font-almarai font-bold text-saudi-green mb-4 text-right">
                      ملخص الحزمة المختارة
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <DollarSign className="h-6 w-6 text-saudi-green mx-auto mb-2" />
                        <div className="text-lg font-bold text-saudi-green">
                          {selectedPackage.price.toLocaleString()} ريال
                        </div>
                        <div className="text-sm font-almarai text-gray-600">السعر</div>
                      </div>
                      
                      <div className="text-center">
                        <Clock className="h-6 w-6 text-saudi-gold mx-auto mb-2" />
                        <div className="text-lg font-bold text-saudi-gold">
                          {selectedPackage.duration}
                        </div>
                        <div className="text-sm font-almarai text-gray-600">مدة التسليم</div>
                      </div>
                      
                      <div className="text-center">
                        <FileText className="h-6 w-6 text-tech-blue mx-auto mb-2" />
                        <div className="text-lg font-bold text-tech-blue">
                          {selectedPackage.outputs.length}
                        </div>
                        <div className="text-sm font-almarai text-gray-600">ملف تسليم</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-almarai font-bold text-gray-800 mb-3 text-right">
                        الملفات المُسلمة:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedPackage.outputs.map((output, index) => {
                          const OutputIcon = getOutputIcon(output.type);
                          return (
                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center gap-3">
                                <OutputIcon className="h-5 w-5 text-saudi-green" />
                                <div className="text-right flex-1">
                                  <div className="font-almarai font-bold text-gray-800 text-sm">
                                    {output.name}
                                  </div>
                                  <div className="font-almarai text-gray-600 text-xs">
                                    {output.format}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* أزرار الإجراءات */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowInputForm(false)}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-almarai font-bold hover:bg-gray-600 transition-colors"
                  >
                    العودة للحزم
                  </button>
                  
                  <button
                    onClick={handleSubmitRequest}
                    disabled={isSubmitting || !selectedPackage || !inputs.projectName}
                    className="bg-gradient-to-r from-saudi-green to-saudi-gold text-white px-8 py-3 rounded-xl font-almarai font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        طلب الخدمة الآن
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServicePackagesModal;