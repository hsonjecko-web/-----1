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
        <div class="u-avatar">A</div>
        <div>
          <h5>المدير العام</h5>
          <p>admin@nettower.iq</p>
        </div>
      </div>
      <nav class="side-nav">
        <div class="nav-section">القائمة الرئيسية</div>
        <router-link to="/"><i class="fas fa-chart-pie"></i> لوحة التحكم</router-link>
        <router-link to="/subscribers"><i class="fas fa-users"></i> المشتركون <span class="sbadge">{{ subsCount }}</span></router-link>
        <router-link to="/add-sub"><i class="fas fa-user-plus"></i> إضافة مشترك</router-link>
        <router-link to="/whatsapp"><i class="fab fa-whatsapp"></i> واتساب</router-link>
        <div class="nav-section">المالية</div>
        <router-link to="/finance"><i class="fas fa-coins"></i> الصندوق المالي</router-link>
        <router-link to="/reports"><i class="fas fa-chart-bar"></i> التقارير</router-link>
        <div class="nav-section">الإدارة</div>
        <router-link to="/archive"><i class="fas fa-archive"></i> الأرشيف</router-link>
        <router-link to="/notifications"><i class="fas fa-bell"></i> الإشعارات <span class="sbadge">{{ notifCount }}</span></router-link>
        <router-link to="/settings"><i class="fas fa-cog"></i> الإعدادات</router-link>
      </nav>
      <div class="side-foot">
        <button @click="doLogout"><i class="fas fa-sign-out-alt"></i> تسجيل الخروج</button>
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

    function doLogout() {
      window.location.href = 'login.html';
    }

    watch(() => route.path, () => {
      if (window.innerWidth <= 768) sidebarOpen.value = false;
    });

    return { sidebarOpen, towerInfo, subsCount, notifCount, doLogout };
  }
};
