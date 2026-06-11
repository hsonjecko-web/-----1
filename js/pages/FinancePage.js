/* ============================================================
   FinancePage.js - صفحة الصندوق المالي
   ============================================================ */

var FinancePage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-coins"></i> الصندوق المالي</h2></div>

      <div class="stats">
        <div class="stat-card">
          <div class="top"><div class="icon green"><i class="fas fa-arrow-down"></i></div></div>
          <div class="num" style="color:var(--success)">{{ totalIncome }}</div>
          <div class="label">إجمالي الإيرادات</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon red"><i class="fas fa-arrow-up"></i></div></div>
          <div class="num" style="color:var(--danger)">{{ totalExpense }}</div>
          <div class="label">إجمالي المصروفات</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon cyan"><i class="fas fa-wallet"></i></div></div>
          <div class="num" style="color:var(--primary)">{{ totalBalance }}</div>
          <div class="label">الرصيد الحالي</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon orange"><i class="fas fa-exclamation-triangle"></i></div></div>
          <div class="num" style="color:var(--warning)">{{ totalDebts }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
      </div>

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
      <div class="filter-row">
        <div class="filter-chip" :class="{ active: filterArea==='all' }" @click="filterArea='all'">كل المناطق</div>
        <div class="filter-chip" v-for="a in areaOpts" :key="a" :class="{ active: filterArea===a }" @click="filterArea=a">{{ a }}</div>
      </div>
      <div class="filter-row">
        <div class="filter-chip" :class="{ active: filterTower==='all' }" @click="filterTower='all'">كل الأبراج</div>
        <div class="filter-chip" v-for="t in towerOpts" :key="t" :class="{ active: filterTower===t }" @click="filterTower=t">{{ t }}</div>
      </div>

      <div class="fin-acts">
        <button class="gr" @click="addFinance('income')"><i class="fas fa-plus-circle"></i> إضافة إيراد</button>
        <button class="rd" @click="addFinance('expense')"><i class="fas fa-minus-circle"></i> إضافة مصروف</button>
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
  `,
  setup() {
    const searchQuery = ref('');
    const filterType = ref('all');
    const dateFrom = ref('');
    const dateTo = ref('');
    const filterArea = ref('all');
    const filterTower = ref('all');

    const allIncome = computed(() => finRecords.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0));
    const allExpense = computed(() => finRecords.filter(f => f.type === 'expense').reduce((a, f) => a + f.amount, 0));

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

    function addFinance(type) {
      const title = type === 'income' ? 'إضافة إيراد' : 'إضافة مصروف';
      document.getElementById('modalTitle').innerHTML = '<i class="fas ' + (type === 'income' ? 'fa-plus-circle' : 'fa-minus-circle') + '" style="color:' + (type === 'income' ? 'var(--success)' : 'var(--danger)') + '"></i> ' + title;
      document.getElementById('modalBody').innerHTML =
        '<div class="form-wrap" style="padding:0">' +
        '<div class="form-group"><label>الوصف</label><input type="text" id="fDesc" placeholder="' + (type === 'income' ? 'اشتراك شهري' : 'فاتورة كهرباء') + '"></div>' +
        '<div class="form-group"><label>المبلغ (دينار)</label><input type="number" id="fAmount" placeholder="0"></div>' +
        (type === 'expense' ? '<div class="form-group"><label>فئة المصروف</label><select id="fCategory">' + expenseCategories.map(c => '<option>' + c.name + '</option>').join('') + '</select></div>' : '') +
        '<div class="form-actions">' +
        '<button class="' + (type === 'income' ? 'primary' : 'danger') + '" onclick="saveFinance(\'' + type + '\')">حفظ</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
      openModal();
    }

    return {
      searchQuery, filterType, dateFrom, dateTo, filterArea, filterTower,
      filteredGroups, areaOpts, towerOpts,
      totalIncome: computed(() => formatMoney(allIncome.value)),
      totalExpense: computed(() => formatMoney(allExpense.value)),
      totalBalance: computed(() => formatMoney(allIncome.value - allExpense.value)),
      totalDebts: computed(() => formatMoney(subs.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0))),
      addFinance, formatMoney
    };
  }
};
