/* ============================================================
   HomePage.js - صفحة لوحة التحكم الرئيسية
   ============================================================ */

var HomePage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-chart-simple"></i> نظرة عامة</h2>
        <a @click="$router.push('/subscribers')"><i class="fas fa-arrow-left"></i> عرض الكل</a>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="top">
            <div class="icon cyan"><i class="fas fa-users"></i></div>
            <span class="trend up"><i class="fas fa-arrow-up"></i> +12%</span>
          </div>
          <div class="num">{{ totalSubs }}</div>
          <div class="label">إجمالي المشتركين</div>
        </div>
        <div class="stat-card">
          <div class="top">
            <div class="icon green"><i class="fas fa-wifi"></i></div>
            <span class="trend up"><i class="fas fa-arrow-up"></i> +5%</span>
          </div>
          <div class="num">{{ activeSubs }}</div>
          <div class="label">مشتركين فعالين</div>
        </div>
        <div class="stat-card">
          <div class="top">
            <div class="icon red"><i class="fas fa-ban"></i></div>
            <span class="trend down"><i class="fas fa-arrow-down"></i> +3</span>
          </div>
          <div class="num">{{ expiredSubs }}</div>
          <div class="label">اشتراكات منتهية</div>
        </div>
        <div class="stat-card">
          <div class="top">
            <div class="icon orange"><i class="fas fa-user-clock"></i></div>
            <span class="trend down"><i class="fas fa-arrow-down"></i> +2</span>
          </div>
          <div class="num">{{ inactiveSubs }}</div>
          <div class="label">غير مفعلين</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon red"><i class="fas fa-coins"></i></div></div>
          <div class="num">{{ debtsTotal }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon green"><i class="fas fa-wallet"></i></div></div>
          <div class="num">{{ balanceTotal }}</div>
          <div class="label">الرصيد الحالي</div>
        </div>
        <div class="stat-card" style="grid-column:span 2">
          <div class="top">
            <div class="icon orange"><i class="fas fa-clock"></i></div>
            <span class="trend down"><i class="fas fa-arrow-down"></i> {{ expiringSoon.length }} مشتركين</span>
          </div>
          <div class="num">{{ expiringSoon.length }}</div>
          <div class="label">اشتراكات تنتهي قريباً (أقل من {{ alertDays }} أيام)</div>
        </div>
      </div>

      <div class="shead"><h2><i class="fas fa-bolt"></i> العمليات السريعة</h2></div>
      <div class="quick-acts">
        <div class="qa" @click="$router.push('/add-sub')">
          <div class="qicon cyan"><i class="fas fa-user-plus"></i></div><span>إضافة مشترك</span>
        </div>
        <div class="qa" @click="$router.push('/subscribers')">
          <div class="qicon green"><i class="fas fa-sync"></i></div><span>تجديد اشتراك</span>
        </div>
        <div class="qa" @click="$router.push('/whatsapp')">
          <div class="qicon green"><i class="fab fa-whatsapp"></i></div><span>إرسال واتساب</span>
        </div>
        <div class="qa" @click="$router.push('/finance')">
          <div class="qicon orange"><i class="fas fa-coins"></i></div><span>الصندوق المالي</span>
        </div>
        <div class="qa" @click="$router.push('/reports')">
          <div class="qicon purple"><i class="fas fa-chart-bar"></i></div><span>التقارير</span>
        </div>
        <div class="qa" @click="$router.push('/archive')">
          <div class="qicon red"><i class="fas fa-archive"></i></div><span>الأرشيف</span>
        </div>
      </div>

      <div class="shead">
        <h2><i class="fas fa-clock"></i> اشتراكات تنتهي قريباً</h2>
        <a @click="$router.push('/subscribers')">المزيد</a>
      </div>
      <div class="subs-list">
        <div v-for="s in expiringSoon" :key="s.id" class="sub-card" @click="$router.push('/sub-detail/'+s.id)">
          <div class="avatar" :class="{ off: s.status!=='active' }">{{ s.name.charAt(0) }}</div>
          <div class="info">
            <div class="name">
              {{ s.name }}
              <span class="dot" :class="s.status==='active'?'on':s.status==='expired'?'off':'wait'"></span>
            </div>
            <div class="phone"><i class="fas fa-phone" style="font-size:10px;color:var(--text3)"></i> {{ s.phone }}</div>
            <div class="meta">
              <span class="type">{{ s.type }}</span>
              <span :class="s.paid?'paid':'debt'">{{ s.paid?'مدفوع':'غير مدفوع' }}</span>
              <span class="expiring">{{ daysBetween(new Date(s.end),new Date()) }} أيام</span>
            </div>
          </div>
        </div>
        <p v-if="!expiringSoon.length" style="color:var(--text3);padding:20px;text-align:center;font-size:14px">
          ✅ لا توجد اشتراكات تنتهي قريباً
        </p>
      </div>
    </div>
  `,
  setup() {
    return {
      totalSubs: computed(() => subs.length),
      activeSubs: computed(() => subs.filter(s => s.status === 'active').length),
      expiredSubs: computed(() => subs.filter(s => s.status === 'expired').length),
      inactiveSubs: computed(() => subs.filter(s => s.status === 'inactive').length),
      debtsTotal: computed(() => {
        const d = subs.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0);
        return formatMoney(d);
      }),
      balanceTotal: computed(() => {
        const i = finRecords.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0);
        const e = finRecords.filter(f => f.type === 'expense').reduce((a, f) => a + f.amount, 0);
        return formatMoney(i - e);
      }),
      expiringSoon: computed(() => subs.filter(s => {
        if(s.status !== 'active') return false;
        const d = daysBetween(new Date(s.end), new Date());
        return d >= 0 && d <= alertDays;
      }).slice(0, 5)),
      daysBetween,
      alertDays
    };
  }
};
