package com.smartrevision.cockpit.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.smartrevision.cockpit.engine.RevisionEngine
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed

@Composable
fun RevisionSessionDialog(
    lecture: LectureItem,
    onDismiss: () -> Unit,
    onSubmit: (rating: DifficultyRating, timeSpent: Int, comprehension: String, mistakes: String, tricks: String) -> Unit
) {
    var rating by remember { mutableStateOf(lecture.lastRating ?: DifficultyRating.Medium) }
    var timeSpent by remember { mutableStateOf(20) }
    var comprehension by remember { mutableStateOf("पक्का") }
    var mistakes by remember { mutableStateOf(lecture.previousMistakes ?: "") }
    var tricks by remember { mutableStateOf(lecture.calculationTricks ?: "") }

    // Dynamic preview of next schedule
    val preview = RevisionEngine.calculateNextRevision(
        lecture = lecture.copy(step1Completed = true),
        rating = rating
    )

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.94f)
                .fillMaxHeight(0.88f),
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Top Bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "रिवीज़न सत्र (Active Revision)",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = AmberPrimary
                            )
                        )
                        Text(
                            text = lecture.title,
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold),
                            maxLines = 1
                        )
                        Text(
                            text = "${lecture.subject} • ${lecture.chapter}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 12.dp))

                // Scrollable Form Content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Next Due Preview Card
                    Surface(
                        color = AmberPrimary.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "अगला रिवीज़न तय होगा:",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = preview.nextDate,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = AmberPrimary
                                    )
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = AmberPrimary,
                                modifier = Modifier.padding(4.dp)
                            ) {
                                Text(
                                    text = preview.nextPhase,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.surface
                                    )
                                )
                            }
                        }
                    }

                    // Rating Selector
                    Text(
                        text = "इस रिवीज़न में समझ और गति कैसी रही?",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(
                            DifficultyRating.Easy to ("सरल\n(Easy)" to EmeraldGreen),
                            DifficultyRating.Medium to ("मध्यम\n(Good)" to AmberPrimary),
                            DifficultyRating.Hard to ("कठिन\n(Hard)" to RoseRed)
                        ).forEach { (r, pair) ->
                            val (label, col) = pair
                            val isSelected = rating == r
                            Surface(
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { rating = r },
                                shape = RoundedCornerShape(12.dp),
                                color = if (isSelected) col.copy(alpha = 0.2f) else MaterialTheme.colorScheme.surfaceVariant,
                                border = if (isSelected) androidx.compose.foundation.BorderStroke(1.5.dp, col) else null
                            ) {
                                Box(
                                    modifier = Modifier.padding(vertical = 12.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = label,
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                            color = if (isSelected) col else MaterialTheme.colorScheme.onSurface
                                        ),
                                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                                    )
                                }
                            }
                        }
                    }

                    // Time spent
                    Text(
                        text = "समय लगा (Minutes Spent)",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(10, 15, 20, 30, 45).forEach { mins ->
                            val isSelected = timeSpent == mins
                            FilterChip(
                                selected = isSelected,
                                onClick = { timeSpent = mins },
                                label = { Text("${mins}m") },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AmberPrimary.copy(alpha = 0.2f),
                                    selectedLabelColor = AmberPrimary
                                )
                            )
                        }
                    }

                    // Comprehension Level
                    Text(
                        text = "कमांड स्तर (Comprehension)",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("पक्का", "मध्यम", "अधूरा/कमजोर").forEach { comp ->
                            val isSelected = comprehension == comp
                            FilterChip(
                                selected = isSelected,
                                onClick = { comprehension = comp },
                                label = { Text(comp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = AmberPrimary.copy(alpha = 0.2f),
                                    selectedLabelColor = AmberPrimary
                                )
                            )
                        }
                    }

                    // Mistakes note
                    OutlinedTextField(
                        value = mistakes,
                        onValueChange = { mistakes = it },
                        label = { Text("कहाँ अटके या क्या गलती हुई? (Mistakes Log)") },
                        placeholder = { Text("उदा. कैलकुलेशन में साइन गलत हुआ...") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4
                    )

                    // Tricks note
                    OutlinedTextField(
                        value = tricks,
                        onValueChange = { tricks = it },
                        label = { Text("शॉर्टकट / स्पेशल ट्रिक (Speed Trick)") },
                        placeholder = { Text("उदा. ऑप्शन एलिमिनेशन या 100 मानकर हल...") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2,
                        maxLines = 4
                    )
                }

                // Actions Footer
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("रद्द करें")
                    }
                    Button(
                        onClick = {
                            onSubmit(rating, timeSpent, comprehension, mistakes, tricks)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("रिवीज़न पूर्ण करें ✓", color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
