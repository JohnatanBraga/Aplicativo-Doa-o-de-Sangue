/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AndroidFile {
  path: string;
  content: string;
  description: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'build.gradle.kts',
    description: 'Configuração Gradle raiz do projeto Android',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.google.gms.google.services) apply false
}
`,
  },
  {
    path: 'settings.gradle.kts',
    description: 'Declaração dos repositórios e módulos do projeto',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MeuDoador"
include(":app")
`,
  },
  {
    path: 'gradle/libs.versions.toml',
    description: 'Catálogo de versões do Gradle (Version Catalog)',
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.0"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
material3 = "1.3.1"
navigationCompose = "2.8.4"
firebaseBom = "33.6.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3", version.ref = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
firebase-bom = { group = "com.google.firebase", name = "firebase-bom", version.ref = "firebaseBom" }
firebase-auth = { group = "com.google.firebase", name = "firebase-auth-ktx" }
firebase-firestore = { group = "com.google.firebase", name = "firebase-firestore-ktx" }
firebase-storage = { group = "com.google.firebase", name = "firebase-storage-ktx" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
google-gms-google-services = { id = "com.google.gms.google-services", version = "4.4.2" }
`,
  },
  {
    path: 'app/build.gradle.kts',
    description: 'Configuração do módulo do aplicativo Android com Jetpack Compose e Firebase',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.meudoador.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.meudoador.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)

    // Firebase
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth)
    implementation(libs.firebase.firestore)
    implementation(libs.firebase.storage)
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    description: 'Manifesto do aplicativo com permissões e atividades',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MeuDoador"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MeuDoador">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/meudoador/app/MainActivity.kt',
    description: 'Atividade principal Android com Jetpack Compose e navegação por abas',
    content: `package com.meudoador.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.meudoador.app.ui.components.BottomBar
import com.meudoador.app.ui.components.EcgTransition
import com.meudoador.app.ui.screens.*
import com.meudoador.app.ui.theme.MeuDoadorTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MeuDoadorTheme {
                MeuDoadorApp()
            }
        }
    }
}

