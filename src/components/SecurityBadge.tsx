import React from 'react';
import { Shield, Lock, CheckCircle, Award } from 'lucide-react';

const SecurityBadge: React.FC = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'تشفير SSL/TLS',
      description: 'جميع البيانات مشفرة أثناء النقل',
      verified: true
    },
    {
      icon: Lock,
      title: 'حماية الخصوصية',
      description: 'أعلى معايير حماية البيانات الشخصية',
      verified: true
    },
    {
      icon: Award,
      title: 'جودة الخدمة',
      description: 'معايير عالية في تقديم الخدمات',
      verified: true
    },
    {
      icon: CheckCircle,
      title: 'أمان المعلومات',
      description: 'حماية شاملة لجميع المعلومات',
      verified: true
    }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-saudi-green" />
        <h3 className="font-almarai font-bold text-gray-800">الأمان والحماية</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <feature.icon className="h-4 w-4 text-saudi-green" />
            <div>
              <div className="text-xs font-almarai font-bold text-gray-800">
                {feature.title}
              </div>
              <div className="text-xs font-almarai text-gray-600">
                {feature.description}
              </div>
            </div>
            {feature.verified && (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityBadge;