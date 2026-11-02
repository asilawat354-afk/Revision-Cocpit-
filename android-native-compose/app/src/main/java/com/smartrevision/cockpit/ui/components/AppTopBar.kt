package com.smartrevision.cockpit.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.BeachAccess
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartrevision.cockpit.model.SubjectCatalogItem
import com.smartrevision.cockpit.ui.navigation.ScreenDestination
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.Stone700
import com.smartrevision.cockpit.ui.theme.Stone900

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppTopBar(
    currentDestination: ScreenDestination,
    selectedSubject: SubjectCatalogItem?,
    selectedChapter: String?,
    activeEcosystem: String,
    onBackClick: () -> Unit,
    onSearchClick: () -> Unit,
    onSettingsClick: () -> Unit,
    onEcosystemClick: () -> Unit
) {
    val canGoBack = selectedSubject != null || selectedChapter != null

    TopAppBar(
        title = {
            Column {
                val title = when {
                    selectedChapter != null -> selectedChapter
                    selectedSubject != null -> selectedSubject.name
                    else -> when (currentDestination) {
                        ScreenDestination.COCKPIT -> "रिवीज़न कॉकपिट"
                        ScreenDestination.SUBJECTS -> "विषय डायरेक्टरी"
                        ScreenDestination.DATABASE -> "मास्टर डेटाबेस"
                        ScreenDestination.HEATMAP -> "30-दिन पूर्वानुमान"
                        ScreenDestination.VAULT -> "डेब्ट वॉल्ट"
                    }
                }
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = activeEcosystem,
                    style = MaterialTheme.typography.bodySmall.copy(
                        fontSize = 11.sp,
                        color = AmberPrimary,
                        fontWeight = FontWeight.Medium
                    ),
                    maxLines = 1,
                    modifier = Modifier.clickable { onEcosystemClick() }
                )
            }
        },
        navigationIcon = {
            if (canGoBack) {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = AmberPrimary
                    )
                }
            } else {
                Box(
                    modifier = Modifier
                        .padding(start = 12.dp, end = 4.dp)
                        .size(32.dp)
                        .clip(RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Surface(
                        color = AmberPrimary.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "🎯",
                                fontSize = 16.sp
                            )
                        }
                    }
                }
            }
        },
        actions = {
            // Search Icon
            IconButton(onClick = onSearchClick) {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }

            // Ecosystem switcher button
            IconButton(onClick = onEcosystemClick) {
                Icon(
                    imageVector = Icons.Default.Tune,
                    contentDescription = "Ecosystem",
                    tint = AmberPrimary
                )
            }

            // Settings Icon
            IconButton(onClick = onSettingsClick) {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings",
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface,
            titleContentColor = MaterialTheme.colorScheme.onSurface
        )
    )
}
