/* ============================================================
   data.js - طبقة البيانات (Data Layer)
   تحتوي على كل بيانات النظام مع حفظ تلقائي في localStorage
   عند ربط الباك إند لاحقاً، نستبدل دوال localStorage بـ API
   ============================================================ */

// ===== دوال مساعدة للحفظ والتحميل من المتصفح =====
// المفتاح الذي ستخزن تحته كل البيانات في localStorage
const STORAGE_KEY = 'nettower_data';

// ===== نسخة تفاعلية (Reactive) للبيانات =====
// نستخدم reactive من Vue لجعل المصفوفات تفاعلية
// هذا يضمن أن أي تغيير في البيانات ينعكس تلقائياً على الواجهة
const _store = reactive({
  subs: [],
  finRecords: [],
  archivedSubs: []
});

// المتغيرات العامة - كلها تشير إلى البيانات التفاعلية
let subs = _store.subs;
let finRecords = _store.finRecords;
let archivedSubs = _store.archivedSubs;

// دالة حفظ كل البيانات في localStorage
function saveAllData() {
  const data = {
    subs: [..._store.subs],
    finRecords: [..._store.finRecords],
    archivedSubs: [..._store.archivedSubs],
    waTemplates: waTemplates,
    expenseCategories: expenseCategories,
    towerInfo: towerInfo,
    alertDays: alertDays,
    nextId: nextId,
    finId: finId,
    nextDebtId: nextDebtId,
    lastArchiveMonth: lastArchiveMonth,
    users: users,
    subscriptionTypes: subscriptionTypes,
    areas: areas,
    towers: towers
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch(e) {
    console.warn('فشل حفظ البيانات:', e);
  }
}

// دالة تحميل كل البيانات من localStorage
function loadAllData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved) {
      const data = JSON.parse(saved);
      // نستخدم splice لاستبدال محتويات المصفوفات التفاعلية
      _store.subs.splice(0, _store.subs.length, ...(data.subs || []).map(s => ({
        ...s,
        prevDebt: s.prevDebt || 0,
        debtHistory: (s.debtHistory || []).map(d => ({
          ...d,
          remaining: d.remaining !== undefined ? d.remaining : d.amount,
          payments: d.payments || []
        }))
      })));
      _store.finRecords.splice(0, _store.finRecords.length, ...(data.finRecords || []).map(function(r) { r.archived = r.archived || false; return r; }));
      _store.archivedSubs.splice(0, _store.archivedSubs.length, ...(data.archivedSubs || []));
      // تحديث تلقائي لحالة المشتركين حسب تاريخ الانتهاء
      _store.subs.forEach(function(s) {
        if (s.status === 'active' && s.end && s.end < todayStr()) {
          s.status = 'expired';
        }
      });
      // المتغيرات غير التفاعلية نستبدلها مباشرة
      waTemplates = data.waTemplates || waTemplates;
      expenseCategories = data.expenseCategories || expenseCategories;
      towerInfo = data.towerInfo || towerInfo;
      alertDays = data.alertDays || alertDays;
      nextId = data.nextId || nextId;
      finId = data.finId || finId;
      nextDebtId = data.nextDebtId || nextDebtId;
      lastArchiveMonth = data.lastArchiveMonth || '';
      users = data.users || users;
      subscriptionTypes = data.subscriptionTypes || subscriptionTypes;
      areas = data.areas || areas;
      towers = (data.towers || towers).map(t => ({ ...t, points: Array.isArray(t.points) ? t.points : [] }));
      autoArchive();
      return true;
    } else {
      // أول مرة: تعبئة البيانات الافتراضية في المصفوفات التفاعلية
      initDefaultData();
      // تحديث الحالات حسب التاريخ الحالي
      _store.subs.forEach(function(s) {
        if (s.status === 'active' && s.end && s.end < todayStr()) {
          s.status = 'expired';
        }
      });
      // تعيين شهر الأرشفة الحالي
      var now = new Date();
      lastArchiveMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
      saveAllData();
    }
  } catch(e) {
    console.warn('فشل تحميل البيانات:', e);
  }
  return false;
}

