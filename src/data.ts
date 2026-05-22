import { SkinArticle } from "./types";

export const FLUTTER_CODE_STRUCTURE = `
lib/
├── main.dart                      # App entry point, MultiProvider configuration, and theme initialization
├── core/
│   ├── constants/
│   │   ├── colors.dart            # Medical primary blue (#0D6EFD), green (#198754), dark Slate & soft off-white
│   │   └── d_strings.dart          # Localized string keys (English & Urdu dictionary fallback)
│   ├── theme/
│   │   └── app_theme.dart         # Material 3 light & dark theme custom configurations with custom font pairings
│   └── utils/
│       ├── hipaa_crypto.dart      # Encrypted storage utility for local data and offline scan caching with AES
│       └── pdf_generator.dart     # Generates secure patient skin report PDFs matching clinical layouts
├── data/
│   ├── models/
│   │   ├── user_profile_model.dart # Maps user demographic parameters securely
│   │   ├── scan_report_model.dart  # Clinical scan outcome serializer with Urdu translations
│   │   └── tracking_day_model.dart # Day log & hydration metrics parser
│   └── services/
│       ├── firebase_auth_service.dart # Handles Email login, Google secure sign-on, flow transitions, & Guest mode
│       ├── firestore_database_service.dart # Coordinates real-time collection updates with HIPAA compliance
│       ├── storage_service.dart    # Manages secure TLS profile/skin image upload and cache
│       ├── gemini_api_service.dart # Integrates with server-side proxy for clinical multimodal vision calls
│       └── local_database.dart     # Offline scan caching using secure SQLite storage
├── providers/
│   ├── user_provider.provider.dart # Holds profile states dynamically
│   ├── scan_provider.provider.dart # Triggers active scanners and parses classification structures
│   └── chart_tracker.provider.dart # Aggregates weekly skin wellness data dynamically
└── screens/
    ├── auth/
    │   ├── login_screen.dart      # Medical layout login with transitions and toggle passwords
    │   └── register_form.dart     # Clinical registration handling demographics, skin-types, and allergy declarations
    ├── dashboard/
    │   ├── main_navigation.dart   # Interactive BottomNavigationBar wrapper with state preservation
    │   ├── skin_health_feed.dart  # Elegant medical dashboard exhibiting metrics, progress snapshots, & quick actions
    │   └── education_articles.dart # Beautiful article list featuring skin education and localized advisory posts
    ├── diagnostics/
    │   ├── camera_viewfinder.dart # Full-viewport camera client featuring custom focal overlays & skin highlights
    │   ├── analysis_processing.dart # Animated radial scanner simulating cellular classification progress
    │   └── assessment_report.dart  # Tabbed detail card showcasing medical insights, OTC brands, and Urdu translations
    ├── support/
    │   └── derm_ai_chatbot.dart   # Instant conversational bubble interface utilizing professional skincare models
    └── tracking/
        ├── skin_history_log.dart  # Timeline of past reports allowing side-by-side comparison (Before/After)
        ├── wellness_survey.dart   # Custom forms to evaluate hydration, sleep time, and routine checkmarks
        └── doctor_consult.dart    # Dynamic clinical booking simulator with search query fields and Google map preview
`;

