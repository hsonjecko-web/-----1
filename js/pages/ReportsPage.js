/* ============================================================
   ReportsPage.js - صفحة التقارير
   ============================================================ */

var ReportsPage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-chart-bar"></i> التقارير</h2></div>

      <div class="stats">
        <div v-for="(card, i) in statCards" :key="i" class="stat-card">
          <div class="top"><div class="icon" :class="card.color"><i :class="card.icon"></i></div></div>
          <div class="num" :style="{ color: card.numColor }">{{ card.value }}</div>
          <div class="label">{{ card.label }}</div>
        </div>
      </div>

      <div class="filter-row" style="padding:0 20px 12px">
        <div class="filter-chip" :class="{ active: repTab==='finance' }" @click="repTab='finance'">السجل المالي</div>
        <div class="filter-chip" :class="{ active: repTab==='subs' }" @click="repTab='subs'">المشتركين</div>
        <div class="filter-chip" :class="{ active: repTab==='debts' }" @click="repTab='debts'">الديون</div>
      </div>

      <!-- ===== التبويب: السجل المالي ===== -->
      <div v-if="repTab==='finance'">
        <div class="search-bar">
          <div class="input-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="بحث في الوصف..." v-model="searchQuery">
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-chip" :class="{ active: filterType==='all' }" @click="filterType='all'">الكل</div>
          <div class="filter-chip" :class="{ active: filterType==='income' }" @click="filterType='income'">إيرادات</div>
          <div class="filter-chip" :class="{ active: filterType==='expense' }" @click="filterType='expense'">مصروفات</div>
        </div>
        <div class="filter-row">
          <div style="display:flex;gap:8px;flex:1">
            <div style="flex:1;min-width:0">
              <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:2px">من تاريخ</label>
              <input type="date" v-model="dateFrom" style="width:100%;padding:8px 10px;font-size:13px;border-radius:10px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-family:inherit">
            </div>
            <div style="flex:1;min-width:0">
              <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:2px">إلى تاريخ</label>
              <input type="date" v-model="dateTo" style="width:100%;padding:8px 10px;font-size:13px;border-radius:10px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-family:inherit">
            </div>
          </div>
        </div>
        <div class="fin-list">
          <div v-for="(group, month) in filteredGroups" :key="month" style="margin-bottom:16px">
            <div style="font-weight:800;color:var(--primary);margin-bottom:8px;padding:0 4px;font-size:14px">{{ month }}</div>
            <div v-for="f in group" :key="f.id" class="fin-item">
              <div class="fleft">
                <div class="fdate">{{ f.date }}</div>
                <div class="fdesc">{{ f.desc }}</div>
              </div>
              <div style="text-align:left">
                <div class="famount" :class="f.type">{{ f.type==='income'?'+':'-' }} {{ formatMoney(f.amount) }}</div>
                <span class="ftype">{{ f.type==='income'?'إيراد':'مصروف' }}</span>
              </div>
            </div>
          </div>
          <p v-if="!Object.keys(filteredGroups).length" style="color:var(--text3);padding:40px;text-align:center;font-size:14px">
            <i class="fas fa-inbox" style="font-size:48px;display:block;margin-bottom:14px;opacity:.2"></i>لا توجد عمليات مطابقة
          </p>
        </div>
      </div>

      <!-- ===== التبويب: المشتركين ===== -->
      <div v-if="repTab==='subs'">
        <div class="search-bar">
          <div class="input-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="بحث في الاسم أو الهاتف..." v-model="subSearch">
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-chip" :class="{ active: subStatusFilter==='all' }" @click="subStatusFilter='all'">الكل</div>
          <div class="filter-chip" :class="{ active: subStatusFilter==='active' }" @click="subStatusFilter='active'">فعال</div>
          <div class="filter-chip" :class="{ active: subStatusFilter==='expired' }" @click="subStatusFilter='expired'">منتهي</div>
          <div class="filter-chip" :class="{ active: subStatusFilter==='inactive' }" @click="subStatusFilter='inactive'">غير مفعل</div>
          <div class="filter-chip" :class="{ active: subStatusFilter==='disabled' }" @click="subStatusFilter='disabled'">معطل</div>
        </div>
        <div class="filter-row">
          <div class="filter-chip" :class="{ active: subAreaFilter==='all' }" @click="subAreaFilter='all'">كل المناطق</div>
          <div class="filter-chip" v-for="a in repAreas" :key="a" :class="{ active: subAreaFilter===a }" @click="subAreaFilter=a">{{ a }}</div>
        </div>
        <div style="padding:0 20px;margin-bottom:8px;font-size:13px;color:var(--text2)">
          <i class="fas fa-list"></i> عدد المشتركين: {{ filteredSubs.length }}
        </div>
        <div class="subs-list">
          <div v-for="s in filteredSubs" :key="s.id" class="sub-card" :class="s.status" @click="$router.push('/sub-detail/'+s.id)">
            <div class="avatar" :class="{ on:s.status==='active', off:s.status==='expired', wait:s.status==='inactive', disabled:s.status==='disabled' }">{{ s.name.charAt(0) }}</div>
            <div class="info">
              <div class="name">{{ s.name }}</div>
              <div class="phone"><i class="fas fa-phone"></i> {{ s.phone }}</div>
              <div class="meta">
                <span class="type">{{ s.type }}</span>
                <span :class="s.paid ? 'paid' : 'debt'">{{ s.paid ? 'مدفوع' : 'غير مدفوع' }}</span>
              </div>
            </div>
          </div>
          <p v-if="!filteredSubs.length" style="color:var(--text3);padding:40px;text-align:center;font-size:14px">
            <i class="fas fa-users" style="font-size:48px;display:block;margin-bottom:14px;opacity:.2"></i>لا يوجد مشتركين
          </p>
        </div>
      </div>

      <!-- ===== التبويب: الديون ===== -->
      <div v-if="repTab==='debts'">
        <div class="search-bar">
          <div class="input-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="بحث في الاسم أو الهاتف..." v-model="debtSearch">
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-chip" :class="{ active: debtAreaFilter==='all' }" @click="debtAreaFilter='all'">كل المناطق</div>
          <div class="filter-chip" v-for="a in repAreas" :key="a" :class="{ active: debtAreaFilter===a }" @click="debtAreaFilter=a">{{ a }}</div>
        </div>
        <div style="padding:0 20px;margin-bottom:8px">
          <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:13px">
            <span style="color:var(--danger);font-weight:800">إجمالي الديون: {{ totalDebtAll }}</span>
            <span style="color:var(--text2)">عدد المدينين: {{ debtorsCount }}</span>
          </div>
        </div>
        <div class="subs-list">
          <div v-for="s in filteredDebtors" :key="s.id" class="sub-card" :class="s.status" @click="$router.push('/sub-detail/'+s.id)">
            <div class="avatar" :class="{ on:s.status==='active', off:s.status==='expired', wait:s.status==='inactive', disabled:s.status==='disabled' }">{{ s.name.charAt(0) }}</div>
            <div class="info">
              <div class="name">{{ s.name }}</div>
              <div class="phone"><i class="fas fa-phone"></i> {{ s.phone }} · {{ s.area }}</div>
              <div class="meta">
                <span class="type">{{ s.type }}</span>
                <span class="debt">دين: {{ formatMoney(calcTotalDebt(s)) }}</span>
                <span v-if="s.prevDebt > 0" class="remaining">سابق: {{ formatMoney(s.prevDebt) }}</span>
              </div>
            </div>
          </div>
          <p v-if="!filteredDebtors.length" style="color:var(--text3);padding:40px;text-align:center;font-size:14px">
            <i class="fas fa-check-circle" style="font-size:48px;display:block;margin-bottom:14px;opacity:.2"></i>لا يوجد مدينين - كل المشتركين مسددين
          </p>
        </div>
      </div>
    </div>
  `,
  setup() {
    const searchQuery = ref('');
    const filterType = ref('all');
    const dateFrom = ref('');
    const dateTo = ref('');
    const repTab = ref('finance');
    const subSearch = ref('');
    const subStatusFilter = ref('all');
    const subAreaFilter = ref('all');
    const debtSearch = ref('');
    const debtAreaFilter = ref('all');

    function matchesFilters(f) {
      if (filterType.value !== 'all' && f.type !== filterType.value) return false;
      if (dateFrom.value && f.date < dateFrom.value) return false;
      if (dateTo.value && f.date > dateTo.value) return false;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        if (!f.desc.toLowerCase().includes(q)) return false;
      }
      return true;
    }

    const filteredRecords = computed(() => finRecords.filter(matchesFilters));

    const filteredGroups = computed(() => {
      const m = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const groups = {};
      filteredRecords.value.forEach(f => {
        const [y, month] = f.date.substring(0, 7).split('-');
        const label = m[parseInt(month)] + ' ' + y;
        if (!groups[label]) groups[label] = [];
        groups[label].push(f);
      });
      return groups;
    });

    const repAreas = computed(() => {
      const s = new Set();
      subs.forEach(x => { if (x.area) s.add(x.area); });
      return [...s].sort();
    });

    // ===== Subscribers tab =====
    const filteredSubs = computed(() => {
      let list = [...subs];
      const q = subSearch.value.toLowerCase();
      if (q) list = list.filter(x => x.name.toLowerCase().includes(q) || x.phone.includes(q) || x.area.toLowerCase().includes(q));
      if (subStatusFilter.value !== 'all') list = list.filter(x => x.status === subStatusFilter.value);
      if (subAreaFilter.value !== 'all') list = list.filter(x => x.area === subAreaFilter.value);
      return list;
    });

    // ===== Debts tab =====
    const filteredDebtors = computed(() => {
      let list = subs.filter(s => calcTotalDebt(s) > 0);
      const q = debtSearch.value.toLowerCase();
      if (q) list = list.filter(x => x.name.toLowerCase().includes(q) || x.phone.includes(q));
      if (debtAreaFilter.value !== 'all') list = list.filter(x => x.area === debtAreaFilter.value);
      return list;
    });

    const totalDebtAll = computed(() => formatMoney(filteredDebtors.value.reduce((a, s) => a + calcTotalDebt(s), 0)));
    const debtorsCount = computed(() => filteredDebtors.value.length);

    // ===== Stat cards dynamic حسب التبويب النشط =====
    const statCards = computed(() => {
      if (repTab.value === 'finance') {
        const income = filteredRecords.value.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0);
        const expense = filteredRecords.value.filter(f => f.type === 'expense').reduce((a, f) => a + f.amount, 0);
        return [
          { icon: 'fas fa-arrow-down', color: 'green', numColor: 'var(--success)', value: formatMoney(income), label: 'إجمالي الإيرادات' },
          { icon: 'fas fa-arrow-up', color: 'red', numColor: 'var(--danger)', value: formatMoney(expense), label: 'إجمالي المصروفات' },
          { icon: 'fas fa-wallet', color: 'green', numColor: 'var(--success)', value: formatMoney(income - expense), label: 'الرصيد' },
          { icon: 'fas fa-list', color: 'cyan', numColor: 'var(--primary)', value: filteredRecords.value.length, label: 'عدد العمليات' },
        ];
      } else if (repTab.value === 'subs') {
        const list = filteredSubs.value;
        const active = list.filter(s => s.status === 'active').length;
        const expired = list.filter(s => s.status === 'expired').length;
        const inactive = list.filter(s => s.status === 'inactive' || s.status === 'disabled').length;
        const debts = list.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0);
        return [
          { icon: 'fas fa-wifi', color: 'green', numColor: 'var(--success)', value: active, label: 'فعالين' },
          { icon: 'fas fa-ban', color: 'red', numColor: 'var(--danger)', value: expired, label: 'منتهية' },
          { icon: 'fas fa-user-clock', color: 'orange', numColor: 'var(--warning)', value: inactive, label: 'غير مفعلين' },
          { icon: 'fas fa-coins', color: 'red', numColor: 'var(--danger)', value: formatMoney(debts), label: 'الديون المستحقة' },
          { icon: 'fas fa-users', color: 'cyan', numColor: 'var(--primary)', value: list.length, label: 'الإجمالي' },
        ];
      } else {
        const list = filteredDebtors.value;
        const total = list.reduce((a, s) => a + calcTotalDebt(s), 0);
        return [
          { icon: 'fas fa-coins', color: 'red', numColor: 'var(--danger)', value: formatMoney(total), label: 'إجمالي الديون' },
          { icon: 'fas fa-users', color: 'cyan', numColor: 'var(--primary)', value: list.length, label: 'عدد المدينين' },
          { icon: 'fas fa-wifi', color: 'green', numColor: 'var(--success)', value: list.filter(s => s.status === 'active').length, label: 'مدينين فعالين' },
          { icon: 'fas fa-ban', color: 'red', numColor: 'var(--danger)', value: list.filter(s => s.status === 'expired').length, label: 'مدينين منتهية' },
        ];
      }
    });

    return {
      searchQuery, filterType, dateFrom, dateTo, repTab,
      subSearch, subStatusFilter, subAreaFilter,
      debtSearch, debtAreaFilter,
      filteredRecords, filteredGroups, repAreas,
      filteredSubs, filteredDebtors,
      totalDebtAll, debtorsCount,
      statCards,
      formatMoney, calcTotalDebt
    };
  }
};
