import React, { useState, useEffect } from 'react';
import { 
  Play, Square, CheckCircle, BarChart2, Home, Target, Clock, 
  Plus, BookOpen, AlertCircle, Calendar, X, Award, TrendingUp, 
  Filter, Info, ChevronRight, Sparkles, Check, MessageSquare,
  Edit2, Trash2, RotateCcw, UserCheck, Download
} from 'lucide-react';

const DISTRACTION_KEYS = [
  'Telefon/Bildirim',
  'Hayal Kurma',
  'Görev Değiştirme',
  'Diğer'
];

const EMPTY_DISTRACTIONS = {
  'Telefon/Bildirim': 0,
  'Hayal Kurma': 0,
  'Görev Değiştirme': 0,
  'Diğer': 0
};

const TRANSLATIONS = {
  tr: {
    appName: 'MCII Odak Koçu',
    onboardingSubtitle: 'Hedeflerini sayısal olarak belirle, engellerini öngör ve bilimsel MCII tekniğiyle odaklanma süreni zirveye taşı.',
    aliasLabel: 'RUMUZUN / TAKMA ADIN',
    aliasPlaceholder: 'Örn: Odak01, Yıldız, Ö1...',
    fieldLabel: 'HEDEF ALANIN (İSTEĞE BAĞLI)',
    fieldPlaceholder: 'Örn: Sayısal / YKS / Olimpiyat',
    continueBtn: 'Devam Et',
    welcomeTitle: (name) => `Hoş Geldin, ${name}!`,
    welcomeSubtitle: 'Uygulamayı nasıl kullanacağına hızlıca göz atalım.',
    step1Title: 'MCII ile Sayısal Hedef ve Süre Belirle',
    step1Desc: 'Sadece "ders çalışacağım" demek yerine; başlangıç değerini, hedef değerini (örn. 0’dan 300 soruya) ve bitiş tarihini gir. Her dikkat dağıtıcı türü için ayrı "Eğer şu olursa, O zaman bunu yapacağım" planları kur.',
    step2Title: 'Akıllı Kronometre ve Zaman Etüdü',
    step2Desc: 'Seansa başla. Çalışırken telefon, hayal kurma, görev değiştirme veya diğer bir nedenle dersten koparsan ilgili butona bas. Aktif çalışma sayacı durur ve sana tam o kategoriye özel Eğer-O Zaman çözümünü hatırlatır!',
    step3Title: 'Haftalık Analiz ve Excel Veri Dışa Aktarma',
    step3Desc: '1., 2. ve 3. hafta gelişimini, kopma sürelerini ve verimlilik oranlarını incele. Çalışma sonunda tüm verilerini tek tıkla Excel (CSV) formatında indir.',
    startAppBtn: 'Uygulamaya Başla',
    helloUser: (name) => `Merhaba, ${name}!`,
    autoSaved: 'Verilerin cihazına otomatik kaydediliyor.',
    editProfileTitle: 'Rumuz / Profil Düzenle',
    howToUseTitle: 'Nasıl Kullanılır?',
    editHintBar: 'Hedefleri kalem ikonundan düzenleyebilir veya silebilirsin.',
    clearAllBtn: 'Tümünü Temizle',
    editGoalTitle: 'Hedefi ve MCII Planını Düzenle',
    newGoalTitle: 'MCII Hedef Planlama Formu',
    editGoalSub: 'Hedef bilgilerini veya kategoriye özel Eğer-O Zaman planlarını güncelle.',
    newGoalSub: 'Somut, ölçülebilir ve zamana bağlı bir hedef oluştur.',
    goalStep1: 'ADIM 1: SOMUT HEDEFİN NEDİR?',
    goalTitlePlaceholder: 'Örn: Matematikte 3 haftada 300 soru çözmek',
    deadlineLabel: 'HEDEF BİTİŞ TARİHİ',
    metricLabel: 'ÖLÇÜM BİRİMİ',
    startValLabel: 'BAŞLANGIÇ',
    currentValLabel: 'ŞU ANKİ DEĞER',
    targetValLabel: 'HEDEF DEĞER',
    goalStep2: 'ADIM 2: OLUMLU GELECEĞİ HAYAL ET (EN İYİ SONUÇ)',
    bestOutcomePlaceholder: 'Bu hedefe ulaştığında ne hissedeceksin? (Örn: Stresim azalacak, kendime güvenim artacak...)',
    goalStep34: 'ADIM 3 & 4: DİKKAT KESİNTİSİ TÜRLERİNE GÖRE "EĞER... O ZAMAN..." PLANLARI',
    goalStep34Hint: 'Çalışma sırasında hangi dikkat dağıtıcıya basarsan, aşağıda o başlık için yazdığın plan ekrana gelecektir.',
    ifTag: 'EĞER',
    thenTag: 'O ZAMAN',
    updateGoalBtn: 'Değişiklikleri Güncelle',
    saveGoalBtn: 'Hedefi ve MCII Planını Kaydet',
    noGoalsTitle: 'Henüz Hiç Hedefin Yok',
    noGoalsDesc: 'Kendi çalışma hedeflerini ve "Eğer-O Zaman" planlarını oluşturarak hemen başla veya örnek verileri geri yükle.',
    createGoalBtn: 'Yeni Hedef Oluştur',
    restoreSampleBtn: 'Örnek Hedefleri Geri Yükle',
    expired: 'Süre Doldu',
    daysLeft: (d) => `Hedefe Son ${d} Gün`,
    studiedSummary: (min, count) => `${min} dk çalışıldı (${count} seans)`,
    editGoalTooltip: 'Hedefi Düzenle',
    deleteGoalTooltip: 'Hedefi Sil',
    studyBtn: 'Çalış',
    startShort: 'Başlangıç',
    currentShort: 'Şu An',
    targetShort: 'Hedef',
    goalAttainmentLabel: 'Hedefe Ulaşma Oranı',
    updateCurrentLabel: (metric) => `Güncel ${metric}:`,
    bestOutcomeLabel: 'En İyi Sonuç:',
    mciiPlansLabel: 'MCII "Eğer - O Zaman" Planların:',
    viewGoalReport: 'Bu Hedefin Özel Raporunu Gör',
    timerSetupTitle: 'Çalışma Seansı Verimlilik Kaydı',
    timerSetupDesc: 'Seansa başlamadan önce 1. Bölümü doldur. Çalışma dışında bir şey yaptığında ilgili dikkat dağıtıcıya basarak aktif sayacı durdur.',
    selectGoalLabel: '1. HANGİ HEDEFİN İÇİN ÇALIŞACAKSIN?',
    selectGoalPlaceholder: 'Hedef seçiniz...',
    subjectLabel: '2. BUGÜN ÇALIŞACAĞIN ANA DERS / KONU',
    subjectPlaceholder: 'Örn: Matematik - Türev Uygulamaları',
    plannedTimeLabel: '3. PLANLADIĞIN TOPLAM SÜRE (DAKİKA - MANUEL GİRİŞ)',
    errSelectGoal: 'Lütfen önce çalışacağın hedefi seç.',
    errEnterSubject: 'Lütfen çalışacağın ders veya konuyu yaz.',
    errEnterTime: 'Lütfen geçerli bir planlanan dakika gir.',
    startTimerBtn: 'Kronometreyi Başlat',
    activeStudyTime: 'Aktif Çalışma Süresi',
    plannedBlock: 'Planlanan Blok',
    minutesUnit: 'dakika',
    minShort: 'dk',
    secShort: 'sn',
    statusLabel: 'Durum',
    statusActive: 'Aktif Çalışıyor',
    statusPaused: 'Duraklatıldı (Blok Süresi Akmaya Devam Ediyor)',
    remainingBlock: 'Kalan Blok',
    elapsedTotal: 'Geçen Toplam',
    pauseBreak: 'Kopma / Ara',
    distractedHeader: 'Dikkatin Dağıldı! MCII Planını Uygula',
    resumeAfterPlanBtn: 'Çözümü Uyguladım, Ana Derse Geri Dön ve Başlat',
    tallyPrompt: 'Dersten Her Koptuğunda İlgili Kutuya Dokun (Aktif Sayacı Durdurur)',
    tickUnit: 'çentik',
    pauseTimerBtn: 'Kronometreyi Durdur',
    resumeTimerBtn: 'Tekrar Başlat',
    finishSessionBtn: 'Seansı Bitir',
    timeUpBanner: (min) => `Planlanan ${min} dakikalık blok süresi doldu! Seans otomatik olarak durduruldu.`,
    endModalTitle: 'Bölüm 3: Seans Sonu Analizi',
    activeStudyLabel: 'Aktif Çalışma',
    rateSessionLabel: 'SEANSI DEĞERLENDİR (1 = Çok Verimsiz, 10 = Çok Verimli):',
    sessionNotesLabel: 'SEANSLA İLGİLİ KISA NOTUN (İsteğe Bağlı)',
    sessionNotesPlaceholder: 'Örn: "İlk 20 dk iyiydi, sonra dikkatim dağıldı." veya "Telefonu kapatmak işe yaradı."',
    progressReminderTitle: 'Hedef İlerlemeni Kaydetmeyi Unutma!',
    progressReminderLabel: (metric) => `Bu seansta hedefine kaç ${metric} ekledin? (İsteğe Bağlı)`,
    progressReminderHint: (curr, target, metric) => `Mevcut: ${curr} / ${target} ${metric}`,
    progressPreview: (nextVal, metric) => `Kaydedilince yeni değer: ${nextVal} ${metric}`,
    goBackBtn: 'Geri Dön',
    saveAndReportBtn: 'Kaydet ve Raporu Gör',
    noNoteDefault: 'Not eklenmedi.',
    reportsTitle: 'Detaylı Analiz & Raporlar',
    reportsSubtitle: 'Haftalık gelişimini, kopma sürelerini ve performansını incele.',
    exportExcelBtn: 'Tüm Verileri Excel (CSV) İndir',
    exportNoData: 'Dışa aktarılacak seans kaydı henüz bulunmuyor.',
    exportSuccess: (file) => `${file} başarıyla indirildi.`,
    filterByGoal: 'Hedefe Göre Rapor Seç',
    allGoalsOption: 'Tüm Hedeflerin Genel Raporu',
    weekFilter: 'Son 7 Gün',
    monthFilter: 'Son 30 Gün',
    allTimeFilter: 'Tüm Zamanlar',
    coachTitle: 'Kişiselleştirilmiş Haftalık Çalışma Önerisi',
    coachEmpty: 'Seçtiğin filtrede henüz çalışma seansı kaydı bulunmuyor. Yeni bir seans tamamladığında burada sana özel ders, saat ve odaklanma önerileri görünecek.',
    cardGoalAttainment: 'Hedefe Ulaşma Oranı',
    cardActualStudy: 'Gerçek Çalışma Oranı',
    cardSessionEff: 'Verimli Seans Oranı',
    pauseSummaryTitle: 'Kopma ve Odak Kaybı Süresi Özeti',
    totalPauseLabel: 'Toplam Kopma Süresi',
    avgPauseLabel: 'Seans Başına Ort. Kopma',
    totalDistractionCountLabel: 'Toplam Kopma Sayısı',
    weeklyTableTitle: 'Haftalık Gelişim Karşılaştırması (1.–3. Hafta)',
    weeklyTableEmpty: 'Haftalık karşılaştırma için en az bir seans kaydı gereklidir.',
    weekCol: 'Hafta',
    sessionsCol: 'Seans',
    activeMinCol: 'Aktif (dk)',
    pauseMinCol: 'Kopma (dk)',
    effCol: 'Çalışma %',
    ratingCol: 'Verim',
    distCol: 'Kopma',
    weekLabel: (n) => `${n}. Hafta`,
    subjectMatrixTitle: 'Hangi Derste Hangi Etken Dikkatini Dağıtıyor?',
    timesDistracted: (n) => `${n} kez kopma`,
    topCauseLabel: 'En büyük etken:',
    timesUnit: 'kez',
    noSubjectData: 'Bu filtrede ders verisi bulunmuyor.',
    timeOfDayTitle: 'Günün Hangi Saatlerinde Dikkatin Daha Çok Dağılıyor?',
    distractionShort: 'Kopma',
    avgRatingShort: 'Ort. Verim:',
    sessionsLower: 'seans',
    overallDistTitle: 'Dikkatini En Çok Dağıtan Etkenler',
    noDistData: 'Hiç dikkat dağıtıcı kaydı yok.',
    pastSessionsTitle: 'Çalışma Seansı Kayıtların ve Notların',
    timePrefix: 'Saat',
    actualShort: 'Aktif:',
    pauseShort: 'Kopma:',
    effBadge: 'Verim:',
    deleteModalTitle: 'Hedefi Silmek İstiyor Musun?',
    deleteModalDesc: (title) => `"${title}" hedefi ve bu hedefe bağlı çalışma seansı kayıtları silinecek.`,
    cancelBtn: 'Vazgeç',
    confirmDeleteBtn: 'Evet, Sil',
    guideModalTitle: 'MCII Uygulama Rehberi',
    guideP1Title: '1. Hedef ve Süre Belirleme:',
    guideP1Body: 'Hedef kartlarında başlangıç ve hedef değerini, bitiş tarihini ve 4 dikkat kesintisi türü için ayrı "Eğer-O Zaman" planlarını oluşturabilirsin.',
    guideP2Title: '2. Çalışma Seansı (Zaman Etüdü):',
    guideP2Body: 'Seansa başlarken planladığın süreyi girersin. Dersten her koptuğunda ilgili çetele butonuna basarsın; aktif çalışma sayacı durur ve o kategoriye özel çözüm planın ekrana gelir. Planlanan toplam blok süresi dolduğunda kronometre otomatik olarak durur.',
    guideP3Title: '3. Analiz ve Excel Dışa Aktarma:',
    guideP3Body: 'Haftalık gelişimini (1.–3. hafta), kopma sürelerini ve verimlilik oranlarını takip edebilir; tüm verilerini rumuzunla adlandırılmış Excel (CSV) dosyası olarak indirebilirsin.',
    guideP4Title: '4. Gizlilik ve Kalıcı Kayıt:',
    guideP4Body: 'Yaptığın tüm değişiklikler ve çalışma seansları yalnızca cihazının yerel hafızasına kaydedilir; dış sunucuya aktarılmaz.',
    understoodBtn: 'Anladım',
    navGoals: 'Hedefler',
    navReports: 'Raporlar',
    fallbackIf: (cat) => `"${cat}" nedeniyle dersten koparsam`,
    fallbackThen: 'Derin bir nefes alıp dikkat dağıtıcıyı uzaklaştıracak ve mevcut görevime geri döneceğim.',
    categories: {
      'Telefon/Bildirim': {
        label: 'Telefon/Bildirim',
        ifPlaceholder: 'Örn: Telefon ekranı aydınlanıp bildirim düşerse...',
        thenPlaceholder: 'Örn: Telefonu yüzüstü çevirip Rahatsız Etme moduna alacağım.'
      },
      'Hayal Kurma': {
        label: 'Hayal Kurma',
        ifPlaceholder: 'Örn: Okuduğum konudan kopup zihnim başka yere kayarsa...',
        thenPlaceholder: 'Örn: Gözlerimi ilk kelimeye sabitleyip kalemle satır takibi yapacağım.'
      },
      'Görev Değiştirme': {
        label: 'Görev Değiştirme',
        ifPlaceholder: 'Örn: Çalıştığım dersten sıkılıp başka derse geçmek istersem...',
        thenPlaceholder: 'Örn: Mevcut konuda 10 dakika daha kalıp o bloğu tamamlayacağım.'
      },
      'Diğer': {
        label: 'Diğer',
        ifPlaceholder: 'Örn: Dış ses, yorgunluk veya kaygı dikkatimi bölerse...',
        thenPlaceholder: 'Örn: Kulaklık takacak ya da su içip yalnızca önümdeki soruya odaklanacağım.'
      }
    },
    metrics: {
      Puan: 'Not / Puan',
      Soru: 'Çözülen Soru',
      Sayfa: 'Okunan Sayfa',
      Deneme: 'Deneme Sayısı',
      Saat: 'Çalışma Saati',
      Konu: 'Tamamlanan Konu',
      Kelime: 'Öğrenilen Kelime'
    },
    timeSlots: {
      morning: 'Sabah (06-12)',
      afternoon: 'Öğle (12-18)',
      evening: 'Akşam (18-24)',
      night: 'Gece (00-06)'
    },
    timeBlocksFull: {
      morning: 'Sabah (06:00-12:00)',
      afternoon: 'Öğleden Sonra (12:00-18:00)',
      evening: 'Akşam (18:00-24:00)',
      night: 'Gece (00:00-06:00)'
    }
  },
  en: {
    appName: 'MCII Focus Coach',
    onboardingSubtitle: 'Set measurable goals, anticipate obstacles, and maximize your focus using the evidence-based MCII technique.',
    aliasLabel: 'YOUR ALIAS / NICKNAME',
    aliasPlaceholder: 'e.g., Focus01, Star, P1...',
    fieldLabel: 'TARGET FIELD / TRACK (OPTIONAL)',
    fieldPlaceholder: 'e.g., STEM / SAT / AP / Olympiad',
    continueBtn: 'Continue',
    welcomeTitle: (name) => `Welcome, ${name}!`,
    welcomeSubtitle: 'Let’s take a quick look at how to use the app.',
    step1Title: 'Set Measurable Goals & Deadlines with MCII',
    step1Desc: 'Instead of vague goals, enter your starting value, target value (e.g., 0 to 300 questions), and deadline. Create specific "If–Then" plans for each distraction type.',
    step2Title: 'Smart Stopwatch & Time-Study Tracking',
    step2Desc: 'Start a timed study block. Whenever phone notifications, daydreaming, task switching, or other distractions occur, tap the corresponding button. Active time pauses and your specific If–Then plan appears!',
    step3Title: 'Weekly Analytics & Excel Data Export',
    step3Desc: 'Track your Week 1–3 progress, distraction durations, and efficiency rates. Export all your anonymized data to Excel (CSV) with a single click.',
    startAppBtn: 'Start Using the App',
    helloUser: (name) => `Hello, ${name}!`,
    autoSaved: 'Your data is saved locally on your device.',
    editProfileTitle: 'Edit Alias / Profile',
    howToUseTitle: 'How to Use?',
    editHintBar: 'You can edit or delete goals using the icons on each card.',
    clearAllBtn: 'Clear All',
    editGoalTitle: 'Edit Goal & MCII Plans',
    newGoalTitle: 'MCII Goal Planning Form',
    editGoalSub: 'Update goal targets or category-specific If–Then plans.',
    newGoalSub: 'Create a concrete, measurable, and time-bound goal.',
    goalStep1: 'STEP 1: WHAT IS YOUR CONCRETE GOAL?',
    goalTitlePlaceholder: 'e.g., Solve 300 Math problems in 3 weeks',
    deadlineLabel: 'TARGET DEADLINE',
    metricLabel: 'MEASUREMENT UNIT',
    startValLabel: 'START',
    currentValLabel: 'CURRENT',
    targetValLabel: 'TARGET',
    goalStep2: 'STEP 2: IMAGINE THE BEST OUTCOME',
    bestOutcomePlaceholder: 'How will you feel when you achieve this goal? (e.g., Less exam stress, higher confidence...)',
    goalStep34: 'STEPS 3 & 4: CATEGORY-SPECIFIC "IF… THEN…" PLANS',
    goalStep34Hint: 'During a session, tapping a distraction button will immediately display the plan you wrote for that category.',
    ifTag: 'IF',
    thenTag: 'THEN',
    updateGoalBtn: 'Update Changes',
    saveGoalBtn: 'Save Goal & MCII Plan',
    noGoalsTitle: 'No Goals Yet',
    noGoalsDesc: 'Create your own study goals and "If–Then" plans to get started, or restore the sample goals.',
    createGoalBtn: 'Create New Goal',
    restoreSampleBtn: 'Restore Sample Goals',
    expired: 'Expired',
    daysLeft: (d) => `${d} Days Left`,
    studiedSummary: (min, count) => `${min} min studied (${count} sessions)`,
    editGoalTooltip: 'Edit Goal',
    deleteGoalTooltip: 'Delete Goal',
    studyBtn: 'Study',
    startShort: 'Start',
    currentShort: 'Current',
    targetShort: 'Target',
    goalAttainmentLabel: 'Goal Attainment Rate',
    updateCurrentLabel: (metric) => `Current ${metric}:`,
    bestOutcomeLabel: 'Best Outcome:',
    mciiPlansLabel: 'Your MCII "If–Then" Plans:',
    viewGoalReport: 'View Detailed Report for This Goal',
    timerSetupTitle: 'Study Session Time-Study Log',
    timerSetupDesc: 'Complete Section 1 before starting. Whenever you lose focus, tap the matching distraction button to pause active study time.',
    selectGoalLabel: '1. WHICH GOAL ARE YOU STUDYING FOR?',
    selectGoalPlaceholder: 'Select a goal...',
    subjectLabel: '2. SUBJECT / TOPIC FOR THIS SESSION',
    subjectPlaceholder: 'e.g., Mathematics - Derivatives',
    plannedTimeLabel: '3. PLANNED BLOCK DURATION (MINUTES - MANUAL)',
    errSelectGoal: 'Please select a goal first.',
    errEnterSubject: 'Please enter the subject or topic.',
    errEnterTime: 'Please enter a valid duration in minutes.',
    startTimerBtn: 'Start Study Timer',
    activeStudyTime: 'Active Study Time',
    plannedBlock: 'Planned Block',
    minutesUnit: 'minutes',
    minShort: 'min',
    secShort: 'sec',
    statusLabel: 'Status',
    statusActive: 'Actively Studying',
    statusPaused: 'Paused (Block Timer Continues)',
    remainingBlock: 'Remaining Block',
    elapsedTotal: 'Total Elapsed',
    pauseBreak: 'Distraction / Break',
    distractedHeader: 'Focus Lost! Apply Your MCII Plan',
    resumeAfterPlanBtn: 'Plan Applied — Return to Task & Resume',
    tallyPrompt: 'Tap Whenever You Lose Focus (Pauses Active Study Timer)',
    tickUnit: 'count',
    pauseTimerBtn: 'Pause Timer',
    resumeTimerBtn: 'Resume Timer',
    finishSessionBtn: 'End Session',
    timeUpBanner: (min) => `Your planned ${min}-minute block is complete! The timer stopped automatically.`,
    endModalTitle: 'Section 3: Post-Session Evaluation',
    activeStudyLabel: 'Active Study',
    rateSessionLabel: 'RATE THIS SESSION (1 = Very Low, 10 = Very High):',
    sessionNotesLabel: 'BRIEF SESSION NOTE (Optional)',
    sessionNotesPlaceholder: 'e.g., "First 20 min were great, then got distracted." or "Keeping phone away helped."',
    progressReminderTitle: 'Don’t Forget to Log Your Goal Progress!',
    progressReminderLabel: (metric) => `How many ${metric} did you add in this session? (Optional)`,
    progressReminderHint: (curr, target, metric) => `Current: ${curr} / ${target} ${metric}`,
    progressPreview: (nextVal, metric) => `New total after saving: ${nextVal} ${metric}`,
    goBackBtn: 'Go Back',
    saveAndReportBtn: 'Save & View Report',
    noNoteDefault: 'No notes added.',
    reportsTitle: 'Analytics & Reports',
    reportsSubtitle: 'Review your weekly trend, distraction duration, and study efficiency.',
    exportExcelBtn: 'Export All Data (Excel / CSV)',
    exportNoData: 'No session records available to export yet.',
    exportSuccess: (file) => `${file} downloaded successfully.`,
    filterByGoal: 'Filter Report by Goal',
    allGoalsOption: 'All Goals Overview',
    weekFilter: 'Last 7 Days',
    monthFilter: 'Last 30 Days',
    allTimeFilter: 'All Time',
    coachTitle: 'Personalized Weekly Study Recommendation',
    coachEmpty: 'No study sessions found for this filter yet. Complete a session to receive personalized insights on your best study hours and focus patterns.',
    cardGoalAttainment: 'Goal Attainment Rate',
    cardActualStudy: 'Actual Study Rate',
    cardSessionEff: 'Session Efficiency',
    pauseSummaryTitle: 'Distraction & Focus-Loss Duration Summary',
    totalPauseLabel: 'Total Distraction Time',
    avgPauseLabel: 'Avg. Distraction / Session',
    totalDistractionCountLabel: 'Total Interruptions',
    weeklyTableTitle: 'Weekly Progress Comparison (Weeks 1–3)',
    weeklyTableEmpty: 'At least one completed session is required for weekly comparison.',
    weekCol: 'Week',
    sessionsCol: 'Sessions',
    activeMinCol: 'Active (m)',
    pauseMinCol: 'Lost (m)',
    effCol: 'Study %',
    ratingCol: 'Rating',
    distCol: 'Count',
    weekLabel: (n) => `Week ${n}`,
    subjectMatrixTitle: 'Distractions by Subject & Primary Trigger',
    timesDistracted: (n) => `${n} interruptions`,
    topCauseLabel: 'Primary trigger:',
    timesUnit: 'times',
    noSubjectData: 'No subject data for this filter.',
    timeOfDayTitle: 'Distractions by Time of Day',
    distractionShort: 'Interruptions',
    avgRatingShort: 'Avg. Rating:',
    sessionsLower: 'sessions',
    overallDistTitle: 'Top Distraction Categories',
    noDistData: 'No distraction records yet.',
    pastSessionsTitle: 'Study Session Logs & Reflections',
    timePrefix: 'At',
    actualShort: 'Active:',
    pauseShort: 'Lost:',
    effBadge: 'Rating:',
    deleteModalTitle: 'Delete This Goal?',
    deleteModalDesc: (title) => `"${title}" and all study sessions linked to it will be permanently deleted.`,
    cancelBtn: 'Cancel',
    confirmDeleteBtn: 'Yes, Delete',
    guideModalTitle: 'MCII App User Guide',
    guideP1Title: '1. Goal & Deadline Planning:',
    guideP1Body: 'Set start/target values, deadlines, and separate "If–Then" plans for all 4 distraction categories.',
    guideP2Title: '2. Time-Study Session:',
    guideP2Body: 'Enter your planned block duration. Tap a distraction button whenever focus breaks; active time pauses and your tailored If–Then plan appears. The timer automatically stops when your planned block ends.',
    guideP3Title: '3. Analytics & Excel Export:',
    guideP3Body: 'Monitor your Week 1–3 progress, distraction durations, and efficiency rates, and export all records as an alias-labeled Excel (CSV) file.',
    guideP4Title: '4. Privacy & Local Storage:',
    guideP4Body: 'All goals and session logs are stored strictly in your browser’s local storage; no personal data is transmitted to external servers.',
    understoodBtn: 'Got It',
    navGoals: 'Goals',
    navReports: 'Reports',
    fallbackIf: (cat) => `I get distracted by "${cat}" during study`,
    fallbackThen: 'I will take a deep breath, remove the distraction, and immediately return to my current task.',
    categories: {
      'Telefon/Bildirim': {
        label: 'Phone / Notification',
        ifPlaceholder: 'e.g., My phone screen lights up with a notification...',
        thenPlaceholder: 'e.g., I will turn it face down and enable Do Not Disturb.'
      },
      'Hayal Kurma': {
        label: 'Daydreaming',
        ifPlaceholder: 'e.g., My mind drifts away from the paragraph I am reading...',
        thenPlaceholder: 'e.g., I will refocus on the first word and track lines with a pen.'
      },
      'Görev Değiştirme': {
        label: 'Task Switching',
        ifPlaceholder: 'e.g., I feel bored and want to switch to another subject...',
        thenPlaceholder: 'e.g., I will stay on the current topic for 10 more minutes.'
      },
      'Diğer': {
        label: 'Other',
        ifPlaceholder: 'e.g., Noise, fatigue, or anxiety interrupts my focus...',
        thenPlaceholder: 'e.g., I will put on headphones or drink water and focus on one question.'
      }
    },
    metrics: {
      Puan: 'Score / Grade',
      Soru: 'Questions Solved',
      Sayfa: 'Pages Read',
      Deneme: 'Practice Tests',
      Saat: 'Study Hours',
      Konu: 'Topics Completed',
      Kelime: 'Words Learned'
    },
    timeSlots: {
      morning: 'Morning (06-12)',
      afternoon: 'Afternoon (12-18)',
      evening: 'Evening (18-24)',
      night: 'Night (00-06)'
    },
    timeBlocksFull: {
      morning: 'Morning (06:00-12:00)',
      afternoon: 'Afternoon (12:00-18:00)',
      evening: 'Evening (18:00-24:00)',
      night: 'Night (00:00-06:00)'
    }
  }
};