export const FIREBASE_SCHEMA_BLUEPRINT = `
=============================================
FIREBASE FIRESTORE SECURED SCHEMA PLAN
=============================================

1. [Collection] users
   └── {id} (Document: User UID is strictly synced with Firebase Auth Token)
       ├── name: String
       ├── age: Number
       ├── gender: String
       ├── skinType: String (Dry | Oily | Combination | Sensitive)
       ├── allergies: String (e.g. "salicylic, sulfur")
       ├── history: String
       ├── medications: String
       ├── defaultLanguage: String ("en" | "ur")
       ├── createdAt: Timestamp
       └── lastLogin: Timestamp

2. [Collection] scans
   └── {scanId} (Document: Auto ID)
       ├── uid: String (Indexed - links strictly to Auth User ID)
       ├── conditionName: String (e.g., "Atopic Dermatitis")
       ├── urduConditionName: String
       ├── confidence: Number (e.g., 94)
       ├── severity: String (Mild | Moderate | Severe)
       ├── description: String
       ├── urduDescription: String
       ├── causes: Array [String]
       ├── symptoms: Array [String]
       ├── preventionTips: Array [String]
       ├── skincareMorning: Array [String]
       ├── skincareNight: Array [String]
       ├── nutritionAdvice: Array [String]
       ├── hydrationGoal: String
       ├── otcMedicines: Array [
       │     Map {
       │       category: String,
       │       genericName: String,
       │       pakistaniMarketName: String,
       │       howToUse: String,
       │       warnings: Array [String]
       │     }
       │   ]
       ├── prescription: Map {
       │     required: Boolean,
       │     warningText: String,
       │     medications: Array [
       │       Map {
       │         name: String,
       │         pakistaniBrand: String,
       │         dosage: String,
       │         frequency: String,
       │         duration: String,
       │         method: String
       │       }
       │     ]
       │   }
       ├── isEmergency: Boolean
       ├── emergencyWarning: String
       ├── imageUrl: String (URL strictly targeted at gs:// bucket with signed headers)
       └── timestamp: Timestamp

3. [Collection] daily_tracker
   └── {trackId} (Document: Custom ID styled as "UID_YYYY-MM-DD")
       ├── uid: String (Indexed)
       ├── date: String ("YYYY-MM-DD")
       ├── score: Number (0 - 100)
       ├── waterIntake: Number (glasses ingested)
       ├── sleepHours: Number
       ├── checkedMorningRoutine: Boolean
       ├── checkedNightRoutine: Boolean
       ├── notes: String
       ├── localPhotoUrl: String (Optional, for current state tracking)
       └── timestamp: Timestamp

4. [Collection] consultation_bookings
   └── {bookingId} (Document: Auto ID)
       ├── uid: String
       ├── doctorId: String
       ├── doctorName: String
       ├── date: String
       ├── timeSlot: String
       ├── type: String ("Video" | "Chat" | "Physical")
       ├── status: String ("Pending" | "Confirmed" | "Completed")
       └── notes: String
`;

export const FLUTTER_SECURE_RULES = `
=============================================
FIRESTORE SECURITY RULES (firestore.rules)
=============================================

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Check if user is fully authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Check if request owner matches the document ID
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Check if user resource links back to current log session
    function isDocOwner() {
      return request.auth.uid == resource.data.uid;
    }

    // User account rule: Strictly bounded, no public scanning
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }

    // Skin analyses records restriction: Only owners can view or delete their reports
    match /scans/{scanId} {
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow read, update, delete: if isAuthenticated() && isDocOwner();
    }

    // Day Logs rule: Bound to owner account verification
    match /daily_tracker/{trackId} {
      allow read, write: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
    }

    // Bookings rule: Strict validation of client ID mapping
    match /consultation_bookings/{bookingId} {
      allow create: if isAuthenticated() && request.resource.data.uid == request.auth.uid;
      allow read, update: if isAuthenticated() && isDocOwner();
    }
  }
}
`;

