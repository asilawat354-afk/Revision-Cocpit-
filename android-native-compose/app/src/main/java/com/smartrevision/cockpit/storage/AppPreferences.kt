package com.smartrevision.cockpit.storage

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.smartrevision.cockpit.data.InitialLectures
import com.smartrevision.cockpit.model.CockpitConfig
import com.smartrevision.cockpit.model.LectureItem

class AppPreferences(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("smart_revision_prefs", Context.MODE_PRIVATE)
    private val gson = Gson()

    companion object {
        private const val KEY_LECTURES = "key_lectures_json"
        private const val KEY_CONFIG = "key_config_json"
        private const val KEY_QUICK_NOTES = "key_quick_notes_text"
    }

    fun loadLectures(): List<LectureItem> {
        val json = prefs.getString(KEY_LECTURES, null)
        if (json.isNullOrEmpty()) {
            val initial = InitialLectures.createDefaultLectures()
            saveLectures(initial)
            return initial
        }
        return try {
            val type = object : TypeToken<List<LectureItem>>() {}.type
            gson.fromJson(json, type) ?: InitialLectures.createDefaultLectures()
        } catch (e: Exception) {
            InitialLectures.createDefaultLectures()
        }
    }

    fun saveLectures(lectures: List<LectureItem>) {
        val json = gson.toJson(lectures)
        prefs.edit().putString(KEY_LECTURES, json).apply()
    }

    fun loadConfig(): CockpitConfig {
        val json = prefs.getString(KEY_CONFIG, null)
        if (json.isNullOrEmpty()) {
            return CockpitConfig()
        }
        return try {
            gson.fromJson(json, CockpitConfig::class.java) ?: CockpitConfig()
        } catch (e: Exception) {
            CockpitConfig()
        }
    }

    fun saveConfig(config: CockpitConfig) {
        val json = gson.toJson(config)
        prefs.edit().putString(KEY_CONFIG, json).apply()
    }

    fun loadQuickNotes(): String {
        return prefs.getString(KEY_QUICK_NOTES, "") ?: ""
    }

    fun saveQuickNotes(notes: String) {
        prefs.edit().putString(KEY_QUICK_NOTES, notes).apply()
    }
}
