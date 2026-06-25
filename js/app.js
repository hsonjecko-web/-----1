/* ============================================================
   app.js - تهيئة Vue + Router + تشغيل التطبيق
   هذا الملف يربط كل أجزاء التطبيق معاً
   ============================================================ */

// ===== دوال عامة للتحكم في Toast و Modal =====
window.showToast = function(msg) {
  const t = document.getElementById('toast');
  if (!t) { console.warn('toast element not found'); return; }
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
};

window._scrollLock = 0;
function _updateScrollLock() {
  document.body.classList.toggle('modal-open', window._scrollLock > 0);
}
window.openModal = function() {
  window._scrollLock++;
  _updateScrollLock();
  document.getElementById('modalOverlay')?.classList.add('show');
  const modal = document.getElementById('modal');
  if (modal) {
    modal.scrollTop = 0;
    modal.classList.add('open');
  }
};
window.closeModal = function() {
  window._scrollLock = Math.max(0, window._scrollLock - 1);
  _updateScrollLock();
  document.getElementById('modalOverlay')?.classList.remove('show');
  document.getElementById('modal')?.classList.remove('open');
};

// ===== مسارات التطبيق (Routes) =====
const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/subscribers', component: SubscribersPage, name: 'subscribers' },
  { path: '/add-sub', component: AddSubPage, name: 'add-sub' },
  { path: '/sub-detail/:id', component: SubDetailPage, name: 'sub-detail' },
  { path: '/whatsapp', component: WhatsAppPage, name: 'whatsapp' },
  { path: '/finance', component: FinancePage, name: 'finance' },
  { path: '/archive', component: ArchivePage, name: 'archive' },
  { path: '/reports', component: ReportsPage, name: 'reports' },
  { path: '/notifications', component: NotificationsPage, name: 'notifications' },
  { path: '/settings', component: SettingsPage, name: 'settings' },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
});

// حماية المسارات - التحقق من تسجيل الدخول والصلاحيات
const routePermissions = {
  home: 'dashboard', subscribers: 'subscribers.view', 'add-sub': 'subscribers.add',
  'sub-detail': 'subscribers.view', whatsapp: 'whatsapp',
  finance: 'finance.view', reports: 'reports',
  archive: 'archive', notifications: 'notifications', settings: 'settings.view'
};

router.beforeEach(function(to, from, next) {
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  const perm = routePermissions[to.name];
  if (perm && !can(perm)) {
    next('/');
    return;
  }
  next();
});

// ===== المكون الرئيسي للتطبيق =====
const App = {
  components: {
    SidebarComponent,
    HeaderComponent,
    BottomNavComponent
  },
  template: `
    <div class="side-overlay" :class="{ show: sidebarOpen }" @click="sidebarOpen = false"></div>
    <SidebarComponent />
    <div class="main">
      <HeaderComponent />
      <router-view />
    </div>
    <BottomNavComponent />
  `,
  setup() {
    const sidebarOpen = ref(false);
    provide('sidebarOpen', sidebarOpen);
    watch(sidebarOpen, v => {
      if(v) window._scrollLock++; else window._scrollLock = Math.max(0, window._scrollLock - 1);
      _updateScrollLock();
    });
    return { sidebarOpen };
  }
};

// ===== تشغيل التطبيق =====
const app = createApp(App);
app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = function(event) {
      if (!el.contains(event.target) && el !== event.target) {
        binding.value();
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
});
app.use(router);
app.mount('#app');

// ===== تزامن الثيم والأكسنت والنمط مع localStorage عند بدء التشغيل =====
(function() {
  var saved = localStorage.getItem('nettower-theme');
  if (saved === 'dark') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', 'light');
  var accent = localStorage.getItem('nettower-accent');
  if (accent && accent !== 'default') document.documentElement.setAttribute('data-accent', accent);
  else document.documentElement.removeAttribute('data-accent');
  var style = localStorage.getItem('nettower-style');
  if (style && style !== 'default') document.documentElement.setAttribute('data-style', style);
  else document.documentElement.removeAttribute('data-style');
})();

// ===== تغيير نمط التصميم مع تأثير تحميل =====
(function() {
  var loader = document.createElement('div');
  loader.className = 'style-loader';
  loader.innerHTML = '<div class="sl-spinner"></div>';
  document.body.appendChild(loader);

  window.applyStyle = function(name) {
    loader.classList.add('show');
    setTimeout(function() {
      var html = document.documentElement;
      if (name === 'default') {
        html.removeAttribute('data-style');
        localStorage.removeItem('nettower-style');
      } else {
        html.setAttribute('data-style', name);
        localStorage.setItem('nettower-style', name);
      }
      loader.classList.remove('show');
    }, 600);
  };
})();