const createEmptyObstaclePlans = () =>
  DISTRACTION_KEYS.map(key => ({
    category: key,
    ifText: '',
    thenText: ''
  }));

const INITIAL_GOALS = [
  {
    id: 'g1',
    title: 'Matematik Notumu 85\'e Çıkarmak',
    bestOutcome: 'Dönem sonunda takdir belgesi almak, ailemi gururlandırmak ve sınav stresimi azaltmak.',
    obstacles: [
      { id: 'o1', category: 'Telefon/Bildirim', if: 'Telefonumdan bildirim sesi gelirse ve bakmak istersem', then: 'Telefonumu çalışma süresince uçak moduna alıp başka odaya koyacağım.' },
      { id: 'o2', category: 'Hayal Kurma', if: 'Çözdüğüm sorudan kopup zihnim başka düşüncelere kayarsa', then: 'Kalem ucuyla soruyu baştan yavaşça okuyup dikkatimi toplayacağım.' },
      { id: 'o3', category: 'Görev Değiştirme', if: 'Zor bir soruda takılıp başka bir derse geçmek istersem', then: 'Soruyu işaretleyip 3 derin nefes alarak aynı konunun bir sonraki sorusuna geçeceğim.' },
      { id: 'o4', category: 'Diğer', if: 'Yorgunluk veya dış ses nedeniyle odaklanmam düşerse', then: 'Kısa bir nefes alıp su içecek ve masaya dönerek seansı tamamlayacağım.' }
    ],
    metric: 'Puan',
    startValue: 65,
    currentValue: 78,
    targetValue: 85,
    deadline: '2026-12-25',
    isCompleted: false,
    createdAt: '2026-11-01'
  },
  {
    id: 'g2',
    title: 'Tales Fen Bilimleri Olimpiyatı Hazırlığı',
    bestOutcome: 'Ulusal finale kalmak ve bilimsel proje yetkinliğimi kanıtlamak.',
    obstacles: [
      { id: 'o5', category: 'Telefon/Bildirim', if: 'Sosyal medya bildirimi gelip elime telefonu alırsam', then: 'Uygulamayı kapatıp telefonu çantamın içine koyacağım.' },
      { id: 'o6', category: 'Hayal Kurma', if: 'Uzun sorularda dalgınlığa kapılırsam', then: 'Önemli ifadelerin altını çizerek soruyu yeniden okuyacağım.' },
      { id: 'o7', category: 'Görev Değiştirme', if: 'Olimpiyat sorularından sıkılıp kolay testlere geçmek istersem', then: 'Mevcut testte en az 5 soru daha çözmeden konuyu değiştirmeyeceğim.' },
      { id: 'o8', category: 'Diğer', if: 'Okuldan eve çok yorgun gelirsem', then: '20 dakika dinlenip alarm kuracağım, alarm çalınca masaya geçeceğim.' }
    ],
    metric: 'Soru',
    startValue: 0,
    currentValue: 140,
    targetValue: 250,
    deadline: '2026-12-10',
    isCompleted: false,
    createdAt: '2026-11-05'
  },
  {
    id: 'g3',
    title: 'AP Fizik 1 Deneme Çözümleri',
    bestOutcome: 'Tüm konuları eksiksiz tamamlayıp sınavdan 5 tam puan almak.',
    obstacles: [
      { id: 'o9', category: 'Telefon/Bildirim', if: 'Deneme çözerken telefonumun ekranı yanarsa', then: 'Ekrana bakmadan telefonu sessize alıp uzaklaştıracağım.' },
      { id: 'o10', category: 'Hayal Kurma', if: 'Çalışırken hayal kurmaya başlarsam', then: 'Dik oturuşumu düzeltip 2 derin nefes alarak soruya döneceğim.' },
      { id: 'o11', category: 'Görev Değiştirme', if: 'Denemenin ortasında not düzenleme gibi yan işlere kayarsam', then: 'Yan işi bırakıp elimdeki denemenin kalan sorularını bitireceğim.' },
      { id: 'o12', category: 'Diğer', if: 'Süre yetmeyecek kaygısı yaşarsam', then: 'Saate bakmayı bırakıp yalnızca önümdeki tek soruya odaklanacağım.' }
    ],
    metric: 'Deneme',
    startValue: 0,
    currentValue: 4,
    targetValue: 10,
    deadline: '2026-11-30',
    isCompleted: false,
    createdAt: '2026-11-10'
  }
];