// دالة تعبئة البيانات الافتراضية في المصفوفات التفاعلية
function initDefaultData() {
  // إضافة كل مشترك افتراضي
  const defaultSubs = [
    {id:1,name:'أحمد علي',phone:'07701234567',ssid:'AL-Ahmed',pass:'12345678',area:'المنصور',tower:'برج الاتحاد',point:'',type:'شهري',amount:35000,start:'2026-05-01',end:'2026-06-01',status:'active',paid:true,notes:'',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:2,name:'سارة خالد',phone:'07807654321',ssid:'SaraNet',pass:'87654321',area:'الكريعات',tower:'برج الاتحاد',point:'',type:'15 يوم',amount:15000,start:'2026-05-15',end:'2026-05-30',status:'active',paid:true,notes:'',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:3,name:'محمد حسن',phone:'07901112233',ssid:'MH-Tower',pass:'mh12345',area:'الدورة',tower:'برج الاتحاد',point:'',type:'شهري',amount:35000,start:'2026-04-01',end:'2026-05-01',status:'expired',paid:false,notes:'لم يدفع الشهر الماضي',archived:false,freeCount:0,freeDates:[],prevDebt:35000,debtHistory:[{id:1,amount:35000,remaining:35000,date:'2026-04-01',note:'اشتراك شهري - أبريل',payments:[]}]},
    {id:4,name:'نور الهدى',phone:'07705556677',ssid:'NoorNet',pass:'noor888',area:'اليرموك',tower:'برج الاتحاد',point:'',type:'60 يوم',amount:55000,start:'2026-03-20',end:'2026-05-19',status:'active',paid:true,notes:'',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:5,name:'علي كريم',phone:'07809876543',ssid:'AliNet',pass:'ali2026',area:'الجامعة',tower:'برج الاتحاد',point:'',type:'أسبوعي',amount:10000,start:'2026-05-25',end:'2026-06-01',status:'active',paid:true,notes:'',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:6,name:'مريم جاسم',phone:'07704443322',ssid:'MariamNet',pass:'mrm123',area:'المنصور',tower:'برج الاتحاد',point:'',type:'شهري',amount:35000,start:'2026-05-10',end:'2026-06-10',status:'active',paid:false,notes:'',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:7,name:'حسن عباس',phone:'07907778899',ssid:'Hasan-5G',pass:'hasan99',area:'الدورة',tower:'برج الاتحاد',point:'',type:'مجاني',amount:0,start:'2026-05-01',end:'2026-06-01',status:'inactive',paid:true,notes:'تجربة مجانية',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:8,name:'زينب أحمد',phone:'07706665544',ssid:'ZainabNet',pass:'zainab22',area:'الكريعات',tower:'برج الاتحاد',point:'',type:'شهري',amount:35000,start:'2026-04-15',end:'2026-05-15',status:'expired',paid:false,notes:'',archived:false,freeCount:0,freeDates:[],prevDebt:35000,debtHistory:[{id:2,amount:35000,remaining:35000,date:'2026-04-15',note:'اشتراك شهري - أبريل',payments:[]}]},
    {id:9,name:'ياسر محمود',phone:'07803332211',ssid:'YasserNet',pass:'ysr2026',area:'اليرموك',tower:'برج الاتحاد',point:'',type:'90 يوم',amount:80000,start:'2026-03-01',end:'2026-05-30',status:'active',paid:true,notes:'دفع كاش',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:10,name:'فاطمة رضا',phone:'07905557788',ssid:'FatimaNet',pass:'ftm123',area:'الجامعة',tower:'برج الاتحاد',point:'',type:'15 يوم',amount:15000,start:'2026-05-20',end:'2026-06-04',status:'active',paid:true,notes:'',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
    {id:11,name:'عباس كاظم',phone:'07801112244',ssid:'AbbasNet',pass:'abbas77',area:'المنصور',tower:'برج الاتحاد',point:'',type:'شهري',amount:35000,start:'2026-04-01',end:'2026-05-01',status:'disabled',paid:false,notes:'تم التعطيل لعدم الدفع',archived:false,freeCount:0,freeDates:[],prevDebt:0,debtHistory:[]},
  ];
  defaultSubs.forEach(s => _store.subs.push(s));

  // السجلات المالية الافتراضية
  const defaultFin = [
    {id:1,date:'2026-05-30',desc:'اشتراك أحمد علي - شهري',amount:35000,type:'income'},
    {id:2,date:'2026-05-29',desc:'اشتراك سارة خالد - 15 يوم',amount:15000,type:'income'},
    {id:3,date:'2026-05-28',desc:'فواتير كهرباء',amount:250000,type:'expense',category:'فواتير'},
    {id:4,date:'2026-05-27',desc:'اشتراك نور الهدى - 60 يوم',amount:55000,type:'income'},
    {id:5,date:'2026-05-25',desc:'صيانة جهاز إرسال',amount:175000,type:'expense',category:'صيانة'},
  ];
  defaultFin.forEach(f => _store.finRecords.push(f));
}

// ===== دوال مساعدة عامة =====
// حساب عدد الأيام بين تاريخين
function daysBetween(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return Math.ceil((a - b) / (86400000));
}

// حساب تاريخ الانتهاء بناءً على نوع الباقة
function calcEndFromType(type, start) {
  const s = new Date(start);
  // البحث عن المدة في أنواع الاشتراك المخصصة
  const found = subscriptionTypes.find(t => t.name === type);
  const days = found ? found.days : 30;  // افتراضي 30 يوم
  return new Date(s.getTime() + days * 86400000);
}

// الحصول على تاريخ اليوم بصيغة YYYY-MM-DD
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// تنسيق المبلغ (دينار عراقي → عرض)
function formatMoney(amount) {
  return (amount || 0).toLocaleString() + ' د.ع';
}

// حساب إجمالي الدين المستحق على مشترك (يشمل prevDebt من debtHistory)
function calcTotalDebt(sub) {
  return (sub.paid ? 0 : sub.amount) + (sub.prevDebt || 0);
}

// حساب prevDebt من debtHistory (مجموع remaining لكل دين)
function recalcPrevDebt(sub) {
  sub.prevDebt = (sub.debtHistory || []).reduce((a, d) => a + (d.remaining || 0), 0);
  return sub.prevDebt;
}

// ================================================================
// البيانات الافتراضية (Default Data)
// تستخدم إذا لم يكن هناك بيانات محفوظة في localStorage
// ================================================================

// ===== أنواع الاشتراك - باقات يمكن إدارتها من الإعدادات =====
let subscriptionTypes = [
  { id: 1, name: 'مجاني', price: 0, days: 30 },
  { id: 2, name: 'أسبوعي', price: 10000, days: 7 },
  { id: 3, name: '15 يوم', price: 15000, days: 15 },
  { id: 4, name: 'شهري', price: 35000, days: 30 },
  { id: 5, name: '60 يوم', price: 55000, days: 60 },
  { id: 6, name: '90 يوم', price: 80000, days: 90 }
];

// ===== المناطق - يمكن إدارتها من الإعدادات =====
let areas = [
  'المنصور', 'الكريعات', 'الدورة', 'اليرموك', 'الجامعة', 'أخرى'
];

// ===== الأبراج - يمكن إدارتها من الإعدادات =====
let towers = [
  { id: 1, name: 'برج الاتحاد', points: [] }
];

// ===== المشتركين (Subscribers) =====
// تم نقل البيانات إلى initDefaultData() أعلاه

// ===== السجلات المالية =====
// تم نقل البيانات إلى initDefaultData() أعلاه

// ===== قوالب رسائل واتساب =====
let waTemplates = [
  {id:1,title:'تفعيل الاشتراك',icon:'fa-check-circle',msg:'مرحباً {name}،\nتم تفعيل اشتراكك في NetTower بنجاح ✅\nنوع الاشتراك: {type}\nتاريخ الانتهاء: {end}\nنتمنى لك تجربة إنترنت ممتعة'},
  {id:2,title:'اقتراب انتهاء الاشتراك',icon:'fa-clock',msg:'عزيزي {name}،\nنذكرك بأن اشتراكك سينتهي بتاريخ {end} ⏰\nيرجى تجديد الاشتراك لضمان استمرارية الخدمة'},
  {id:3,title:'انتهاء الاشتراك',icon:'fa-exclamation-circle',msg:'عزيزي {name}،\nانتهى اشتراكك بتاريخ {end} ❌\nيرجى التجديد فوراً لاستعادة الخدمة.\nللتواصل: {towerPhone}'},
  {id:4,title:'استلام المبلغ',icon:'fa-money-bill-wave',msg:'تم استلام مبلغ الاشتراك من {name} ✅\nالمبلغ: {amount} دينار\nنوع الاشتراك: {type}\nشكراً لثقتكم 🙏'},
  {id:5,title:'رسالة مخصصة',icon:'fa-edit',msg:'الاسم: {name}\nرقم: {phone}'},
];

// ===== المشتركين المؤرشفين =====
// تمت إدارته عبر _store.archivedSubs (تفاعلي)

// ===== فئات المصروفات =====
let expenseCategories = [
  { id: 1, name: 'فواتير كهرباء' },
  { id: 2, name: 'صيانة أجهزة' },
  { id: 3, name: 'إيجار برج' },
  { id: 4, name: 'رواتب موظفين' },
  { id: 5, name: 'مصاريف تشغيل' },
];

// ===== معلومات البرج (تستخدم في الواتساب والإعدادات) =====
let towerInfo = {
  name: 'برج الاتحاد',
  address: 'بغداد - المنصور',
  phone: '07700000000'
};

// ===== إعدادات التنبيهات - مدة التنبيه قبل انتهاء الاشتراك (2-7 أيام) =====
let alertDays = 3;

// ===== عدادات للـ ID =====
let nextId = 12;    // للمشتركين الجدد
let finId = 6;      // للسجلات المالية الجديدة
let nextDebtId = 1; // للديون الفردية
let lastArchiveMonth = ''; // آخر شهر تمت فيه الأرشفة

// ===== نظام المستخدمين والصلاحيات =====
let users = [
  { id: 1, name: 'المدير العام', username: 'admin', password: 'admin', lastLogin: null,
    permissions: {
      dashboard: true, subscribers: { view: true, add: true, edit: true, del: true, renew: true, settle: true },
      finance: { view: true, add: true, edit: true, del: true },
      whatsapp: true, reports: true, archive: true, notifications: true,
      settings: { view: true, manageUsers: true, manageTypes: true, manageAreas: true, manageTowers: true, manageTemplates: true, manageAlerts: true }
    }
  }
];
let currentUser = null;

function can(perm) {
  if (!currentUser) return false;
  const p = currentUser.permissions;
  const parts = perm.split('.');
  let obj = p;
  for (let i = 0; i < parts.length; i++) {
    if (obj === true || obj === false) return obj;
    if (obj === undefined || obj === null) return false;
    obj = obj[parts[i]];
  }
  return obj === true;
}

function doLogin(username, password) {
  const u = users.find(x => x.username === username && x.password === password);
  if (!u) return null;
  u.lastLogin = todayStr();
  currentUser = u;
  sessionStorage.setItem('nettower_user', JSON.stringify({ id: u.id, username: u.username, name: u.name }));
  saveAllData();
  return u;
}

function doLogout() {
  currentUser = null;
  sessionStorage.removeItem('nettower_user');
  window.location.href = 'login.html';
}

function restoreSession() {
  try {
    const saved = sessionStorage.getItem('nettower_user');
    if (saved) {
      const d = JSON.parse(saved);
      currentUser = users.find(u => u.id === d.id) || null;
    }
  } catch(e) {}
}

// ===== الأرشفة التلقائية الشهرية =====
function autoArchive() {
  const now = new Date();
  const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  if (!lastArchiveMonth) {
    lastArchiveMonth = currentMonth;
    return;
  }
  if (lastArchiveMonth !== currentMonth) {
    // وجدنا أن الشهر تغير -> أرشفة الشهر السابق
    const prevMonth = lastArchiveMonth;
    _store.finRecords.forEach(function(r) {
      if (r.date && r.date.startsWith(prevMonth) && !r.archived) {
        r.archived = true;
      }
    });
    // أيضاً أرشفة المشتركين المنتهية اشتراكاتهم من الشهر السابق
    _store.subs.forEach(function(s) {
      if (s.status === 'expired' && s.end && s.end.startsWith(prevMonth) && !s.archived) {
        s.archived = true;
      }
    });
    lastArchiveMonth = currentMonth;
    saveAllData();
  }
}

// ===== تحميل البيانات المحفوظة (إن وجدت) =====
// هذا يستبدل البيانات الافتراضية بالمحفوظة في localStorage
loadAllData();
restoreSession();

/* ============================================================
   ملاحظة للمستقبل - ربط الباك إند:
   عند وجود API، استبدل دوال saveAllData() و loadAllData()
   باستدعاءات API مثل fetch().
   مثال:
     async function saveAllData() {
       await fetch('/api/save', { method:'POST', body: JSON.stringify({...}) });
     }
   ============================================================ */
