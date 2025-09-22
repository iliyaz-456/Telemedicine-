'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Language types
export type Language = 'en' | 'hi' | 'pa';

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider props
interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'pa'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const translations = getTranslations(language);
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation data
function getTranslations(lang: Language): Record<string, string> {
  const translations = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.dashboard': 'Dashboard',
      'nav.medicalRecords': 'Medical Records',
      'nav.medicineTracker': 'Medicine Tracker',
      'nav.signup': 'Sign Up',
      'nav.login': 'Login',
      'nav.logout': 'Logout',
      
      // Homepage
      'home.hero.title': 'Healthcare at Your Doorstep',
      'home.hero.subtitle': 'Connecting rural Punjab with expert doctors through trusted ASHA workers',
      'home.hero.title.hi': 'आपके दरवाजे तक स्वास्थ्य सेवा',
      'home.hero.subtitle.hi': 'विश्वसनीय आशा कार्यकर्ताओं के माध्यम से विशेषज्ञ डॉक्टरों से जुड़ना',
      'home.hero.title.pa': 'ਤੁਹਾਡੇ ਘਰ ਤੱਕ ਸਿਹਤ ਸੇਵਾ',
      'home.hero.subtitle.pa': 'ਭਰੋਸੇਮੰਦ ਆਸ਼ਾ ਵਰਕਰਾਂ ਰਾਹੀਂ ਮਾਹਰ ਡਾਕਟਰਾਂ ਨਾਲ ਜੋੜਨਾ',
      
      // Call to Action
      'cta.missedCall': 'Missed Call Consultation',
      'cta.missedCall.number': '1800-XXX-XXXX',
      'cta.missedCall.desc': 'Give a missed call. We will call you back.',
      'cta.missedCall.button': 'Call Now for Help',
      'cta.videoCall': 'Video Consultation',
      'cta.videoCall.desc': 'Start a video consultation instantly with a doctor.',
      'cta.videoCall.button': 'Start Video Call',
      
      // Sections
      'section.howItWorks': 'How NabhaCare Works',
      'section.howItWorks.desc': 'Simple steps to get healthcare support in your village',
      'section.forDoctors': 'For Doctors',
      'section.forDoctors.title': 'Ready to Make a Difference?',
      'section.forDoctors.desc': 'Join hundreds of doctors who are already using NabhaCare to provide quality healthcare to rural communities. Flexible hours, competitive compensation, and the satisfaction of serving those who need it most.',
      'section.forDoctors.button': 'Join as a Doctor',
      'section.forDoctors.learnMore': 'Learn More',
      
      // ASHA Workers
      'asha.title': 'Empowering Our ASHA Heroes',
      'asha.subtitle': 'Tech-Enabled, Community-Driven Healthcare',
      'asha.desc': 'Join our mission to bring quality healthcare to every doorstep in rural Punjab. As an ASHA worker with NabhaCare, you\'ll be equipped with modern tools while maintaining the personal touch that makes you trusted in your community.',
      'asha.button': 'Join as an ASHA Worker',
      
      // Benefits
      'benefit.oneClick': 'One-Click Workflows',
      'benefit.oneClick.desc': 'Simple, intuitive tools that make your work easier',
      'benefit.fairIncentives': 'Fair Incentives',
      'benefit.fairIncentives.desc': 'Earn competitive compensation for your valuable work',
      'benefit.training': 'Continuous Training',
      'benefit.training.desc': 'Regular skill development and learning opportunities',
      'benefit.community': 'Trusted Community Link',
      'benefit.community.desc': 'Strengthen your role as a healthcare bridge in your community',
      
      // Chatbot
      'chatbot.title': 'Nabha Care',
      'chatbot.subtitle': 'Health Advisor',
      'chatbot.welcome': 'Welcome to Nabha Care!',
      'chatbot.welcome.desc': 'I\'m your health advisor. How can I help you today?',
      'chatbot.placeholder': 'Type your health concern in any language...',
      'chatbot.send': 'Send',
      
      // Footer
      'footer.desc': 'Bridging the healthcare gap in rural Punjab through technology, community trust, and accessible medical services. Every village deserves quality healthcare.',
      'footer.copyright': '© 2024 NabhaCare. Made with ❤️ for rural Punjab.',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.close': 'Close',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
    },
    
    hi: {
      // Navigation
      'nav.home': 'होम',
      'nav.dashboard': 'डैशबोर्ड',
      'nav.medicalRecords': 'चिकित्सा रिकॉर्ड',
      'nav.medicineTracker': 'दवा ट्रैकर',
      'nav.signup': 'साइन अप',
      'nav.login': 'लॉगिन',
      'nav.logout': 'लॉगआउट',
      
      // Homepage
      'home.hero.title': 'आपके दरवाजे तक स्वास्थ्य सेवा',
      'home.hero.subtitle': 'विश्वसनीय आशा कार्यकर्ताओं के माध्यम से विशेषज्ञ डॉक्टरों से जुड़ना',
      'home.hero.title.hi': 'आपके दरवाजे तक स्वास्थ्य सेवा',
      'home.hero.subtitle.hi': 'विश्वसनीय आशा कार्यकर्ताओं के माध्यम से विशेषज्ञ डॉक्टरों से जुड़ना',
      'home.hero.title.pa': 'ਤੁਹਾਡੇ ਘਰ ਤੱਕ ਸਿਹਤ ਸੇਵਾ',
      'home.hero.subtitle.pa': 'ਭਰੋਸੇਮੰਦ ਆਸ਼ਾ ਵਰਕਰਾਂ ਰਾਹੀਂ ਮਾਹਰ ਡਾਕਟਰਾਂ ਨਾਲ ਜੋੜਨਾ',
      
      // Call to Action
      'cta.missedCall': 'मिस्ड कॉल परामर्श',
      'cta.missedCall.number': '1800-XXX-XXXX',
      'cta.missedCall.desc': 'मिस्ड कॉल दें। हम आपको वापस कॉल करेंगे।',
      'cta.missedCall.button': 'अभी मदद के लिए कॉल करें',
      'cta.videoCall': 'वीडियो परामर्श',
      'cta.videoCall.desc': 'डॉक्टर के साथ तुरंत वीडियो परामर्श शुरू करें।',
      'cta.videoCall.button': 'वीडियो कॉल शुरू करें',
      
      // Sections
      'section.howItWorks': 'नाभा केयर कैसे काम करता है',
      'section.howItWorks.desc': 'अपने गाँव में स्वास्थ्य सेवा सहायता पाने के लिए सरल कदम',
      'section.forDoctors': 'डॉक्टरों के लिए',
      'section.forDoctors.title': 'अंतर लाने के लिए तैयार हैं?',
      'section.forDoctors.desc': 'सैकड़ों डॉक्टरों में शामिल हों जो पहले से ही नाभा केयर का उपयोग करके ग्रामीण समुदायों को गुणवत्तापूर्ण स्वास्थ्य सेवा प्रदान कर रहे हैं। लचीले घंटे, प्रतिस्पर्धी मुआवजा, और उन लोगों की सेवा करने की संतुष्टि जिन्हें इसकी सबसे अधिक आवश्यकता है।',
      'section.forDoctors.button': 'डॉक्टर के रूप में शामिल हों',
      'section.forDoctors.learnMore': 'और जानें',
      
      // ASHA Workers
      'asha.title': 'हमारे आशा नायकों को सशक्त बनाना',
      'asha.subtitle': 'तकनीक-सक्षम, समुदाय-संचालित स्वास्थ्य सेवा',
      'asha.desc': 'ग्रामीण पंजाब के हर दरवाजे तक गुणवत्तापूर्ण स्वास्थ्य सेवा लाने के हमारे मिशन में शामिल हों। नाभा केयर के साथ एक आशा कार्यकर्ता के रूप में, आप आधुनिक उपकरणों से लैस होंगे जबकि व्यक्तिगत स्पर्श बनाए रखेंगे जो आपको अपने समुदाय में विश्वसनीय बनाता है।',
      'asha.button': 'आशा कार्यकर्ता के रूप में शामिल हों',
      
      // Benefits
      'benefit.oneClick': 'वन-क्लिक वर्कफ्लो',
      'benefit.oneClick.desc': 'सरल, सहज उपकरण जो आपके काम को आसान बनाते हैं',
      'benefit.fairIncentives': 'निष्पक्ष प्रोत्साहन',
      'benefit.fairIncentives.desc': 'अपने मूल्यवान काम के लिए प्रतिस्पर्धी मुआवजा कमाएं',
      'benefit.training': 'निरंतर प्रशिक्षण',
      'benefit.training.desc': 'नियमित कौशल विकास और सीखने के अवसर',
      'benefit.community': 'विश्वसनीय समुदाय लिंक',
      'benefit.community.desc': 'अपने समुदाय में स्वास्थ्य सेवा पुल के रूप में अपनी भूमिका को मजबूत करें',
      
      // Chatbot
      'chatbot.title': 'नाभा केयर',
      'chatbot.subtitle': 'स्वास्थ्य सलाहकार',
      'chatbot.welcome': 'नाभा केयर में आपका स्वागत है!',
      'chatbot.welcome.desc': 'मैं आपका स्वास्थ्य सलाहकार हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
      'chatbot.placeholder': 'किसी भी भाषा में अपनी स्वास्थ्य चिंता टाइप करें...',
      'chatbot.send': 'भेजें',
      
      // Footer
      'footer.desc': 'तकनीक, समुदाय विश्वास और सुलभ चिकित्सा सेवाओं के माध्यम से ग्रामीण पंजाब में स्वास्थ्य सेवा की खाई को पाटना। हर गाँव गुणवत्तापूर्ण स्वास्थ्य सेवा का हकदार है।',
      'footer.copyright': '© 2024 नाभा केयर। ग्रामीण पंजाब के लिए ❤️ के साथ बनाया गया।',
      
      // Common
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.cancel': 'रद्द करें',
      'common.save': 'सहेजें',
      'common.edit': 'संपादित करें',
      'common.delete': 'हटाएं',
      'common.close': 'बंद करें',
      'common.back': 'वापस',
      'common.next': 'अगला',
      'common.previous': 'पिछला',
    },
    
    pa: {
      // Navigation
      'nav.home': 'ਘਰ',
      'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
      'nav.medicalRecords': 'ਮੈਡੀਕਲ ਰਿਕਾਰਡ',
      'nav.medicineTracker': 'ਦਵਾਈ ਟ੍ਰੈਕਰ',
      'nav.signup': 'ਸਾਈਨ ਅੱਪ',
      'nav.login': 'ਲੌਗਇਨ',
      'nav.logout': 'ਲੌਗਆਉਟ',
      
      // Homepage
      'home.hero.title': 'ਤੁਹਾਡੇ ਘਰ ਤੱਕ ਸਿਹਤ ਸੇਵਾ',
      'home.hero.subtitle': 'ਭਰੋਸੇਮੰਦ ਆਸ਼ਾ ਵਰਕਰਾਂ ਰਾਹੀਂ ਮਾਹਰ ਡਾਕਟਰਾਂ ਨਾਲ ਜੋੜਨਾ',
      'home.hero.title.hi': 'आपके दरवाजे तक स्वास्थ्य सेवा',
      'home.hero.subtitle.hi': 'विश्वसनीय आशा कार्यकर्ताओं के माध्यम से विशेषज्ञ डॉक्टरों से जुड़ना',
      'home.hero.title.pa': 'ਤੁਹਾਡੇ ਘਰ ਤੱਕ ਸਿਹਤ ਸੇਵਾ',
      'home.hero.subtitle.pa': 'ਭਰੋਸੇਮੰਦ ਆਸ਼ਾ ਵਰਕਰਾਂ ਰਾਹੀਂ ਮਾਹਰ ਡਾਕਟਰਾਂ ਨਾਲ ਜੋੜਨਾ',
      
      // Call to Action
      'cta.missedCall': 'ਮਿਸ ਕਾਲ ਸਲਾਹ',
      'cta.missedCall.number': '1800-XXX-XXXX',
      'cta.missedCall.desc': 'ਮਿਸ ਕਾਲ ਦਿਓ। ਅਸੀਂ ਤੁਹਾਨੂੰ ਵਾਪਸ ਕਾਲ ਕਰਾਂਗੇ।',
      'cta.missedCall.button': 'ਮਦਦ ਲਈ ਹੁਣੇ ਕਾਲ ਕਰੋ',
      'cta.videoCall': 'ਵੀਡੀਓ ਸਲਾਹ',
      'cta.videoCall.desc': 'ਡਾਕਟਰ ਨਾਲ ਤੁਰੰਤ ਵੀਡੀਓ ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ।',
      'cta.videoCall.button': 'ਵੀਡੀਓ ਕਾਲ ਸ਼ੁਰੂ ਕਰੋ',
      
      // Sections
      'section.howItWorks': 'ਨਾਭਾ ਕੇਅਰ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
      'section.howItWorks.desc': 'ਆਪਣੇ ਪਿੰਡ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਸਧਾਰਨ ਕਦਮ',
      'section.forDoctors': 'ਡਾਕਟਰਾਂ ਲਈ',
      'section.forDoctors.title': 'ਫਰਕ ਲਿਆਉਣ ਲਈ ਤਿਆਰ ਹੋ?',
      'section.forDoctors.desc': 'ਸੈਕੜੇ ਡਾਕਟਰਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ ਜੋ ਪਹਿਲਾਂ ਤੋਂ ਹੀ ਨਾਭਾ ਕੇਅਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪੇਂਡੂ ਭਾਈਚਾਰਿਆਂ ਨੂੰ ਗੁਣਵੱਤਾਪੂਰਨ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਨ ਕਰ ਰਹੇ ਹਨ। ਲਚਕਦਾਰ ਘੰਟੇ, ਮੁਕਾਬਲੇਬਾਜ਼ ਮੁਆਵਜ਼ਾ, ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੇਵਾ ਕਰਨ ਦੀ ਸੰਤੁਸ਼ਟੀ ਜਿਨ੍ਹਾਂ ਨੂੰ ਇਸਦੀ ਸਭ ਤੋਂ ਵੱਧ ਲੋੜ ਹੈ।',
      'section.forDoctors.button': 'ਡਾਕਟਰ ਵਜੋਂ ਸ਼ਾਮਲ ਹੋਵੋ',
      'section.forDoctors.learnMore': 'ਹੋਰ ਜਾਣੋ',
      
      // ASHA Workers
      'asha.title': 'ਸਾਡੇ ਆਸ਼ਾ ਹੀਰੋਜ਼ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ',
      'asha.subtitle': 'ਟੈਕ-ਸਮਰੱਥ, ਭਾਈਚਾਰਕ-ਸੰਚਾਲਿਤ ਸਿਹਤ ਸੇਵਾ',
      'asha.desc': 'ਪੇਂਡੂ ਪੰਜਾਬ ਦੇ ਹਰ ਦਰਵਾਜ਼ੇ ਤੱਕ ਗੁਣਵੱਤਾਪੂਰਨ ਸਿਹਤ ਸੇਵਾ ਲਿਆਉਣ ਦੇ ਸਾਡੇ ਮਿਸ਼ਨ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ। ਨਾਭਾ ਕੇਅਰ ਦੇ ਨਾਲ ਇੱਕ ਆਸ਼ਾ ਵਰਕਰ ਵਜੋਂ, ਤੁਸੀਂ ਆਧੁਨਿਕ ਉਪਕਰਣਾਂ ਨਾਲ ਲੈਸ ਹੋਵੋਗੇ ਜਦੋਂ ਕਿ ਵਿਅਕਤੀਗਤ ਸਪਰਸ਼ ਬਣਾਈ ਰੱਖੋਗੇ ਜੋ ਤੁਹਾਨੂੰ ਆਪਣੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਭਰੋਸੇਮੰਦ ਬਣਾਉਂਦਾ ਹੈ।',
      'asha.button': 'ਆਸ਼ਾ ਵਰਕਰ ਵਜੋਂ ਸ਼ਾਮਲ ਹੋਵੋ',
      
      // Benefits
      'benefit.oneClick': 'ਵਨ-ਕਲਿਕ ਵਰਕਫਲੋ',
      'benefit.oneClick.desc': 'ਸਧਾਰਨ, ਸਹਜ ਉਪਕਰਣ ਜੋ ਤੁਹਾਡੇ ਕੰਮ ਨੂੰ ਆਸਾਨ ਬਣਾਉਂਦੇ ਹਨ',
      'benefit.fairIncentives': 'ਨਿਰਪੱਖ ਪ੍ਰੋਤਸਾਹਨ',
      'benefit.fairIncentives.desc': 'ਆਪਣੇ ਮੁੱਲਵਾਨ ਕੰਮ ਲਈ ਮੁਕਾਬਲੇਬਾਜ਼ ਮੁਆਵਜ਼ਾ ਕਮਾਓ',
      'benefit.training': 'ਨਿਰੰਤਰ ਸਿਖਲਾਈ',
      'benefit.training.desc': 'ਨਿਯਮਿਤ ਹੁਨਰ ਵਿਕਾਸ ਅਤੇ ਸਿੱਖਣ ਦੇ ਮੌਕੇ',
      'benefit.community': 'ਭਰੋਸੇਮੰਦ ਭਾਈਚਾਰਕ ਲਿੰਕ',
      'benefit.community.desc': 'ਆਪਣੇ ਭਾਈਚਾਰੇ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਪੁਲ ਦੇ ਰੂਪ ਵਿੱਚ ਆਪਣੀ ਭੂਮਿਕਾ ਨੂੰ ਮਜ਼ਬੂਤ ਬਣਾਓ',
      
      // Chatbot
      'chatbot.title': 'ਨਾਭਾ ਕੇਅਰ',
      'chatbot.subtitle': 'ਸਿਹਤ ਸਲਾਹਕਾਰ',
      'chatbot.welcome': 'ਨਾਭਾ ਕੇਅਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ!',
      'chatbot.welcome.desc': 'ਮੈਂ ਤੁਹਾਡਾ ਸਿਹਤ ਸਲਾਹਕਾਰ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      'chatbot.placeholder': 'ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਆਪਣੀ ਸਿਹਤ ਚਿੰਤਾ ਟਾਈਪ ਕਰੋ...',
      'chatbot.send': 'ਭੇਜੋ',
      
      // Footer
      'footer.desc': 'ਟੈਕਨਾਲੋਜੀ, ਭਾਈਚਾਰਕ ਵਿਸ਼ਵਾਸ ਅਤੇ ਪਹੁੰਚਯੋਗ ਡਾਕਟਰੀ ਸੇਵਾਵਾਂ ਦੇ ਮਾਧਿਅਮ ਨਾਲ ਪੇਂਡੂ ਪੰਜਾਬ ਵਿੱਚ ਸਿਹਤ ਸੇਵਾ ਦੇ ਗੈਪ ਨੂੰ ਪਾਟਣਾ। ਹਰ ਪਿੰਡ ਗੁਣਵੱਤਾਪੂਰਨ ਸਿਹਤ ਸੇਵਾ ਦਾ ਹੱਕਦਾਰ ਹੈ।',
      'footer.copyright': '© 2024 ਨਾਭਾ ਕੇਅਰ। ਪੇਂਡੂ ਪੰਜਾਬ ਲਈ ❤️ ਨਾਲ ਬਣਾਇਆ ਗਿਆ।',
      
      // Common
      'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      'common.error': 'ਗਲਤੀ',
      'common.success': 'ਸਫਲਤਾ',
      'common.cancel': 'ਰੱਦ ਕਰੋ',
      'common.save': 'ਸੇਵ ਕਰੋ',
      'common.edit': 'ਸੰਪਾਦਿਤ ਕਰੋ',
      'common.delete': 'ਹਟਾਓ',
      'common.close': 'ਬੰਦ ਕਰੋ',
      'common.back': 'ਵਾਪਸ',
      'common.next': 'ਅਗਲਾ',
      'common.previous': 'ਪਿਛਲਾ',
    }
  };

  return translations[lang] || translations.en;
}
