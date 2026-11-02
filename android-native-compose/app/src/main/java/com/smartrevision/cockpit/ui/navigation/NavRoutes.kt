package com.smartrevision.cockpit.ui.navigation

import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.model.SubjectCatalogItem

enum class ScreenDestination(val title: String, val iconName: String) {
    COCKPIT("Cockpit", "Dashboard"),
    SUBJECTS("Subjects", "LibraryBooks"),
    DATABASE("Database", "TableChart"),
    HEATMAP("Forecast", "CalendarMonth"),
    VAULT("Debt Vault", "Warning")
}

sealed class NavigationState {
    data class MainScreen(val destination: ScreenDestination) : NavigationState()
    data class SubjectChapters(val subject: SubjectCatalogItem) : NavigationState()
    data class ChapterLectures(val subject: SubjectCatalogItem, val chapter: String) : NavigationState()
    data class LectureDetail(val lecture: LectureItem) : NavigationState()
}