@Composable
fun MeuDoadorApp() {
    var showSplash by remember { mutableStateOf(true) }
    val navController = rememberNavController()

    if (showSplash) {
        SplashScreen(onFinish = { showSplash = false })
    } else {
        Scaffold(
            modifier = Modifier.fillMaxSize(),
            bottomBar = { BottomBar(navController = navController) }
        ) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = "home",
                modifier = Modifier.padding(innerPadding)
            ) {
                composable("home") { HomeScreen(navController) }
                composable("donations") { DonationScreen(navController) }
                composable("card") { CardScreen() }
                composable("guide") { GuideScreen() }
                composable("profile") { ProfileScreen() }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/meudoador/app/ui/theme/Color.kt',
    description: 'Paleta de cores oficial do Meu Doador em Material 3',
    content: `package com.meudoador.app.ui.theme

import androidx.compose.ui.graphics.Color

val FundoPrincipal = Color(0xFFF7F7F5)
val CartaoBranco = Color(0xFFFFFFFF)
val AzulClaro = Color(0xFFBDE8F0)
val VerdeMenta = Color(0xFFDCECCB)
val VerdeSuave = Color(0xFFA8C98B)
val VermelhoPrincipal = Color(0xFFD95757)
val VermelhoProfundo = Color(0xFF7D0909)
val RosaSuave = Color(0xFFF5D9D5)
val TextoPrincipal = Color(0xFF242424)
val TextoSecundario = Color(0xFF777777)
val BordasDiscretas = Color(0xFFE9E9E6)
`,
  },
  {
    path: 'app/src/main/java/com/meudoador/app/ui/screens/SplashScreen.kt',
    description: 'Tela de Abertura com pulso cardíaco e animação de eletrocardiograma',
    content: `package com.meudoador.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.meudoador.app.ui.components.EcgLine
import com.meudoador.app.ui.theme.VermelhoPrincipal
import com.meudoador.app.ui.theme.VermelhoProfundo
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(onFinish: () -> Unit) {
    LaunchedEffect(Unit) {
        delay(3500)
        onFinish()
    }

    val infiniteTransition = rememberInfiniteTransition(label = "heartbeat")
    val scale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.12f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF8A1414),
                        VermelhoProfundo,
                        Color(0xFF3B0404)
                    )
                )
            )
            .clickable { onFinish() },
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(24.dp)
        ) {
            Text(
                text = "Meu Doador",
                color = Color.White,
                fontSize = 34.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(32.dp))

            // Coração pulsando
            Box(
                modifier = Modifier
                    .size(160.dp)
                    .scale(scale),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "❤️", fontSize = 100.sp)
            }

            Spacer(modifier = Modifier.height(32.dp))
            Text(
                text = "Cada doação pode salvar vidas",
                color = Color(0xFFFFD5D5),
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(24.dp))
            EcgLine(modifier = Modifier.fillMaxWidth().height(40.dp))
        }
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/meudoador/app/ui/components/EcgTransition.kt',
    description: 'Componente Jetpack Compose reutilizável com linha de eletrocardiograma',
    content: `package com.meudoador.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.meudoador.app.ui.theme.VermelhoPrincipal

@Composable
fun EcgLine(modifier: Modifier = Modifier, color: Color = VermelhoPrincipal) {
    Canvas(modifier = modifier) {
        val width = size.width
        val height = size.height
        val midY = height / 2

        val path = Path().apply {
            moveTo(0f, midY)
            lineTo(width * 0.25f, midY)
            lineTo(width * 0.30f, midY - height * 0.15f)
            lineTo(width * 0.35f, midY)
            lineTo(width * 0.40f, midY)
            lineTo(width * 0.45f, height * 0.1f) // Pico R
            lineTo(width * 0.50f, height * 0.9f) // Vale S
            lineTo(width * 0.55f, midY)
            lineTo(width * 0.65f, midY - height * 0.25f) // Onda T
            lineTo(width * 0.75f, midY)
            lineTo(width, midY)
        }

        drawPath(
            path = path,
            color = color,
            style = Stroke(width = 6f)
        )
    }
}
`,
  },
  {
    path: 'README_ANDROID.md',
    description: 'Instruções completas para abrir no Android Studio e compilar o APK',
    content: `# 📱 Meu Doador — Guia de Compilação do APK no Android Studio

Este projeto foi estruturado seguindo os padrões modernos do ecossistema Android:
- **Linguagem:** Kotlin 2.0
- **UI Toolkit:** Jetpack Compose & Material 3
- **Build System:** Gradle com Kotlin DSL (build.gradle.kts)
- **Backend:** Firebase Authentication & Cloud Firestore

---

## 🛠️ Passo a Passo para Gerar o APK:

1. **Baixar e descompactar o arquivo ZIP do projeto:**
   - Clique no botão "Baixar Projeto Android Studio (.ZIP)" disponível na barra superior do aplicativo.
   - Extraia a pasta em seu computador.

2. **Abrir no Android Studio:**
   - Abra o **Android Studio** (versão Ladybug, Jellyfish ou superior).
   - Selecione **File > Open** e escolha a pasta descompactada.
   - Aguarde o Gradle sincronizar as dependências (Sync Project with Gradle Files).

3. **Compilar o APK:**
   - No menu superior do Android Studio, clique em:
     \`Build > Build Bundle(s) / APK(s) > Build APK(s)\`
   - O Gradle gerará o arquivo \`app-debug.apk\` em:
     \`app/build/outputs/apk/debug/app-debug.apk\`

4. **Instalação Direta no Samsung Galaxy:**
   - Conecte o Samsung Galaxy ao computador via cabo USB ou envie o arquivo \`app-debug.apk\` para seu celular (via Google Drive, WhatsApp ou cabo).
   - No Samsung Galaxy, abra o aplicativo **Meus Arquivos** (ou Downloads) e toque no arquivo \`app-debug.apk\`.
   - Caso o sistema pergunte, autorize a instalação de aplicativos de "Fontes Desconhecidas" para aquele gerenciador.
   - Toque em **Instalar**. Pronto! O **Meu Doador** estará instalado nativamente em seu Samsung Galaxy.
`,
  },
];
