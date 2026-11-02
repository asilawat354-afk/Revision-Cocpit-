package com.smartrevision.cockpit.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.smartrevision.cockpit.data.CatalogData
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.EmeraldGreen
import com.smartrevision.cockpit.ui.theme.RoseRed

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddLectureDialog(
    initialSubject: String? = null,
    initialChapter: String? = null,
    onDismiss: () -> Unit,
    onAdd: (subject: String, chapter: String, title: String, lectureNumber: Int, rating: DifficultyRating) -> Unit
) {
    var subject by remember { mutableStateOf(initialSubject ?: "Maths- (Arithmetic)") }
    var chapter by remember { mutableStateOf(initialChapter ?: "") }
    var title by remember { mutableStateOf("") }
    var lectureNumber by remember { mutableStateOf("1") }
    var selectedRating by remember { mutableStateOf(DifficultyRating.Medium) }

    var subjectMenuExpanded by remember { mutableStateOf(false) }
    var chapterMenuExpanded by remember { mutableStateOf(false) }

    val currentSubjectCatalog = CatalogData.ALL_SUBJECTS.find { it.name.equals(subject, ignoreCase = true) }
    val availableChapters = currentSubjectCatalog?.chapters ?: emptyList()

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .wrapContentHeight(),
            shape = RoundedCornerShape(18.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "नया लेक्चर जोड़ें",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                // Subject Selection
                ExposedDropdownMenuBox(
                    expanded = subjectMenuExpanded,
                    onExpandedChange = { subjectMenuExpanded = !subjectMenuExpanded }
                ) {
                    OutlinedTextField(
                        value = subject,
                        onValueChange = { subject = it },
                        label = { Text("विषय (Subject)") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = subjectMenuExpanded) },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth(),
                        colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                    )
                    ExposedDropdownMenu(
                        expanded = subjectMenuExpanded,
                        onDismissRequest = { subjectMenuExpanded = false }
                    ) {
                        CatalogData.ALL_SUBJECTS.forEach { s ->
                            DropdownMenuItem(
                                text = { Text(s.name) },
                                onClick = {
                                    subject = s.name
                                    chapter = s.chapters.firstOrNull() ?: ""
                                    subjectMenuExpanded = false
                                }
                            )
                        }
                    }
                }

                // Chapter Selection
                if (availableChapters.isNotEmpty()) {
                    ExposedDropdownMenuBox(
                        expanded = chapterMenuExpanded,
                        onExpandedChange = { chapterMenuExpanded = !chapterMenuExpanded }
                    ) {
                        OutlinedTextField(
                            value = chapter,
                            onValueChange = { chapter = it },
                            label = { Text("अध्याय (Chapter)") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = chapterMenuExpanded) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth(),
                            colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors()
                        )
                        ExposedDropdownMenu(
                            expanded = chapterMenuExpanded,
                            onDismissRequest = { chapterMenuExpanded = false }
                        ) {
                            availableChapters.forEach { ch ->
                                DropdownMenuItem(
                                    text = { Text(ch) },
                                    onClick = {
                                        chapter = ch
                                        chapterMenuExpanded = false
                                    }
                                )
                            }
                        }
                    }
                } else {
                    OutlinedTextField(
                        value = chapter,
                        onValueChange = { chapter = it },
                        label = { Text("अध्याय (Chapter)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                // Title
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("लेक्चर का नाम या टॉपिक") },
                    placeholder = { Text("उदा. अनुपात व समानुपात बेसिक") },
                    modifier = Modifier.fillMaxWidth()
                )

                // Lecture Number
                OutlinedTextField(
                    value = lectureNumber,
                    onValueChange = { lectureNumber = it },
                    label = { Text("लेक्चर नंबर") },
                    modifier = Modifier.fillMaxWidth()
                )

                // Difficulty Rating
                Text(
                    text = "कठिनाई स्तर (Difficulty)",
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(
                        DifficultyRating.Easy to "सरल (Easy)",
                        DifficultyRating.Medium to "मध्यम (Medium)",
                        DifficultyRating.Hard to "कठिन (Hard)"
                    ).forEach { (rate, label) ->
                        val isSelected = selectedRating == rate
                        val color = when (rate) {
                            DifficultyRating.Easy -> EmeraldGreen
                            DifficultyRating.Medium -> AmberPrimary
                            DifficultyRating.Hard -> RoseRed
                        }
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedRating = rate },
                            label = { Text(label, fontSize = 12.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = color.copy(alpha = 0.2f),
                                selectedLabelColor = color
                            ),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Actions
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("रद्द करें")
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            val finalTitle = title.ifBlank { "$chapter - Lecture $lectureNumber" }
                            val lecNum = lectureNumber.toIntOrNull() ?: 1
                            onAdd(subject, chapter, finalTitle, lecNum, selectedRating)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary)
                    ) {
                        Text("जोड़ें (Add Lecture)", color = MaterialTheme.colorScheme.surface)
                    }
                }
            }
        }
    }
}
