/**
 * Mock data for Sehat Shakti chatbot
 * Contains doctor information and ASHA worker contacts
 */

export const mockDoctors = {
  english: {
    general: [
      {
        name: "Dr. Priya Sharma",
        specialization: "General Physician",
        experience: "12 years",
        phone: "+91-98765-43210",
        availability: "Mon-Fri: 9 AM - 6 PM",
        location: "Nabha Medical Center"
      },
      {
        name: "Dr. Rajesh Kumar",
        specialization: "General Physician", 
        experience: "8 years",
        phone: "+91-98765-43211",
        availability: "Mon-Sat: 8 AM - 5 PM",
        location: "Nabha Health Clinic"
      }
    ],
    cardiologist: [
      {
        name: "Dr. Meena Singh",
        specialization: "Cardiologist",
        experience: "15 years",
        phone: "+91-98765-43212",
        availability: "Mon-Fri: 10 AM - 4 PM",
        location: "Nabha Heart Center"
      }
    ],
    dermatologist: [
      {
        name: "Dr. Sunita Verma",
        specialization: "Dermatologist",
        experience: "10 years",
        phone: "+91-98765-43213",
        availability: "Tue-Sat: 9 AM - 5 PM",
        location: "Nabha Skin Care Clinic"
      }
    ],
    pediatrician: [
      {
        name: "Dr. Anil Gupta",
        specialization: "Pediatrician",
        experience: "14 years",
        phone: "+91-98765-43214",
        availability: "Mon-Fri: 8 AM - 6 PM",
        location: "Nabha Children's Hospital"
      }
    ],
    orthopedist: [
      {
        name: "Dr. Vikram Singh",
        specialization: "Orthopedist",
        experience: "16 years",
        phone: "+91-98765-43215",
        availability: "Mon-Sat: 9 AM - 5 PM",
        location: "Nabha Bone & Joint Center"
      }
    ]
  },
  hindi: {
    general: [
      {
        name: "डॉ. प्रिया शर्मा",
        specialization: "सामान्य चिकित्सक",
        experience: "12 वर्ष",
        phone: "+91-98765-43210",
        availability: "सोम-शुक्र: सुबह 9 - शाम 6",
        location: "नाभा मेडिकल सेंटर"
      },
      {
        name: "डॉ. राजेश कुमार",
        specialization: "सामान्य चिकित्सक",
        experience: "8 वर्ष",
        phone: "+91-98765-43211",
        availability: "सोम-शनि: सुबह 8 - शाम 5",
        location: "नाभा हेल्थ क्लिनिक"
      }
    ],
    cardiologist: [
      {
        name: "डॉ. मीना सिंह",
        specialization: "हृदय रोग विशेषज्ञ",
        experience: "15 वर्ष",
        phone: "+91-98765-43212",
        availability: "सोम-शुक्र: सुबह 10 - शाम 4",
        location: "नाभा हार्ट सेंटर"
      }
    ],
    dermatologist: [
      {
        name: "डॉ. सुनीता वर्मा",
        specialization: "त्वचा रोग विशेषज्ञ",
        experience: "10 वर्ष",
        phone: "+91-98765-43213",
        availability: "मंगल-शनि: सुबह 9 - शाम 5",
        location: "नाभा स्किन केयर क्लिनिक"
      }
    ],
    pediatrician: [
      {
        name: "डॉ. अनिल गुप्ता",
        specialization: "बाल रोग विशेषज्ञ",
        experience: "14 वर्ष",
        phone: "+91-98765-43214",
        availability: "सोम-शुक्र: सुबह 8 - शाम 6",
        location: "नाभा चिल्ड्रन हॉस्पिटल"
      }
    ],
    orthopedist: [
      {
        name: "डॉ. विक्रम सिंह",
        specialization: "हड्डी रोग विशेषज्ञ",
        experience: "16 वर्ष",
        phone: "+91-98765-43215",
        availability: "सोम-शनि: सुबह 9 - शाम 5",
        location: "नाभा बोन एंड जॉइंट सेंटर"
      }
    ]
  },
  punjabi: {
    general: [
      {
        name: "ਡਾ. ਪ੍ਰਿਯਾ ਸ਼ਰਮਾ",
        specialization: "ਆਮ ਡਾਕਟਰ",
        experience: "12 ਸਾਲ",
        phone: "+91-98765-43210",
        availability: "ਸੋਮ-ਸ਼ੁਕਰ: ਸਵੇਰੇ 9 - ਸ਼ਾਮ 6",
        location: "ਨਾਭਾ ਮੈਡੀਕਲ ਸੈਂਟਰ"
      },
      {
        name: "ਡਾ. ਰਾਜੇਸ਼ ਕੁਮਾਰ",
        specialization: "ਆਮ ਡਾਕਟਰ",
        experience: "8 ਸਾਲ",
        phone: "+91-98765-43211",
        availability: "ਸੋਮ-ਸ਼ਨਿੱਚਰ: ਸਵੇਰੇ 8 - ਸ਼ਾਮ 5",
        location: "ਨਾਭਾ ਹੈਲਥ ਕਲੀਨਿਕ"
      }
    ],
    cardiologist: [
      {
        name: "ਡਾ. ਮੀਨਾ ਸਿੰਘ",
        specialization: "ਦਿਲ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ",
        experience: "15 ਸਾਲ",
        phone: "+91-98765-43212",
        availability: "ਸੋਮ-ਸ਼ੁਕਰ: ਸਵੇਰੇ 10 - ਸ਼ਾਮ 4",
        location: "ਨਾਭਾ ਹਾਰਟ ਸੈਂਟਰ"
      }
    ],
    dermatologist: [
      {
        name: "ਡਾ. ਸੁਨੀਤਾ ਵਰਮਾ",
        specialization: "ਚਮੜੀ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ",
        experience: "10 ਸਾਲ",
        phone: "+91-98765-43213",
        availability: "ਮੰਗਲ-ਸ਼ਨਿੱਚਰ: ਸਵੇਰੇ 9 - ਸ਼ਾਮ 5",
        location: "ਨਾਭਾ ਸਕਿਨ ਕੇਅਰ ਕਲੀਨਿਕ"
      }
    ],
    pediatrician: [
      {
        name: "ਡਾ. ਅਨਿਲ ਗੁਪਤਾ",
        specialization: "ਬੱਚਿਆਂ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ",
        experience: "14 ਸਾਲ",
        phone: "+91-98765-43214",
        availability: "ਸੋਮ-ਸ਼ੁਕਰ: ਸਵੇਰੇ 8 - ਸ਼ਾਮ 6",
        location: "ਨਾਭਾ ਚਿਲਡਰਨ ਹਸਪਤਾਲ"
      }
    ],
    orthopedist: [
      {
        name: "ਡਾ. ਵਿਕਰਮ ਸਿੰਘ",
        specialization: "ਹੱਡੀਆਂ ਦੇ ਰੋਗ ਵਿਸ਼ੇਸ਼ਗ",
        experience: "16 ਸਾਲ",
        phone: "+91-98765-43215",
        availability: "ਸੋਮ-ਸ਼ਨਿੱਚਰ: ਸਵੇਰੇ 9 - ਸ਼ਾਮ 5",
        location: "ਨਾਭਾ ਬੋਨ ਐਂਡ ਜੌਇੰਟ ਸੈਂਟਰ"
      }
    ]
  }
};