export const FLUTTER_DART_API_INTEGRATION_CODE = `
// Flutter/Dart Code Example: Secure API integration with the proxy backend
// Put inside: lib/data/services/gemini_api_service.dart

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/scan_report_model.dart';

class GeminiApiService {
  final String _baseUrl = 'https://ais-dev-w2x7ckvpc6sjxf74izkdir-914031651558.asia-southeast1.run.app/api';

  Future<ScanReportModel> analyzeSkinImage({
    required File imageFile,
    required String conditionHint,
    required String cameraArea,
  }) async {
    try {
      // 1. Convert file data safely to standard base64 chunk
      final bytes = await imageFile.readAsBytes();
      final base64Image = base64Encode(bytes);
      final dataUri = 'data:image/jpeg;base64,\$base64Image';

      // 2. Post to secure server-side endpoint
      final response = await http.post(
        Uri.parse('\$_baseUrl/analyze-skin'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'image': dataUri,
          'conditionHint': conditionHint,
          'cameraArea': cameraArea,
        }),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> result = jsonDecode(response.body);
        if (result['success'] == true) {
          return ScanReportModel.fromJson(result['data']);
        } else {
          throw Exception(result['error'] ?? 'Engine failed to process cellular layer');
        }
      } else {
        throw Exception('Server returned clinical warning status: \${response.statusCode}');
      }
    } catch (e) {
      throw Exception('API connection timeout: \${e.toString()}');
    }
  }
}
`;

export const SKIN_ARTICLES_DATA: SkinArticle[] = [
  {
    id: "a1",
    title: "The Ultimate Guide to Salicylic Acid and Acne Care",
    urduTitle: "سیلی اسائلک ایسڈ اور چہرے کے کیل دانوں کا علاج",
    category: "Acne",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
    summary: "Understand why Salicylic acid is a top-tier beta-hydroxy acid designed to deeply flush cellular debris and sebum.",
    urduSummary: "یہ مضمون سیلی اسائلک ایسڈ کے فوائد اور چکنی جلد پر دانوں کو صاف کرنے میں اس کے استعمال کے صیحح طریقے کو واضح کرتا ہے۔",
    content: [
      "Salicylic Acid (BHA) is oil-soluble, which allows it to penetrate deep into pores where it dissolves excess sebum and cellular debris.",
      "In Pakistan, many standard dermatologists prescribe Salicylic-based washes for initial moderate acne control. Brands like Acne-Aid, Neutrogena, and local option Clindalyne wash offer outstanding relief.",
      "How to use: Start with alternate evening applications before gradually ramping up to daily use. Sunscreen is essential the next morning."
    ]
  },
  {
    id: "a2",
    title: "Understanding Eczema and Epidermal Lipid Restoration",
    urduTitle: "ایگزیما اور لِپڈ کثافت کی بحالی کا طریقہ",
    category: "Skin Barrier",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600&auto=format&fit=crop",
    summary: "Discover how genetic deficiencies like Filaggrin contribute to tissue cracking, and how Ceramides reverse irritation.",
    urduSummary: "یہ مضمون ایگزیما کے مریضوں کو جلد کو موئسچرائز رکھنے، کھردری خارش دور کرنے اور صابن سے پرہیز کے متعلق سکھاتا ہے۔",
    content: [
      "When the skin barrier suffers from crucial filaggrin protein deficency, moisture escapes and external irritants trigger hot dermal rashes.",
      "Applying ceramide dense barrier formulations (Atoderm or Physiogel AI) helps recreate the protective 'brick-and-mortar' structure of healthy tissue.",
      "Keep bath times limited. Tap water in major cities can often be harsh; filters or boiled water help sensitive cases."
    ]
  },
  {
    id: "a3",
    title: "Hydration Metrics: The Foundation of Radiant Skin Cells",
    urduTitle: "پانی کا استعمال اور صاف چمکدار جلد کا راز",
    category: "Wellness",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1548839140-29a88648f1d8?q=80&w=600&auto=format&fit=crop",
    summary: "Scientifically, systemic hydration sustains intracellular turgor pressure. Let's look at simple daily water goals.",
    urduSummary: "پانی کا مناسب استعمال جلد کو لچکدار اور چمکدار بناتا ہے بیرونی خشکی سے حفاظت کے لیے روزانہ ۳ لیٹر پانی پینا لازمی ہے۔",
    content: [
      "Intracellular turgor pressure relies fundamentally on steady fluid intake. When dehydrated, skin displays accentuating lines.",
      "Try to keep a consistent daily target of 8-12 glasses (about 3 Liters) of water, supplementing with green teas."
    ]
  }
];
