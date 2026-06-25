/* ============================================================
   HomePage.js - صفحة لوحة التحكم الرئيسية
   ============================================================ */

var HomePage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-chart-simple"></i> نظرة عامة</h2>
      </div>

      <div class="stats">
        <div class="stat-card" data-accent="purple" style="cursor:pointer" @click="showCardDetail('total')">
          <div class="top">
            <div class="icon cyan"><i class="fas fa-users"></i></div>
            <span class="trend up"><i class="fas fa-arrow-up"></i> +12%</span>
          </div>
          <div class="num">{{ totalSubs }}</div>
          <div class="label">إجمالي المشتركين</div>
        </div>
        <div class="stat-card" data-accent="teal" style="cursor:pointer" @click="showCardDetail('active')">
          <div class="top">
            <div class="icon green"><i class="fas fa-wifi"></i></div>
            <span class="trend up"><i class="fas fa-arrow-up"></i> +5%</span>
          </div>
          <div class="num">{{ activeSubs }}</div>
          <div class="label">مشتركين فعالين</div>
        </div>
        <div class="stat-card" data-accent="mint" style="cursor:pointer" @click="showCardDetail('balance')">
          <div class="top"><div class="icon orange"><i class="fas fa-wallet"></i></div></div>
          <div class="num">{{ balanceTotal }}</div>
          <div class="label">الرصيد الحالي</div>
        </div>
        <div class="stat-card" data-accent="gray" style="cursor:pointer" @click="showCardDetail('inactive')">
          <div class="top">
            <div class="icon rose"><i class="fas fa-user-clock"></i></div>
            <span class="trend down"><i class="fas fa-arrow-down"></i> +2</span>
          </div>
          <div class="num">{{ inactiveSubs }}</div>
          <div class="label">غير مفعلين</div>
        </div>
        <div class="stat-card" data-accent="rose" style="cursor:pointer" @click="showCardDetail('debts')">
          <div class="top"><div class="icon red"><i class="fas fa-coins"></i></div></div>
          <div class="num">{{ debtsTotal }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
        <div class="stat-card" data-accent="coral" style="cursor:pointer" @click="showCardDetail('expired')">
          <div class="top">
            <div class="icon blue"><i class="fas fa-ban"></i></div>
            <span class="trend down"><i class="fas fa-arrow-down"></i> +3</span>
          </div>
          <div class="num">{{ expiredSubs }}</div>
          <div class="label">اشتراكات منتهية</div>
        </div>
        <div class="stat-card" data-accent="orange" style="grid-column:span 2;cursor:pointer" @click="showCardDetail('expiring')">
          <div class="top">
            <div class="icon mint"><i class="fas fa-clock"></i></div>
            <span class="trend down"><i class="fas fa-arrow-down"></i> {{ expiringSoon.length }} مشتركين</span>
          </div>
          <div class="num">{{ expiringSoon.length }}</div>
          <div class="label">اشتراكات تنتهي قريباً (أقل من {{ alertDays }} أيام)</div>
        </div>
      </div>

      <div class="shead"><h2><i class="fas fa-bolt"></i> العمليات السريعة</h2></div>
      <div class="quick-acts">
        <div class="qa" data-accent="purple" @click="$router.push('/add-sub')" v-if="can('subscribers.add')">
          <div class="qicon cyan"><i class="fas fa-user-plus"></i></div><span>إضافة مشترك</span>
        </div>
        <div class="qa" data-accent="teal" @click="$router.push('/subscribers')" v-if="can('subscribers.view')">
          <div class="qicon green"><i class="fas fa-sync"></i></div><span>تجديد اشتراك</span>
        </div>
        <div class="qa" data-accent="mint" @click="$router.push('/whatsapp')" v-if="can('whatsapp')">
          <div class="qicon green"><i class="fab fa-whatsapp"></i></div><span>إرسال واتساب</span>
        </div>
        <div class="qa" data-accent="gold" @click="$router.push('/finance')" v-if="can('finance.view')">
          <div class="qicon orange"><i class="fas fa-coins"></i></div><span>الصندوق المالي</span>
        </div>
        <div class="qa" data-accent="lavender" @click="$router.push('/reports')" v-if="can('reports')">
          <div class="qicon purple"><i class="fas fa-chart-bar"></i></div><span>التقارير</span>
        </div>
        <div class="qa" data-accent="coral" @click="$router.push('/archive')" v-if="can('archive')">
          <div class="qicon red"><i class="fas fa-archive"></i></div><span>الأرشيف</span>
        </div>
      </div>

      <div class="shead">
        <h2><i class="fas fa-clock"></i> اشتراكات تنتهي قريباً</h2>
        <a @click="$router.push('/subscribers')">المزيد</a>
      </div>
      <div class="subs-list">
        <div v-for="s in expiringSoon" :key="s.id" class="sub-card" @click="$router.push('/sub-detail/'+s.id)">
          <div class="avatar" :class="{ on: s.status==='active', off: s.status!=='active' }">{{ s.name.charAt(0) }}</div>
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
    function showCardDetail(key) {
      let list = [];
      let title = '';
      if (key === 'total') {
        list = [...subs];
        title = 'جميع المشتركين';
      } else if (key === 'active') {
        list = subs.filter(s => s.status === 'active');
        title = 'المشتركين الفعالين';
      } else if (key === 'expired') {
        list = subs.filter(s => s.status === 'expired');
        title = 'الاشتراكات المنتهية';
      } else if (key === 'inactive') {
        list = subs.filter(s => s.status === 'inactive' || s.status === 'disabled');
        title = 'المشتركين غير المفعلين';
      } else if (key === 'debts') {
        list = subs.filter(s => !s.paid);
        title = 'المشتركين المتأخرين عن الدفع';
      } else if (key === 'balance') {
        const i = finRecords.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0);
        const e = finRecords.filter(f => f.type === 'expense').reduce((a, f) => a + f.amount, 0);
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-wallet" style="color:var(--success)"></i> الرصيد الحالي';
        document.getElementById('modalBody').innerHTML =
          '<div class="form-wrap" style="padding:0;text-align:center">' +
          '<div style="font-size:48px;font-weight:900;color:var(--success);margin:20px 0">' + formatMoney(i - e) + '</div>' +
          '<div style="display:flex;gap:20px;justify-content:center;margin-bottom:20px">' +
          '<div><div style="font-size:24px;font-weight:800;color:var(--success)">' + formatMoney(i) + '</div><div style="font-size:12px;color:var(--text3)">إجمالي الإيرادات</div></div>' +
          '<div><div style="font-size:24px;font-weight:800;color:var(--danger)">' + formatMoney(e) + '</div><div style="font-size:12px;color:var(--text3)">إجمالي المصروفات</div></div>' +
          '</div></div>';
        openModal();
        return;
      } else if (key === 'expiring') {
        list = subs.filter(s => {
          if (s.status !== 'active') return false;
          const d = daysBetween(new Date(s.end), new Date());
          return d >= 0 && d <= alertDays;
        });
        title = 'الاشتراكات التي تنتهي قريباً';
      }
      const statusMap = { active: 'فعال', expired: 'منتهي', inactive: 'غير مفعل', disabled: 'معطل' };
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-list"></i> ' + title + ' (' + list.length + ')';
      document.getElementById('modalBody').innerHTML =
        '<div class="subs-list" style="max-height:60vh;overflow-y:auto">' +
        list.map(s => '<div class="sub-card" onclick="closeModal();window.location.href=\'#/sub-detail/' + s.id + '\'" style="cursor:pointer">' +
          '<div class="avatar" style="background:' + (s.status === 'active' ? 'var(--success)' : s.status === 'expired' ? 'var(--danger)' : 'var(--warning)') + '">' + s.name.charAt(0) + '</div>' +
          '<div class="info">' +
          '<div class="name">' + s.name + ' <span class="dot" style="background:' + (s.status === 'active' ? 'var(--success)' : s.status === 'expired' ? 'var(--danger)' : 'var(--warning)') + '"></span></div>' +
          '<div class="phone"><i class="fas fa-phone"></i> ' + (s.phone || '') + '</div>' +
          '<div class="meta">' +
          '<span class="type">' + (s.type || '') + '</span>' +
          '<span class="' + (s.paid ? 'paid' : 'debt') + '">' + (s.paid ? 'مدفوع' : 'غير مدفوع') + '</span>' +
          (s.amount > 0 ? '<span>' + formatMoney(s.amount) + '</span>' : '') +
          '</div></div></div>').join('') +
        (!list.length ? '<p style="color:var(--text3);padding:40px;text-align:center">لا توجد نتائج</p>' : '') +
        '</div>';
      openModal();
    }

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
      showCardDetail,
      daysBetween,
      alertDays
    };
  }
};