export const mockASHAWorkers = {
  english: [
    {
      name: "Kavita Devi",
      area: "Nabha Block A",
      phone: "+91-98765-44001",
      experience: "8 years",
      specializations: ["Maternal Health", "Child Care", "Immunization"],
      availability: "Mon-Sat: 8 AM - 6 PM"
    },
    {
      name: "Sunita Rani",
      area: "Nabha Block B", 
      phone: "+91-98765-44002",
      experience: "6 years",
      specializations: ["Family Planning", "Nutrition", "Health Education"],
      availability: "Mon-Fri: 9 AM - 5 PM"
    },
    {
      name: "Rajni Kumari",
      area: "Nabha Block C",
      phone: "+91-98765-44003", 
      experience: "10 years",
      specializations: ["Pregnancy Care", "Newborn Care", "Disease Prevention"],
      availability: "Mon-Sat: 7 AM - 7 PM"
    }
  ],
  hindi: [
    {
      name: "कविता देवी",
      area: "नाभा ब्लॉक ए",
      phone: "+91-98765-44001",
      experience: "8 वर्ष",
      specializations: ["मातृ स्वास्थ्य", "बाल देखभाल", "टीकाकरण"],
      availability: "सोम-शनि: सुबह 8 - शाम 6"
    },
    {
      name: "सुनीता रानी",
      area: "नाभा ब्लॉक बी",
      phone: "+91-98765-44002",
      experience: "6 वर्ष", 
      specializations: ["परिवार नियोजन", "पोषण", "स्वास्थ्य शिक्षा"],
      availability: "सोम-शुक्र: सुबह 9 - शाम 5"
    },
    {
      name: "राजनी कुमारी",
      area: "नाभा ब्लॉक सी",
      phone: "+91-98765-44003",
      experience: "10 वर्ष",
      specializations: ["गर्भावस्था देखभाल", "नवजात देखभाल", "रोग निवारण"],
      availability: "सोम-शनि: सुबह 7 - शाम 7"
    }
  ],
  punjabi: [
    {
      name: "ਕਵਿਤਾ ਦੇਵੀ",
      area: "ਨਾਭਾ ਬਲਾਕ ਏ",
      phone: "+91-98765-44001",
      experience: "8 ਸਾਲ",
      specializations: ["ਮਾਤਾ ਦਾ ਸਿਹਤ", "ਬੱਚਿਆਂ ਦੀ ਦੇਖਭਾਲ", "ਟੀਕਾਕਰਣ"],
      availability: "ਸੋਮ-ਸ਼ਨਿੱਚਰ: ਸਵੇਰੇ 8 - ਸ਼ਾਮ 6"
    },
    {
      name: "ਸੁਨੀਤਾ ਰਾਣੀ",
      area: "ਨਾਭਾ ਬਲਾਕ ਬੀ",
      phone: "+91-98765-44002",
      experience: "6 ਸਾਲ",
      specializations: ["ਪਰਿਵਾਰ ਯੋਜਨਾ", "ਪੋਸ਼ਣ", "ਸਿਹਤ ਸਿੱਖਿਆ"],
      availability: "ਸੋਮ-ਸ਼ੁਕਰ: ਸਵੇਰੇ 9 - ਸ਼ਾਮ 5"
    },
    {
      name: "ਰਾਜਨੀ ਕੁਮਾਰੀ",
      area: "ਨਾਭਾ ਬਲਾਕ ਸੀ",
      phone: "+91-98765-44003",
      experience: "10 ਸਾਲ",
      specializations: ["ਗਰਭਾਵਸਥਾ ਦੇਖਭਾਲ", "ਨਵਜਾਤ ਦੇਖਭਾਲ", "ਰੋਗ ਰੋਕਥਾਮ"],
      availability: "ਸੋਮ-ਸ਼ਨਿੱਚਰ: ਸਵੇਰੇ 7 - ਸ਼ਾਮ 7"
    }
  ]
};

