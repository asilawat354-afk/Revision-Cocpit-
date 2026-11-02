package com.smartrevision.cockpit.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed

@Composable
fun DebtVaultScreen(
    lectures: List<LectureItem>,
    onOpenDetail: (LectureItem) -> Unit,
    onStartRevision: (LectureItem) -> Unit,
    onQuickRate: (LectureItem, DifficultyRating) -> Unit
) {
    val debtLectures = lectures.filter {
        it.lastRating == DifficultyRating.Hard ||
        !it.previousMistakes.isNullOrBlank() ||
        it.revisionCount == 0
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = Icons.Default.Warning, contentDescription = null, tint = AmberPrimary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "डेब्ट व मिस्टेक्स वॉल्ट (Debt Vault)",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            }
            Text(
                text = "कठिन टॉपिक्स, गलतियों के नोट्स और वो लेक्चर्स जहाँ अतिरिक्त अभ्यास आवश्यक है।",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        if (debtLectures.isEmpty()) {
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
                        Text(text = "🛡️", fontSize = 36.sp)
                        Text(
                            text = "वॉल्ट पूरी तरह सुरक्षित व साफ है!",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )
                        Text(
                            text = "कोई भी टॉपिक 'कठिन' श्रेणी में नहीं है। आपकी तैयारी सही दिशा में है।",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        } else {
            items(debtLectures) { lec ->
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 2.dp,
                    border = androidx.compose.foundation.BorderStroke(1.dp, RoseRed.copy(alpha = 0.3f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .clickable { onOpenDetail(lec) }
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "${lec.subject} • ${lec.chapter}",
                                style = MaterialTheme.typography.bodySmall.copy(color = AmberPrimary, fontWeight = FontWeight.SemiBold)
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = RoseRed.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = if (lec.lastRating == DifficultyRating.Hard) "कठिन (Hard)" else "समीक्षा योग्य",
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    style = MaterialTheme.typography.labelSmall.copy(color = RoseRed, fontWeight = FontWeight.Bold)
                                )
                            }
                        }

                        Text(
                            text = lec.title,
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                        )

                        // Mistake preview
                        if (!lec.previousMistakes.isNullOrBlank()) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = RoseRed.copy(alpha = 0.08f),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "⚠️ पिछली गलती: ${lec.previousMistakes}",
                                    modifier = Modifier.padding(8.dp),
                                    fontSize = 11.sp,
                                    color = RoseRed
                                )
                            }
                        }

                        // Trick preview
                        if (!lec.calculationTricks.isNullOrBlank()) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = AmberPrimary.copy(alpha = 0.08f),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(
                                    text = "⚡ शॉर्ट ट्रिक: ${lec.calculationTricks}",
                                    modifier = Modifier.padding(8.dp),
                                    fontSize = 11.sp,
                                    color = AmberPrimary
                                )
                            }
                        }

                        // Actions
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            TextButton(onClick = { onQuickRate(lec, DifficultyRating.Medium) }) {
                                Text("मध्यम पर शिफ्ट करें", fontSize = 11.sp, color = AmberPrimary)
                            }

                            Button(
                                onClick = { onStartRevision(lec) },
                                colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.surface)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("अभ्यास करें", fontSize = 11.sp, color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(72.dp)) }
    }
}
