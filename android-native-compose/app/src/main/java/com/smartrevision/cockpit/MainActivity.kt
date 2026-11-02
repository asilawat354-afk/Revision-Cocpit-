package com.smartrevision.cockpit

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.ui.components.*
import com.smartrevision.cockpit.ui.navigation.ScreenDestination
import com.smartrevision.cockpit.ui.screens.*
import com.smartrevision.cockpit.ui.theme.SmartRevisionTheme
import com.smartrevision.cockpit.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SmartRevisionTheme {
                val viewModel: MainViewModel = viewModel()

                // Global System Back Handler
                BackHandler {
                    val handled = viewModel.handleBackPress()
                    if (!handled) {
                        finish()
                    }
                }

                MainAppContent(
                    viewModel = viewModel,
                    onSystemExit = { finish() }
                )
            }
        }
    }
}

@Composable
fun MainAppContent(
    viewModel: MainViewModel,
    onSystemExit: () -> Unit
) {
    val currentDestination by viewModel.currentDestination.collectAsState()
    val lectures by viewModel.lectures.collectAsState()
    val config by viewModel.config.collectAsState()

    val selectedSubject by viewModel.selectedSubject.collectAsState()
    val selectedChapter by viewModel.selectedChapter.collectAsState()

    val detailLecture by viewModel.detailLecture.collectAsState()
    val revisionSessionLecture by viewModel.revisionSessionLecture.collectAsState()
    val isAddLectureOpen by viewModel.isAddLectureOpen.collectAsState()
    val addLectureDefaults by viewModel.addLectureDefaults.collectAsState()
    val isSearchOpen by viewModel.isSearchOpen.collectAsState()
    val isSettingsOpen by viewModel.isSettingsOpen.collectAsState()
    val isEcosystemOpen by viewModel.isEcosystemOpen.collectAsState()
    val activeEcosystem by viewModel.activeEcosystem.collectAsState()

    val dueTodayCount = lectures.count { it.status == "due_today" }
    val vaultCount = lectures.count { it.lastRating == DifficultyRating.Hard || !it.previousMistakes.isNullOrBlank() }

    Scaffold(
        topBar = {
            AppTopBar(
                currentDestination = currentDestination,
                selectedSubject = selectedSubject,
                selectedChapter = selectedChapter,
                activeEcosystem = activeEcosystem,
                onBackClick = { viewModel.handleBackPress() },
                onSearchClick = { viewModel.openSearch() },
                onSettingsClick = { viewModel.openSettings() },
                onEcosystemClick = { viewModel.openEcosystem() }
            )
        },
        bottomBar = {
            AppBottomBar(
                currentDestination = currentDestination,
                dueCount = dueTodayCount,
                vaultCount = vaultCount,
                onNavigate = { dest -> viewModel.navigateToTab(dest) }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentDestination) {
                ScreenDestination.COCKPIT -> {
                    CockpitScreen(
                        lectures = lectures,
                        config = config,
                        onStartRevision = { lec -> viewModel.openRevisionSession(lec) },
                        onOpenDetail = { lec -> viewModel.openLectureDetail(lec) },
                        onToggleStep = { lec, step -> viewModel.toggleFoundationStep(lec.id, step) },
                        onQuickRate = { lec, rate -> viewModel.quickRate(lec.id, rate) },
                        onOpenAddLecture = { viewModel.openAddLecture() }
                    )
                }
                ScreenDestination.SUBJECTS -> {
                    SubjectsDirectoryScreen(
                        lectures = lectures,
                        selectedSubject = selectedSubject,
                        selectedChapter = selectedChapter,
                        onSelectSubject = { sub -> viewModel.openSubjectChapters(sub) },
                        onSelectChapter = { sub, ch -> viewModel.openChapterLectures(sub, ch) },
                        onBack = { viewModel.handleBackPress() },
                        onOpenAddLecture = { sub, ch -> viewModel.openAddLecture(sub, ch) },
                        onOpenDetail = { lec -> viewModel.openLectureDetail(lec) },
                        onStartRevision = { lec -> viewModel.openRevisionSession(lec) },
                        onToggleStep = { lec, step -> viewModel.toggleFoundationStep(lec.id, step) }
                    )
                }
                ScreenDestination.DATABASE -> {
                    MasterDatabaseScreen(
                        lectures = lectures,
                        onOpenDetail = { lec -> viewModel.openLectureDetail(lec) },
                        onStartRevision = { lec -> viewModel.openRevisionSession(lec) },
                        onQuickRate = { lec, rate -> viewModel.quickRate(lec.id, rate) },
                        onDelete = { id -> viewModel.deleteLecture(id) },
                        onOpenAddLecture = { viewModel.openAddLecture() }
                    )
                }
                ScreenDestination.HEATMAP -> {
                    HeatmapScreen(
                        lectures = lectures,
                        onOpenDetail = { lec -> viewModel.openLectureDetail(lec) },
                        onStartRevision = { lec -> viewModel.openRevisionSession(lec) }
                    )
                }
                ScreenDestination.VAULT -> {
                    DebtVaultScreen(
                        lectures = lectures,
                        onOpenDetail = { lec -> viewModel.openLectureDetail(lec) },
                        onStartRevision = { lec -> viewModel.openRevisionSession(lec) },
                        onQuickRate = { lec, rate -> viewModel.quickRate(lec.id, rate) }
                    )
                }
            }
        }
    }

    // ==========================================
    // Modals, Dialogs and Sheets Overlays
    // ==========================================

    if (isAddLectureOpen) {
        AddLectureDialog(
            initialSubject = addLectureDefaults?.first,
            initialChapter = addLectureDefaults?.second,
            onDismiss = { viewModel.closeAddLecture() },
            onAdd = { subject, chapter, title, lecNum, rating ->
                viewModel.addNewLecture(subject, chapter, title, lecNum, rating)
            }
        )
    }

    revisionSessionLecture?.let { lec ->
        RevisionSessionDialog(
            lecture = lec,
            onDismiss = { viewModel.closeRevisionSession() },
            onSubmit = { rating, timeSpent, comp, mistakes, tricks ->
                viewModel.completeRevision(lec.id, rating, timeSpent, comp, mistakes, tricks)
            }
        )
    }

    detailLecture?.let { lec ->
        LectureDetailSheet(
            lecture = lec,
            onDismiss = { viewModel.closeLectureDetail() },
            onStartRevision = { l -> viewModel.openRevisionSession(l) },
            onToggleStep = { l, step -> viewModel.toggleFoundationStep(l.id, step) },
            onDelete = { id -> viewModel.deleteLecture(id) }
        )
    }

    if (isSearchOpen) {
        CommandPaletteDialog(
            lectures = lectures,
            onDismiss = { viewModel.closeSearch() },
            onSelectLecture = { lec ->
                viewModel.closeSearch()
                viewModel.openLectureDetail(lec)
            },
            onSelectChapter = { sub, ch ->
                viewModel.closeSearch()
                viewModel.navigateToTab(ScreenDestination.SUBJECTS)
                viewModel.openChapterLectures(sub, ch)
            },
            onSelectSubject = { sub ->
                viewModel.closeSearch()
                viewModel.navigateToTab(ScreenDestination.SUBJECTS)
                viewModel.openSubjectChapters(sub)
            }
        )
    }

    if (isSettingsOpen) {
        SettingsDialog(
            config = config,
            onDismiss = { viewModel.closeSettings() },
            onSaveConfig = { newConfig -> viewModel.updateConfig(newConfig) },
            onApplyVacation = { days -> viewModel.applyVacationMode(days) },
            onApplyAutoLevel = { viewModel.applyAutoLevel() }
        )
    }

    if (isEcosystemOpen) {
        EcosystemDialog(
            currentEcosystem = activeEcosystem,
            onDismiss = { viewModel.closeEcosystem() },
            onSelect = { eco -> viewModel.selectEcosystem(eco) }
        )
    }
}
