package com.smartrevision.cockpit.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartrevision.cockpit.model.CockpitConfig
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed
import java.time.LocalDate

@Composable
fun CockpitScreen(
    lectures: List<LectureItem>,
    config: CockpitConfig,
    onStartRevision: (LectureItem) -> Unit,
    onOpenDetail: (LectureItem) -> Unit,
    onToggleStep: (LectureItem, Int) -> Unit,
    onQuickRate: (LectureItem, DifficultyRating) -> Unit,
    onOpenAddLecture: () -> Unit
) {
    val todayStr = LocalDate.now().toString()
    val dueToday = lectures.filter {
        it.status != "archived" && (it.status == "due_today" || it.nextDueDate <= todayStr)
    }
    val completedToday = lectures.count { it.lastRevisionDate == todayStr }
    val masteredCount = lectures.count { it.revisionCount >= 3 && it.lastRating != DifficultyRating.Hard }
    val hardCount = lectures.count { it.lastRating == DifficultyRating.Hard }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = onOpenAddLecture,
                containerColor = AmberPrimary,
                contentColor = MaterialTheme.colorScheme.surface
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Add Lecture")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Metrics Summary Grid
            item {
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Due Today Card
                    Surface(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(14.dp),
                        color = AmberPrimary.copy(alpha = 0.15f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, AmberPrimary.copy(alpha = 0.3f))
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(text = "आज देय", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(
                                text = "${dueToday.size}",
                                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, color = AmberPrimary)
                            )
                            Text(text = "रिवीज़न बाकी", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }

                    // Completed Today vs Quota
                    Surface(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(14.dp),
                        color = EmeraldGreen.copy(alpha = 0.12f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldGreen.copy(alpha = 0.3f))
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(text = "दैनिक कोटा", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(
                                text = "$completedToday / ${config.dailyQuota}",
                                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold, color = EmeraldGreen)
                            )
                            val percent = ((completedToday.toFloat() / config.dailyQuota.coerceAtLeast(1)) * 100).toInt()
                            Text(text = "$percent% पूर्ण", fontSize = 10.sp, color = EmeraldGreen)
                        }
                    }

                    // Mastered Count
                    Surface(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(14.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(text = "पक्का / सिद्ध", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(
                                text = "$masteredCount",
                                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(text = "मास्टर्ड लेक्चर्स", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }

            // Section Header: Due Today
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "आज के रिवीज़न (${dueToday.size})",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    if (dueToday.isNotEmpty()) {
                        Text(
                            text = "एक्टिव री-कॉल सत्र",
                            style = MaterialTheme.typography.bodySmall,
                            color = AmberPrimary
                        )
                    }
                }
            }

            // Empty State
            if (dueToday.isEmpty()) {
                item {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 16.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(text = "🎉", fontSize = 40.sp)
                            Text(
                                text = "शानदार! आज का सारा रिवीज़न पूरा हो चुका है।",
                                style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "आप नया लेक्चर जोड़ सकते हैं या विषय डायरेक्टरी से अतिरिक्त अभ्यास कर सकते हैं।",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                textAlign = androidx.compose.ui.text.style.TextAlign.Center
                            )
                            Button(
                                onClick = onOpenAddLecture,
                                colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("+ नया लेक्चर जोड़ें", color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            } else {
                // Due Lectures List
                items(dueToday) { lecture ->
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = MaterialTheme.colorScheme.surface,
                        tonalElevation = 2.dp,
                        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .clickable { onOpenDetail(lecture) }
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            // Top Row: Subject & Due Badge
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "${lecture.subject} • ${lecture.chapter}",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        color = AmberPrimary,
                                        fontWeight = FontWeight.SemiBold
                                    ),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    modifier = Modifier.weight(1f)
                                )
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = RoseRed.copy(alpha = 0.15f)
                                ) {
                                    Text(
                                        text = "आज देय",
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            color = RoseRed,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 10.sp
                                        )
                                    )
                                }
                            }

                            // Title
                            Text(
                                text = lecture.title,
                                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                maxLines = 2,
                                overflow = TextOverflow.Ellipsis
                            )

                            // 2-Step Foundation pills
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Step 1
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (lecture.step1Completed) EmeraldGreen.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                                    modifier = Modifier.clickable { onToggleStep(lecture, 1) }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = if (lecture.step1Completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                            contentDescription = null,
                                            tint = if (lecture.step1Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = "स्टेप 1 (24h)",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = if (lecture.step1Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurface
                                        )
                                    }
                                }

                                // Step 2
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (lecture.step2Completed) EmeraldGreen.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                                    modifier = Modifier.clickable { onToggleStep(lecture, 2) }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = if (lecture.step2Completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                            contentDescription = null,
                                            tint = if (lecture.step2Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = "स्टेप 2 (3d)",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = if (lecture.step2Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurface
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.weight(1f))

                                // Revision Count
                                Text(
                                    text = "${lecture.revisionCount}x चक्र",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            // Action Row
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Quick Rating chips
                                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    listOf(
                                        DifficultyRating.Easy to "सरल",
                                        DifficultyRating.Medium to "मध्यम",
                                        DifficultyRating.Hard to "कठिन"
                                    ).forEach { (r, label) ->
                                        val isCurrent = lecture.lastRating == r
                                        val col = when (r) {
                                            DifficultyRating.Easy -> EmeraldGreen
                                            DifficultyRating.Medium -> AmberPrimary
                                            DifficultyRating.Hard -> RoseRed
                                        }
                                        Surface(
                                            shape = RoundedCornerShape(6.dp),
                                            color = if (isCurrent) col.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                            modifier = Modifier.clickable { onQuickRate(lecture, r) }
                                        ) {
                                            Text(
                                                text = label,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                                fontSize = 10.sp,
                                                color = if (isCurrent) col else MaterialTheme.colorScheme.onSurfaceVariant,
                                                fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal
                                            )
                                        }
                                    }
                                }

                                // Start Revision Button
                                Button(
                                    onClick = { onStartRevision(lecture) },
                                    colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.surface)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(text = "रिवीज़न करें", fontSize = 12.sp, color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
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
