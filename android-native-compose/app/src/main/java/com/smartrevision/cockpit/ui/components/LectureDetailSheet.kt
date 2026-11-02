package com.smartrevision.cockpit.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed

@Composable
fun LectureDetailSheet(
    lecture: LectureItem,
    onDismiss: () -> Unit,
    onStartRevision: (LectureItem) -> Unit,
    onToggleStep: (LectureItem, Int) -> Unit,
    onDelete: (String) -> Unit
) {
    var showDeleteConfirm by remember { mutableStateOf(false) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.90f),
            shape = RoundedCornerShape(22.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "${lecture.subject} • ${lecture.chapter}",
                            style = MaterialTheme.typography.bodySmall,
                            color = AmberPrimary,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = lecture.title,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 17.sp
                            ),
                            maxLines = 2
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 10.dp))

                // Scrollable Content
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    // Status & Summary Metrics Card
                    Surface(
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(text = "स्थिति (Status):", style = MaterialTheme.typography.bodySmall)
                                Text(
                                    text = if (lecture.status == "due_today") "आज रिवीज़न बाकी (Due Today)" else "सक्रिय (Active)",
                                    fontWeight = FontWeight.Bold,
                                    color = if (lecture.status == "due_today") RoseRed else EmeraldGreen
                                )
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(text = "अगला रिवीज़न (Due Date):", style = MaterialTheme.typography.bodySmall)
                                Text(
                                    text = lecture.nextDueDate.ifEmpty { "तय नहीं" },
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(text = "कुल रिवीज़न चक्र (Count):", style = MaterialTheme.typography.bodySmall)
                                Text(
                                    text = "${lecture.revisionCount} बार",
                                    fontWeight = FontWeight.Bold,
                                    color = AmberPrimary
                                )
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(text = "अंतिम रेटिंग (Last Rating):", style = MaterialTheme.typography.bodySmall)
                                val ratingColor = when (lecture.lastRating) {
                                    DifficultyRating.Easy -> EmeraldGreen
                                    DifficultyRating.Hard -> RoseRed
                                    else -> AmberPrimary
                                }
                                Text(
                                    text = lecture.lastRating?.name ?: "दर्ज नहीं",
                                    fontWeight = FontWeight.Bold,
                                    color = ratingColor
                                )
                            }
                        }
                    }

                    // 2-Step Foundation Spaced Repetition Checklist
                    Text(
                        text = "फाउंडेशन चक्र (2-Step Spaced Repetition)",
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Step 1
                        Surface(
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onToggleStep(lecture, 1) },
                            shape = RoundedCornerShape(12.dp),
                            color = if (lecture.step1Completed) EmeraldGreen.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                            border = if (lecture.step1Completed) androidx.compose.foundation.BorderStroke(1.dp, EmeraldGreen) else null
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = if (lecture.step1Completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                    contentDescription = null,
                                    tint = if (lecture.step1Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text(
                                        text = "स्टेप 1 (24h)",
                                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                                    )
                                    Text(
                                        text = if (lecture.step1Completed) "पूर्ण ✓" else "बाकी",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = if (lecture.step1Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }

                        // Step 2
                        Surface(
                            modifier = Modifier
                                .weight(1f)
                                .clickable { onToggleStep(lecture, 2) },
                            shape = RoundedCornerShape(12.dp),
                            color = if (lecture.step2Completed) EmeraldGreen.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant,
                            border = if (lecture.step2Completed) androidx.compose.foundation.BorderStroke(1.dp, EmeraldGreen) else null
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = if (lecture.step2Completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                    contentDescription = null,
                                    tint = if (lecture.step2Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text(
                                        text = "स्टेप 2 (3d)",
                                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                                    )
                                    Text(
                                        text = if (lecture.step2Completed) "पूर्ण ✓" else "बाकी",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = if (lecture.step2Completed) EmeraldGreen else MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }

                    // Notes Section
                    if (!lecture.conceptNotes.isNullOrBlank()) {
                        Text(text = "📝 मुख्य नोट्स (Key Notes)", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold))
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = lecture.conceptNotes,
                                modifier = Modifier.padding(12.dp),
                                style = MaterialTheme.typography.bodyMedium
                            )
                        }
                    }

                    // Calculation Tricks Section
                    if (!lecture.calculationTricks.isNullOrBlank()) {
                        Text(text = "⚡ शॉर्टकट व ट्रिक्स (Tricks)", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold))
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = AmberPrimary.copy(alpha = 0.1f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = lecture.calculationTricks,
                                modifier = Modifier.padding(12.dp),
                                style = MaterialTheme.typography.bodyMedium.copy(color = AmberPrimary)
                            )
                        }
                    }

                    // Previous Mistakes Section
                    if (!lecture.previousMistakes.isNullOrBlank()) {
                        Text(text = "⚠️ गलतियों का रिकॉर्ड (Mistakes Log)", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold))
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = RoseRed.copy(alpha = 0.1f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = lecture.previousMistakes,
                                modifier = Modifier.padding(12.dp),
                                style = MaterialTheme.typography.bodyMedium.copy(color = RoseRed)
                            )
                        }
                    }

                    // Revision Logs History
                    if (lecture.revisionLogs.isNotEmpty()) {
                        Text(text = "📜 रिवीज़न इतिहास (${lecture.revisionLogs.size})", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold))
                        lecture.revisionLogs.forEach { log ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(10.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(text = "सत्र #${log.attemptNumber} • ${log.date}", fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                                        Text(text = "${log.timeSpentMinutes} मिनट • समझ: ${log.comprehensionLevel}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    log.difficultyRating?.let { r ->
                                        val color = when (r) {
                                            DifficultyRating.Easy -> EmeraldGreen
                                            DifficultyRating.Hard -> RoseRed
                                            else -> AmberPrimary
                                        }
                                        Text(text = r.name, color = color, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 10.dp))

                // Bottom Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = { showDeleteConfirm = true }) {
                        Icon(imageVector = Icons.Default.Delete, contentDescription = "Delete", tint = RoseRed)
                    }

                    Button(
                        onClick = {
                            onDismiss()
                            onStartRevision(lecture)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, tint = MaterialTheme.colorScheme.surface)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "रिवीज़न शुरू करें", color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }

    if (showDeleteConfirm) {
        AlertDialog(
            onDismissRequest = { showDeleteConfirm = false },
            title = { Text("लेक्चर हटाएं?") },
            text = { Text("क्या आप सचमुच '${lecture.title}' को हटाना चाहते हैं?") },
            confirmButton = {
                TextButton(onClick = {
                    showDeleteConfirm = false
                    onDelete(lecture.id)
                }) {
                    Text("हाँ, हटाएं", color = RoseRed, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteConfirm = false }) {
                    Text("रद्द करें")
                }
            }
        )
    }
}
