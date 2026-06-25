/* ============================================================
   header.js - مكون الشريط العلوي
   ============================================================ */

var pageTitles = {
  home: 'لوحة التحكم', subscribers: 'المشتركين', 'add-sub': 'إضافة مشترك',
  'sub-detail': 'تفاصيل المشترك', whatsapp: 'واتساب', finance: 'الصندوق المالي',
  reports: 'التقارير', archive: 'الأرشيف', notifications: 'الإشعارات', settings: 'الإعدادات'
};
var searchPageRoutes = ['home', 'subscribers', 'whatsapp'];
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
      <div class="h-search" v-if="showSearchInHeader">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="بحث..." v-model="searchQ" @input="doSearch" @focus="doSearch" @blur="setTimeout(()=>showSearchResults=false,200)">
        <div v-if="showSearchResults" class="search-dropdown">
          <div v-for="r in searchResults" :key="r.id" @mousedown="goToSub(r.id)" class="search-result-item">
            <div class="sri-avatar" :style="{background: r.status==='active'?'var(--success)':r.status==='expired'?'var(--danger)':r.status==='inactive'?'var(--warning)':'var(--text3)'}">{{ r.name.charAt(0) }}</div>
            <div class="sri-info">
              <div class="sri-name">{{ r.name }}</div>
              <div class="sri-phone">{{ r.phone }}</div>
            </div>
            <span class="sri-status" :class="r.status">{{ statusMap[r.status] || r.status }}</span>
          </div>
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
    const searchResults = ref([]);
    const showSearchResults = ref(false);
    const isDark = ref(localStorage.getItem('nettower-theme') !== 'light');

    const currentTitle = computed(() => {
      const name = route.name || 'home';
      return pageTitles[name] || 'NetTower Pro';
    });
    const currentIcon = computed(() => {
      const name = route.name || 'home';
      return pageIcons[name] || 'fa-circle';
    });
    const showSearchInHeader = computed(() => searchPageRoutes.includes(route.name));

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
      if (!q) { searchResults.value = []; showSearchResults.value = false; return; }
      searchResults.value = subs.filter(s => s.name.toLowerCase().includes(q)).slice(0, 10);
      showSearchResults.value = searchResults.value.length > 0;
    }

    function goToSub(id) {
      router.push('/sub-detail/' + id);
      searchQ.value = '';
      searchResults.value = [];
      showSearchResults.value = false;
    }

    const statusMap = { active: 'فعال', expired: 'منتهي', inactive: 'غير مفعل', disabled: 'معطل' };

    return { currentTitle, currentIcon, notifBadge, toggleSidebar, toggleTheme, searchQ, searchResults, showSearchResults, doSearch, goToSub, isDark, statusMap, showSearchInHeader };
  }
};
