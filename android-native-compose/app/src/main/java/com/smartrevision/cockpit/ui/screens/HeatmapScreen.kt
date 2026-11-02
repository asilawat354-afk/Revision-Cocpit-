package com.smartrevision.cockpit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed
import java.time.LocalDate

@Composable
fun HeatmapScreen(
    lectures: List<LectureItem>,
    onOpenDetail: (LectureItem) -> Unit,
    onStartRevision: (LectureItem) -> Unit
) {
    val today = remember { LocalDate.now() }
    var selectedDateStr by remember { mutableStateOf(today.toString()) }

    // Next 30 days
    val calendarDays = remember {
        (0 until 30).map { offset ->
            val date = today.plusDays(offset.toLong())
            date.toString() to date.dayOfMonth.toString()
        }
    }

    // Counts per date
    val countsMap = remember(lectures) {
        val map = mutableMapOf<String, Int>()
        lectures.forEach { l ->
            if (l.nextDueDate.isNotEmpty()) {
                map[l.nextDueDate] = (map[l.nextDueDate] ?: 0) + 1
            }
        }
        map
    }

    // Lectures for the selected date
    val selectedDayLectures = remember(lectures, selectedDateStr) {
        lectures.filter { it.nextDueDate == selectedDateStr }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "30-दिन लोड पूर्वानुमान (Heatmap Forecast)",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
            )
            Text(
                text = "आगामी 30 दिनों में किस दिन कितना रिवीज़न लोड है, इसका विज़ुअल विश्लेषण।",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // 30 Days Grid Card
        item {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 2.dp,
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "कैलेंडर ग्रिड (तारीख पर टैप करें):",
                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold)
                    )

                    // Grid of 30 days
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        calendarDays.chunked(6).forEach { row ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                row.forEach { (dateStr, dayNum) ->
                                    val count = countsMap[dateStr] ?: 0
                                    val isSelected = dateStr == selectedDateStr
                                    val isToday = dateStr == today.toString()

                                    val bgColor = when {
                                        count == 0 -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                                        count in 1..3 -> EmeraldGreen.copy(alpha = 0.25f)
                                        count in 4..7 -> AmberPrimary.copy(alpha = 0.35f)
                                        else -> RoseRed.copy(alpha = 0.45f)
                                    }

                                    Surface(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(48.dp)
                                            .clip(RoundedCornerShape(8.dp))
                                            .clickable { selectedDateStr = dateStr },
                                        color = bgColor,
                                        border = if (isSelected) androidx.compose.foundation.BorderStroke(2.dp, AmberPrimary)
                                        else if (isToday) androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.onSurface)
                                        else null
                                    ) {
                                        Column(
                                            modifier = Modifier.fillMaxSize(),
                                            horizontalAlignment = Alignment.CenterHorizontally,
                                            verticalArrangement = Arrangement.Center
                                        ) {
                                            Text(
                                                text = dayNum,
                                                fontSize = 12.sp,
                                                fontWeight = if (isToday) FontWeight.Bold else FontWeight.Medium
                                            )
                                            if (count > 0) {
                                                Text(
                                                    text = "$count",
                                                    fontSize = 10.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = if (count > 7) RoseRed else AmberPrimary
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Legend
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "लोड: 0 (रिक्त)", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(text = "1-3 (सामान्य)", fontSize = 10.sp, color = EmeraldGreen)
                        Text(text = "4-7 (सक्रिय)", fontSize = 10.sp, color = AmberPrimary)
                        Text(text = "8+ (ओवरलोड)", fontSize = 10.sp, color = RoseRed)
                    }
                }
            }
        }

        // Selected Date Lectures Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "चयनित तिथि: $selectedDateStr (${selectedDayLectures.size} लेक्चर्स)",
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold)
                )
            }
        }

        if (selectedDayLectures.isEmpty()) {
            item {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(modifier = Modifier.padding(20.dp), contentAlignment = Alignment.Center) {
                        Text(
                            text = "इस तारीख पर कोई रिवीज़न निर्धारित नहीं है।",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        } else {
            items(selectedDayLectures) { lec ->
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 1.dp,
                    border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { onOpenDetail(lec) }
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = lec.title,
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                            )
                            Text(
                                text = "${lec.subject} • ${lec.chapter}",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Button(
                            onClick = { onStartRevision(lec) },
                            colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text("रिवीज़न", fontSize = 11.sp, color = MaterialTheme.colorScheme.surface, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        item { Spacer(modifier = Modifier.height(72.dp)) }
    }
}
