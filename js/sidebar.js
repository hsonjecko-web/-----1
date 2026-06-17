/* ============================================================
   sidebar.js - مكون القائمة الجانبية
   ============================================================ */

var SidebarComponent = {
  template: `
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="logo">
        <div class="icon"><i class="fas fa-signal"></i></div>
        <div class="info">
          <h4>NetTower Pro</h4>
          <span>{{ towerInfo.name }} - {{ towerInfo.address }}</span>
        </div>
      </div>
      <div class="side-user">
        <div class="u-avatar">{{ currentUser ? currentUser.name.charAt(0) : '?' }}</div>
        <div>
          <h5>{{ currentUser ? currentUser.name : 'زائر' }}</h5>
          <p>@{{ currentUser ? currentUser.username : 'غير مسجل' }}</p>
        </div>
      </div>
      <nav class="side-nav">
        <div class="nav-section">القائمة الرئيسية</div>
        <router-link to="/"><i class="fas fa-chart-pie"></i> لوحة التحكم</router-link>
        <router-link to="/subscribers" v-if="can('subscribers.view')"><i class="fas fa-users"></i> المشتركون <span class="sbadge">{{ subsCount }}</span></router-link>
        <router-link to="/add-sub" v-if="can('subscribers.add')"><i class="fas fa-user-plus"></i> إضافة مشترك</router-link>
        <router-link to="/whatsapp" v-if="can('whatsapp')"><i class="fab fa-whatsapp"></i> واتساب</router-link>
        <div class="nav-section">المالية</div>
        <router-link to="/finance" v-if="can('finance.view')"><i class="fas fa-coins"></i> الصندوق المالي</router-link>
        <router-link to="/reports" v-if="can('reports')"><i class="fas fa-chart-bar"></i> التقارير</router-link>
        <div class="nav-section">الإدارة</div>
        <router-link to="/archive" v-if="can('archive')"><i class="fas fa-archive"></i> الأرشيف</router-link>
        <router-link to="/notifications" v-if="can('notifications')"><i class="fas fa-bell"></i> الإشعارات <span class="sbadge">{{ notifCount }}</span></router-link>
        <router-link to="/settings" v-if="can('settings.view')"><i class="fas fa-cog"></i> الإعدادات</router-link>
      </nav>
      <div class="side-foot">
      </div>
    </aside>
  `,
  setup() {
    const route = useRoute();
    const sidebarOpen = inject('sidebarOpen');

    const subsCount = computed(() => subs.length);
    const notifCount = computed(() => {
      let n = 0;
      subs.forEach(s => {
        const d = daysBetween(new Date(s.end), new Date());
        if (s.status === 'expired') n++;
        else if (d >= 0 && d <= alertDays) n++;
        if (!s.paid && s.status === 'active') n++;
      });
      return n;
    });

    watch(() => route.path, () => {
      if (window.innerWidth <= 768) sidebarOpen.value = false;
    });

    return { sidebarOpen, towerInfo, subsCount, notifCount, currentUser, can };
  }
};
