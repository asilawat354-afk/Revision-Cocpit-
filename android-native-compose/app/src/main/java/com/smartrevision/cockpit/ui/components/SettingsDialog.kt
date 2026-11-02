package com.smartrevision.cockpit.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.smartrevision.cockpit.model.CockpitConfig
import com.smartrevision.cockpit.ui.theme.AmberPrimary
import kotlin.math.roundToInt

@Composable
fun SettingsDialog(
    config: CockpitConfig,
    onDismiss: () -> Unit,
    onSaveConfig: (CockpitConfig) -> Unit,
    onApplyVacation: (days: Int) -> Unit,
    onApplyAutoLevel: () -> Unit
) {
    var quota by remember { mutableStateOf(config.dailyQuota.toFloat()) }
    var autoThreshold by remember { mutableStateOf(config.autoLevelThreshold.toFloat()) }
    var vacationDays by remember { mutableStateOf(3) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .wrapContentHeight(),
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "सेटिंग्स व रणनीतिक टूल्स",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                // Daily Quota Slider
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "दैनिक रिवीज़न कोटा (Daily Quota)", style = MaterialTheme.typography.bodyMedium)
                        Text(
                            text = "${quota.roundToInt()} लेक्चर्स",
                            fontWeight = FontWeight.Bold,
                            color = AmberPrimary
                        )
                    }
                    Slider(
                        value = quota,
                        onValueChange = { quota = it },
                        valueRange = 2f..20f,
                        steps = 17,
                        colors = SliderDefaults.colors(thumbColor = AmberPrimary, activeTrackColor = AmberPrimary)
                    )
                }

                // Auto Level Threshold Slider
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "ऑटो-लेवलिंग अधिकतम लोड", style = MaterialTheme.typography.bodyMedium)
                        Text(
                            text = "${autoThreshold.roundToInt()} प्रति दिन",
                            fontWeight = FontWeight.Bold,
                            color = AmberPrimary
                        )
                    }
                    Slider(
                        value = autoThreshold,
                        onValueChange = { autoThreshold = it },
                        valueRange = 4f..15f,
                        steps = 10,
                        colors = SliderDefaults.colors(thumbColor = AmberPrimary, activeTrackColor = AmberPrimary)
                    )
                }

                // Auto Level Action
                Button(
                    onClick = onApplyAutoLevel,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(
                        text = "⚡ ऑटो-लेवल लोड बैलेंस करें",
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Divider()

                // Vacation Mode Section
                Text(
                    text = "🏖️ वेकेशन मोड (Vacation Mode)",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
                Text(
                    text = "यदि आप यात्रा या बीमारी के कारण अध्ययन नहीं कर पा रहे हैं, तो आगामी सभी रिवीज़न को आगे खिसकाएं बिना किसी नुकसान के।",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf(1, 2, 3, 5, 7, 14).forEach { d ->
                        val isSelected = vacationDays == d
                        FilterChip(
                            selected = isSelected,
                            onClick = { vacationDays = d },
                            label = { Text("${d} दिन") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = AmberPrimary.copy(alpha = 0.2f),
                                selectedLabelColor = AmberPrimary
                            )
                        )
                    }
                }

                Button(
                    onClick = { onApplyVacation(vacationDays) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(
                        text = "$vacationDays दिन वेकेशन लागू करें",
                        color = MaterialTheme.colorScheme.surface,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Save Config & Close
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    TextButton(onClick = {
                        onSaveConfig(
                            config.copy(
                                dailyQuota = quota.roundToInt(),
                                autoLevelThreshold = autoThreshold.roundToInt()
                            )
                        )
                        onDismiss()
                    }) {
                        Text("सहेजें (Save & Close)", fontWeight = FontWeight.Bold, color = AmberPrimary)
                    }
                }
            }
        }
    }
}
