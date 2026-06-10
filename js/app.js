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

window.openModal = function() {
  document.getElementById('modalOverlay')?.classList.add('show');
  document.getElementById('modal')?.classList.add('open');
};

window.closeModal = function() {
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
    return { sidebarOpen };
  }
};

// ===== تشغيل التطبيق =====
const app = createApp(App);
app.use(router);
app.mount('#app');

// ===== تزامن الثيم مع localStorage عند بدء التشغيل =====
(function() {
  const saved = localStorage.getItem('nettower-theme');
  if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
})();
