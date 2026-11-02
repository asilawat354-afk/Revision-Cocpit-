package com.smartrevision.cockpit.engine

import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import java.time.LocalDate

object RevisionEngine {

    fun getTodayString(): String = LocalDate.now().toString()

    data class NextScheduleResult(
        val nextDate: String,
        val nextPhase: String
    )

    fun calculateNextRevision(
        lecture: LectureItem,
        rating: DifficultyRating? = null,
        baseDate: String = getTodayString()
    ): NextScheduleResult {
        val currentLocalDate = try {
            LocalDate.parse(baseDate)
        } catch (e: Exception) {
            LocalDate.now()
        }

        // 2-Step Foundation Spaced Repetition logic
        if (!lecture.step1Completed) {
            val nextDate = currentLocalDate.plusDays(1).toString()
            return NextScheduleResult(nextDate, "1-Day")
        }

        if (!lecture.step2Completed) {
            val nextDate = currentLocalDate.plusDays(3).toString()
            return NextScheduleResult(nextDate, "3-Day")
        }

        // Advanced maintenance intervals
        val effectiveRating = rating ?: lecture.lastRating ?: DifficultyRating.Medium
        val revCount = lecture.revisionCount

        val baseIntervalDays = when {
            revCount <= 2 -> 7
            revCount == 3 -> 14
            revCount == 4 -> 21
            else -> 30
        }

        val multiplier = when (effectiveRating) {
            DifficultyRating.Easy -> 1.3
            DifficultyRating.Medium -> 1.0
            DifficultyRating.Hard -> 0.7
        }

        val finalDays = (baseIntervalDays * multiplier).toInt().coerceAtLeast(2)
        val nextDate = currentLocalDate.plusDays(finalDays.toLong()).toString()
        val phase = "${finalDays}-Day"

        return NextScheduleResult(nextDate, phase)
    }

    fun autoLevelSchedule(
        lectures: List<LectureItem>,
        dailyThreshold: Int = 8
    ): List<LectureItem> {
        val today = LocalDate.now()
        val dayCounts = mutableMapOf<String, Int>()

        // Count existing loads per date
        lectures.forEach { l ->
            if (l.status != "archived" && l.nextDueDate.isNotEmpty()) {
                dayCounts[l.nextDueDate] = (dayCounts[l.nextDueDate] ?: 0) + 1
            }
        }

        return lectures.map { lec ->
            if (lec.status == "archived" || !lec.step1Completed || !lec.step2Completed) {
                // Foundation tasks are never auto-shifted
                lec
            } else {
                val currentDueDate = lec.nextDueDate
                val countForDay = dayCounts[currentDueDate] ?: 0
                if (countForDay > dailyThreshold) {
                    // Find earliest upcoming day with capacity < threshold
                    var testDate = try {
                        LocalDate.parse(currentDueDate).plusDays(1)
                    } catch (e: Exception) {
                        today.plusDays(1)
                    }

                    var shiftedDate = currentDueDate
                    for (i in 1..14) {
                        val testDateStr = testDate.toString()
                        val testCount = dayCounts[testDateStr] ?: 0
                        if (testCount < dailyThreshold) {
                            shiftedDate = testDateStr
                            dayCounts[currentDueDate] = countForDay - 1
                            dayCounts[testDateStr] = testCount + 1
                            break
                        }
                        testDate = testDate.plusDays(1)
                    }

                    lec.copy(nextDueDate = shiftedDate)
                } else {
                    lec
                }
            }
        }
    }

    fun shiftTasksForVacation(
        lectures: List<LectureItem>,
        vacationDays: Int
    ): List<LectureItem> {
        if (vacationDays <= 0) return lectures
        val today = LocalDate.now()

        return lectures.map { lec ->
            if (lec.status == "archived") {
                lec
            } else {
                try {
                    val currentDue = LocalDate.parse(lec.nextDueDate)
                    if (!currentDue.isAfter(today.plusDays(vacationDays.toLong()))) {
                        val newDate = currentDue.plusDays(vacationDays.toLong()).toString()
                        lec.copy(nextDueDate = newDate)
                    } else {
                        lec
                    }
                } catch (e: Exception) {
                    lec
                }
            }
        }
    }
}