const INITIAL_SESSIONS = [
  { 
    id: 's1', 
    goalId: 'g1', 
    subject: 'Matematik - Türev', 
    date: '2026-11-02', 
    startTime: '19:30', 
    plannedMin: 60, 
    actualMin: 45,
    activeSeconds: 2700,
    totalElapsedSeconds: 3600,
    pausedSeconds: 900,
    completedByTimeLimit: true,
    rating: 6, 
    notes: 'İlk 25 dakika çok iyiydi ama sonra telefon bildirimleri dikkatimi dağıttı.',
    distractions: { 'Telefon/Bildirim': 3, 'Hayal Kurma': 1, 'Görev Değiştirme': 0, 'Diğer': 1 } 
  },
  { 
    id: 's2', 
    goalId: 'g1', 
    subject: 'Matematik - Fonksiyonlar', 
    date: '2026-11-10', 
    startTime: '10:00', 
    plannedMin: 50, 
    actualMin: 48,
    activeSeconds: 2880,
    totalElapsedSeconds: 3000,
    pausedSeconds: 120,
    completedByTimeLimit: true,
    rating: 9, 
    notes: 'Sabah çalışmak çok verimli oldu, telefonu diğer odaya bıraktım.',
    distractions: { 'Telefon/Bildirim': 0, 'Hayal Kurma': 1, 'Görev Değiştirme': 0, 'Diğer': 0 } 
  },
  { 
    id: 's3', 
    goalId: 'g2', 
    subject: 'Fen Bilimleri - Astronomi', 
    date: '2026-11-16', 
    startTime: '15:30', 
    plannedMin: 60, 
    actualMin: 55,
    activeSeconds: 3300,
    totalElapsedSeconds: 3600,
    pausedSeconds: 300,
    completedByTimeLimit: true,
    rating: 8, 
    notes: 'Olimpiyat soruları zorlayıcıydı ama odaklanmamı korudum.',
    distractions: { 'Telefon/Bildirim': 1, 'Hayal Kurma': 1, 'Görev Değiştirme': 0, 'Diğer': 1 } 
  },
  { 
    id: 's4', 
    goalId: 'g3', 
    subject: 'AP Fizik - Kinematik', 
    date: '2026-11-18', 
    startTime: '21:15', 
    plannedMin: 45, 
    actualMin: 35,
    activeSeconds: 2100,
    totalElapsedSeconds: 2700,
    pausedSeconds: 600,
    completedByTimeLimit: true,
    rating: 7, 
    notes: 'Akşam saatinde yorgundum ama MCII planını uygulayarak toparladım.',
    distractions: { 'Telefon/Bildirim': 1, 'Hayal Kurma': 2, 'Görev Değiştirme': 1, 'Diğer': 0 } 
  }
];