/**
 * Get doctor data based on language and specialization
 */
export function getDoctorData(language = 'english', specialization = 'general') {
  const langData = mockDoctors[language] || mockDoctors.english;
  return langData[specialization] || langData.general;
}

/**
 * Get ASHA worker data based on language
 */
export function getASHAData(language = 'english') {
  return mockASHAWorkers[language] || mockASHAWorkers.english;
}

/**
 * Format doctor data for display
 */
export function formatDoctorData(doctors, language = 'english') {
  const labels = {
    english: {
      name: "Name",
      specialization: "Specialization", 
      experience: "Experience",
      availability: "Availability",
      location: "Location"
    },
    hindi: {
      name: "नाम",
      specialization: "विशेषज्ञता",
      experience: "अनुभव", 
      availability: "उपलब्धता",
      location: "स्थान"
    },
    punjabi: {
      name: "ਨਾਮ",
      specialization: "ਵਿਸ਼ੇਸ਼ਤਾ",
      experience: "ਅਨੁਭਵ",
      availability: "ਉਪਲਬਧਤਾ", 
      location: "ਟਿਕਾਣਾ"
    }
  };

  const langLabels = labels[language] || labels.english;
  
  return doctors.map(doctor => 
    `${langLabels.name}: ${doctor.name}\n${langLabels.specialization}: ${doctor.specialization}\n${langLabels.experience}: ${doctor.experience}\n${langLabels.availability}: ${doctor.availability}\n${langLabels.location}: ${doctor.location}`
  ).join('\n\n');
}

/**
 * Format ASHA worker data for display
 */
export function formatASHAData(ashaWorkers, language = 'english') {
  const labels = {
    english: {
      name: "Name",
      area: "Area",
      experience: "Experience",
      specializations: "Specializations",
      availability: "Availability"
    },
    hindi: {
      name: "नाम",
      area: "क्षेत्र",
      experience: "अनुभव",
      specializations: "विशेषज्ञता",
      availability: "उपलब्धता"
    },
    punjabi: {
      name: "ਨਾਮ",
      area: "ਖੇਤਰ",
      experience: "ਅਨੁਭਵ", 
      specializations: "ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
      availability: "ਉਪਲਬਧਤਾ"
    }
  };

  const langLabels = labels[language] || labels.english;
  
  return ashaWorkers.map(worker => 
    `${langLabels.name}: ${worker.name}\n${langLabels.area}: ${worker.area}\n${langLabels.experience}: ${worker.experience}\n${langLabels.specializations}: ${worker.specializations.join(', ')}\n${langLabels.availability}: ${worker.availability}`
  ).join('\n\n');
}
