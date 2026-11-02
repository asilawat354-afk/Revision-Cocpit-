// Range I3:J310 data + All CH List NTPC syllabus
// Complete syllabus catalog with exact chapter lecture counts

export interface ChapterCatalogItem {
  name: string;
  lectureCount: number;
}

export interface SubjectCatalogItem {
  id: string;
  name: string; // Exact subject name from Range I3:J310 / All CH List
  category: "Maths" | "Reasoning" | "Science" | "General Studies" | "Computer" | "Special / Other";
  iconName: string;
  chapters: string[]; // List of chapter names
  chapterMeta?: ChapterCatalogItem[]; // With lecture counts from All CH List
}

export const ALL_CH_LIST_RAW: { subject: string; chapter: string; lectures: number }[] = [
  // Maths- (Arithmetic)
  { subject: "Maths- (Arithmetic)", chapter: "Calculation", lectures: 10 },
  { subject: "Maths- (Arithmetic)", chapter: "Digital Sum", lectures: 3 },
  { subject: "Maths- (Arithmetic)", chapter: "Ratio & Proportion", lectures: 17 },
  { subject: "Maths- (Arithmetic)", chapter: "Percentage", lectures: 18 },
  { subject: "Maths- (Arithmetic)", chapter: "Mixture & Alligation", lectures: 9 },
  { subject: "Maths- (Arithmetic)", chapter: "Profit & Loss", lectures: 13 },
  { subject: "Maths- (Arithmetic)", chapter: "Simple Interest", lectures: 7 },
  { subject: "Maths- (Arithmetic)", chapter: "Compound Interest", lectures: 11 },
  { subject: "Maths- (Arithmetic)", chapter: "Chain Rule", lectures: 4 },
  { subject: "Maths- (Arithmetic)", chapter: "Time & Work", lectures: 8 },
  { subject: "Maths- (Arithmetic)", chapter: "Pipe & Cistern", lectures: 5 },
  { subject: "Maths- (Arithmetic)", chapter: "Average", lectures: 9 },
  { subject: "Maths- (Arithmetic)", chapter: "Age", lectures: 7 },
  { subject: "Maths- (Arithmetic)", chapter: "Partnership", lectures: 5 },
  { subject: "Maths- (Arithmetic)", chapter: "Train", lectures: 3 },
  { subject: "Maths- (Arithmetic)", chapter: "Boat and Stream", lectures: 4 },
  { subject: "Maths- (Arithmetic)", chapter: "Time Speed & Distance", lectures: 10 },

  // Maths- (Advance)
  { subject: "Maths- (Advance)", chapter: "Geometry (ज्यामिति)", lectures: 27 },
  { subject: "Maths- (Advance)", chapter: "Algebra", lectures: 21 },
  { subject: "Maths- (Advance)", chapter: "Algebra Recorded", lectures: 13 },
  { subject: "Maths- (Advance)", chapter: "Trigonometry", lectures: 19 },
  { subject: "Maths- (Advance)", chapter: "Trigonometry Recorded", lectures: 12 },
  { subject: "Maths- (Advance)", chapter: "Height & Distance", lectures: 5 },
  { subject: "Maths- (Advance)", chapter: "Permutation, Combination & Probability", lectures: 8 },
  { subject: "Maths- (Advance)", chapter: "Quadratic Equation", lectures: 5 },
  { subject: "Maths- (Advance)", chapter: "Coordination Geometry", lectures: 8 },
  { subject: "Maths- (Advance)", chapter: "Polynomial", lectures: 1 },
  { subject: "Maths- (Advance)", chapter: "Number System", lectures: 21 },
  { subject: "Maths- (Advance)", chapter: "Statistics", lectures: 5 },
  { subject: "Maths- (Advance)", chapter: "Simplification", lectures: 7 },
  { subject: "Maths- (Advance)", chapter: "LCM & HCF", lectures: 8 },
  { subject: "Maths- (Advance)", chapter: "Surds & Indices", lectures: 10 },
  { subject: "Maths- (Advance)", chapter: "Data Interpretation", lectures: 11 },
  { subject: "Maths- (Advance)", chapter: "Mensuration", lectures: 29 },

  // Maths (General)
  { subject: "Maths", chapter: "Ratio & Proportion", lectures: 16 },
  { subject: "Maths", chapter: "Percentage", lectures: 14 },
  { subject: "Maths", chapter: "Mixture & Alligation", lectures: 6 },
  { subject: "Maths", chapter: "Profit & Loss", lectures: 9 },
  { subject: "Maths", chapter: "Simple Interest", lectures: 6 },
  { subject: "Maths", chapter: "Compound Interest", lectures: 10 },
  { subject: "Maths", chapter: "Time & Work", lectures: 10 },
  { subject: "Maths", chapter: "Pipe & Cistern", lectures: 6 },
  { subject: "Maths", chapter: "Average", lectures: 5 },
  { subject: "Maths", chapter: "Race", lectures: 2 },
  { subject: "Maths", chapter: "Age", lectures: 6 },
  { subject: "Maths", chapter: "Partnership", lectures: 2 },
  { subject: "Maths", chapter: "Train", lectures: 4 },
  { subject: "Maths", chapter: "Boat and Stream", lectures: 4 },
  { subject: "Maths", chapter: "Time Speed & Distance", lectures: 7 },
  { subject: "Maths", chapter: "Number System", lectures: 11 },
  { subject: "Maths", chapter: "LCM & HCF", lectures: 4 },
  { subject: "Maths", chapter: "Surds & Indices", lectures: 3 },
  { subject: "Maths", chapter: "Algebra", lectures: 5 },
  { subject: "Maths", chapter: "Trigonometry", lectures: 7 },
  { subject: "Maths", chapter: "Geometry (ज्यामिति)", lectures: 11 },
  { subject: "Maths", chapter: "Mensuration", lectures: 12 },
  { subject: "Maths", chapter: "Coordination Geometry", lectures: 4 },
  { subject: "Maths", chapter: "Statistics", lectures: 6 },
  { subject: "Maths", chapter: "Permutation, Combination", lectures: 2 },
  { subject: "Maths", chapter: "Probability", lectures: 2 },
  { subject: "Maths", chapter: "Data Interpretation", lectures: 5 },

  // Reasoning
  { subject: "Reasoning", chapter: "Venn Diagram", lectures: 2 },
  { subject: "Reasoning", chapter: "Dice", lectures: 3 },
  { subject: "Reasoning", chapter: "Mirror & Water Image", lectures: 1 },
  { subject: "Reasoning", chapter: "Mathematical Operations", lectures: 2 },
  { subject: "Reasoning", chapter: "Alphabet", lectures: 4 },
  { subject: "Reasoning", chapter: "Letter Series", lectures: 1 },
  { subject: "Reasoning", chapter: "Coding Decoding", lectures: 4 },
  { subject: "Reasoning", chapter: "Analogy", lectures: 2 },
  { subject: "Reasoning", chapter: "Classification", lectures: 1 },
  { subject: "Reasoning", chapter: "Number Series", lectures: 2 },
  { subject: "Reasoning", chapter: "Seating Arrangement", lectures: 3 },
  { subject: "Reasoning", chapter: "Puzzle", lectures: 1 },
  { subject: "Reasoning", chapter: "Inequality", lectures: 2 },
  { subject: "Reasoning", chapter: "Non-verbal Analogy & Classification", lectures: 1 },
  { subject: "Reasoning", chapter: "Non Verbal Series", lectures: 1 },
  { subject: "Reasoning", chapter: "Syllogism", lectures: 3 },
  { subject: "Reasoning", chapter: "Blood Relation", lectures: 3 },
  { subject: "Reasoning", chapter: "Calendar", lectures: 4 },
  { subject: "Reasoning", chapter: "Clock", lectures: 2 },
  { subject: "Reasoning", chapter: "Distance & Direction", lectures: 2 },
  { subject: "Reasoning", chapter: "Counting Of Figure", lectures: 2 },
  { subject: "Reasoning", chapter: "Missing Number", lectures: 1 },
  { subject: "Reasoning", chapter: "Ranking & Ordering", lectures: 2 },
  { subject: "Reasoning", chapter: "Statement & Argument", lectures: 1 },
  { subject: "Reasoning", chapter: "Paper Cutting, Figure Formation & Passage", lectures: 1 },
  { subject: "Reasoning", chapter: "Cube & Cuboid, Cause & Effect", lectures: 1 },
  { subject: "Reasoning", chapter: "Completion Of Figures", lectures: 1 },

  // Physics
  { subject: "Physics", chapter: "दाब", lectures: 3 },
  { subject: "Physics", chapter: "प्रकाश", lectures: 14 },
  { subject: "Physics", chapter: "गति", lectures: 5 },
  { subject: "Physics", chapter: "न्यूटन के गति के नियम", lectures: 6 },
  { subject: "Physics", chapter: "कार्य, ऊर्जा और शक्ति", lectures: 6 },
  { subject: "Physics", chapter: "गुरुत्वाकर्षण", lectures: 5 },
  { subject: "Physics", chapter: "ध्वनि और तरंग", lectures: 7 },
  { subject: "Physics", chapter: "ऊष्मा", lectures: 9 },
  { subject: "Physics", chapter: "विद्युत", lectures: 4 },
  { subject: "Physics", chapter: "चुम्बकत्व", lectures: 2 },
  { subject: "Physics", chapter: "Unit & Dimension", lectures: 2 },
  { subject: "Physics", chapter: "पदार्थ", lectures: 3 },
  { subject: "Physics", chapter: "घर्षण", lectures: 1 },
  { subject: "Physics", chapter: "SHM", lectures: 1 },

  // Chemistry
  { subject: "Chemistry", chapter: "पदार्थ", lectures: 2 },
  { subject: "Chemistry", chapter: "परमाणु", lectures: 10 },
  { subject: "Chemistry", chapter: "अम्ल और क्षार", lectures: 5 },
  { subject: "Chemistry", chapter: "PH Scale", lectures: 4 },
  { subject: "Chemistry", chapter: "आवर्त सारणी", lectures: 9 },
  { subject: "Chemistry", chapter: "रासायनिक बंध/आबंध", lectures: 9 },
  { subject: "Chemistry", chapter: "Periodic Table (MCQ)", lectures: 1 },
  { subject: "Chemistry", chapter: "गैसीय अवस्था", lectures: 2 },
  { subject: "Chemistry", chapter: "विलयन और कोलाइड", lectures: 5 },
  { subject: "Chemistry", chapter: "ईंधन", lectures: 2 },
  { subject: "Chemistry", chapter: "हाइड्रोजन", lectures: 2 },
  { subject: "Chemistry", chapter: "धातु व अधातु", lectures: 5 },
  { subject: "Chemistry", chapter: "Organic Compound", lectures: 3 },
  { subject: "Chemistry", chapter: "विद्युत-रसायन", lectures: 2 },
  { subject: "Chemistry", chapter: "दैनिक जीवन में रसायन", lectures: 4 },
  { subject: "Chemistry", chapter: "Important Facts", lectures: 2 },

  // Biology
  { subject: "Biology", chapter: "कोशिका", lectures: 9 },
  { subject: "Biology", chapter: "पाचन तंत्र", lectures: 8 },
  { subject: "Biology", chapter: "उत्सर्जन तंत्र", lectures: 3 },
  { subject: "Biology", chapter: "रक्त", lectures: 5 },
  { subject: "Biology", chapter: "परिसंचरण तंत्र", lectures: 6 },
  { subject: "Biology", chapter: "श्र्वसन तंत्र", lectures: 3 },
  { subject: "Biology", chapter: "कंकाल तंत्र", lectures: 5 },
  { subject: "Biology", chapter: "तंत्रिका तंत्र", lectures: 5 },
  { subject: "Biology", chapter: "अंतस्रावी तंत्र", lectures: 5 },
  { subject: "Biology", chapter: "प्रजनन तंत्र", lectures: 4 },
  { subject: "Biology", chapter: "मानव स्वास्थ्य और रोग", lectures: 8 },
  { subject: "Biology", chapter: "ऊतक", lectures: 4 },
  { subject: "Biology", chapter: "Plant Morphology & Phychology", lectures: 5 },
  { subject: "Biology", chapter: "मानव नेत्र", lectures: 1 },
  { subject: "Biology", chapter: "Classification", lectures: 10 },

  // Static GK
  { subject: "Static GK", chapter: "कला से संबंधित महत्वपूर्ण तथ्य", lectures: 1 },
  { subject: "Static GK", chapter: "भारत के संगठन", lectures: 1 },
  { subject: "Static GK", chapter: "भारत में राष्ट्रीय उद्यान", lectures: 1 },
  { subject: "Static GK", chapter: "शास्त्रीय नृत्य", lectures: 2 },
  { subject: "Static GK", chapter: "महत्वपूर्ण दिवस एवं थीम", lectures: 2 },
  { subject: "Static GK", chapter: "भारत और विश्व में प्रथम", lectures: 1 },
  { subject: "Static GK", chapter: "खेल से संबंधित महत्वपूर्ण तथ्य", lectures: 4 },
  { subject: "Static GK", chapter: "कला एवं संस्कृति", lectures: 1 },
  { subject: "Static GK", chapter: "भारत की लोक भाषा", lectures: 1 },
  { subject: "Static GK", chapter: "GI Tag", lectures: 1 },
  { subject: "Static GK", chapter: "भारत में प्रथम पुरुष एवं महिला", lectures: 1 },
  { subject: "Static GK", chapter: "भारत की नदी घाटी परियोजनाएं", lectures: 1 },
  { subject: "Static GK", chapter: "भारत के प्रमुख त्यौहार एवं उत्सव", lectures: 1 },
  { subject: "Static GK", chapter: "ओलंपिक खेल", lectures: 2 },
  { subject: "Static GK", chapter: "देश राजधानी और मुद्रा", lectures: 1 },
  { subject: "Static GK", chapter: "अनुसंधान संथान", lectures: 2 },
  { subject: "Static GK", chapter: "भारत के राष्ट्रीय उद्यान एवं अभयारण्य", lectures: 4 },
  { subject: "Static GK", chapter: "Paralympic 2024", lectures: 1 },
  { subject: "Static GK", chapter: "भारत की पंचवर्षीय योजनाएँ", lectures: 2 },
  { subject: "Static GK", chapter: "भारत रत्न पुरस्कार", lectures: 1 },
  { subject: "Static GK", chapter: "अंतर्राष्ट्रीय संगठन", lectures: 2 },
  { subject: "Static GK", chapter: "विश्व विरासत स्थल", lectures: 1 },
  { subject: "Static GK", chapter: "राष्ट्रीय संगठन", lectures: 1 },
  { subject: "Static GK", chapter: "भारत के प्रमुख संगीत घराने", lectures: 1 },
  { subject: "Static GK", chapter: "प्रमुख संग्रहालय एवं समाधी स्थल", lectures: 1 },
  { subject: "Static GK", chapter: "भारत के प्रमुख दर्रे", lectures: 1 },
  { subject: "Static GK", chapter: "भारत एवं विश्व की प्रमुख झीले, जलप्रपात एवं नहरे", lectures: 2 },
  { subject: "Static GK", chapter: "भारत एवं विश्व की प्रमुख नदिया", lectures: 1 },
  { subject: "Static GK", chapter: "महत्वपूर्ण अनुच्छेद", lectures: 1 },

  // Physical Geography
  { subject: "Physical Geography", chapter: "Universe (ब्रह्माण्ड)", lectures: 2 },
  { subject: "Physical Geography", chapter: "तारों का जीवन चक्र", lectures: 1 },
  { subject: "Physical Geography", chapter: "सौरमंडल", lectures: 2 },
  { subject: "Physical Geography", chapter: "क्षुद्रग्रह, धुमकेतु, उपग्रह", lectures: 3 },
  { subject: "Physical Geography", chapter: "ज्वार-भाटा", lectures: 1 },
  { subject: "Physical Geography", chapter: "पृथ्वी", lectures: 1 },
  { subject: "Physical Geography", chapter: "वायुमंडल", lectures: 2 },
  { subject: "Physical Geography", chapter: "पर्वत, पठार एवं मैदान", lectures: 3 },
  { subject: "Physical Geography", chapter: "ज्वालामुखी", lectures: 1 },
  { subject: "Physical Geography", chapter: "ज्वालामुखी और भूकंप", lectures: 2 },
  { subject: "Physical Geography", chapter: "ऋतु परिवर्तन", lectures: 1 },
  { subject: "Physical Geography", chapter: "दाब और पवनें", lectures: 3 },

  // World Geography
  { subject: "World Geography", chapter: "दक्षिण अमेरिका", lectures: 2 },
  { subject: "World Geography", chapter: "उत्तरी अमेरिका", lectures: 3 },
  { subject: "World Geography", chapter: "यूरोप महाद्वीप", lectures: 2 },
  { subject: "World Geography", chapter: "अफ्रीका महाद्वीप", lectures: 2 },
  { subject: "World Geography", chapter: "ऑस्ट्रेलिया महाद्वीप", lectures: 2 },
  { subject: "World Geography", chapter: "एशिया महाद्वीप", lectures: 1 },

  // Indian Geography
  { subject: "Indian Geography", chapter: "भारत का सामान्य परिचय", lectures: 6 },
  { subject: "Indian Geography", chapter: "Island (द्वीप)", lectures: 2 },
  { subject: "Indian Geography", chapter: "पठार और पर्वत", lectures: 7 },
  { subject: "Indian Geography", chapter: "अपवाह तंत्र", lectures: 9 },
  { subject: "Indian Geography", chapter: "झीलें", lectures: 1 },
  { subject: "Indian Geography", chapter: "Forest (वन)", lectures: 6 },
  { subject: "Indian Geography", chapter: "परिवहन", lectures: 5 },
  { subject: "Indian Geography", chapter: "खनिज संसाधन", lectures: 3 },
  { subject: "Indian Geography", chapter: "Soil (मिट्टी)", lectures: 3 },
  { subject: "Indian Geography", chapter: "कृषि", lectures: 4 },
  { subject: "Indian Geography", chapter: "जनजाति", lectures: 2 },

  // Polity
  { subject: "Polity", chapter: "Doubt And Talk Session", lectures: 1 },
  { subject: "Polity", chapter: "Practice Session", lectures: 3 },
  { subject: "Polity", chapter: "Test", lectures: 3 },
  { subject: "Polity", chapter: "संविधान सभा", lectures: 5 },
  { subject: "Polity", chapter: "भारतीय संविधान के स्रोत", lectures: 1 },
  { subject: "Polity", chapter: "अनुसूचियाँ", lectures: 2 },
  { subject: "Polity", chapter: "भाग-1", lectures: 2 },
  { subject: "Polity", chapter: "भाग-2", lectures: 3 },
  { subject: "Polity", chapter: "भाग-3", lectures: 7 },
  { subject: "Polity", chapter: "भाग-4", lectures: 2 },
  { subject: "Polity", chapter: "मौलिक कर्तव्य", lectures: 1 },
  { subject: "Polity", chapter: "भारत के राष्ट्रपति", lectures: 5 },
  { subject: "Polity", chapter: "उपराष्ट्रपति", lectures: 1 },
  { subject: "Polity", chapter: "प्रधानमंत्री", lectures: 1 },
  { subject: "Polity", chapter: "संसद", lectures: 5 },
  { subject: "Polity", chapter: "सुप्रीम कोर्ट", lectures: 1 },
  { subject: "Polity", chapter: "Comptroller and Auditor General of India", lectures: 1 },
  { subject: "Polity", chapter: "राज्यपाल", lectures: 1 },
  { subject: "Polity", chapter: "विधानमण्डल", lectures: 1 },
  { subject: "Polity", chapter: "उच्च न्यायालय", lectures: 2 },
  { subject: "Polity", chapter: "मुख्यमंत्री", lectures: 1 },
  { subject: "Polity", chapter: "भाग-8,9", lectures: 1 },
  { subject: "Polity", chapter: "भाग-9,10", lectures: 1 },
  { subject: "Polity", chapter: "भाग-11, भाग-12, भाग-13", lectures: 1 },
  { subject: "Polity", chapter: "भाग-14,15,16", lectures: 1 },
  { subject: "Polity", chapter: "भाग-16,17,18,19", lectures: 1 },
  { subject: "Polity", chapter: "भाग-20,21,22", lectures: 1 },
  { subject: "Polity", chapter: "Commission", lectures: 1 },
  { subject: "Polity", chapter: "प्रस्तावना", lectures: 1 },
  { subject: "Polity", chapter: "भारत का संवैधानिक विकास", lectures: 4 },

  // Economics
  { subject: "Economics", chapter: "Doubt Session", lectures: 1 },
  { subject: "Economics", chapter: "Test", lectures: 4 },
  { subject: "Economics", chapter: "Structure Of RBI", lectures: 4 },
  { subject: "Economics", chapter: "Monetary Policy(मौद्रिक नीति)", lectures: 3 },
  { subject: "Economics", chapter: "Cheque", lectures: 3 },
  { subject: "Economics", chapter: "Money Market", lectures: 4 },
  { subject: "Economics", chapter: "Capital Market", lectures: 2 },
  { subject: "Economics", chapter: "Stock Market", lectures: 1 },
  { subject: "Economics", chapter: "योजनाएं (Scheme)", lectures: 3 },
  { subject: "Economics", chapter: "Budget (बजट)", lectures: 4 },
  { subject: "Economics", chapter: "Census", lectures: 3 },
  { subject: "Economics", chapter: "Five Year Plans(पंचवर्षीय योजनाएं)", lectures: 4 },
  { subject: "Economics", chapter: "International Organization", lectures: 3 },
  { subject: "Economics", chapter: "Inflation And Deflation", lectures: 1 },
  { subject: "Economics", chapter: "Basel Norms", lectures: 2 },
  { subject: "Economics", chapter: "National Income (राष्ट्रीय आय)", lectures: 1 },

  // History
  { subject: "History", chapter: "Test", lectures: 1 },
  { subject: "History", chapter: "सिंधु घाटी सभ्यता", lectures: 3 },
  { subject: "History", chapter: "वैदिक सभ्यता", lectures: 3 },
  { subject: "History", chapter: "जैन धर्म", lectures: 2 },
  { subject: "History", chapter: "बौद्ध धर्म", lectures: 2 },
  { subject: "History", chapter: "मगध साम्राज्य", lectures: 2 },
  { subject: "History", chapter: "मौर्य साम्राज्य", lectures: 3 },
  { subject: "History", chapter: "मौर्योत्तर काल", lectures: 1 },
  { subject: "History", chapter: "गुप्त वंश", lectures: 3 },
  { subject: "History", chapter: "इस्लाम धर्म", lectures: 1 },
  { subject: "History", chapter: "अरब आक्रमण", lectures: 1 },
  { subject: "History", chapter: "तुर्की आक्रमण", lectures: 4 },
  { subject: "History", chapter: "गुलाम वंश", lectures: 5 },
  { subject: "History", chapter: "खिलजी वंश", lectures: 6 },
  { subject: "History", chapter: "तुगलक वंश (Tughlaq Dynasty)", lectures: 1 },
  { subject: "History", chapter: "सैय्यद और लोदी वंश", lectures: 2 },
  { subject: "History", chapter: "मुगल साम्राज्य", lectures: 15 },
  { subject: "History", chapter: "मराठा साम्राज्य", lectures: 2 },
  { subject: "History", chapter: "यूरोपीय कंपनियों का आगमन", lectures: 4 },
  { subject: "History", chapter: "प्लासी और बक्सर का युद्ध", lectures: 3 },
  { subject: "History", chapter: "सामाजिक सुधारक", lectures: 4 },
  { subject: "History", chapter: "1857 की क्रांति", lectures: 3 },
  { subject: "History", chapter: "कांग्रेस की स्थापना", lectures: 2 },
  { subject: "History", chapter: "बंगाल विभाजन", lectures: 2 },
  { subject: "History", chapter: "क्रांतिकारी आंदोलन", lectures: 3 },
  { subject: "History", chapter: "गांधी युग", lectures: 3 },
  { subject: "History", chapter: "भारत छोड़ो आंदोलन", lectures: 2 },
  { subject: "History", chapter: "Test(Class)", lectures: 3 },

  // Computer
  { subject: "Computer", chapter: "Introduction And Syllabus", lectures: 1 },
  { subject: "Computer", chapter: "Basic Of Computer", lectures: 2 },
  { subject: "Computer", chapter: "Internet", lectures: 7 },
  { subject: "Computer", chapter: "Operating System", lectures: 3 },
  { subject: "Computer", chapter: "MS Word", lectures: 7 },
  { subject: "Computer", chapter: "Software", lectures: 2 },
  { subject: "Computer", chapter: "History Of Computer", lectures: 4 },
  { subject: "Computer", chapter: "Input Device", lectures: 3 },
  { subject: "Computer", chapter: "Types Of Computer", lectures: 2 },
  { subject: "Computer", chapter: "MS Excel", lectures: 3 },
  { subject: "Computer", chapter: "Networking", lectures: 5 },
  { subject: "Computer", chapter: "MS Power Point", lectures: 2 },
  { subject: "Computer", chapter: "Cyber Security", lectures: 4 },
  { subject: "Computer", chapter: "Data Representation", lectures: 2 },
  { subject: "Computer", chapter: "Generation Of Computer", lectures: 1 },
  { subject: "Computer", chapter: "Output Device", lectures: 2 },
  { subject: "Computer", chapter: "Memory", lectures: 3 },
  { subject: "Computer", chapter: "Programming Language", lectures: 2 },
  { subject: "Computer", chapter: "Computer Architecture", lectures: 2 },
  { subject: "Computer", chapter: "Mobile Communication", lectures: 1 },
  { subject: "Computer", chapter: "Database Management System", lectures: 3 },

  // Environment
  { subject: "Environment", chapter: "Introduction And Syllabus", lectures: 1 },
  { subject: "Environment", chapter: "Extra Notes", lectures: 4 },
  { subject: "Environment", chapter: "MCQ", lectures: 4 },
  { subject: "Environment", chapter: "पारिस्थितिकी तंत्र", lectures: 2 },
  { subject: "Environment", chapter: "पारिस्थितिक पिरामिड तथा पोषण स्तर", lectures: 1 },
  { subject: "Environment", chapter: "जैव-भू-रासायनिक चक्र (Biogeochemical Cycle)", lectures: 2 },
  { subject: "Environment", chapter: "प्रदूषण", lectures: 5 },
  { subject: "Environment", chapter: "जैव विविधता (Biodiversity)", lectures: 3 },
  { subject: "Environment", chapter: "Climate Change ( जलवायु परिवर्तन)", lectures: 1 },

  // Current Affairs
  { subject: "Current Affairs", chapter: "Current Affairs", lectures: 71 },

  // Special Class
  { subject: "Special Class", chapter: "Mixture And Alligation", lectures: 1 },

  // Talk Session
  { subject: "Talk Session", chapter: "Talk Session", lectures: 1 },
  { subject: "Talk Session", chapter: "Special Talk Session By Aditya Sir", lectures: 6 },

  // SMP
  { subject: "SMP", chapter: "Special Class", lectures: 6 },
  { subject: "SMP", chapter: "Result PDF", lectures: 3 },

  // ebook
  { subject: "ebook", chapter: "Current Affairs eMagazine", lectures: 1 },
  { subject: "ebook", chapter: "Static GK Sanjivani Book", lectures: 1 },
];

