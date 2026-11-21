import React, { useState, useEffect } from 'react';
import { 
  Play, Square, CheckCircle, BarChart2, Home, Target, Clock, 
  Plus, BookOpen, AlertCircle, Calendar, X, Award, TrendingUp, 
  Filter, Info, ChevronRight, Sparkles, Check, MessageSquare,
  Edit2, Trash2, RotateCcw, UserCheck
} from 'lucide-react';

const DISTRACTION_CATEGORIES = [
  {
    key: 'Telefon/Bildirim',
    ifPlaceholder: 'Örn: Telefon ekranı aydınlanıp bildirim düşerse...',
    thenPlaceholder: 'Örn: Telefonu yüzüstü çevirip Rahatsız Etme moduna alacağım.'
  },
  {
    key: 'Hayal Kurma',
    ifPlaceholder: 'Örn: Okuduğum konudan kopup zihnim başka yere kayarsa...',
    thenPlaceholder: 'Örn: Gözlerimi ilk kelimeye sabitleyip kalemle satır takibi yapacağım.'
  },
  {
    key: 'Görev Değiştirme',
    ifPlaceholder: 'Örn: Çalıştığım dersten sıkılıp başka derse geçmek istersem...',
    thenPlaceholder: 'Örn: Mevcut konuda 10 dakika daha kalıp o bloğu tamamlayacağım.'
  },
  {
    key: 'Diğer',
    ifPlaceholder: 'Örn: Dış ses, yorgunluk veya kaygı dikkatimi bölerse...',
    thenPlaceholder: 'Örn: Kulaklık takacak ya da su içip yalnızca önümdeki soruya odaklanacağım.'
  }
];

const EMPTY_DISTRACTIONS = {
  'Telefon/Bildirim': 0,
  'Hayal Kurma': 0,
  'Görev Değiştirme': 0,
  'Diğer': 0
};

