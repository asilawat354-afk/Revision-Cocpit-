package com.smartrevision.cockpit.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val AmberPrimary = Color(0xFFF59E0B)
val AmberPrimaryDark = Color(0xFFD97706)
val Stone950 = Color(0xFF0C0A09)
val Stone900 = Color(0xFF1C1917)
val Stone800 = Color(0xFF292524)
val Stone700 = Color(0xFF44403C)
val Stone500 = Color(0xFF78716C)
val Stone200 = Color(0xFFE7E5E4)
val Stone100 = Color(0xFFF5F5F4)
val Stone50 = Color(0xFFFAFAF9)
val EmeraldGreen = Color(0xFF10B981)
val RoseRed = Color(0xFFEF4444)
val IndigoPurple = Color(0xFF6366F1)

private val LightColorScheme = lightColorScheme(
    primary = AmberPrimary,
    onPrimary = Stone950,
    secondary = AmberPrimaryDark,
    background = Stone50,
    surface = Color.White,
    onBackground = Stone900,
    onSurface = Stone900,
    surfaceVariant = Stone100,
    onSurfaceVariant = Stone700
)

private val DarkColorScheme = darkColorScheme(
    primary = AmberPrimary,
    onPrimary = Stone950,
    secondary = AmberPrimaryDark,
    background = Stone950,
    surface = Stone900,
    onBackground = Stone50,
    onSurface = Stone50,
    surfaceVariant = Stone800,
    onSurfaceVariant = Stone200
)

@Composable
fun SmartRevisionTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
