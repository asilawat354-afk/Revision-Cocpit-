package com.smartrevision.cockpit.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed

@Composable
fun MasterDatabaseScreen(
    lectures: List<LectureItem>,
    onOpenDetail: (LectureItem) -> Unit,
    onStartRevision: (LectureItem) -> Unit,
    onQuickRate: (LectureItem, DifficultyRating) -> Unit,
    onDelete: (String) -> Unit,
    onOpenAddLecture: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedSubjectFilter by remember { mutableStateOf<String?>(null) }
    var selectedStatusFilter by remember { mutableStateOf("सभी") }

    val allSubjects = remember(lectures) {
        lectures.map { it.subject }.distinct().sorted()
    }

    val filteredLectures = remember(lectures, searchQuery, selectedSubjectFilter, selectedStatusFilter) {
        lectures.filter { lec ->
            val matchQuery = searchQuery.isBlank() ||
                lec.title.contains(searchQuery, ignoreCase = true) ||
                lec.subject.contains(searchQuery, ignoreCase = true) ||
                lec.chapter.contains(searchQuery, ignoreCase = true)
            val matchSubject = selectedSubjectFilter == null || lec.subject.equals(selectedSubjectFilter, ignoreCase = true)
            val matchStatus = when (selectedStatusFilter) {
                "आज देय" -> lec.status == "due_today"
                "कठिन (Hard)" -> lec.lastRating == DifficultyRating.Hard
                "मास्टर्ड" -> lec.revisionCount >= 3 && lec.lastRating != DifficultyRating.Hard
                else -> true
            }
            matchQuery && matchSubject && matchStatus
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = onOpenAddLecture,
                containerColor = AmberPrimary,
                contentColor = MaterialTheme.colorScheme.surface
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Add")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // Search Input
            item {
                Spacer(modifier = Modifier.height(4.dp))
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("मास्टर डेटाबेस में खोजें...") },
                    leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = AmberPrimary) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )
            }

            // Status Filter Chips
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    listOf("सभी", "आज देय", "कठिन (Hard)", "मास्टर्ड").forEach { st ->
                        val isSelected = selectedStatusFilter == st
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedStatusFilter = st },
                            label = { Text(st, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = AmberPrimary.copy(alpha = 0.2f),
                                selectedLabelColor = AmberPrimary
                            )
                        )
                    }
                }
            }

            // Subject Filter Chips
            if (allSubjects.isNotEmpty()) {
                item {
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        item {
                            FilterChip(
                                selected = selectedSubjectFilter == null,
                                onClick = { selectedSubjectFilter = null },
                                label = { Text("सभी विषय", fontSize = 11.sp) }
                            )
                        }
                        items(allSubjects) { sub ->
                            FilterChip(
                                selected = selectedSubjectFilter == sub,
                                onClick = { selectedSubjectFilter = if (selectedSubjectFilter == sub) null else sub },
                                label = { Text(sub, fontSize = 11.sp) }
                            )
                        }
                    }
                }
            }

            // Summary text
            item {
                Text(
                    text = "कुल ${filteredLectures.size} लेक्चर्स मिले",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Lecture List
            items(filteredLectures) { lecture ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 1.dp,
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
                                text = "${lecture.subject} • ${lecture.chapter}",
                                style = MaterialTheme.typography.bodySmall.copy(color = AmberPrimary, fontWeight = FontWeight.SemiBold),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.weight(1f)
                            )
                            val ratingCol = when (lecture.lastRating) {
                                DifficultyRating.Easy -> EmeraldGreen
                                DifficultyRating.Hard -> RoseRed
                                else -> AmberPrimary
                            }
                            Text(
                                text = lecture.lastRating?.name ?: "तय नहीं",
                                style = MaterialTheme.typography.labelSmall.copy(color = ratingCol, fontWeight = FontWeight.Bold)
                            )
                        }

                        Text(
                            text = lecture.title,
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "रिवीज़न: ${lecture.revisionCount}x • अगला: ${lecture.nextDueDate.ifEmpty { "तय नहीं" }}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Button(
                                    onClick = { onStartRevision(lecture) },
                                    colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.surface)
                                    Spacer(modifier = Modifier.width(4.dp))
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
}
