package com.smartrevision.cockpit.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayCircle
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.smartrevision.cockpit.data.CatalogData
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.model.SubjectCatalogItem
import com.smartrevision.cockpit.ui.theme.AmberPrimary

@Composable
fun CommandPaletteDialog(
    lectures: List<LectureItem>,
    onDismiss: () -> Unit,
    onSelectLecture: (LectureItem) -> Unit,
    onSelectChapter: (SubjectCatalogItem, String) -> Unit,
    onSelectSubject: (SubjectCatalogItem) -> Unit
) {
    var query by remember { mutableStateOf("") }

    val filteredLectures = remember(query, lectures) {
        if (query.isBlank()) emptyList()
        else lectures.filter {
            it.title.contains(query, ignoreCase = true) ||
            it.subject.contains(query, ignoreCase = true) ||
            it.chapter.contains(query, ignoreCase = true)
        }.take(10)
    }

    val filteredSubjects = remember(query) {
        if (query.isBlank()) emptyList()
        else CatalogData.ALL_SUBJECTS.filter {
            it.name.contains(query, ignoreCase = true) ||
            it.category.contains(query, ignoreCase = true)
        }.take(5)
    }

    val filteredChapters = remember(query) {
        if (query.isBlank()) emptyList()
        else {
            val list = mutableListOf<Pair<SubjectCatalogItem, String>>()
            for (sub in CatalogData.ALL_SUBJECTS) {
                for (ch in sub.chapters) {
                    if (ch.contains(query, ignoreCase = true)) {
                        list.add(sub to ch)
                        if (list.size >= 10) break
                    }
                }
                if (list.size >= 10) break
            }
            list
        }
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.85f),
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Search Input
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    placeholder = { Text("खोजें (लेक्चर, अध्याय, विषय)...") },
                    leadingIcon = {
                        Icon(imageVector = Icons.Default.Search, contentDescription = "Search", tint = AmberPrimary)
                    },
                    trailingIcon = {
                        IconButton(onClick = onDismiss) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                        }
                    },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Results list
                if (query.isBlank()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(text = "🔍", fontSize = 36.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "किसी भी विषय, अध्याय या लेक्चर का नाम लिखें",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                } else if (filteredLectures.isEmpty() && filteredChapters.isEmpty() && filteredSubjects.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "'$query' के लिए कोई परिणाम नहीं मिला",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Matching Lectures
                        if (filteredLectures.isNotEmpty()) {
                            item {
                                Text(
                                    text = "लेक्चर्स (${filteredLectures.size})",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = AmberPrimary,
                                        fontWeight = FontWeight.Bold
                                    ),
                                    modifier = Modifier.padding(vertical = 4.dp)
                                )
                            }
                            items(filteredLectures) { lec ->
                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(10.dp))
                                        .clickable {
                                            onSelectLecture(lec)
                                            onDismiss()
                                        },
                                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.PlayCircle,
                                            contentDescription = null,
                                            tint = AmberPrimary,
                                            modifier = Modifier.size(24.dp)
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
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
                                    }
                                }
                            }
                        }

                        // Matching Chapters
                        if (filteredChapters.isNotEmpty()) {
                            item {
                                Text(
                                    text = "अध्याय (${filteredChapters.size})",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = AmberPrimary,
                                        fontWeight = FontWeight.Bold
                                    ),
                                    modifier = Modifier.padding(vertical = 4.dp)
                                )
                            }
                            items(filteredChapters) { (sub, ch) ->
                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(10.dp))
                                        .clickable {
                                            onSelectChapter(sub, ch)
                                            onDismiss()
                                        },
                                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Book,
                                            contentDescription = null,
                                            tint = MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.size(22.dp)
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = ch,
                                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                                            )
                                            Text(
                                                text = sub.name,
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        // Matching Subjects
                        if (filteredSubjects.isNotEmpty()) {
                            item {
                                Text(
                                    text = "विषय (${filteredSubjects.size})",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = AmberPrimary,
                                        fontWeight = FontWeight.Bold
                                    ),
                                    modifier = Modifier.padding(vertical = 4.dp)
                                )
                            }
                            items(filteredSubjects) { sub ->
                                Surface(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(10.dp))
                                        .clickable {
                                            onSelectSubject(sub)
                                            onDismiss()
                                        },
                                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = "📚", fontSize = 20.sp)
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = sub.name,
                                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                                            )
                                            Text(
                                                text = "${sub.category} • ${sub.chapters.size} अध्याय",
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