const COLORS = ['#4f46e5', '#ef4444', '#f59e0b', '#10b981'];

const sanitizeFilenamePart = (raw) => {
  if (!raw || !raw.trim()) return 'Ogrenci';
  const trMap = { 'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ş': 's', 'Ş': 'S', 'ü': 'u', 'Ü': 'U' };
  const mapped = raw.trim().split('').map(ch => trMap[ch] || ch).join('');
  const cleaned = mapped.replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '');
  return cleaned || 'Ogrenci';
};

export default function App() {
  // --- DİL SEÇİMİ (TR / EN) ---
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('mcii_lang');
    return saved === 'en' ? 'en' : 'tr';
  });
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('mcii_lang', lang);
  }, [lang]);

  // --- KALICI HAFIZA (LOCALSTORAGE) İLE BAŞLATMA ---
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('mcii_userName') || '';
  });

  const [userGrade, setUserGrade] = useState(() => {
    return localStorage.getItem('mcii_userGrade') || '';
  });

  const [onboardingStep, setOnboardingStep] = useState(() => {
    const savedStep = localStorage.getItem('mcii_onboardingStep');
    const savedName = localStorage.getItem('mcii_userName');
    if (savedStep !== null) return Number(savedStep);
    return savedName ? 2 : 0;
  });

  const [goals, setGoals] = useState(() => {
    try {
      const savedGoals = localStorage.getItem('mcii_goals');
      return savedGoals ? JSON.parse(savedGoals) : INITIAL_GOALS;
    } catch (e) {
      return INITIAL_GOALS;
    }
  });

  const [sessions, setSessions] = useState(() => {
    try {
      const savedSessions = localStorage.getItem('mcii_sessions');
      return savedSessions ? JSON.parse(savedSessions) : INITIAL_SESSIONS;
    } catch (e) {
      return INITIAL_SESSIONS;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [exportMessage, setExportMessage] = useState('');

  // --- VERİLER DEĞİŞTİKÇE HAFIZAYA KAYDETME ---
  useEffect(() => {
    localStorage.setItem('mcii_userName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('mcii_userGrade', userGrade);
  }, [userGrade]);

  useEffect(() => {
    localStorage.setItem('mcii_onboardingStep', String(onboardingStep));
  }, [onboardingStep]);

  useEffect(() => {
    localStorage.setItem('mcii_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('mcii_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Kronometre ve Seans State'leri (Klasik Zaman Etüdü - Toplam Blok Süresi)
  const [activeGoal, setActiveGoal] = useState(null);
  const [sessionSubject, setSessionSubject] = useState('');
  const [plannedTime, setPlannedTime] = useState(45);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // Aktif (net) çalışma süresi (saniye)
  const [totalElapsedTime, setTotalElapsedTime] = useState(0); // Toplam (brüt) blok süresi (saniye)
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentDistractions, setCurrentDistractions] = useState({ ...EMPTY_DISTRACTIONS });
  const [activeObstacle, setActiveObstacle] = useState(null); 
  const [uiMessage, setUiMessage] = useState('');
  
  // Seans Sonu Değerlendirme Modalı State'leri
  const [showEndModal, setShowEndModal] = useState(false);
  const [sessionRating, setSessionRating] = useState(8);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionProgressDelta, setSessionProgressDelta] = useState('');

  // Yeni Hedef Ekleme ve Düzenleme State'leri
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    bestOutcome: '',
    metric: 'Puan',
    startValue: 0,
    currentValue: 0,
    targetValue: 100,
    deadline: '2026-12-31'
  });
  const [newObstacles, setNewObstacles] = useState(createEmptyObstaclePlans());

  // Rapor Filtreleri
  const [selectedReportGoalId, setSelectedReportGoalId] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [showGuideModal, setShowGuideModal] = useState(false);

  const plannedSeconds = Math.max(1, (Number(plannedTime) || 1) * 60);

  // Dil Değiştirme Bileşeni
  const renderLangToggle = (dark = false) => (
    <div className={`inline-flex items-center rounded-xl p-0.5 border text-[11px] font-extrabold ${
      dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <button
        type="button"
        onClick={() => setLang('tr')}
        className={`px-2 py-1 rounded-lg transition-all ${
          lang === 'tr'
            ? 'bg-indigo-600 text-white'
            : dark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        TR
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded-lg transition-all ${
          lang === 'en'
            ? 'bg-indigo-600 text-white'
            : dark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        EN
      </button>
    </div>
  );

  // Her yeni seans veya hedef değişiminde kopmaları ve kronometreyi sıfırla
  const resetSessionState = () => {
    setIsSessionActive(false);
    setIsRunning(false);
    setElapsedTime(0);
    setTotalElapsedTime(0);
    setIsTimeUp(false);
    setCurrentDistractions({ ...EMPTY_DISTRACTIONS });
    setActiveObstacle(null);
    setShowEndModal(false);
    setSessionProgressDelta('');
  };

  // Klasik Zaman Etüdü Zamanlayıcısı
  useEffect(() => {
    if (!isSessionActive || showEndModal || isTimeUp) return;

    const interval = setInterval(() => {
      setTotalElapsedTime(prev => Math.min(plannedSeconds, prev + 1));
      if (isRunning) {
        setElapsedTime(prev => Math.min(plannedSeconds, prev + 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, isRunning, showEndModal, isTimeUp, plannedSeconds]);

  // Planlanan toplam blok süresi dolduğunda kronometreyi otomatik durdur
  useEffect(() => {
    if (isSessionActive && totalElapsedTime >= plannedSeconds) {
      setIsRunning(false);
      setIsSessionActive(false);
      setActiveObstacle(null);
      setIsTimeUp(true);
      setShowEndModal(true);
    }
  }, [isSessionActive, totalElapsedTime, plannedSeconds]);

  const formatTime = (totalSeconds) => {
    const safeSec = Math.max(0, Math.round(totalSeconds || 0));
    const m = Math.floor(safeSec / 60).toString().padStart(2, '0');
    const s = (safeSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatMinutesText = (totalSeconds) => {
    const safeSec = Math.max(0, Math.round(totalSeconds || 0));
    const mins = Math.floor(safeSec / 60);
    const secs = safeSec % 60;
    if (mins === 0) return `${secs} ${t.secShort}`;
    if (secs === 0) return `${mins} ${t.minShort}`;
    return `${mins} ${t.minShort} ${secs} ${t.secShort}`;
  };

  const getSessionPausedSeconds = (s) => {
    if (typeof s.pausedSeconds === 'number') return Math.max(0, s.pausedSeconds);
    if (typeof s.totalElapsedSeconds === 'number' && typeof s.activeSeconds === 'number') {
      return Math.max(0, s.totalElapsedSeconds - s.activeSeconds);
    }
    return Math.max(0, ((s.plannedMin || 0) - (s.actualMin || 0)) * 60);
  };

  const getSessionActiveSeconds = (s) => {
    if (typeof s.activeSeconds === 'number') return Math.max(0, s.activeSeconds);
    return Math.max(0, (s.actualMin || 0) * 60);
  };

  const getSessionTotalBlockSeconds = (s) => {
    if (typeof s.totalElapsedSeconds === 'number') return Math.max(0, s.totalElapsedSeconds);
    return Math.max(getSessionActiveSeconds(s), (s.plannedMin || 0) * 60);
  };

  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateProgress = (start, current, target) => {
    if (target === start) return 100;
    const progress = ((current - start) / (target - start)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  };

  const getTimeSlotKey = (startTime) => {
    const hour = parseInt((startTime || '12:00').split(':')[0], 10);
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    return 'night';
  };

  const getWeekNumberForSession = (sessionDateStr, allSessionsList) => {
    if (!allSessionsList || allSessionsList.length === 0) return 1;
    const dates = allSessionsList
      .map(s => new Date(s.date))
      .filter(d => !isNaN(d.getTime()))
      .sort((a, b) => a - b);
    if (dates.length === 0) return 1;
    const firstDate = new Date(dates[0]);
    firstDate.setHours(0, 0, 0, 0);
    const curr = new Date(sessionDateStr);
    curr.setHours(0, 0, 0, 0);
    if (isNaN(curr.getTime())) return 1;
    const diffDays = Math.max(0, Math.floor((curr - firstDate) / (1000 * 60 * 60 * 24)));
    return Math.floor(diffDays / 7) + 1;
  };

  const getCategoryLabel = (key) => {
    return (t.categories[key] && t.categories[key].label) ? t.categories[key].label : key;
  };

  // --- EXCEL / CSV DIŞA AKTARMA (RUMUZ İLE ADLANDIRILMIŞ, SPSS & EXCEL UYUMLU) ---
  const handleExportCSV = () => {
    if (sessions.length === 0) {
      setExportMessage(t.exportNoData);
      setTimeout(() => setExportMessage(''), 3500);
      return;
    }

    const delimiter = lang === 'tr' ? ';' : ',';
    const escapeCell = (val) => {
      const str = String(val === null || val === undefined ? '' : val).replace(/\r?\n/g, ' ');
      if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = lang === 'tr'
      ? [
          'Rumuz', 'Hedef_Alani', 'Seans_ID', 'Hafta_No', 'Tarih', 'Baslangic_Saati', 'Zaman_Dilimi',
          'Hedef_Adi', 'Hedef_Birimi', 'Hedef_Baslangic', 'Hedef_Guncel', 'Hedef_Deger', 'Hedefe_Ulasma_Yuzde',
          'Ders_Konu', 'Planlanan_Dk', 'Aktif_Calisma_Dk', 'Aktif_Calisma_Sn', 'Toplam_Blok_Sn',
          'Kopma_Suresi_Sn', 'Kopma_Suresi_Dk', 'Gercek_Calisma_Orani_Yuzde',
          'Kopma_Telefon_Bildirim', 'Kopma_Hayal_Kurma', 'Kopma_Gorev_Degistirme', 'Kopma_Diger',
          'Toplam_Kopma_Sayisi', 'Sure_Doldu_Mu', 'Seans_Eklenen_Ilerleme', 'Verim_Puani_10', 'Seans_Notu'
        ]
      : [
          'Alias', 'Target_Field', 'Session_ID', 'Week_No', 'Date', 'Start_Time', 'Time_Slot',
          'Goal_Title', 'Goal_Metric', 'Goal_Start', 'Goal_Current', 'Goal_Target', 'Goal_Attainment_Pct',
          'Subject_Topic', 'Planned_Min', 'Active_Study_Min', 'Active_Study_Sec', 'Total_Block_Sec',
          'Distraction_Duration_Sec', 'Distraction_Duration_Min', 'Actual_Study_Rate_Pct',
          'Dist_Phone_Notification', 'Dist_Daydreaming', 'Dist_Task_Switching', 'Dist_Other',
          'Total_Distractions', 'Completed_By_Time_Limit', 'Session_Progress_Added', 'Efficiency_Rating_10', 'Session_Notes'
        ];

    const sortedSessions = [...sessions].sort((a, b) => {
      const da = `${a.date} ${a.startTime}`;
      const db = `${b.date} ${b.startTime}`;
      return da.localeCompare(db);
    });

    const rows = sortedSessions.map(s => {
      const goalObj = goals.find(g => g.id === s.goalId);
      const weekNo = getWeekNumberForSession(s.date, sortedSessions);
      const slotKey = getTimeSlotKey(s.startTime);
      const activeSec = getSessionActiveSeconds(s);
      const totalBlockSec = getSessionTotalBlockSeconds(s);
      const pausedSec = getSessionPausedSeconds(s);
      const pausedMin = (pausedSec / 60).toFixed(2);
      const plannedMin = s.plannedMin || 1;
      const effPct = Math.min(100, Math.round((s.actualMin / plannedMin) * 100));
      const dPhone = (s.distractions && s.distractions['Telefon/Bildirim']) || 0;
      const dDream = (s.distractions && s.distractions['Hayal Kurma']) || 0;
      const dSwitch = (s.distractions && s.distractions['Görev Değiştirme']) || 0;
      const dOther = (s.distractions && s.distractions['Diğer']) || 0;
      const dTotal = dPhone + dDream + dSwitch + dOther;
      const goalPct = goalObj ? calculateProgress(goalObj.startValue, goalObj.currentValue, goalObj.targetValue) : '';
      const timeLimitStr = s.completedByTimeLimit
        ? (lang === 'tr' ? 'Evet' : 'Yes')
        : (lang === 'tr' ? 'Hayir' : 'No');

      return [
        userName || 'Ogrenci',
        userGrade || '',
        s.id,
        weekNo,
        s.date,
        s.startTime,
        t.timeSlots[slotKey],
        goalObj ? goalObj.title : '',
        goalObj ? goalObj.metric : '',
        goalObj ? goalObj.startValue : '',
        goalObj ? goalObj.currentValue : '',
        goalObj ? goalObj.targetValue : '',
        goalPct,
        s.subject,
        s.plannedMin,
        s.actualMin,
        activeSec,
        totalBlockSec,
        pausedSec,
        lang === 'tr' ? pausedMin.replace('.', ',') : pausedMin,
        effPct,
        dPhone,
        dDream,
        dSwitch,
        dOther,
        dTotal,
        timeLimitStr,
        s.progressAdded || 0,
        s.rating,
        s.notes || ''
      ].map(escapeCell).join(delimiter);
    });

    const csvContent = '\uFEFF' + [headers.map(escapeCell).join(delimiter), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const safeAlias = sanitizeFilenamePart(userName);
    const todayStr = getTodayDateString();
    const filePrefix = lang === 'tr' ? 'MCII_Veri' : 'MCII_Data';
    const fileName = `${filePrefix}_${safeAlias}_${todayStr}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportMessage(t.exportSuccess(fileName));
    setTimeout(() => setExportMessage(''), 4000);
  };

  // Hedef Ekleme / Düzenleme Yardımcıları
  const openNewGoalForm = () => {
    setEditingGoalId(null);
    setNewGoal({
      title: '',
      bestOutcome: '',
      metric: 'Puan',
      startValue: 0,
      currentValue: 0,
      targetValue: 100,
      deadline: '2026-12-31'
    });
    setNewObstacles(createEmptyObstaclePlans());
    setShowAddGoal(true);
  };

  const handleEditGoalClick = (goal) => {
    setEditingGoalId(goal.id);
    setNewGoal({
      title: goal.title,
      bestOutcome: goal.bestOutcome,
      metric: goal.metric,
      startValue: goal.startValue,
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      deadline: goal.deadline
    });
    const mappedObstacles = DISTRACTION_KEYS.map((key, idx) => {
      const matched = (goal.obstacles || []).find(o => o.category === key);
      if (matched) {
        return { category: key, ifText: matched.if || '', thenText: matched.then || '' };
      }
      const legacy = (goal.obstacles || []).filter(o => !o.category)[idx];
      return {
        category: key,
        ifText: legacy ? legacy.if || '' : '',
        thenText: legacy ? legacy.then || '' : ''
      };
    });
    setNewObstacles(mappedObstacles);
    setShowAddGoal(true);
  };

  const confirmDeleteGoal = () => {
    if (!goalToDelete) return;
    const deletedId = goalToDelete.id;
    setGoals(prev => prev.filter(g => g.id !== deletedId));
    setSessions(prev => prev.filter(s => s.goalId !== deletedId));
    if (activeGoal && activeGoal.id === deletedId) {
      setActiveGoal(null);
      resetSessionState();
    }
    if (selectedReportGoalId === deletedId) {
      setSelectedReportGoalId('all');
    }
    setGoalToDelete(null);
  };

  const handleDistraction = (type) => {
    if (!isRunning) return;
    setIsRunning(false);
    setCurrentDistractions(prev => ({ ...prev, [type]: prev[type] + 1 }));

    const obstacles = (activeGoal && activeGoal.obstacles) ? activeGoal.obstacles : [];
    const matchedPlan = obstacles.find(o => o.category === type && o.if && o.then);

    if (matchedPlan) {
      setActiveObstacle({ ...matchedPlan, category: type });
    } else {
      setActiveObstacle({
        category: type,
        if: t.fallbackIf(getCategoryLabel(type)),
        then: t.fallbackThen
      });
    }
  };

  const handleFinishSessionConfirm = () => {
    const plannedMins = Math.max(1, Number(plannedTime) || 30);
    const actualMinutes = Math.min(plannedMins, Math.round(elapsedTime / 60));
    const pausedSeconds = Math.max(0, totalElapsedTime - elapsedTime);
    const addedProgress = Math.max(0, Number(sessionProgressDelta) || 0);
    const now = new Date();
    const newSession = {
      id: 's' + Date.now(),
      goalId: activeGoal.id,
      subject: sessionSubject,
      date: getTodayDateString(),
      startTime: now.toTimeString().slice(0, 5),
      plannedMin: plannedMins,
      actualMin: actualMinutes,
      activeSeconds: elapsedTime,
      totalElapsedSeconds: totalElapsedTime,
      pausedSeconds: pausedSeconds,
      completedByTimeLimit: isTimeUp,
      progressAdded: addedProgress,
      rating: sessionRating,
      notes: sessionNotes.trim() || t.noNoteDefault,
      distractions: { ...currentDistractions }
    };
    if (addedProgress > 0) {
      setGoals(prev => prev.map(g =>
        g.id === activeGoal.id
          ? { ...g, currentValue: (Number(g.currentValue) || 0) + addedProgress }
          : g
      ));
    }
    setSessions(prev => [...prev, newSession]);
    resetSessionState();
    setActiveGoal(null);
    setSessionSubject('');
    setSessionNotes('');
    setActiveTab('reports');
  };

  // --- ONBOARDING (KARŞILAMA VE REHBER EKRANLARI) ---
  if (onboardingStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative">
          <div className="flex justify-end mb-2">
            {renderLangToggle(false)}
          </div>
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Target className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{t.appName}</h1>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            {t.onboardingSubtitle}
          </p>
          
          <div className="space-y-4 text-left mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.aliasLabel}</label>
              <input 
                type="text" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder={t.aliasPlaceholder}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">{t.fieldLabel}</label>
              <input 
                type="text" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder={t.fieldPlaceholder}
                value={userGrade}
                onChange={(e) => setUserGrade(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={() => userName.trim() !== '' && setOnboardingStep(1)}
            disabled={!userName.trim()}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              userName.trim() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{t.continueBtn}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (onboardingStep === 1) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 max-w-lg w-full">
          <div className="flex items-start justify-between gap-2 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">{t.welcomeTitle(userName)}</h2>
                <p className="text-xs text-slate-500 font-medium">{t.welcomeSubtitle}</p>
              </div>
            </div>
            {renderLangToggle(false)}
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex gap-3.5 items-start">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t.step1Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t.step1Desc}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex gap-3.5 items-start">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t.step2Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t.step2Desc}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex gap-3.5 items-start">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{t.step3Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{t.step3Desc}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setOnboardingStep(2)}
            className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            {t.startAppBtn}
          </button>
        </div>
      </div>
    );
  }

  // --- ANA PANO (DASHBOARD) ---
  const renderDashboard = () => (
    <div className="p-4 pb-28 max-w-lg mx-auto">
      <div className="flex justify-between items-start gap-2 mb-6 pt-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-800">{t.helloUser(userName)}</h2>
            {userGrade && (
              <span className="text-[11px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                {userGrade}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{t.autoSaved}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {renderLangToggle(false)}
          <button 
            onClick={() => setOnboardingStep(0)} 
            title={t.editProfileTitle}
            className="p-2 bg-white text-slate-600 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-100"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowGuideModal(true)} 
            title={t.howToUseTitle}
            className="p-2 bg-white text-slate-600 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-100"
          >
            <Info className="w-4 h-4" />
          </button>
          <button 
            onClick={openNewGoalForm} 
            className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Örnek Verileri Temizleme Çubuğu */}
      {!showAddGoal && goals.length > 0 && (
        <div className="flex justify-between items-center bg-indigo-50/70 border border-indigo-100 px-3.5 py-2 rounded-2xl mb-4">
          <span className="text-[11px] font-semibold text-indigo-800">
            {t.editHintBar}
          </span>
          <button
            onClick={() => {
              setGoals([]);
              setSessions([]);
              setActiveGoal(null);
              resetSessionState();
              setSelectedReportGoalId('all');
            }}
            className="text-[11px] font-extrabold text-red-600 hover:text-red-700 flex items-center gap-1 shrink-0 ml-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearAllBtn}</span>
          </button>
        </div>
      )}

      {showAddGoal ? (
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 mb-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                {editingGoalId ? t.editGoalTitle : t.newGoalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {editingGoalId ? t.editGoalSub : t.newGoalSub}
              </p>
            </div>
            <button onClick={() => { setShowAddGoal(false); setEditingGoalId(null); }} className="p-1.5 rounded-lg hover:bg-slate-100">
              <X className="text-slate-400 w-5 h-5"/>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">{t.goalStep1}</label>
              <input 
                type="text" 
                placeholder={t.goalTitlePlaceholder} 
                className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none focus:border-indigo-500" 
                value={newGoal.title} 
                onChange={e => setNewGoal({...newGoal, title: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">{t.deadlineLabel}</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.deadline} 
                  onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">{t.metricLabel}</label>
                <select 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.metric} 
                  onChange={e => setNewGoal({...newGoal, metric: e.target.value})}
                >
                  {Object.entries(t.metrics).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">{t.startValLabel}</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.startValue} 
                  onChange={e => setNewGoal({...newGoal, startValue: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">{t.currentValLabel}</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.currentValue} 
                  onChange={e => setNewGoal({...newGoal, currentValue: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">{t.targetValLabel}</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.targetValue} 
                  onChange={e => setNewGoal({...newGoal, targetValue: Number(e.target.value)})} 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">{t.goalStep2}</label>
              <textarea 
                placeholder={t.bestOutcomePlaceholder} 
                className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none resize-none" 
                rows="2" 
                value={newGoal.bestOutcome} 
                onChange={e => setNewGoal({...newGoal, bestOutcome: e.target.value})}
              />
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                {t.goalStep34}
              </label>
              <p className="text-[11px] text-slate-400 mb-3">
                {t.goalStep34Hint}
              </p>
              {newObstacles.map((obs, idx) => {
                const catMeta = t.categories[obs.category] || t.categories['Diğer'];
                return (
                  <div key={obs.category} className="space-y-2 mb-3 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-lg">
                        {catMeta.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded shrink-0">{t.ifTag}</span>
                      <input 
                        type="text" 
                        placeholder={catMeta.ifPlaceholder} 
                        className="flex-1 p-2 rounded-lg text-xs outline-none border border-amber-200 bg-white" 
                        value={obs.ifText} 
                        onChange={e => {
                          const updated = [...newObstacles];
                          updated[idx] = { ...updated[idx], ifText: e.target.value };
                          setNewObstacles(updated);
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded shrink-0">{t.thenTag}</span>
                      <input 
                        type="text" 
                        placeholder={catMeta.thenPlaceholder} 
                        className="flex-1 p-2 rounded-lg text-xs outline-none border border-emerald-200 bg-white" 
                        value={obs.thenText} 
                        onChange={e => {
                          const updated = [...newObstacles];
                          updated[idx] = { ...updated[idx], thenText: e.target.value };
                          setNewObstacles(updated);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => {
                if (!newGoal.title.trim()) return;
                const formattedObstacles = newObstacles
                  .filter(o => o.ifText.trim() && o.thenText.trim())
                  .map((o, i) => ({
                    id: 'o' + Date.now() + i,
                    category: o.category,
                    if: o.ifText.trim(),
                    then: o.thenText.trim()
                  }));

                if (editingGoalId) {
                  setGoals(goals.map(g => g.id === editingGoalId ? {
                    ...g,
                    ...newGoal,
                    obstacles: formattedObstacles
                  } : g));
                  if (activeGoal && activeGoal.id === editingGoalId) {
                    setActiveGoal(prev => ({ ...prev, ...newGoal, obstacles: formattedObstacles }));
                  }
                } else {
                  const finalGoal = {
                    ...newGoal,
                    id: 'g' + Date.now(),
                    isCompleted: false,
                    createdAt: getTodayDateString(),
                    obstacles: formattedObstacles
                  };
                  setGoals([finalGoal, ...goals]);
                }

                setShowAddGoal(false);
                setEditingGoalId(null);
                setNewGoal({ title: '', bestOutcome: '', metric: 'Puan', startValue: 0, currentValue: 0, targetValue: 100, deadline: '2026-12-31' });
                setNewObstacles(createEmptyObstaclePlans());
              }} 
              className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 mt-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700"
            >
              {editingGoalId ? t.updateGoalBtn : t.saveGoalBtn}
            </button>
          </div>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center my-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base mb-1">{t.noGoalsTitle}</h3>
          <p className="text-xs text-slate-500 mb-6">{t.noGoalsDesc}</p>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={openNewGoalForm}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" /> {t.createGoalBtn}
            </button>
            <button
              onClick={() => {
                setGoals(INITIAL_GOALS);
                setSessions(INITIAL_SESSIONS);
              }}
              className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200"
            >
              <RotateCcw className="w-4 h-4" /> {t.restoreSampleBtn}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const progress = calculateProgress(goal.startValue, goal.currentValue, goal.targetValue);
            const daysLeft = getDaysRemaining(goal.deadline);
            const goalSessions = sessions.filter(s => s.goalId === goal.id);
            const totalMinutesStudied = goalSessions.reduce((acc, s) => acc + s.actualMin, 0);
            const metricDisplay = t.metrics[goal.metric] ? goal.metric : goal.metric;

            return (
              <div 
                key={goal.id} 
                className={`bg-white p-5 rounded-3xl shadow-sm border transition-all ${
                  progress >= 100 ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">{goal.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {daysLeft !== null && (
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                          daysLeft < 0 ? 'bg-red-100 text-red-700' : daysLeft <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {daysLeft < 0 ? t.expired : t.daysLeft(daysLeft)}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        {t.studiedSummary(totalMinutesStudied, goalSessions.length)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEditGoalClick(goal)}
                      title={t.editGoalTooltip}
                      className="p-2 bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGoalToDelete(goal)}
                      title={t.deleteGoalTooltip}
                      className="p-2 bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        resetSessionState();
                        setActiveGoal(goal);
                        setSessionSubject('');
                        setUiMessage('');
                        setActiveTab('timer');
                      }}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-indigo-700"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t.studyBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Sayısal Hedef İlerleme Çubuğu */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-3">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>{t.startShort}: {goal.startValue} {metricDisplay}</span>
                    <span className="text-indigo-600">{t.currentShort}: {goal.currentValue} {metricDisplay}</span>
                    <span>{t.targetShort}: {goal.targetValue} {metricDisplay}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-xs font-extrabold ${progress >= 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                      {t.goalAttainmentLabel}: %{progress}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-semibold">{t.updateCurrentLabel(metricDisplay)}</span>
                      <input 
                        type="number" 
                        className="w-16 text-xs p-1.5 border border-slate-300 rounded-lg text-center font-bold bg-white outline-none focus:border-indigo-500"
                        value={goal.currentValue}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setGoals(goals.map(g => g.id === goal.id ? { ...g, currentValue: val } : g));
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hayal ve Eğer-O Zaman Özeti */}
                <div className="space-y-2">
                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600"><strong className="text-slate-700">{t.bestOutcomeLabel}</strong> "{goal.bestOutcome}"</p>
                  </div>
                  {goal.obstacles && goal.obstacles.length > 0 && (
                    <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      <p className="text-[11px] font-bold text-amber-800 mb-1.5">{t.mciiPlansLabel}</p>
                      {goal.obstacles.map((obs) => (
                        <p key={obs.id} className="text-xs text-slate-600 leading-snug mb-1.5 last:mb-0">
                          {obs.category && (
                            <span className="inline-block text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded mr-1.5">
                              {getCategoryLabel(obs.category)}
                            </span>
                          )}
                          <strong>{t.ifTag}</strong> {obs.if} → <strong>{t.thenTag}</strong> {obs.then}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => {
                      setSelectedReportGoalId(goal.id);
                      setActiveTab('reports');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>{t.viewGoalReport}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // --- KRONOMETRE VE ÇALIŞMA SEANSI (TIMER) ---
  const renderTimer = () => {
    if (!activeGoal || (!isSessionActive && !showEndModal)) {
      return (
        <div className="p-4 pb-28 max-w-lg mx-auto">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mt-4">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-indigo-600" />
              </div>
              {renderLangToggle(false)}
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mb-1">{t.timerSetupTitle}</h2>
            <p className="text-xs text-slate-500 mb-6">{t.timerSetupDesc}</p>

            {uiMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {uiMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t.selectGoalLabel}</label>
                <select 
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 text-sm font-medium"
                  value={activeGoal ? activeGoal.id : ''}
                  onChange={(e) => {
                    resetSessionState();
                    setActiveGoal(goals.find(g => g.id === e.target.value));
                  }}
                >
                  <option value="" disabled>{t.selectGoalPlaceholder}</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t.subjectLabel}</label>
                <input 
                  type="text"
                  placeholder={t.subjectPlaceholder}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 text-sm font-medium"
                  value={sessionSubject}
                  onChange={(e) => {
                    setSessionSubject(e.target.value);
                    setUiMessage('');
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">{t.plannedTimeLabel}</label>
                <input 
                  type="number"
                  placeholder="60"
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 text-lg font-extrabold text-center text-indigo-700"
                  value={plannedTime}
                  onChange={(e) => setPlannedTime(e.target.value)}
                  min="1"
                  max="300"
                />
              </div>

              <button 
                onClick={() => {
                  if (!activeGoal) {
                    setUiMessage(t.errSelectGoal);
                    return;
                  }
                  if (!sessionSubject.trim()) {
                    setUiMessage(t.errEnterSubject);
                    return;
                  }
                  if (!plannedTime || Number(plannedTime) <= 0) {
                    setUiMessage(t.errEnterTime);
                    return;
                  }
                  setUiMessage('');
                  resetSessionState();
                  setIsSessionActive(true);
                  setIsRunning(true);
                }}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 mt-2 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" /> {t.startTimerBtn}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const remainingBlockSeconds = Math.max(0, plannedSeconds - totalElapsedTime);
    const pausedBlockSeconds = Math.max(0, totalElapsedTime - elapsedTime);
    const blockProgressPercent = Math.min(100, Math.round((totalElapsedTime / plannedSeconds) * 100));

    // SEANS SIRASI (ÇETELE VE KRONOMETRE EKRANI)
    return (
      <div className="min-h-screen bg-slate-900 p-5 flex flex-col justify-between pb-10">
        <div className="text-center pt-4">
          <span className="inline-block px-3.5 py-1 bg-slate-800 rounded-full text-indigo-400 text-xs font-bold mb-2 border border-slate-700">
            {activeGoal.title}
          </span>
          <h3 className="text-white font-bold text-lg mb-3">{sessionSubject}</h3>
          <p className="text-[11px] uppercase tracking-widest text-indigo-300 font-bold mb-1">
            {t.activeStudyTime}
          </p>
          <div className="text-6xl sm:text-7xl font-mono text-white font-extrabold tracking-tight mb-2">
            {formatTime(elapsedTime)}
          </div>
          <p className="text-slate-400 text-xs font-medium mb-4">
            {t.plannedBlock}: <strong>{plannedTime} {t.minutesUnit}</strong> • {t.statusLabel}: {isRunning ? <span className="text-emerald-400">{t.statusActive}</span> : <span className="text-amber-400">{t.statusPaused}</span>}
          </p>

          {/* Klasik Zaman Etüdü Blok Takip Çubuğu */}
          <div className="max-w-md mx-auto bg-slate-800/80 border border-slate-700 rounded-2xl p-3">
            <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.remainingBlock}</div>
                <div className="text-sm font-mono font-extrabold text-amber-400">{formatTime(remainingBlockSeconds)}</div>
              </div>
              <div className="border-x border-slate-700">
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.elapsedTotal}</div>
                <div className="text-sm font-mono font-extrabold text-slate-200">{formatTime(totalElapsedTime)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.pauseBreak}</div>
                <div className="text-sm font-mono font-extrabold text-rose-400">{formatTime(pausedBlockSeconds)}</div>
              </div>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${blockProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* MCII EĞER-O ZAMAN MÜDAHALE KARTI */}
        {activeObstacle && !isRunning && (
          <div className="bg-amber-500/15 border border-amber-500/40 p-4 rounded-2xl my-4 max-w-md w-full mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-amber-300 text-xs font-extrabold uppercase tracking-wider">{t.distractedHeader}</p>
                  {activeObstacle.category && (
                    <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {getCategoryLabel(activeObstacle.category)}
                    </span>
                  )}
                </div>
                <p className="text-white text-xs mb-1"><strong className="text-amber-400">{t.ifTag}:</strong> {activeObstacle.if}</p>
                <p className="text-white text-xs font-bold"><strong className="text-emerald-400">{t.thenTag}:</strong> {activeObstacle.then}</p>
              </div>
            </div>
            <button 
              onClick={() => { setActiveObstacle(null); setIsRunning(true); }}
              className="w-full mt-3 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-xs transition-colors"
            >
              {t.resumeAfterPlanBtn}
            </button>
          </div>
        )}

        {/* BÖLÜM 2: ÇETELE TUTMA ALANI */}
        <div className="my-4 max-w-md w-full mx-auto">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider text-center mb-3">
            {t.tallyPrompt}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DISTRACTION_KEYS.map((dist) => (
              <button
                key={dist}
                onClick={() => handleDistraction(dist)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span className="text-slate-200 text-xs font-bold text-center">{getCategoryLabel(dist)}</span>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                  <span className="text-indigo-400 font-mono font-extrabold text-base">{currentDistractions[dist]}</span>
                  <span className="text-[10px] text-slate-400">{t.tickUnit}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 max-w-md w-full mx-auto">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 ${
              isRunning ? 'bg-amber-500 text-amber-950' : 'bg-emerald-500 text-emerald-950'
            }`}
          >
            {isRunning ? t.pauseTimerBtn : <><Play className="w-4 h-4 fill-current" /> {t.resumeTimerBtn}</>}
          </button>
          <button 
            onClick={() => {
              setIsRunning(false);
              setShowEndModal(true);
            }}
            className="flex-1 py-4 bg-red-500 hover:bg-red-400 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4 fill-current" /> {t.finishSessionBtn}
          </button>
        </div>

        {/* BÖLÜM 3: SEANS SONU DEĞERLENDİRME MODALI */}
        {showEndModal && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full">
              {isTimeUp && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.timeUpBanner(plannedTime)}</span>
                </div>
              )}
              <h3 className="text-lg font-extrabold text-slate-800 mb-1">{t.endModalTitle}</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {t.plannedBlock}: <strong>{plannedTime} {t.minShort}</strong> • {t.activeStudyLabel}: <strong>{formatTime(elapsedTime)} ({Math.min(Number(plannedTime) || 30, Math.round(elapsedTime / 60))} {t.minShort})</strong> • {t.pauseBreak}: <strong>{formatTime(Math.max(0, totalElapsedTime - elapsedTime))}</strong>
              </p>

              {/* HEDEF İLERLEME HATIRLATMA VE HIZLI GÜNCELLEME KUTUSU */}
              {activeGoal && (
                <div className="mb-4 p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="text-xs font-extrabold text-indigo-900">{t.progressReminderTitle}</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 mb-2">
                    {t.progressReminderHint(activeGoal.currentValue, activeGoal.targetValue, activeGoal.metric)}
                  </p>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t.progressReminderLabel(activeGoal.metric)}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-28 p-2 bg-white border border-indigo-200 rounded-xl text-sm font-extrabold text-indigo-700 text-center outline-none focus:border-indigo-500"
                      value={sessionProgressDelta}
                      onChange={(e) => setSessionProgressDelta(e.target.value)}
                    />
                    <span className="text-xs font-bold text-slate-600">{activeGoal.metric}</span>
                  </div>
                  {Number(sessionProgressDelta) > 0 && (
                    <p className="text-[11px] font-extrabold text-emerald-700 mt-1.5">
                      {t.progressPreview((Number(activeGoal.currentValue) || 0) + Number(sessionProgressDelta), activeGoal.metric)}
                    </p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  {t.rateSessionLabel} <span className="text-indigo-600 font-extrabold">{sessionRating}/10</span>
                </label>
                <div className="grid grid-cols-10 gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <button
                      key={num}
                      onClick={() => setSessionRating(num)}
                      className={`py-2 rounded-lg text-xs font-extrabold border ${
                        sessionRating === num 
                          ? 'bg-indigo-600 text-white border-indigo-600' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">{t.sessionNotesLabel}</label>
                <textarea
                  rows="3"
                  placeholder={t.sessionNotesPlaceholder}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {!isTimeUp && (
                  <button 
                    onClick={() => setShowEndModal(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100"
                  >
                    {t.goBackBtn}
                  </button>
                )}
                <button 
                  onClick={handleFinishSessionConfirm}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {t.saveAndReportBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- GELİŞMİŞ RAPORLAR, HAFTALIK KARŞILAŞTIRMA VE EXCEL ÇIKTISI ---
  const getFilteredSessions = () => {
    const today = new Date();
    return sessions.filter(s => {
      const goalMatch = selectedReportGoalId === 'all' || s.goalId === selectedReportGoalId;
      if (!goalMatch) return false;

      if (selectedTimeRange === 'all') return true;
      const sessionDate = new Date(s.date);
      const diffDays = Math.ceil((today - sessionDate) / (1000 * 60 * 60 * 24));
      if (selectedTimeRange === 'week') return diffDays <= 7;
      if (selectedTimeRange === 'month') return diffDays <= 30;
      return true;
    });
  };

  const generateSmartCoachAdvice = (filteredSessions, selectedGoalObj) => {
    if (filteredSessions.length === 0) {
      return t.coachEmpty;
    }

    const timeBlocks = {
      morning: { ratingSum: 0, distSum: 0, count: 0 },
      afternoon: { ratingSum: 0, distSum: 0, count: 0 },
      evening: { ratingSum: 0, distSum: 0, count: 0 },
      night: { ratingSum: 0, distSum: 0, count: 0 }
    };

    const subjectDistractions = {};
    const distractionTypes = {};

    filteredSessions.forEach(s => {
      const blockKey = getTimeSlotKey(s.startTime);
      const dCount = Object.values(s.distractions || {}).reduce((a, b) => a + b, 0);
      timeBlocks[blockKey].ratingSum += s.rating;
      timeBlocks[blockKey].distSum += dCount;
      timeBlocks[blockKey].count += 1;

      subjectDistractions[s.subject] = (subjectDistractions[s.subject] || 0) + dCount;
      Object.entries(s.distractions || {}).forEach(([k, v]) => {
        distractionTypes[k] = (distractionTypes[k] || 0) + v;
      });
    });

    let bestBlockKey = 'morning';
    let worstBlockKey = 'evening';
    let maxScore = -999;
    let minScore = 999;

    Object.entries(timeBlocks).forEach(([blockKey, data]) => {
      if (data.count > 0) {
        const avgRating = data.ratingSum / data.count;
        const avgDist = data.distSum / data.count;
        const score = avgRating - avgDist * 0.8;
        if (score > maxScore) { maxScore = score; bestBlockKey = blockKey; }
        if (score < minScore) { minScore = score; worstBlockKey = blockKey; }
      }
    });

    const mostDistractedSubject = Object.keys(subjectDistractions).sort((a, b) => subjectDistractions[b] - subjectDistractions[a])[0];
    const topDistractionKey = Object.keys(distractionTypes).sort((a, b) => distractionTypes[b] - distractionTypes[a])[0];
    const topDistractionLabel = getCategoryLabel(topDistractionKey);
    const totalDistCount = Object.values(distractionTypes).reduce((a, b) => a + b, 0);
    const bestBlockName = t.timeBlocksFull[bestBlockKey];
    const worstBlockName = t.timeBlocksFull[worstBlockKey];

    if (lang === 'en') {
      const goalCtx = selectedGoalObj ? `For your goal "${selectedGoalObj.title}", ` : 'Across your study sessions, ';
      return `${goalCtx}you completed ${filteredSessions.length} sessions with ${totalDistCount} focus interruptions. Most interruptions occurred during "${mostDistractedSubject}" (${subjectDistractions[mostDistractedSubject]} times), primarily triggered by "${topDistractionLabel}". Your focus tends to drop during ${worstBlockName}, whereas ${bestBlockName} yields your highest efficiency. Try scheduling challenging topics during ${bestBlockName} and activating your "${topDistractionLabel}" If–Then plan before starting.`;
    }

    const goalContextText = selectedGoalObj 
      ? `"${selectedGoalObj.title}" hedefin doğrultusunda ` 
      : `Bu dönem yaptığın çalışmalarda `;

    return `${goalContextText}toplam ${filteredSessions.length} seans gerçekleştirdin ve ${totalDistCount} kez odak kaybı yaşadın. En fazla dikkat dağınıklığını "${mostDistractedSubject}" çalışırken (${subjectDistractions[mostDistractedSubject]} kopma) ve en çok "${topDistractionLabel}" nedeniyle yaşıyorsun. Verilere göre ${worstBlockName} saatlerinde çalıştığında motivasyonun ve verimin düşüyor; ancak ${bestBlockName} saatlerinde odaklanman çok daha yüksek. Zorlandığın konuları ${bestBlockName} dilimine planlamanı ve "${topDistractionLabel}" engeli için MCII Eğer-O Zaman kuralını seans öncesinde uygulamanı öneririm.`;
  };

  const renderReports = () => {
    const filteredSessions = getFilteredSessions();
    const selectedGoalObj = selectedReportGoalId === 'all' 
      ? null 
      : goals.find(g => g.id === selectedReportGoalId);

    const relevantGoals = selectedGoalObj ? [selectedGoalObj] : goals;
    const avgGoalAttainment = relevantGoals.length > 0
      ? Math.round(
          relevantGoals.reduce((acc, g) => acc + calculateProgress(g.startValue, g.currentValue, g.targetValue), 0) / relevantGoals.length
        )
      : 0;

    const totalPlanned = filteredSessions.reduce((acc, s) => acc + s.plannedMin, 0);
    const totalActual = filteredSessions.reduce((acc, s) => acc + s.actualMin, 0);
    const timeEfficiency = totalPlanned > 0 ? Math.min(100, Math.round((totalActual / totalPlanned) * 100)) : 0;

    const avgRatingPercent = filteredSessions.length > 0
      ? Math.round((filteredSessions.reduce((acc, s) => acc + s.rating, 0) / (filteredSessions.length * 10)) * 100)
      : 0;

    // Kopma süresi özeti
    const totalPausedSeconds = filteredSessions.reduce((acc, s) => acc + getSessionPausedSeconds(s), 0);
    const avgPausedSeconds = filteredSessions.length > 0 ? Math.round(totalPausedSeconds / filteredSessions.length) : 0;

    // Haftalık Kırılım (1., 2., 3. Hafta)
    const weeklyMap = {};
    filteredSessions.forEach(s => {
      const w = getWeekNumberForSession(s.date, sessions);
      if (!weeklyMap[w]) {
        weeklyMap[w] = { week: w, count: 0, plannedMin: 0, actualMin: 0, pausedSec: 0, ratingSum: 0, distCount: 0 };
      }
      weeklyMap[w].count += 1;
      weeklyMap[w].plannedMin += s.plannedMin || 0;
      weeklyMap[w].actualMin += s.actualMin || 0;
      weeklyMap[w].pausedSec += getSessionPausedSeconds(s);
      weeklyMap[w].ratingSum += s.rating || 0;
      weeklyMap[w].distCount += Object.values(s.distractions || {}).reduce((a, b) => a + b, 0);
    });
    const weeklyRows = Object.values(weeklyMap).sort((a, b) => a.week - b.week);

    // Ders Bazlı Analiz
    const subjectAnalysis = {};
    filteredSessions.forEach(s => {
      if (!subjectAnalysis[s.subject]) {
        subjectAnalysis[s.subject] = { total: 0, byType: {} };
      }
      Object.entries(s.distractions || {}).forEach(([type, count]) => {
        subjectAnalysis[s.subject].total += count;
        subjectAnalysis[s.subject].byType[type] = (subjectAnalysis[s.subject].byType[type] || 0) + count;
      });
    });

    const maxSubjectDistraction = Math.max(1, ...Object.values(subjectAnalysis).map(d => d.total));

    const timeSlotStats = {
      morning: { distractions: 0, sessions: 0, ratingSum: 0 },
      afternoon: { distractions: 0, sessions: 0, ratingSum: 0 },
      evening: { distractions: 0, sessions: 0, ratingSum: 0 },
      night: { distractions: 0, sessions: 0, ratingSum: 0 }
    };

    filteredSessions.forEach(s => {
      const slot = getTimeSlotKey(s.startTime);
      const dSum = Object.values(s.distractions || {}).reduce((a, b) => a + b, 0);
      timeSlotStats[slot].distractions += dSum;
      timeSlotStats[slot].sessions += 1;
      timeSlotStats[slot].ratingSum += s.rating;
    });

    const totalDistractionsMap = filteredSessions.reduce((acc, session) => {
      Object.entries(session.distractions || {}).forEach(([key, val]) => {
        acc[key] = (acc[key] || 0) + val;
      });
      return acc;
    }, {});
    const totalDistractionsCount = Object.values(totalDistractionsMap).reduce((a, b) => a + b, 0);

    return (
      <div className="p-4 pb-28 max-w-lg mx-auto space-y-5">
        <div className="pt-2 flex justify-between items-start gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">{t.reportsTitle}</h2>
            <p className="text-xs text-slate-500 font-medium">{t.reportsSubtitle}</p>
          </div>
          {renderLangToggle(false)}
        </div>

        {/* EXCEL / CSV DIŞA AKTARMA BUTONU */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col gap-2">
          <button
            onClick={handleExportCSV}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-100 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportExcelBtn}</span>
          </button>
          {exportMessage && (
            <p className="text-[11px] font-bold text-emerald-800 text-center">{exportMessage}</p>
          )}
        </div>

        {/* FİLTRELEME ÇUBUĞU */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" /> {t.filterByGoal}
            </label>
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              value={selectedReportGoalId}
              onChange={(e) => setSelectedReportGoalId(e.target.value)}
            >
              <option value="all">{t.allGoalsOption}</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title} ({g.currentValue}/{g.targetValue} {g.metric})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'week', label: t.weekFilter },
              { id: 'month', label: t.monthFilter },
              { id: 'all', label: t.allTimeFilter }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTimeRange(tab.id)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedTimeRange === tab.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* AKILLI HAFTALIK KOÇ ÖNERİSİ KARTI */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-5 rounded-3xl text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-xs tracking-wider uppercase text-indigo-100">
              {t.coachTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-indigo-50">
            {generateSmartCoachAdvice(filteredSessions, selectedGoalObj)}
          </p>
        </div>

        {/* 3 ANA ORAN KARTI */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-2xl text-center shadow-sm border border-slate-100">
            <div className="text-xl font-black text-indigo-600">%{avgGoalAttainment}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{t.cardGoalAttainment}</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl text-center shadow-sm border border-slate-100">
            <div className="text-xl font-black text-emerald-600">%{timeEfficiency}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{t.cardActualStudy}</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl text-center shadow-sm border border-slate-100">
            <div className="text-xl font-black text-amber-500">%{avgRatingPercent}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">{t.cardSessionEff}</div>
          </div>
        </div>

        {/* KOPMA SÜRESİ ÖZETİ */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-3">
            {t.pauseSummaryTitle}
          </h3>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="text-sm font-black text-rose-600">{formatMinutesText(totalPausedSeconds)}</div>
              <div className="text-[10px] font-bold text-slate-500 mt-1">{t.totalPauseLabel}</div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="text-sm font-black text-amber-600">{formatMinutesText(avgPausedSeconds)}</div>
              <div className="text-[10px] font-bold text-slate-500 mt-1">{t.avgPauseLabel}</div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="text-sm font-black text-indigo-600">{totalDistractionsCount}</div>
              <div className="text-[10px] font-bold text-slate-500 mt-1">{t.totalDistractionCountLabel}</div>
            </div>
          </div>
        </div>

        {/* HAFTALIK GELİŞİM KARŞILAŞTIRMASI (1.-3. HAFTA) */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            {t.weeklyTableTitle}
          </h3>
          {weeklyRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase">
                    <th className="py-2 pr-2">{t.weekCol}</th>
                    <th className="py-2 px-1 text-center">{t.sessionsCol}</th>
                    <th className="py-2 px-1 text-center">{t.activeMinCol}</th>
                    <th className="py-2 px-1 text-center">{t.pauseMinCol}</th>
                    <th className="py-2 px-1 text-center">{t.effCol}</th>
                    <th className="py-2 pl-1 text-center">{t.ratingCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {weeklyRows.map(row => {
                    const weekEff = row.plannedMin > 0 ? Math.min(100, Math.round((row.actualMin / row.plannedMin) * 100)) : 0;
                    const weekRating = row.count > 0 ? (row.ratingSum / row.count).toFixed(1) : '-';
                    const weekPauseMin = Math.round(row.pausedSec / 60);
                    return (
                      <tr key={row.week} className="hover:bg-slate-50">
                        <td className="py-2.5 pr-2 font-extrabold text-indigo-700">{t.weekLabel(row.week)}</td>
                        <td className="py-2.5 px-1 text-center font-semibold text-slate-700">{row.count}</td>
                        <td className="py-2.5 px-1 text-center font-semibold text-emerald-700">{row.actualMin}</td>
                        <td className="py-2.5 px-1 text-center font-semibold text-rose-600">{weekPauseMin}</td>
                        <td className="py-2.5 px-1 text-center font-extrabold text-indigo-600">%{weekEff}</td>
                        <td className="py-2.5 pl-1 text-center font-bold text-amber-600">{weekRating}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-4">{t.weeklyTableEmpty}</p>
          )}
        </div>

        {/* DERSLERE GÖRE DİKKAT KAYBI VE BASKIN ETKEN MATRİSİ */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            {t.subjectMatrixTitle}
          </h3>
          {Object.keys(subjectAnalysis).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(subjectAnalysis).map(([subject, data]) => {
                const topCause = Object.entries(data.byType).sort((a, b) => b[1] - a[1])[0];
                const barWidth = Math.round((data.total / maxSubjectDistraction) * 100);
                return (
                  <div key={subject} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{subject}</span>
                      <span className="font-extrabold text-indigo-600">{t.timesDistracted(data.total)}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${barWidth}%` }} />
                    </div>
                    {topCause && topCause[1] > 0 && (
                      <p className="text-[11px] text-slate-500">
                        {t.topCauseLabel} <strong className="text-slate-700">{getCategoryLabel(topCause[0])}</strong> ({topCause[1]} {t.timesUnit})
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">{t.noSubjectData}</p>
          )}
        </div>

        {/* GÜNÜN SAATLERİNE GÖRE DİKKAT KAYBI ANALİZİ */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            {t.timeOfDayTitle}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(timeSlotStats).map(([slotKey, info]) => {
              const avgRating = info.sessions > 0 ? (info.ratingSum / info.sessions).toFixed(1) : '-';
              return (
                <div key={slotKey} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-extrabold text-slate-700 mb-1">{t.timeSlots[slotKey]}</div>
                  <div className="text-lg font-black text-indigo-600">{info.distractions} {t.distractionShort}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {info.sessions} {t.sessionsLower} • {t.avgRatingShort} <strong>{avgRating}/10</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GENEL DİKKAT DAĞITICI DAĞILIMI */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            {t.overallDistTitle}
          </h3>
          {totalDistractionsCount > 0 ? (
            <div className="space-y-3">
              {Object.entries(totalDistractionsMap).map(([name, val], idx) => {
                const pct = Math.round((val / totalDistractionsCount) * 100);
                return (
                  <div key={name}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        {getCategoryLabel(name)}
                      </span>
                      <span>{val} {t.timesUnit} (%{pct})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${pct}%`, backgroundColor: COLORS[idx % COLORS.length] }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">{t.noDistData}</p>
          )}
        </div>

        {/* GEÇMİŞ SEANSLAR VE ÖĞRENCİ NOTLARI */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            {t.pastSessionsTitle}
          </h3>
          <div className="space-y-3">
            {filteredSessions.slice().reverse().map(session => {
              const pSec = getSessionPausedSeconds(session);
              return (
                <div key={session.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <p className="font-extrabold text-sm text-slate-800">{session.subject}</p>
                      <p className="text-[11px] font-semibold text-slate-500">
                        {session.date} • {t.timePrefix} {session.startTime} • {t.actualShort} {session.actualMin}/{session.plannedMin} {t.minShort} • {t.pauseShort} {formatMinutesText(pSec)}
                      </p>
                    </div>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${
                      session.rating >= 7 ? 'bg-emerald-100 text-emerald-700' : session.rating >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.effBadge} {session.rating}/10
                    </span>
                  </div>
                  {session.notes && (
                    <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 mt-2">
                      "{session.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'timer' && renderTimer()}
      {activeTab === 'reports' && renderReports()}

      {/* HEDEF SİLME ONAY MODALI */}
      {goalToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base mb-1">{t.deleteModalTitle}</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              {t.deleteModalDesc(goalToDelete.title)}
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setGoalToDelete(null)}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                {t.cancelBtn}
              </button>
              <button
                onClick={confirmDeleteGoal}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700"
              >
                {t.confirmDeleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UYGULAMA KULLANIM KILAVUZU MODALI */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-800 text-base">{t.guideModalTitle}</h3>
              <button onClick={() => setShowGuideModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed mb-5">
              <p><strong>{t.guideP1Title}</strong> {t.guideP1Body}</p>
              <p><strong>{t.guideP2Title}</strong> {t.guideP2Body}</p>
              <p><strong>{t.guideP3Title}</strong> {t.guideP3Body}</p>
              <p><strong>{t.guideP4Title}</strong> {t.guideP4Body}</p>
            </div>
            <button 
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs"
            >
              {t.understoodBtn}
            </button>
          </div>
        </div>
      )}

      {/* ALT GEZİNME ÇUBUĞU */}
      {!(activeTab === 'timer' && (isSessionActive || showEndModal)) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-3 flex justify-between items-center z-40 max-w-lg mx-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">{t.navGoals}</span>
          </button>
          
          <button 
            onClick={() => {
              setUiMessage('');
              setActiveTab('timer');
            }} 
            className="flex flex-col items-center justify-center w-16 h-16 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200 text-white -mt-8 transform transition-transform active:scale-95 hover:bg-indigo-700 border-4 border-slate-50"
          >
            <Play className="w-7 h-7 fill-current ml-0.5" />
          </button>

          <button 
            onClick={() => setActiveTab('reports')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'reports' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">{t.navReports}</span>
          </button>
        </div>
      )}
    </div>
  );
}
