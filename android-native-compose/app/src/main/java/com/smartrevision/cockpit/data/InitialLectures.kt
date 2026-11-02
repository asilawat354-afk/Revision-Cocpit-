package com.smartrevision.cockpit.data

import com.smartrevision.cockpit.model.DifficultyRating
import com.smartrevision.cockpit.model.LectureItem
import java.time.LocalDate

object InitialLectures {
    fun createDefaultLectures(): List<LectureItem> {
        val today = LocalDate.now().toString()
        val tomorrow = LocalDate.now().plusDays(1).toString()

        val sampleList = mutableListOf<LectureItem>()

        val arithmeticTopics = listOf(
            "Ratio & Proportion - Basic Concepts & Types" to 1,
            "Ratio & Proportion - Cross Multiplication" to 2,
            "Ratio & Proportion - Income & Expenditure" to 3,
            "Percentage - Fraction to Percentage Conversion" to 1,
            "Percentage - Price, Consumption & Expenditure" to 2,
            "Profit & Loss - Dishonest Shopkeeper" to 1,
            "Time & Work - Efficiency Based Problems" to 1,
            "Simple Interest - Installments & Rates" to 1
        )

        arithmeticTopics.forEachIndexed { index, (title, lecNum) ->
            val rating = when (index % 3) {
                0 -> DifficultyRating.Easy
                1 -> DifficultyRating.Medium
                else -> DifficultyRating.Hard
            }
            sampleList.add(
                LectureItem(
                    id = "lec-init-$index",
                    addedDate = today,
                    subject = "Maths- (Arithmetic)",
                    chapter = title.split(" - ")[0],
                    lectureNumber = lecNum,
                    title = title,
                    step1Completed = index < 4,
                    step2Completed = index < 2,
                    revisionCount = if (index < 3) 2 else 0,
                    lastRating = rating,
                    nextDueDate = if (index % 2 == 0) today else tomorrow,
                    status = if (index % 2 == 0) "due_today" else "active",
                    conceptNotes = "महत्वपूर्ण फॉर्मूले और स्टेप्स नोट किए गए हैं।",
                    calculationTricks = "डिजिटल सम और अनुपात विधि से 15 सेकंड में हल करें।"
                )
            )
        }

        val reasoningTopics = listOf(
            "Coding-Decoding - Letter Shifting" to 1,
            "Syllogism - 100-50 & Venn Diagram Method" to 1,
            "Blood Relation - Coded Relations" to 1
        )

        reasoningTopics.forEachIndexed { index, (title, lecNum) ->
            sampleList.add(
                LectureItem(
                    id = "lec-reas-$index",
                    addedDate = today,
                    subject = "Reasoning",
                    chapter = title.split(" - ")[0],
                    lectureNumber = lecNum,
                    title = title,
                    step1Completed = true,
                    revisionCount = 1,
                    lastRating = DifficultyRating.Medium,
                    nextDueDate = today,
                    status = "due_today",
                    conceptNotes = "नियम 1 और 2 का विशेष ध्यान रखें।"
                )
            )
        }

        return sampleList
    }
}
