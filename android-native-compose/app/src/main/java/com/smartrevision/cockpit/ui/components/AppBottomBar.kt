package com.smartrevision.cockpit.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.FolderSpecial
import androidx.compose.material.icons.filled.LibraryBooks
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartrevision.cockpit.ui.navigation.ScreenDestination
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import com.smartrevision.cockpit.ui.theme.RoseRed

@Composable
fun AppBottomBar(
    currentDestination: ScreenDestination,
    dueCount: Int,
    vaultCount: Int,
    onNavigate: (ScreenDestination) -> Unit
) {
    NavigationBar(
        tonalElevation = 8.dp,
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        // Cockpit
        NavigationBarItem(
            selected = currentDestination == ScreenDestination.COCKPIT,
            onClick = { onNavigate(ScreenDestination.COCKPIT) },
            icon = {
                BadgedBox(
                    badge = {
                        if (dueCount > 0) {
                            Badge(
                                containerColor = RoseRed,
                                contentColor = MaterialTheme.colorScheme.surface
                            ) {
                                Text(
                                    text = if (dueCount > 99) "99+" else dueCount.toString(),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                ) {
                    Icon(imageVector = Icons.Default.Dashboard, contentDescription = "Cockpit")
                }
            },
            label = { Text("कॉकपिट", fontSize = 11.sp) },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AmberPrimary,
                selectedTextColor = AmberPrimary,
                indicatorColor = AmberPrimary.copy(alpha = 0.15f)
            )
        )

        // Subjects
        NavigationBarItem(
            selected = currentDestination == ScreenDestination.SUBJECTS,
            onClick = { onNavigate(ScreenDestination.SUBJECTS) },
            icon = {
                Icon(imageVector = Icons.Default.LibraryBooks, contentDescription = "विषय")
            },
            label = { Text("विषय", fontSize = 11.sp) },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AmberPrimary,
                selectedTextColor = AmberPrimary,
                indicatorColor = AmberPrimary.copy(alpha = 0.15f)
            )
        )

        // Database
        NavigationBarItem(
            selected = currentDestination == ScreenDestination.DATABASE,
            onClick = { onNavigate(ScreenDestination.DATABASE) },
            icon = {
                Icon(imageVector = Icons.Default.TableChart, contentDescription = "डेटाबेस")
            },
            label = { Text("डेटाबेस", fontSize = 11.sp) },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AmberPrimary,
                selectedTextColor = AmberPrimary,
                indicatorColor = AmberPrimary.copy(alpha = 0.15f)
            )
        )

        // Forecast
        NavigationBarItem(
            selected = currentDestination == ScreenDestination.HEATMAP,
            onClick = { onNavigate(ScreenDestination.HEATMAP) },
            icon = {
                Icon(imageVector = Icons.Default.CalendarMonth, contentDescription = "पूर्वानुमान")
            },
            label = { Text("कैलेंडर", fontSize = 11.sp) },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AmberPrimary,
                selectedTextColor = AmberPrimary,
                indicatorColor = AmberPrimary.copy(alpha = 0.15f)
            )
        )

        // Vault
        NavigationBarItem(
            selected = currentDestination == ScreenDestination.VAULT,
            onClick = { onNavigate(ScreenDestination.VAULT) },
            icon = {
                BadgedBox(
                    badge = {
                        if (vaultCount > 0) {
                            Badge(
                                containerColor = AmberPrimary,
                                contentColor = MaterialTheme.colorScheme.surface
                            ) {
                                Text(
                                    text = vaultCount.toString(),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                ) {
                    Icon(imageVector = Icons.Default.FolderSpecial, contentDescription = "वॉल्ट")
                }
            },
            label = { Text("वॉल्ट", fontSize = 11.sp) },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = AmberPrimary,
                selectedTextColor = AmberPrimary,
                indicatorColor = AmberPrimary.copy(alpha = 0.15f)
            )
        )
    }
}
