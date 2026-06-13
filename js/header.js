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
        <input type="text" placeholder="بحث عن مشترك..." v-model="searchQ" @keydown.enter="doSearch" @input="doSearch">
      </div>
      <div class="h-user" @click="showUserMenu = !showUserMenu" v-click-outside="() => showUserMenu = false">
        <div class="hu-avatar">{{ currentUser ? currentUser.name.charAt(0) : '?' }}</div>
        <div class="hu-name">{{ currentUser ? currentUser.name : 'زائر' }}</div>
        <div class="hu-menu" v-if="showUserMenu">
          <div class="hum-item" @click="doLogoutAction"><i class="fas fa-sign-out-alt"></i> تسجيل الخروج</div>
        </div>
      </div>
      <div class="h-actions">
        <button @click="toggleTheme" title="تغيير المود">
          <i class="fas" :class="isDark?'fa-moon':'fa-sun'"></i>
        </button>
        <button @click="$router.push('/notifications')" title="الإشعارات">
          <i class="fas fa-bell"></i><span class="badge">{{ notifBadge }}</span>
        </button>
      </div>
    </header>
  `,
  setup() {
    const route = useRoute();
    const router = useRouter();
    const sidebarOpen = inject('sidebarOpen');
    const searchQ = ref('');
    const isDark = ref(localStorage.getItem('nettower-theme') !== 'light');
    const showUserMenu = ref(false);

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

    function toggleTheme() {
      isDark.value = !isDark.value;
      const html = document.documentElement;
      if (isDark.value) html.removeAttribute('data-theme');
      else html.setAttribute('data-theme', 'light');
      localStorage.setItem('nettower-theme', isDark.value ? 'dark' : 'light');
    }

    function doSearch() {
      const q = searchQ.value.trim().toLowerCase();
      if (!q) return;
      const found = subs.find(s => s.name.toLowerCase().includes(q) || s.phone.includes(q));
      if (found) {
        router.push('/sub-detail/' + found.id);
        searchQ.value = '';
      } else {
        showToast('🔍 لا توجد نتائج لـ "' + q + '"');
      }
    }

    function doLogoutAction() {
      doLogout();
    }

    return { currentTitle, currentIcon, notifBadge, toggleSidebar, toggleTheme, searchQ, doSearch, isDark, currentUser, showUserMenu, doLogoutAction };
  }
};
