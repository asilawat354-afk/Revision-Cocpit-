package com.smartrevision.cockpit.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartrevision.cockpit.data.CatalogData
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.model.SubjectCatalogItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed

@Composable
fun SubjectsDirectoryScreen(
    lectures: List<LectureItem>,
    selectedSubject: SubjectCatalogItem?,
    selectedChapter: String?,
    onSelectSubject: (SubjectCatalogItem) -> Unit,
    onSelectChapter: (SubjectCatalogItem, String) -> Unit,
    onBack: () -> Unit,
    onOpenAddLecture: (subject: String?, chapter: String?) -> Unit,
    onOpenDetail: (LectureItem) -> Unit,
    onStartRevision: (LectureItem) -> Unit,
    onToggleStep: (LectureItem, Int) -> Unit
) {
    when {
        selectedSubject != null && selectedChapter != null -> {
            // Level 3: Chapter's Lectures View
            ChapterLecturesView(
                subject = selectedSubject,
                chapter = selectedChapter,
                allLectures = lectures,
                onBack = onBack,
                onOpenAddLecture = { onOpenAddLecture(selectedSubject.name, selectedChapter) },
                onOpenDetail = onOpenDetail,
                onStartRevision = onStartRevision,
                onToggleStep = onToggleStep
            )
        }
        selectedSubject != null -> {
            // Level 2: Chapters in Subject View
            SubjectChaptersView(
                subject = selectedSubject,
                allLectures = lectures,
                onSelectChapter = { ch -> onSelectChapter(selectedSubject, ch) },
                onBack = onBack,
                onOpenAddLecture = { onOpenAddLecture(selectedSubject.name, null) }
            )
        }
        else -> {
            // Level 1: All Subjects View
            AllSubjectsView(
                allLectures = lectures,
                onSelectSubject = onSelectSubject
            )
        }
    }
}

// ==========================================
// Level 1: All Subjects View
// ==========================================
@Composable
private fun AllSubjectsView(
    allLectures: List<LectureItem>,
    onSelectSubject: (SubjectCatalogItem) -> Unit
) {
    var selectedCategory by remember { mutableStateOf("सभी (All)") }
    var searchQuery by remember { mutableStateOf("") }

    val categories = listOf("सभी (All)", "Maths", "Science", "Reasoning", "General Studies")

    val filteredSubjects = remember(selectedCategory, searchQuery) {
        CatalogData.ALL_SUBJECTS.filter { sub ->
            val matchCat = selectedCategory == "सभी (All)" || sub.category.equals(selectedCategory, ignoreCase = true)
            val matchQuery = searchQuery.isBlank() ||
                sub.name.contains(searchQuery, ignoreCase = true) ||
                sub.chapters.any { it.contains(searchQuery, ignoreCase = true) }
            matchCat && matchQuery
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Search Input
        item {
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("विषय या अध्याय खोजें...") },
                leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = AmberPrimary) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                singleLine = true
            )
        }

        // Category Filter Chips
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(categories) { cat ->
                    val isSelected = selectedCategory == cat
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = cat },
                        label = { Text(cat, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = AmberPrimary.copy(alpha = 0.2f),
                            selectedLabelColor = AmberPrimary
                        )
                    )
                }
            }
        }

        // Subjects List
        items(filteredSubjects) { sub ->
            val subLectures = allLectures.filter { it.subject.equals(sub.name, ignoreCase = true) }
            val mastered = subLectures.count { it.revisionCount >= 3 && it.lastRating != DifficultyRating.Hard }

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .clickable { onSelectSubject(sub) },
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 2.dp,
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    val iconText = when (sub.category) {
                        "Maths" -> "📐"
                        "Reasoning" -> "🧩"
                        "Science" -> "🔬"
                        else -> "🏛️"
                    }
                    Text(text = iconText, fontSize = 28.sp)
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = sub.name,
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${sub.category} • ${sub.chapters.size} अध्याय • ${subLectures.size} लेक्चर्स",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        if (subLectures.isNotEmpty()) {
                            Text(
                                text = "मास्टर्ड: $mastered / ${subLectures.size}",
                                style = MaterialTheme.typography.bodySmall.copy(color = EmeraldGreen, fontWeight = FontWeight.SemiBold)
                            )
                        }
                    }
                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = "Open",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        item { Spacer(modifier = Modifier.height(72.dp)) }
    }
}

