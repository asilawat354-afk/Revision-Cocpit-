package com.smartrevision.cockpit.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.smartrevision.cockpit.ui.theme.AmberPrimary

data class EcosystemItem(val name: String, val icon: String, val desc: String)

val ALL_ECOSYSTEMS = listOf(
    EcosystemItem("SSC CGL / Govt Exams", "🏛️", "Maths, Reasoning, GS & English फोकस"),
    EcosystemItem("UPSC Civil Services", "🇮🇳", "Polity, History, Geo, Economy & Current Affairs"),
    EcosystemItem("Banking & Insurance (IBPS/SBI)", "🏦", "Speed Maths, DI, Puzzles & Banking Awareness"),
    EcosystemItem("Railways (RRB NTPC/JE)", "🚆", "General Science, Reasoning & Arithmetic"),
    EcosystemItem("State PSCs (BPSC, UPPSC, etc.)", "📜", "General Studies & State Specific History"),
    EcosystemItem("Defence (NDA / CDS / AFCAT)", "🎖️", "Mathematics, General Ability & English"),
    EcosystemItem("NEET / JEE Foundation", "🔬", "Physics, Chemistry, Biology / Maths Core")
)

@Composable
fun EcosystemDialog(
    currentEcosystem: String,
    onDismiss: () -> Unit,
    onSelect: (String) -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .fillMaxHeight(0.75f),
            shape = RoundedCornerShape(20.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(20.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "परीक्षा इकोसिस्टम चुनें",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp
                            )
                        )
                        Text(
                            text = "अपनी तैयारी का मुख्य लक्ष्य निर्धारित करें",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(ALL_ECOSYSTEMS) { eco ->
                        val isSelected = currentEcosystem.contains(eco.name.split(" ")[0]) || currentEcosystem == eco.name

                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .clickable { onSelect(eco.name) },
                            color = if (isSelected) AmberPrimary.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            border = if (isSelected) androidx.compose.foundation.BorderStroke(1.5.dp, AmberPrimary) else null
                        ) {
                            Row(
                                modifier = Modifier.padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = eco.icon, fontSize = 28.sp)
                                Spacer(modifier = Modifier.width(14.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = eco.name,
                                        style = MaterialTheme.typography.titleSmall.copy(
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold
                                        )
                                    )
                                    Text(
                                        text = eco.desc,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                if (isSelected) {
                                    Icon(
                                        imageVector = Icons.Default.Check,
                                        contentDescription = "Selected",
                                        tint = AmberPrimary
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
