package com.smartrevision.cockpit.data

import com.smartrevision.cockpit.model.SubjectCatalogItem

object CatalogData {
    val ALL_SUBJECTS: List<SubjectCatalogItem> = listOf(
        SubjectCatalogItem(
            id = "maths_arithmetic",
            name = "Maths- (Arithmetic)",
            category = "Maths",
            chapters = listOf(
                "Calculation", "Digital Sum", "Ratio & Proportion", "Percentage",
                "Mixture & Alligation", "Profit & Loss", "Simple Interest", "Compound Interest",
                "Chain Rule", "Time & Work", "Pipe & Cistern", "Average", "Age",
                "Partnership", "Train", "Boat and Stream", "Time Speed & Distance"
            )
        ),
        SubjectCatalogItem(
            id = "maths_advance",
            name = "Maths- (Advance)",
            category = "Maths",
            chapters = listOf(
                "Geometry (ज्यामिति)", "Algebra", "Algebra Recorded", "Trigonometry",
                "Trigonometry Recorded", "Height & Distance", "Permutation, Combination & Probability",
                "Quadratic Equation", "Coordination Geometry", "Polynomial", "Number System",
                "Statistics", "Simplification", "LCM & HCF", "Surds & Indices",
                "Data Interpretation", "Mensuration"
            )
        ),
        SubjectCatalogItem(
            id = "maths_general",
            name = "Maths",
            category = "Maths",
            chapters = listOf(
                "Ratio & Proportion", "Percentage", "Mixture & Alligation", "Profit & Loss",
                "Simple Interest", "Compound Interest", "Work & Time", "Pipe & Cistern",
                "Speed, Time & Distance", "Train", "Boat & Stream", "Average", "Age", "Partnership"
            )
        ),
        SubjectCatalogItem(
            id = "reasoning",
            name = "Reasoning",
            category = "Reasoning",
            chapters = listOf(
                "Coding-Decoding", "Analogy", "Classification (Odd One Out)", "Series (Number & Alphabet)",
                "Missing Number", "Direction & Distance", "Blood Relation", "Order & Ranking",
                "Sitting Arrangement", "Syllogism", "Venn Diagram", "Mathematical Operations",
                "Dice & Cube", "Clock & Calendar", "Statement & Assumptions", "Mirror & Water Image",
                "Paper Folding & Cutting", "Embedded Figures", "Figure Counting"
            )
        ),
        SubjectCatalogItem(
            id = "physics",
            name = "Physics",
            category = "Science",
            chapters = listOf(
                "Units & Dimensions", "Motion & Kinematics", "Laws of Motion (Newton)",
                "Work, Power & Energy", "Gravitation", "Fluids & Pressure", "Heat & Thermodynamics",
                "Waves & Sound", "Optics (Light)", "Electricity", "Magnetism", "Modern Physics"
            )
        ),
        SubjectCatalogItem(
            id = "chemistry",
            name = "Chemistry",
            category = "Science",
            chapters = listOf(
                "Matter & States", "Atomic Structure", "Periodic Table", "Chemical Bonding",
                "Acids, Bases & Salts", "Metals & Non-Metals", "Carbon & Its Compounds",
                "Chemical Reactions", "Environmental Chemistry", "Everyday Chemistry"
            )
        ),
        SubjectCatalogItem(
            id = "biology",
            name = "Biology",
            category = "Science",
            chapters = listOf(
                "Cell Biology", "Tissues (Plant & Animal)", "Human Digestive System",
                "Respiratory System", "Circulatory System (Heart & Blood)", "Excretory System",
                "Nervous System & Brain", "Endocrine System & Hormones", "Skeletal System",
                "Plant Physiology (Photosynthesis)", "Genetics & Evolution", "Diseases & Human Health",
                "Ecology & Environment"
            )
        ),
        SubjectCatalogItem(
            id = "polity",
            name = "Polity",
            category = "General Studies",
            chapters = listOf(
                "Constitutional Framework & Preamble", "Fundamental Rights", "Fundamental Duties & DPSP",
                "President & Vice President", "Prime Minister & Council of Ministers", "Parliament (Lok Sabha & Rajya Sabha)",
                "Supreme Court & High Courts", "Governor & State Legislature", "Panchayati Raj & Municipalities",
                "Emergency Provisions", "Important Amendments & Articles"
            )
        ),
        SubjectCatalogItem(
            id = "history",
            name = "History",
            category = "General Studies",
            chapters = listOf(
                "Indus Valley Civilization", "Vedic Age & Buddhism/Jainism", "Maurya & Gupta Empire",
                "Delhi Sultanate", "Mughal Empire", "Maratha & Bhakti Movement",
                "Advent of Europeans & British Rule", "Revolt of 1857", "Indian National Movement (1885-1947)",
                "Governor Generals & Viceroys"
            )
        ),
        SubjectCatalogItem(
            id = "indian_geography",
            name = "Indian Geography",
            category = "General Studies",
            chapters = listOf(
                "Physical Divisions & Himalayas", "Northern Plains & Peninsular Plateau",
                "Drainage System (Rivers & Lakes)", "Indian Climate & Monsoon", "Soils of India",
                "Natural Vegetation & Forests", "Agriculture & Minerals", "National Parks & Wildlife Sanctuaries"
            )
        ),
        SubjectCatalogItem(
            id = "world_geography",
            name = "World Geography",
            category = "General Studies",
            chapters = listOf(
                "Solar System & Earth's Movements", "Atmosphere & Pressure Belts",
                "Oceans & Currents", "Major Continents & Landforms", "Major Rivers & Deserts of the World"
            )
        ),
        SubjectCatalogItem(
            id = "economics",
            name = "Economics",
            category = "General Studies",
            chapters = listOf(
                "National Income & GDP", "Inflation & Price Index", "Banking & RBI Monetary Policy",
                "Government Budget & Fiscal Policy", "Five Year Plans & NITI Aayog",
                "Poverty, Unemployment & Govt Schemes", "Taxation System (GST)"
            )
        ),
        SubjectCatalogItem(
            id = "computer",
            name = "Computer",
            category = "Computer",
            chapters = listOf(
                "Computer Architecture & Hardware", "Operating Systems", "Memory (RAM, ROM, Cache)",
                "Microsoft Office (Word, Excel, PPT)", "Internet & Networking Protocols",
                "Cyber Security & Malwares", "Shortcuts & File Extensions", "Database & SQL Basics"
            )
        ),
        SubjectCatalogItem(
            id = "static_gk",
            name = "Static GK",
            category = "General Studies",
            chapters = listOf(
                "Classical & Folk Dances", "Festivals & Fairs", "Musical Instruments & Masters",
                "Famous Temples & Monuments", "Books & Authors", "National & International Awards",
                "Sports Cups & Trophies", "Headquarters of International Organizations",
                "First in India & World"
            )
        )
    )

    fun getSubjectByName(name: String): SubjectCatalogItem? {
        return ALL_SUBJECTS.find { it.name.equals(name, ignoreCase = true) }
    }
}
