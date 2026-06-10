/* ============================================================
   footer.js - مكون الشريط السفلي للموبايل
   ============================================================ */

var BottomNavComponent = {
  template: `
    <nav class="bnav">
      <router-link to="/" class="bnav-item" exact-active-class="active"><i class="fas fa-chart-pie"></i><span>الرئيسية</span></router-link>
      <router-link to="/subscribers" class="bnav-item" active-class="active"><i class="fas fa-users"></i><span>المشتركون</span></router-link>
      <router-link to="/whatsapp" class="bnav-item" active-class="active"><i class="fab fa-whatsapp"></i><span>واتساب</span></router-link>
      <router-link to="/finance" class="bnav-item" active-class="active"><i class="fas fa-coins"></i><span>الصندوق</span></router-link>
      <router-link to="/settings" class="bnav-item" active-class="active"><i class="fas fa-cog"></i><span>الإعدادات</span></router-link>
    </nav>
  `,
  setup() {
    return {};
  }
};
