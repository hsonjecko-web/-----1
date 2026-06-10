/* ============================================================
   header.js - مكون الشريط العلوي
   ============================================================ */

var pageTitles = {
  home: 'لوحة التحكم', subscribers: 'المشتركين', 'add-sub': 'إضافة مشترك',
  'sub-detail': 'تفاصيل المشترك', whatsapp: 'واتساب', finance: 'الصندوق المالي',
  reports: 'التقارير', archive: 'الأرشيف', notifications: 'الإشعارات', settings: 'الإعدادات'
};
var pageIcons = {
  home: 'fa-chart-pie', subscribers: 'fa-users', 'add-sub': 'fa-user-plus',
  'sub-detail': 'fa-id-card', whatsapp: 'fa-whatsapp', finance: 'fa-coins',
  reports: 'fa-chart-bar', archive: 'fa-archive', notifications: 'fa-bell', settings: 'fa-cog'
};

var HeaderComponent = {
  template: `
    <header class="header">
      <button class="menu-btn" @click="toggleSidebar"><i class="fas fa-bars"></i></button>
      <div class="page-title"><i :class="'fas ' + currentIcon"></i> {{ currentTitle }}</div>
      <div class="h-search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="بحث سريع..." @keydown.enter="quickSearch">
      </div>
      <div class="h-actions">
        <button @click="$router.push('/notifications')" title="الإشعارات">
          <i class="fas fa-bell"></i><span class="badge">{{ notifBadge }}</span>
        </button>
        <button @click="$router.push('/settings')" title="الإعدادات"><i class="fas fa-cog"></i></button>
      </div>
    </header>
  `,
  setup() {
    const route = useRoute();
    const sidebarOpen = inject('sidebarOpen');

    const currentTitle = computed(() => {
      const name = route.name || 'home';
      return pageTitles[name] || 'NetTower Pro';
    });
    const currentIcon = computed(() => {
      const name = route.name || 'home';
      return pageIcons[name] || 'fa-circle';
    });
    const notifBadge = computed(() => {
      let n = 0;
      subs.forEach(s => {
        const d = daysBetween(new Date(s.end), new Date());
        if (s.status === 'expired') n++;
        else if (d >= 0 && d <= alertDays) n++;
        if (!s.paid && s.status === 'active') n++;
      });
      return n || '';
    });

    function toggleSidebar() {
      sidebarOpen.value = !sidebarOpen.value;
    }

    function quickSearch(e) {
      const q = e.target.value.trim();
      if (!q) return;
      showToast('🔍 البحث عن: ' + q);
      e.target.value = '';
    }

    return { currentTitle, currentIcon, notifBadge, toggleSidebar, quickSearch };
  }
};