// Helper to group by subject
export function getSubjectCatalog(): SubjectCatalogItem[] {
  const map = new Map<string, { chapters: string[]; chapterMeta: ChapterCatalogItem[] }>();

  ALL_CH_LIST_RAW.forEach((item) => {
    if (!map.has(item.subject)) {
      map.set(item.subject, { chapters: [], chapterMeta: [] });
    }
    const entry = map.get(item.subject)!;
    if (!entry.chapters.includes(item.chapter)) {
      entry.chapters.push(item.chapter);
      entry.chapterMeta.push({ name: item.chapter, lectureCount: item.lectures });
    }
  });

  const getCategory = (sub: string): SubjectCatalogItem["category"] => {
    if (sub.includes("Maths")) return "Maths";
    if (sub === "Reasoning") return "Reasoning";
    if (sub === "Physics" || sub === "Chemistry" || sub === "Biology" || sub === "Environment") return "Science";
    if (sub === "Computer") return "Computer";
    if (sub.includes("Geography") || sub === "Polity" || sub === "History" || sub === "Economics" || sub === "Static GK" || sub === "Current Affairs") return "General Studies";
    return "Special / Other";
  };

  const getIcon = (sub: string): string => {
    if (sub.includes("Arithmetic")) return "Calculator";
    if (sub.includes("Advance")) return "Binary";
    if (sub === "Maths") return "PieChart";
    if (sub === "Reasoning") return "Brain";
    if (sub === "Physics") return "Atom";
    if (sub === "Chemistry") return "FlaskConical";
    if (sub === "Biology") return "Dna";
    if (sub === "Indian Geography" || sub === "World Geography" || sub === "Physical Geography") return "Globe";
    if (sub === "Polity") return "Scale";
    if (sub === "History") return "Landmark";
    if (sub === "Economics") return "Coins";
    if (sub === "Computer") return "Laptop";
    return "BookOpen";
  };

  const result: SubjectCatalogItem[] = [];
  for (const [subName, data] of map.entries()) {
    result.push({
      id: subName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name: subName,
      category: getCategory(subName),
      iconName: getIcon(subName),
      chapters: data.chapters,
      chapterMeta: data.chapterMeta,
    });
  }

  return result;
}

export const SUBJECT_CHAPTER_CATALOG: SubjectCatalogItem[] = getSubjectCatalog();

// Helper to create safe, guaranteed-unique ID supporting Unicode/Hindi strings
export function generateLectureId(subject: string, chapter: string, lectureNum: number): string {
  let hash = 0;
  const str = `${subject}:::${chapter}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const positiveHash = (hash >>> 0).toString(36);
  const safeSubj = subject.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toLowerCase() || "sub";
  return `lec-${safeSubj}-${positiveHash}-${lectureNum}`;
}

// Helper to look up chapters for any subject
export function getChaptersForSubject(subjectName: string): string[] {
  const found = SUBJECT_CHAPTER_CATALOG.find((s) => s.name === subjectName);
  return found ? found.chapters : [];
}

// Helper to get total expected lectures for a subject
export function getTotalLecturesForSubject(subjectName: string): number {
  return ALL_CH_LIST_RAW
    .filter((item) => item.subject === subjectName)
    .reduce((sum, item) => sum + item.lectures, 0);
}
