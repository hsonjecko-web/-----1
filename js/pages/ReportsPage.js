/* ============================================================
   ReportsPage.js - صفحة التقارير
   ============================================================ */

var ReportsPage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-chart-bar"></i> التقارير</h2></div>

      <div class="stats">
        <div class="stat-card">
          <div class="top"><div class="icon cyan"><i class="fas fa-users"></i></div></div>
          <div class="num" style="color:var(--primary)">{{ rActive }}</div>
          <div class="label">مشتركين فعالين</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon red"><i class="fas fa-ban"></i></div></div>
          <div class="num" style="color:var(--danger)">{{ rExpired }}</div>
          <div class="label">اشتراكات منتهية</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon orange"><i class="fas fa-user-clock"></i></div></div>
          <div class="num" style="color:var(--warning)">{{ rInactive }}</div>
          <div class="label">غير مفعلين</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon red"><i class="fas fa-coins"></i></div></div>
          <div class="num" style="color:var(--danger)">{{ rDebts }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon green"><i class="fas fa-wallet"></i></div></div>
          <div class="num" style="color:var(--success)">{{ rPayments }}</div>
          <div class="label">إجمالي المدفوعات</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon cyan"><i class="fas fa-archive"></i></div></div>
          <div class="num" style="color:var(--primary)">{{ rArchived }}</div>
          <div class="label">المؤرشفين</div>
        </div>
      </div>

      <div class="search-bar">
        <div class="input-wrap">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="بحث في التقارير..." v-model="searchQuery">
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
      <div class="filter-row">
        <div class="filter-chip" :class="{ active: filterArea==='all' }" @click="filterArea='all'">كل المناطق</div>
        <div class="filter-chip" v-for="a in areaOpts" :key="a" :class="{ active: filterArea===a }" @click="filterArea=a">{{ a }}</div>
      </div>
      <div class="filter-row">
        <div class="filter-chip" :class="{ active: filterTower==='all' }" @click="filterTower='all'">كل الأبراج</div>
        <div class="filter-chip" v-for="t in towerOpts" :key="t" :class="{ active: filterTower===t }" @click="filterTower=t">{{ t }}</div>
      </div>

      <div class="shead" style="margin-top:6px"><h2><i class="fas fa-list"></i> سجل العمليات ({{ filteredRecords.length }})</h2></div>
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
  `,
  setup() {
    const searchQuery = ref('');
    const filterType = ref('all');
    const dateFrom = ref('');
    const dateTo = ref('');
    const filterArea = ref('all');
    const filterTower = ref('all');

    function matchesFilters(f) {
      if (filterType.value !== 'all' && f.type !== filterType.value) return false;
      if (dateFrom.value && f.date < dateFrom.value) return false;
      if (dateTo.value && f.date > dateTo.value) return false;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        if (!f.desc.toLowerCase().includes(q)) return false;
      }
      if (filterArea.value !== 'all') {
        if (!f.area || f.area !== filterArea.value) return false;
      }
      if (filterTower.value !== 'all') {
        if (!f.tower || f.tower !== filterTower.value) return false;
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

    const areaOpts = computed(() => {
      const s = new Set();
      finRecords.forEach(f => { if (f.area) s.add(f.area); });
      return [...s].sort();
    });

    const towerOpts = computed(() => {
      const s = new Set();
      finRecords.forEach(f => { if (f.tower) s.add(f.tower); });
      return [...s].sort();
    });

    function filterSubs(list) {
      const q = searchQuery.value.toLowerCase();
      let s = [...list];
      if (q) s = s.filter(x => x.name.toLowerCase().includes(q) || x.phone.includes(q) || x.area.includes(q));
      if (filterArea.value !== 'all') s = s.filter(x => x.area === filterArea.value);
      if (filterTower.value !== 'all') s = s.filter(x => (x.tower || '') === filterTower.value);
      return s;
    }

    const filteredSubs = computed(() => filterSubs(subs));

    const rActive = computed(() => filteredSubs.value.filter(s => s.status === 'active').length);
    const rExpired = computed(() => filteredSubs.value.filter(s => s.status === 'expired').length);
    const rInactive = computed(() => filteredSubs.value.filter(s => s.status === 'inactive' || s.status === 'disabled').length);
    const rDebts = computed(() => formatMoney(filteredSubs.value.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0)));
    const rPayments = computed(() => formatMoney(filteredRecords.value.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0)));
    const rArchived = computed(() => filterSubs(archivedSubs).length);

    return {
      searchQuery, filterType, dateFrom, dateTo, filterArea, filterTower,
      filteredRecords, filteredGroups, areaOpts, towerOpts,
      rActive, rExpired, rInactive, rDebts, rPayments, rArchived,
      formatMoney
    };
  }
};
