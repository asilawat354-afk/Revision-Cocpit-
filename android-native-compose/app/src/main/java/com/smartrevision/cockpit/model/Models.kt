package com.smartrevision.cockpit.model

import java.io.Serializable

enum class DifficultyRating {
    Easy, Medium, Hard
}

data class ReferenceLink(
    val id: String = "",
    val title: String = "",
    val url: String = ""
) : Serializable

data class RevisionLogEntry(
    val id: String = "",
    val attemptNumber: Int = 1,
    val date: String = "",
    val timeSpentMinutes: Int = 0,
    val difficultyRating: DifficultyRating? = null,
    val comprehensionLevel: String = "पक्का",
    val mistakes: String = "",
    val tricks: String = "",
    val links: List<ReferenceLink> = emptyList(),
    val isHidden: Boolean = false
) : Serializable

data class LectureItem(
    val id: String = "",
    val addedDate: String = "",
    val subject: String = "",
    val chapter: String = "",
    val lectureNumber: Int = 1,
    val title: String = "",
    val step1Completed: Boolean = false,
    val step2Completed: Boolean = false,
    val revisionCount: Int = 0,
    val lastRevisionDate: String? = null,
    val lastRating: DifficultyRating? = null,
    val nextDueDate: String = "",
    val minTimeMinutes: Int = 15,
    val avgTimeMinutes: Int = 20,
    val maxTimeMinutes: Int = 30,
    val status: String = "due_today", // "due_today", "active", "completed", "archived", "not_started"
    val previousMistakes: String? = null,
    val calculationTricks: String? = null,
    val conceptNotes: String? = null,
    val formulaNotes: String? = null,
    val geminiDoubts: String? = null,
    val referenceLinks: List<ReferenceLink> = emptyList(),
    val revisionLogs: List<RevisionLogEntry> = emptyList(),
    val archivedReason: String? = null
) : Serializable

data class CockpitConfig(
    val dailyQuota: Int = 5,
    val vacationMode: Boolean = false,
    val vacationStartDate: String? = null,
    val vacationDaysCount: Int = 1,
    val autoLevelThreshold: Int = 8
) : Serializable

data class ChapterCatalogItem(
    val name: String,
    val lectureCount: Int
) : Serializable

data class SubjectCatalogItem(
    val id: String,
    val name: String,
    val category: String,
    val chapters: List<String>
) : Serializable
