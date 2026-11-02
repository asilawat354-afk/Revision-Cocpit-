package com.smartrevision.cockpit.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.smartrevision.cockpit.data.CatalogData
import com.smartrevision.cockpit.engine.RevisionEngine
import com.smartrevision.cockpit.model.CockpitConfig
import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import com.smartrevision.cockpit.model.RevisionLogEntry
import com.smartrevision.cockpit.model.SubjectCatalogItem
import com.smartrevision.cockpit.storage.AppPreferences
import com.smartrevision.cockpit.ui.navigation.NavigationState
import com.smartrevision.cockpit.ui.navigation.ScreenDestination
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.util.UUID

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val prefs = AppPreferences(application.applicationContext)

    // Data State
    private val _lectures = MutableStateFlow<List<LectureItem>>(emptyList())
    val lectures: StateFlow<List<LectureItem>> = _lectures.asStateFlow()

    private val _config = MutableStateFlow(CockpitConfig())
    val config: StateFlow<CockpitConfig> = _config.asStateFlow()

    // Navigation Stack State
    private val _currentDestination = MutableStateFlow(ScreenDestination.COCKPIT)
    val currentDestination: StateFlow<ScreenDestination> = _currentDestination.asStateFlow()

    private val _navStack = MutableStateFlow<List<NavigationState>>(listOf(NavigationState.MainScreen(ScreenDestination.COCKPIT)))
    val navStack: StateFlow<List<NavigationState>> = _navStack.asStateFlow()

    // Active Subject / Chapter for Directory View
    private val _selectedSubject = MutableStateFlow<SubjectCatalogItem?>(null)
    val selectedSubject: StateFlow<SubjectCatalogItem?> = _selectedSubject.asStateFlow()

    private val _selectedChapter = MutableStateFlow<String?>(null)
    val selectedChapter: StateFlow<String?> = _selectedChapter.asStateFlow()

    // Active Overlays and Dialogs
    private val _detailLecture = MutableStateFlow<LectureItem?>(null)
    val detailLecture: StateFlow<LectureItem?> = _detailLecture.asStateFlow()

    private val _revisionSessionLecture = MutableStateFlow<LectureItem?>(null)
    val revisionSessionLecture: StateFlow<LectureItem?> = _revisionSessionLecture.asStateFlow()

    private val _isAddLectureOpen = MutableStateFlow(false)
    val isAddLectureOpen: StateFlow<Boolean> = _isAddLectureOpen.asStateFlow()

    private val _addLectureDefaults = MutableStateFlow<Pair<String, String>?>(null)
    val addLectureDefaults: StateFlow<Pair<String, String>?> = _addLectureDefaults.asStateFlow()

    private val _isSearchOpen = MutableStateFlow(false)
    val isSearchOpen: StateFlow<Boolean> = _isSearchOpen.asStateFlow()

    private val _isSettingsOpen = MutableStateFlow(false)
    val isSettingsOpen: StateFlow<Boolean> = _isSettingsOpen.asStateFlow()

    private val _isEcosystemOpen = MutableStateFlow(false)
    val isEcosystemOpen: StateFlow<Boolean> = _isEcosystemOpen.asStateFlow()

    private val _activeEcosystem = MutableStateFlow("SSC CGL / Govt Exams")
    val activeEcosystem: StateFlow<String> = _activeEcosystem.asStateFlow()

    // Filters and Search
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _filterSubject = MutableStateFlow<String?>(null)
    val filterSubject: StateFlow<String?> = _filterSubject.asStateFlow()

    private val _filterStatus = MutableStateFlow<String?>(null)
    val filterStatus: StateFlow<String?> = _filterStatus.asStateFlow()

    private val _quickNotes = MutableStateFlow("")
    val quickNotes: StateFlow<String> = _quickNotes.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        val loaded = prefs.loadLectures()
        _lectures.value = loaded
        _config.value = prefs.loadConfig()
        _quickNotes.value = prefs.loadQuickNotes()
    }

    private fun persistLectures(updated: List<LectureItem>) {
        _lectures.value = updated
        viewModelScope.launch {
            prefs.saveLectures(updated)
        }
    }

    // ==========================================
    // Centralized Navigation & Global Back Logic
    // ==========================================

    fun navigateToTab(destination: ScreenDestination) {
        _currentDestination.value = destination
        _selectedSubject.value = null
        _selectedChapter.value = null
        _navStack.value = listOf(NavigationState.MainScreen(destination))
    }

    fun openSubjectChapters(subject: SubjectCatalogItem) {
        _selectedSubject.value = subject
        _selectedChapter.value = null
        val newStack = _navStack.value.toMutableList()
        newStack.add(NavigationState.SubjectChapters(subject))
        _navStack.value = newStack
    }

    fun openChapterLectures(subject: SubjectCatalogItem, chapter: String) {
        _selectedSubject.value = subject
        _selectedChapter.value = chapter
        val newStack = _navStack.value.toMutableList()
        newStack.add(NavigationState.ChapterLectures(subject, chapter))
        _navStack.value = newStack
    }

    fun openLectureDetail(lecture: LectureItem) {
        _detailLecture.value = lecture
    }

    fun closeLectureDetail() {
        _detailLecture.value = null
    }

    fun openRevisionSession(lecture: LectureItem) {
        _revisionSessionLecture.value = lecture
    }

    fun closeRevisionSession() {
        _revisionSessionLecture.value = null
    }

    fun openAddLecture(subject: String? = null, chapter: String? = null) {
        if (subject != null || chapter != null) {
            _addLectureDefaults.value = Pair(subject ?: "", chapter ?: "")
        } else {
            _addLectureDefaults.value = null
        }
        _isAddLectureOpen.value = true
    }

    fun closeAddLecture() {
        _isAddLectureOpen.value = false
        _addLectureDefaults.value = null
    }

    fun openSearch() {
        _isSearchOpen.value = true
    }

    fun closeSearch() {
        _isSearchOpen.value = false
        _searchQuery.value = ""
    }

    fun openSettings() {
        _isSettingsOpen.value = true
    }

    fun closeSettings() {
        _isSettingsOpen.value = false
    }

    fun openEcosystem() {
        _isEcosystemOpen.value = true
    }

    fun closeEcosystem() {
        _isEcosystemOpen.value = false
    }

    fun selectEcosystem(name: String) {
        _activeEcosystem.value = name
        closeEcosystem()
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setFilterSubject(subj: String?) {
        _filterSubject.value = subj
    }

    fun setFilterStatus(status: String?) {
        _filterStatus.value = status
    }

    /**
     * Global Back Handler:
     * 1. Closes topmost overlay/dialog
     * 2. Returns from Grandchild -> Child -> Root
     * 3. Returns to Cockpit if on another tab
     * Returns true if handled internally, false if app can exit.
     */
    fun handleBackPress(): Boolean {
        // 1. Deepest Dialogs
        if (_isSearchOpen.value) {
            closeSearch()
            return true
        }
        if (_isSettingsOpen.value) {
            closeSettings()
            return true
        }
        if (_isEcosystemOpen.value) {
            closeEcosystem()
            return true
        }
        if (_isAddLectureOpen.value) {
            closeAddLecture()
            return true
        }
        if (_revisionSessionLecture.value != null) {
            closeRevisionSession()
            return true
        }
        if (_detailLecture.value != null) {
            closeLectureDetail()
            return true
        }

        // 2. Hierarchical Navigation Stack (Level 3 -> Level 2 -> Level 1)
        if (_selectedChapter.value != null) {
            // In chapter lectures -> go back to chapter list
            _selectedChapter.value = null
            popNavStack()
            return true
        }
        if (_selectedSubject.value != null) {
            // In subject chapters -> go back to all subjects
            _selectedSubject.value = null
            popNavStack()
            return true
        }

        val stack = _navStack.value
        if (stack.size > 1) {
            val popped = stack.dropLast(1)
            _navStack.value = popped
            return true
        }

        // 3. Fallback to Cockpit if on another root tab
        if (_currentDestination.value != ScreenDestination.COCKPIT) {
            navigateToTab(ScreenDestination.COCKPIT)
            return true
        }

        return false
    }

    private fun popNavStack() {
        val stack = _navStack.value
        if (stack.size > 1) {
            _navStack.value = stack.dropLast(1)
        }
    }

    // ==========================================
    // Lecture Actions & Spaced Repetition Engine
    // ==========================================

    fun completeRevision(
        lectureId: String,
        rating: DifficultyRating,
        timeSpentMinutes: Int,
        comprehension: String = "पक्का",
        mistakes: String = "",
        tricks: String = ""
    ) {
        val todayStr = LocalDate.now().toString()
        val currentList = _lectures.value.toMutableList()
        val idx = currentList.indexOfFirst { it.id == lectureId }
        if (idx == -1) return

        val lecture = currentList[idx]
        val step1 = true
        val step2 = lecture.step1Completed // if step 1 was done, now step 2 is done

        val nextSchedule = RevisionEngine.calculateNextRevision(
            lecture = lecture.copy(step1Completed = step1, step2Completed = step2),
            rating = rating,
            baseDate = todayStr
        )

        val newLog = RevisionLogEntry(
            id = UUID.randomUUID().toString(),
            attemptNumber = lecture.revisionCount + 1,
            date = todayStr,
            timeSpentMinutes = timeSpentMinutes,
            difficultyRating = rating,
            comprehensionLevel = comprehension,
            mistakes = mistakes.ifBlank { lecture.previousMistakes ?: "" },
            tricks = tricks.ifBlank { lecture.calculationTricks ?: "" }
        )

        val updated = lecture.copy(
            step1Completed = step1,
            step2Completed = step2,
            revisionCount = lecture.revisionCount + 1,
            lastRevisionDate = todayStr,
            lastRating = rating,
            nextDueDate = nextSchedule.nextDate,
            status = "active",
            previousMistakes = if (mistakes.isNotBlank()) mistakes else lecture.previousMistakes,
            calculationTricks = if (tricks.isNotBlank()) tricks else lecture.calculationTricks,
            revisionLogs = listOf(newLog) + lecture.revisionLogs
        )

        currentList[idx] = updated
        persistLectures(currentList)

        // Close revision dialog and update detail if currently open
        closeRevisionSession()
        if (_detailLecture.value?.id == lectureId) {
            _detailLecture.value = updated
        }
    }

    fun quickRate(lectureId: String, rating: DifficultyRating) {
        val currentList = _lectures.value.toMutableList()
        val idx = currentList.indexOfFirst { it.id == lectureId }
        if (idx == -1) return

        val lecture = currentList[idx]
        val updated = lecture.copy(lastRating = rating)
        currentList[idx] = updated
        persistLectures(currentList)
        if (_detailLecture.value?.id == lectureId) {
            _detailLecture.value = updated
        }
    }

    fun toggleFoundationStep(lectureId: String, stepNumber: Int) {
        val currentList = _lectures.value.toMutableList()
        val idx = currentList.indexOfFirst { it.id == lectureId }
        if (idx == -1) return

        val lecture = currentList[idx]
        val updated = if (stepNumber == 1) {
            lecture.copy(step1Completed = !lecture.step1Completed)
        } else {
            lecture.copy(step2Completed = !lecture.step2Completed)
        }
        currentList[idx] = updated
        persistLectures(currentList)
        if (_detailLecture.value?.id == lectureId) {
            _detailLecture.value = updated
        }
    }

    fun addNewLecture(
        subject: String,
        chapter: String,
        title: String,
        lectureNumber: Int,
        initialRating: DifficultyRating = DifficultyRating.Medium
    ) {
        val todayStr = LocalDate.now().toString()
        val newLec = LectureItem(
            id = "lec-custom-${System.currentTimeMillis()}",
            addedDate = todayStr,
            subject = subject,
            chapter = chapter,
            lectureNumber = lectureNumber,
            title = title,
            step1Completed = false,
            step2Completed = false,
            revisionCount = 0,
            lastRating = initialRating,
            nextDueDate = todayStr,
            status = "due_today"
        )
        val updated = listOf(newLec) + _lectures.value
        persistLectures(updated)
        closeAddLecture()
    }

    fun deleteLecture(lectureId: String) {
        val filtered = _lectures.value.filterNot { it.id == lectureId }
        persistLectures(filtered)
        if (_detailLecture.value?.id == lectureId) {
            closeLectureDetail()
        }
    }

    fun saveQuickNotes(notes: String) {
        _quickNotes.value = notes
        viewModelScope.launch {
            prefs.saveQuickNotes(notes)
        }
    }

    fun updateConfig(config: CockpitConfig) {
        _config.value = config
        viewModelScope.launch {
            prefs.saveConfig(config)
        }
    }

    fun applyVacationMode(days: Int) {
        val shifted = RevisionEngine.shiftTasksForVacation(_lectures.value, days)
        val newConfig = _config.value.copy(
            vacationMode = true,
            vacationDaysCount = days,
            vacationStartDate = LocalDate.now().toString()
        )
        updateConfig(newConfig)
        persistLectures(shifted)
        closeSettings()
    }

    fun applyAutoLevel() {
        val leveled = RevisionEngine.autoLevelSchedule(_lectures.value, _config.value.autoLevelThreshold)
        persistLectures(leveled)
        closeSettings()
    }
}