const createEmptyObstaclePlans = () =>
  DISTRACTION_CATEGORIES.map(cat => ({
    category: cat.key,
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
    date: '2026-11-15', 
    startTime: '19:30', 
    plannedMin: 60, 
    actualMin: 45, 
    rating: 6, 
    notes: 'İlk 25 dakika çok iyiydi ama sonra telefon bildirimleri dikkatimi dağıttı.',
    distractions: { 'Telefon/Bildirim': 3, 'Hayal Kurma': 1, 'Görev Değiştirme': 0, 'Diğer': 1 } 
  },
  { 
    id: 's2', 
    goalId: 'g1', 
    subject: 'Matematik - Fonksiyonlar', 
    date: '2026-11-16', 
    startTime: '10:00', 
    plannedMin: 50, 
    actualMin: 48, 
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
    rating: 8, 
    notes: 'Olimpiyat soruları zorlayıcıydı ama odaklanmamı korudum.',
    distractions: { 'Telefon/Bildirim': 1, 'Hayal Kurma': 1, 'Görev Değiştirme': 0, 'Diğer': 1 } 
  },
  { 
    id: 's4', 
    goalId: 'g3', 
    subject: 'AP Fizik - Kinematik', 
    date: '2026-11-17', 
    startTime: '21:15', 
    plannedMin: 45, 
    actualMin: 25, 
    rating: 4, 
    notes: 'Akşam saatinde çok yorgundum, sürekli dalıp gittim ve başka derse geçmek istedim.',
    distractions: { 'Telefon/Bildirim': 2, 'Hayal Kurma': 4, 'Görev Değiştirme': 2, 'Diğer': 1 } 
  }
];

const COLORS = ['#4f46e5', '#ef4444', '#f59e0b', '#10b981'];

export default function App() {
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

  // Kronometre ve Seans State'leri
  const [activeGoal, setActiveGoal] = useState(null);
  const [sessionSubject, setSessionSubject] = useState('');
  const [plannedTime, setPlannedTime] = useState(45);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [currentDistractions, setCurrentDistractions] = useState({ ...EMPTY_DISTRACTIONS });
  const [activeObstacle, setActiveObstacle] = useState(null); 
  const [uiMessage, setUiMessage] = useState('');
  
  // Seans Sonu Değerlendirme Modalı State'leri
  const [showEndModal, setShowEndModal] = useState(false);
  const [sessionRating, setSessionRating] = useState(8);
  const [sessionNotes, setSessionNotes] = useState('');

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

  // Her yeni seans veya hedef değişiminde kopmaları ve kronometreyi sıfırla
  const resetSessionState = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setCurrentDistractions({ ...EMPTY_DISTRACTIONS });
    setActiveObstacle(null);
    setShowEndModal(false);
  };

  // Zamanlayıcı
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
    const mappedObstacles = DISTRACTION_CATEGORIES.map((cat, idx) => {
      const matched = (goal.obstacles || []).find(o => o.category === cat.key);
      if (matched) {
        return { category: cat.key, ifText: matched.if || '', thenText: matched.then || '' };
      }
      // Eski formatta (kategorisiz) kayıt varsa ilk sıradakileri koru
      const legacy = (goal.obstacles || []).filter(o => !o.category)[idx];
      return {
        category: cat.key,
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
        if: `"${type}" nedeniyle dersten koparsam`,
        then: 'Derin bir nefes alıp dikkat dağıtıcıyı uzaklaştıracak ve mevcut görevime geri döneceğim.'
      });
    }
  };

  const handleFinishSessionConfirm = () => {
    const actualMinutes = Math.max(1, Math.round(elapsedTime / 60));
    const now = new Date();
    const newSession = {
      id: 's' + Date.now(),
      goalId: activeGoal.id,
      subject: sessionSubject,
      date: getTodayDateString(),
      startTime: now.toTimeString().slice(0, 5),
      plannedMin: Number(plannedTime) || 30,
      actualMin: actualMinutes,
      rating: sessionRating,
      notes: sessionNotes.trim() || 'Not eklenmedi.',
      distractions: { ...currentDistractions }
    };
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
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Target className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">MCII Odak Koçu</h1>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">
            Hedeflerini sayısal olarak belirle, engellerini öngör ve bilimsel <strong>MCII tekniğiyle</strong> odaklanma süreni zirveye taşı.
          </p>
          
          <div className="space-y-4 text-left mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">RUMUZUN / TAKMA ADIN</label>
              <input 
                type="text" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="Örn: Odak01, Yıldız, Ö1..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">HEDEF ALANIN (İSTEĞE BAĞLI)</label>
              <input 
                type="text" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium"
                placeholder="Örn: Sayısal / YKS / Olimpiyat"
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
            <span>Devam Et</span>
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Hoş Geldin, {userName}!</h2>
              <p className="text-xs text-slate-500 font-medium">Uygulamayı nasıl kullanacağına hızlıca göz atalım.</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex gap-3.5 items-start">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">MCII ile Sayısal Hedef ve Süre Belirle</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sadece "ders çalışacağım" demek yerine; başlangıç puanını, hedef puanını (örn. 70'ten 85'e) ve <strong>bitiş tarihini</strong> gir. Her dikkat dağıtıcı türü için ayrı <em>"Eğer şu olursa, O zaman bunu yapacağım"</em> planları kur.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex gap-3.5 items-start">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">Akıllı Kronometre ve Çetele Tutma</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seansa başla. Çalışırken telefon, hayal kurma, görev değiştirme veya diğer bir nedenle dersten koparsan ilgili butona bas. Kronometre anında durur ve sana tam o kategoriye özel <strong>Eğer-O Zaman</strong> çözümünü hatırlatır!
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex gap-3.5 items-start">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">Hedef Bazlı Raporlar ve Haftalık Koç Önerisi</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hangi derste, günün hangi saatinde ve hangi etkenden dolayı dikkat kaybı yaşadığını grafiklerle incele. Haftalık akıllı önerilerle çalışma saatlerini yeniden planla.
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setOnboardingStep(2)}
            className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            Uygulamaya Başla
          </button>
        </div>
      </div>
    );
  }

  // --- ANA PANO (DASHBOARD) ---
  const renderDashboard = () => (
    <div className="p-4 pb-28 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6 pt-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-800">Merhaba, {userName}!</h2>
            {userGrade && (
              <span className="text-[11px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                {userGrade}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Verilerin cihazına otomatik kaydediliyor.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setOnboardingStep(0)} 
            title="Rumuz / Profil Düzenle"
            className="p-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-100"
          >
            <UserCheck className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowGuideModal(true)} 
            title="Nasıl Kullanılır?"
            className="p-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-100"
          >
            <Info className="w-5 h-5" />
          </button>
          <button 
            onClick={openNewGoalForm} 
            className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-transform active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Örnek Verileri Temizleme / Sıfırlama Çubuğu */}
      {!showAddGoal && goals.length > 0 && (
        <div className="flex justify-between items-center bg-indigo-50/70 border border-indigo-100 px-3.5 py-2 rounded-2xl mb-4">
          <span className="text-[11px] font-semibold text-indigo-800">
            Hedefleri kalem ikonundan düzenleyebilir veya silebilirsin.
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
            <span>Tümünü Temizle</span>
          </button>
        </div>
      )}

      {showAddGoal ? (
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 mb-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                {editingGoalId ? 'Hedefi ve MCII Planını Düzenle' : 'MCII Hedef Planlama Formu'}
              </h3>
              <p className="text-xs text-slate-400">
                {editingGoalId ? 'Hedef bilgilerini veya kategoriye özel Eğer-O Zaman planlarını güncelle.' : 'Somut, ölçülebilir ve zamana bağlı bir hedef oluştur.'}
              </p>
            </div>
            <button onClick={() => { setShowAddGoal(false); setEditingGoalId(null); }} className="p-1.5 rounded-lg hover:bg-slate-100">
              <X className="text-slate-400 w-5 h-5"/>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">ADIM 1: SOMUT HEDEFİN NEDİR?</label>
              <input 
                type="text" 
                placeholder="Örn: Matematikte 3 haftada 300 soru çözmek" 
                className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none focus:border-indigo-500" 
                value={newGoal.title} 
                onChange={e => setNewGoal({...newGoal, title: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">HEDEF BİTİŞ TARİHİ</label>
                <input 
                  type="date" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.deadline} 
                  onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">ÖLÇÜM BİRİMİ</label>
                <select 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.metric} 
                  onChange={e => setNewGoal({...newGoal, metric: e.target.value})}
                >
                  <option value="Puan">Not / Puan</option>
                  <option value="Soru">Çözülen Soru</option>
                  <option value="Sayfa">Okunan Sayfa</option>
                  <option value="Deneme">Deneme Sayısı</option>
                  <option value="Saat">Çalışma Saati</option>
                  <option value="Konu">Tamamlanan Konu</option>
                  <option value="Kelime">Öğrenilen Kelime</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">BAŞLANGIÇ</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.startValue} 
                  onChange={e => setNewGoal({...newGoal, startValue: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">ŞU ANKİ DEĞER</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.currentValue} 
                  onChange={e => setNewGoal({...newGoal, currentValue: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">HEDEF DEĞER</label>
                <input 
                  type="number" 
                  className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none" 
                  value={newGoal.targetValue} 
                  onChange={e => setNewGoal({...newGoal, targetValue: Number(e.target.value)})} 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 mb-1 block">ADIM 2: OLUMLU GELECEĞİ HAYAL ET (EN İYİ SONUÇ)</label>
              <textarea 
                placeholder="Bu hedefe ulaştığında ne hissedeceksin? (Örn: Stresim azalacak, kendime güvenim artacak...)" 
                className="w-full p-3 bg-slate-50 rounded-xl text-sm border border-slate-200 outline-none resize-none" 
                rows="2" 
                value={newGoal.bestOutcome} 
                onChange={e => setNewGoal({...newGoal, bestOutcome: e.target.value})}
              />
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                ADIM 3 & 4: DİKKAT KESİNTİSİ TÜRLERİNE GÖRE "EĞER... O ZAMAN..." PLANLARI
              </label>
              <p className="text-[11px] text-slate-400 mb-3">
                Çalışma sırasında hangi dikkat dağıtıcıya basarsan, aşağıda o başlık için yazdığın plan ekrana gelecektir.
              </p>
              {newObstacles.map((obs, idx) => {
                const catMeta = DISTRACTION_CATEGORIES[idx] || DISTRACTION_CATEGORIES[3];
                return (
                  <div key={obs.category} className="space-y-2 mb-3 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/70">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-lg">
                        {obs.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-amber-800 bg-amber-200 px-2 py-0.5 rounded shrink-0">EĞER</span>
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
                      <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded shrink-0">O ZAMAN</span>
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
              {editingGoalId ? 'Değişiklikleri Güncelle' : 'Hedefi ve MCII Planını Kaydet'}
            </button>
          </div>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center my-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base mb-1">Henüz Hiç Hedefin Yok</h3>
          <p className="text-xs text-slate-500 mb-6">
            Kendi çalışma hedeflerini ve "Eğer-O Zaman" planlarını oluşturarak hemen başla veya örnek verileri geri yükle.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={openNewGoalForm}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4" /> Yeni Hedef Oluştur
            </button>
            <button
              onClick={() => {
                setGoals(INITIAL_GOALS);
                setSessions(INITIAL_SESSIONS);
              }}
              className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200"
            >
              <RotateCcw className="w-4 h-4" /> Örnek Hedefleri Geri Yükle
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
                          {daysLeft < 0 ? 'Süre Doldu' : `Hedefe Son ${daysLeft} Gün`}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        {totalMinutesStudied} dk çalışıldı ({goalSessions.length} seans)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEditGoalClick(goal)}
                      title="Hedefi Düzenle"
                      className="p-2 bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGoalToDelete(goal)}
                      title="Hedefi Sil"
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
                      <span>Çalış</span>
                    </button>
                  </div>
                </div>

                {/* Sayısal Hedef İlerleme Çubuğu */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-3">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                    <span>Başlangıç: {goal.startValue} {goal.metric}</span>
                    <span className="text-indigo-600">Şu An: {goal.currentValue} {goal.metric}</span>
                    <span>Hedef: {goal.targetValue} {goal.metric}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className={`text-xs font-extrabold ${progress >= 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                      Hedefe Ulaşma Oranı: %{progress}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500 font-semibold">Güncel {goal.metric}:</span>
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
                    <p className="text-xs text-slate-600"><strong className="text-slate-700">En İyi Sonuç:</strong> "{goal.bestOutcome}"</p>
                  </div>
                  {goal.obstacles && goal.obstacles.length > 0 && (
                    <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100">
                      <p className="text-[11px] font-bold text-amber-800 mb-1.5">MCII "Eğer - O Zaman" Planların:</p>
                      {goal.obstacles.map((obs) => (
                        <p key={obs.id} className="text-xs text-slate-600 leading-snug mb-1.5 last:mb-0">
                          {obs.category && (
                            <span className="inline-block text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded mr-1.5">
                              {obs.category}
                            </span>
                          )}
                          <strong>Eğer</strong> {obs.if} → <strong>O Zaman</strong> {obs.then}
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
                    <span>Bu Hedefin Özel Raporunu Gör</span>
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
    if (!activeGoal || (!isRunning && elapsedTime === 0 && !activeObstacle)) {
      return (
        <div className="p-4 pb-28 max-w-lg mx-auto">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mt-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mb-1">Çalışma Seansı Verimlilik Kaydı</h2>
            <p className="text-xs text-slate-500 mb-6">
              Seansa başlamadan önce 1. Bölümü doldur. Çalışma dışında bir şey yaptığında ilgili dikkat dağıtıcıya basarak kronometreyi durdur.
            </p>

            {uiMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {uiMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">1. HANGİ HEDEFİN İÇİN ÇALIŞACAKSIN?</label>
                <select 
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 text-sm font-medium"
                  value={activeGoal ? activeGoal.id : ''}
                  onChange={(e) => {
                    resetSessionState();
                    setActiveGoal(goals.find(g => g.id === e.target.value));
                  }}
                >
                  <option value="" disabled>Hedef seçiniz...</option>
                  {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">2. BUGÜN ÇALIŞACAĞIN ANA DERS / KONU</label>
                <input 
                  type="text"
                  placeholder="Örn: Matematik - Türev Uygulamaları"
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-500 text-sm font-medium"
                  value={sessionSubject}
                  onChange={(e) => {
                    setSessionSubject(e.target.value);
                    setUiMessage('');
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">3. PLANLADIĞIN TOPLAM SÜRE (DAKİKA - MANUEL GİRİŞ)</label>
                <input 
                  type="number"
                  placeholder="Örn: 60"
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
                    setUiMessage('Lütfen önce çalışacağın hedefi seç.');
                    return;
                  }
                  if (!sessionSubject.trim()) {
                    setUiMessage('Lütfen çalışacağın ders veya konuyu yaz.');
                    return;
                  }
                  if (!plannedTime || Number(plannedTime) <= 0) {
                    setUiMessage('Lütfen geçerli bir planlanan dakika gir.');
                    return;
                  }
                  setUiMessage('');
                  resetSessionState();
                  setIsRunning(true);
                }}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 mt-2 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <Play className="w-5 h-5 fill-current" /> Kronometreyi Başlat
              </button>
            </div>
          </div>
        </div>
      );
    }

    // SEANS SIRASI (ÇETELE VE KRONOMETRE EKRANI)
    return (
      <div className="min-h-screen bg-slate-900 p-5 flex flex-col justify-between pb-10">
        <div className="text-center pt-6">
          <span className="inline-block px-3.5 py-1 bg-slate-800 rounded-full text-indigo-400 text-xs font-bold mb-2 border border-slate-700">
            {activeGoal.title}
          </span>
          <h3 className="text-white font-bold text-lg mb-4">{sessionSubject}</h3>
          <div className="text-6xl sm:text-7xl font-mono text-white font-extrabold tracking-tight mb-2">
            {formatTime(elapsedTime)}
          </div>
          <p className="text-slate-400 text-xs font-medium">
            Planlanan Süre: <strong>{plannedTime} dakika</strong> • Durum: {isRunning ? <span className="text-emerald-400">Çalışıyor</span> : <span className="text-amber-400">Duraklatıldı</span>}
          </p>
        </div>

        {/* MCII EĞER-O ZAMAN MÜDAHALE KARTI */}
        {activeObstacle && !isRunning && (
          <div className="bg-amber-500/15 border border-amber-500/40 p-4 rounded-2xl my-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-amber-300 text-xs font-extrabold uppercase tracking-wider">Dikkatin Dağıldı! MCII Planını Uygula</p>
                  {activeObstacle.category && (
                    <span className="text-[10px] font-extrabold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {activeObstacle.category}
                    </span>
                  )}
                </div>
                <p className="text-white text-xs mb-1"><strong className="text-amber-400">EĞER:</strong> {activeObstacle.if}</p>
                <p className="text-white text-xs font-bold"><strong className="text-emerald-400">O ZAMAN:</strong> {activeObstacle.then}</p>
              </div>
            </div>
            <button 
              onClick={() => { setActiveObstacle(null); setIsRunning(true); }}
              className="w-full mt-3 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold text-xs transition-colors"
            >
              Çözümü Uyguladım, Ana Derse Geri Dön ve Başlat
            </button>
          </div>
        )}

        {/* BÖLÜM 2: ÇETELE TUTMA ALANI */}
        <div className="my-4">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider text-center mb-3">
            Dersten Her Koptuğunda İlgili Kutuya Dokun (Kronometreyi Durdurur)
          </p>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(currentDistractions).map((dist) => (
              <button
                key={dist}
                onClick={() => handleDistraction(dist)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span className="text-slate-200 text-xs font-bold text-center">{dist}</span>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                  <span className="text-indigo-400 font-mono font-extrabold text-base">{currentDistractions[dist]}</span>
                  <span className="text-[10px] text-slate-400">çentik</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 ${
              isRunning ? 'bg-amber-500 text-amber-950' : 'bg-emerald-500 text-emerald-950'
            }`}
          >
            {isRunning ? 'Kronometreyi Durdur' : <><Play className="w-4 h-4 fill-current" /> Tekrar Başlat</>}
          </button>
          <button 
            onClick={() => {
              setIsRunning(false);
              setShowEndModal(true);
            }}
            className="flex-1 py-4 bg-red-500 hover:bg-red-400 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4 fill-current" /> Seansı Bitir
          </button>
        </div>

        {/* BÖLÜM 3: SEANS SONU DEĞERLENDİRME MODALI */}
        {showEndModal && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full">
              <h3 className="text-lg font-extrabold text-slate-800 mb-1">Bölüm 3: Seans Sonu Analizi</h3>
              <p className="text-xs text-slate-500 mb-4">
                Planlanan: <strong>{plannedTime} dk</strong> • Gerçekleşen: <strong>{Math.max(1, Math.round(elapsedTime / 60))} dk</strong>
              </p>

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  SEANSI DEĞERLENDİR (1 = Çok Verimsiz, 10 = Çok Verimli): <span className="text-indigo-600 font-extrabold">{sessionRating}/10</span>
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
                <label className="text-xs font-bold text-slate-700 block mb-1.5">SEANSLA İLGİLİ KISA NOTUN (İsteğe Bağlı)</label>
                <textarea
                  rows="3"
                  placeholder='Örn: "İlk 20 dk iyiydi, sonra dikkatim dağıldı." veya "Telefonu kapatmak işe yaradı."'
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setShowEndModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100"
                >
                  Geri Dön
                </button>
                <button 
                  onClick={handleFinishSessionConfirm}
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Kaydet ve Raporu Gör
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- GELİŞMİŞ RAPORLAR VE HAFTALIK ÖNERİ MOTORU ---
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
      return "Seçtiğin filtrede henüz çalışma seansı kaydı bulunmuyor. Yeni bir seans tamamladığında burada sana özel ders, saat ve odaklanma önerileri görünecek.";
    }

    const timeBlocks = {
      'Sabah (06:00-12:00)': { ratingSum: 0, distSum: 0, count: 0 },
      'Öğleden Sonra (12:00-18:00)': { ratingSum: 0, distSum: 0, count: 0 },
      'Akşam (18:00-24:00)': { ratingSum: 0, distSum: 0, count: 0 },
      'Gece (00:00-06:00)': { ratingSum: 0, distSum: 0, count: 0 }
    };

    const subjectDistractions = {};
    const distractionTypes = {};

    filteredSessions.forEach(s => {
      const hour = parseInt(s.startTime.split(':')[0], 10);
      const block = hour >= 6 && hour < 12 
        ? 'Sabah (06:00-12:00)' 
        : hour >= 12 && hour < 18 
        ? 'Öğleden Sonra (12:00-18:00)' 
        : hour >= 18 && hour < 24 
        ? 'Akşam (18:00-24:00)' 
        : 'Gece (00:00-06:00)';

      const dCount = Object.values(s.distractions).reduce((a, b) => a + b, 0);
      timeBlocks[block].ratingSum += s.rating;
      timeBlocks[block].distSum += dCount;
      timeBlocks[block].count += 1;

      subjectDistractions[s.subject] = (subjectDistractions[s.subject] || 0) + dCount;
      Object.entries(s.distractions).forEach(([k, v]) => {
        distractionTypes[k] = (distractionTypes[k] || 0) + v;
      });
    });

    let bestBlock = '';
    let worstBlock = '';
    let maxScore = -999;
    let minScore = 999;

    Object.entries(timeBlocks).forEach(([blockName, data]) => {
      if (data.count > 0) {
        const avgRating = data.ratingSum / data.count;
        const avgDist = data.distSum / data.count;
        const score = avgRating - avgDist * 0.8;
        if (score > maxScore) { maxScore = score; bestBlock = blockName; }
        if (score < minScore) { minScore = score; worstBlock = blockName; }
      }
    });

    const mostDistractedSubject = Object.keys(subjectDistractions).sort((a, b) => subjectDistractions[b] - subjectDistractions[a])[0];
    const topDistractionType = Object.keys(distractionTypes).sort((a, b) => distractionTypes[b] - distractionTypes[a])[0];
    const totalDistCount = Object.values(distractionTypes).reduce((a, b) => a + b, 0);

    const goalContextText = selectedGoalObj 
      ? `"${selectedGoalObj.title}" hedefin doğrultusunda ` 
      : `Bu dönem yaptığın çalışmalarda `;

    return `${goalContextText}toplam ${filteredSessions.length} seans gerçekleştirdin ve ${totalDistCount} kez odak kaybı yaşadın. En fazla dikkat dağınıklığını "${mostDistractedSubject}" çalışırken (${subjectDistractions[mostDistractedSubject]} kopma) ve en çok "${topDistractionType}" nedeniyle yaşıyorsun. Verilere göre ${worstBlock} saatlerinde çalıştığında motivasyonun ve verimin düşüyor; ancak ${bestBlock} saatlerinde odaklanman çok daha yüksek. Zorlandığın konuları ${bestBlock} dilimine planlamanı ve "${topDistractionType}" engeli için MCII Eğer-O Zaman kuralını seans öncesinde uygulamanı öneririm.`;
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
    const timeEfficiency = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;

    const avgRatingPercent = filteredSessions.length > 0
      ? Math.round((filteredSessions.reduce((acc, s) => acc + s.rating, 0) / (filteredSessions.length * 10)) * 100)
      : 0;

    const subjectAnalysis = {};
    filteredSessions.forEach(s => {
      if (!subjectAnalysis[s.subject]) {
        subjectAnalysis[s.subject] = { total: 0, byType: {} };
      }
      Object.entries(s.distractions).forEach(([type, count]) => {
        subjectAnalysis[s.subject].total += count;
        subjectAnalysis[s.subject].byType[type] = (subjectAnalysis[s.subject].byType[type] || 0) + count;
      });
    });

    const maxSubjectDistraction = Math.max(1, ...Object.values(subjectAnalysis).map(d => d.total));

    const timeSlotStats = {
      'Sabah (06-12)': { distractions: 0, sessions: 0, ratingSum: 0 },
      'Öğle (12-18)': { distractions: 0, sessions: 0, ratingSum: 0 },
      'Akşam (18-24)': { distractions: 0, sessions: 0, ratingSum: 0 },
      'Gece (00-06)': { distractions: 0, sessions: 0, ratingSum: 0 }
    };

    filteredSessions.forEach(s => {
      const hour = parseInt(s.startTime.split(':')[0], 10);
      const slot = hour >= 6 && hour < 12 ? 'Sabah (06-12)' : hour >= 12 && hour < 18 ? 'Öğle (12-18)' : hour >= 18 && hour < 24 ? 'Akşam (18-24)' : 'Gece (00-06)';
      const dSum = Object.values(s.distractions).reduce((a, b) => a + b, 0);
      timeSlotStats[slot].distractions += dSum;
      timeSlotStats[slot].sessions += 1;
      timeSlotStats[slot].ratingSum += s.rating;
    });

    const totalDistractionsMap = filteredSessions.reduce((acc, session) => {
      Object.entries(session.distractions).forEach(([key, val]) => {
        acc[key] = (acc[key] || 0) + val;
      });
      return acc;
    }, {});
    const totalDistractionsCount = Object.values(totalDistractionsMap).reduce((a, b) => a + b, 0);

    return (
      <div className="p-4 pb-28 max-w-lg mx-auto space-y-5">
        <div className="pt-2">
          <h2 className="text-2xl font-extrabold text-slate-800">Detaylı Analiz & Raporlar</h2>
          <p className="text-xs text-slate-500 font-medium">Her hedef için ayrı veya haftalık/aylık performansını incele.</p>
        </div>

        {/* FİLTRELEME ÇUBUĞU */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" /> Hedefe Göre Rapor Seç
            </label>
            <select 
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              value={selectedReportGoalId}
              onChange={(e) => setSelectedReportGoalId(e.target.value)}
            >
              <option value="all">Tüm Hedeflerin Genel Raporu</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>{g.title} ({g.currentValue}/{g.targetValue} {g.metric})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'week', label: 'Haftalık Rapor' },
              { id: 'month', label: 'Aylık Rapor' },
              { id: 'all', label: 'Tüm Zamanlar' }
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
              Kişiselleştirilmiş Haftalık Çalışma Önerisi
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
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Hedefe Ulaşma Oranı</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl text-center shadow-sm border border-slate-100">
            <div className="text-xl font-black text-emerald-600">%{timeEfficiency}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Gerçek Çalışma Oranı</div>
          </div>
          <div className="bg-white p-3.5 rounded-2xl text-center shadow-sm border border-slate-100">
            <div className="text-xl font-black text-amber-500">%{avgRatingPercent}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Verimli Seans Oranı</div>
          </div>
        </div>

        {/* DERSLERE GÖRE DİKKAT KAYBI VE BASKIN ETKEN MATRİSİ */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            Hangi Derste Hangi Etken Dikkatini Dağıtıyor?
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
                      <span className="font-extrabold text-indigo-600">{data.total} kez kopma</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${barWidth}%` }} />
                    </div>
                    {topCause && topCause[1] > 0 && (
                      <p className="text-[11px] text-slate-500">
                        En büyük etken: <strong className="text-slate-700">{topCause[0]}</strong> ({topCause[1]} kez)
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">Bu filtrede ders verisi bulunmuyor.</p>
          )}
        </div>

        {/* GÜNÜN SAATLERİNE GÖRE DİKKAT KAYBI ANALİZİ */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            Günün Hangi Saatlerinde Dikkatin Daha Çok Dağılıyor?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(timeSlotStats).map(([slot, info]) => {
              const avgRating = info.sessions > 0 ? (info.ratingSum / info.sessions).toFixed(1) : '-';
              return (
                <div key={slot} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-xs font-extrabold text-slate-700 mb-1">{slot}</div>
                  <div className="text-lg font-black text-indigo-600">{info.distractions} Kopma</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {info.sessions} seans • Ort. Verim: <strong>{avgRating}/10</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GENEL DİKKAT DAĞITICI DAĞILIMI */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            Dikkatini En Çok Dağıtan Etkenler
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
                        {name}
                      </span>
                      <span>{val} kez (%{pct})</span>
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
            <p className="text-xs text-slate-400 text-center py-6">Hiç dikkat dağıtıcı kaydı yok.</p>
          )}
        </div>

        {/* GEÇMİŞ SEANSLAR VE ÖĞRENCİ NOTLARI */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">
            Çalışma Seansı Kayıtların ve Notların
          </h3>
          <div className="space-y-3">
            {filteredSessions.slice().reverse().map(session => (
              <div key={session.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <p className="font-extrabold text-sm text-slate-800">{session.subject}</p>
                    <p className="text-[11px] font-semibold text-slate-500">
                      {session.date} • Saat {session.startTime} • Gerçekleşen: {session.actualMin}/{session.plannedMin} dk
                    </p>
                  </div>
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                    session.rating >= 7 ? 'bg-emerald-100 text-emerald-700' : session.rating >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    Verim: {session.rating}/10
                  </span>
                </div>
                {session.notes && (
                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-xl border border-slate-100 mt-2">
                    "{session.notes}"
                  </p>
                )}
              </div>
            ))}
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
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Hedefi Silmek İstiyor Musun?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              <strong>"{goalToDelete.title}"</strong> hedefi ve bu hedefe bağlı çalışma seansı kayıtları silinecek.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setGoalToDelete(null)}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Vazgeç
              </button>
              <button
                onClick={confirmDeleteGoal}
                className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700"
              >
                Evet, Sil
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
              <h3 className="font-extrabold text-slate-800 text-base">MCII Uygulama Rehberi</h3>
              <button onClick={() => setShowGuideModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed mb-5">
              <p><strong>1. Hedef ve Süre Belirleme:</strong> Hedef kartlarında başlangıç ve hedef değerini, bitiş tarihini ve 4 dikkat kesintisi türü için ayrı "Eğer-O Zaman" planlarını oluşturabilirsin.</p>
              <p><strong>2. Çalışma Seansı:</strong> Seansa başlarken süreyi manuel girersin. Dersten her koptuğunda ilgili çetele butonuna basarsın; kronometre durur ve tam o kategoriye özel çözüm planın ekrana gelir.</p>
              <p><strong>3. Analiz ve Raporlar:</strong> Her hedefin kendi ilerleme yüzdesini, hangi derste ve hangi saatte dikkat kaybı yaşadığını ve haftalık koç önerilerini takip edebilirsin.</p>
              <p><strong>4. Kalıcı Kayıt:</strong> Yaptığın tüm değişiklikler ve çalışma seansları otomatik olarak cihazının yerel hafızasına kaydedilir.</p>
            </div>
            <button 
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      {/* ALT GEZİNME ÇUBUĞU */}
      {!(activeTab === 'timer' && isRunning) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-3 flex justify-between items-center z-40 max-w-lg mx-auto">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Hedefler</span>
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
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Raporlar</span>
          </button>
        </div>
      )}
    </div>
  );
}