// ==========================================
// Level 2: Chapters in Subject View
// ==========================================
@Composable
private fun SubjectChaptersView(
    subject: SubjectCatalogItem,
    allLectures: List<LectureItem>,
    onSelectChapter: (String) -> Unit,
    onBack: () -> Unit,
    onOpenAddLecture: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    val filteredChapters = remember(searchQuery, subject) {
        if (searchQuery.isBlank()) subject.chapters
        else subject.chapters.filter { it.contains(searchQuery, ignoreCase = true) }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Navigation Header
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = AmberPrimary)
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = subject.name,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    Text(
                        text = "सभी ${subject.chapters.size} अध्याय",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Button(
                    onClick = onOpenAddLecture,
                    colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text("+ नया लेक्चर", fontSize = 11.sp, color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Search Chapters
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("अध्याय खोजें...") },
                leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = AmberPrimary) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                singleLine = true
            )
        }

        // Chapters List
        items(filteredChapters) { chapter ->
            val chapLectures = allLectures.filter {
                it.subject.equals(subject.name, ignoreCase = true) && it.chapter.equals(chapter, ignoreCase = true)
            }
            val dueInChap = chapLectures.count { it.status == "due_today" }
            val masteredInChap = chapLectures.count { it.revisionCount >= 3 && it.lastRating != DifficultyRating.Hard }

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .clickable { onSelectChapter(chapter) },
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 1.dp,
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(imageVector = Icons.Default.Book, contentDescription = null, tint = AmberPrimary)
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = chapter,
                            style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.SemiBold)
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "${chapLectures.size} लेक्चर्स",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            if (dueInChap > 0) {
                                Text(
                                    text = "• $dueInChap आज देय",
                                    style = MaterialTheme.typography.bodySmall.copy(color = RoseRed, fontWeight = FontWeight.Bold)
                                )
                            }
                            if (masteredInChap > 0) {
                                Text(
                                    text = "• $masteredInChap सिद्ध",
                                    style = MaterialTheme.typography.bodySmall.copy(color = EmeraldGreen)
                                )
                            }
                        }
                    }
                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = "Open",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        item { Spacer(modifier = Modifier.height(72.dp)) }
    }
}

// ==========================================
// Level 3: Chapter's Lectures View
// ==========================================
@Composable
private fun ChapterLecturesView(
    subject: SubjectCatalogItem,
    chapter: String,
    allLectures: List<LectureItem>,
    onBack: () -> Unit,
    onOpenAddLecture: () -> Unit,
    onOpenDetail: (LectureItem) -> Unit,
    onStartRevision: (LectureItem) -> Unit,
    onToggleStep: (LectureItem, Int) -> Unit
) {
    val chapLectures = allLectures.filter {
        it.subject.equals(subject.name, ignoreCase = true) && it.chapter.equals(chapter, ignoreCase = true)
    }

    val masteredCount = chapLectures.count { it.revisionCount >= 3 && it.lastRating != DifficultyRating.Hard }
    val dueTodayCount = chapLectures.count { it.status == "due_today" }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Navigation Header with Breadcrumb
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = AmberPrimary)
                }
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = subject.name,
                        style = MaterialTheme.typography.bodySmall,
                        color = AmberPrimary
                    )
                    Text(
                        text = chapter,
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }

        // Chapter Summary Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(text = "कुल लेक्चर्स", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(text = "${chapLectures.size}", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                }
                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    color = RoseRed.copy(alpha = 0.12f)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(text = "आज देय", fontSize = 10.sp, color = RoseRed)
                        Text(text = "$dueTodayCount", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = RoseRed)
                    }
                }
                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    color = EmeraldGreen.copy(alpha = 0.12f)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Text(text = "मास्टर्ड", fontSize = 10.sp, color = EmeraldGreen)
                        Text(text = "$masteredCount", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = EmeraldGreen)
                    }
                }
            }
        }

        // Add Lecture CTA Button
        item {
            Button(
                onClick = onOpenAddLecture,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = null, tint = MaterialTheme.colorScheme.surface)
                Spacer(modifier = Modifier.width(6.dp))
                Text("+ इस अध्याय में नया लेक्चर जोड़ें", color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
            }
        }

        // Empty State or Lecture Cards
        if (chapLectures.isEmpty()) {
            item {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(text = "📖", fontSize = 36.sp)
                        Text(
                            text = "इस अध्याय में अभी कोई लेक्चर नहीं है",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Text(
                            text = "ऊपर दिए गए बटन से पहला लेक्चर जोड़ें और अपना 2-स्टेप फाउंडेशन रिवीज़न शुरू करें।",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(chapLectures) { lecture ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 2.dp,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .clickable { onOpenDetail(lecture) }
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "लेक्चर #${lecture.lectureNumber}",
                                style = MaterialTheme.typography.labelSmall.copy(color = AmberPrimary, fontWeight = FontWeight.Bold)
                            )
                            val ratingCol = when (lecture.lastRating) {
                                DifficultyRating.Easy -> EmeraldGreen
                                DifficultyRating.Hard -> RoseRed
                                else -> AmberPrimary
                            }
                            Text(
                                text = lecture.lastRating?.name ?: "दर्ज नहीं",
                                style = MaterialTheme.typography.labelSmall.copy(color = ratingCol, fontWeight = FontWeight.Bold)
                            )
                        }

                        Text(
                            text = lecture.title,
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )

                        // 2-Step badges
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = if (lecture.step1Completed) EmeraldGreen.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier.clickable { onToggleStep(lecture, 1) }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = if (lecture.step1Completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                        contentDescription = null,
                                        tint = if (lecture.step1Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(12.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = "स्टेप 1", fontSize = 10.sp, color = if (lecture.step1Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurface)
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = if (lecture.step2Completed) EmeraldGreen.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier.clickable { onToggleStep(lecture, 2) }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = if (lecture.step2Completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                        contentDescription = null,
                                        tint = if (lecture.step2Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(12.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = "स्टेप 2", fontSize = 10.sp, color = if (lecture.step2Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurface)
                                }
                            }

                            Spacer(modifier = Modifier.weight(1f))

                            Button(
                                onClick = { onStartRevision(lecture) },
                                colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text("रिवीज़न", fontSize = 11.sp, color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(72.dp)) }
    }
}
