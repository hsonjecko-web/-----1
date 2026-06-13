/* ============================================================
   FinancePage.js - صفحة الصندوق المالي
   ============================================================ */

var FinancePage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-coins"></i> الصندوق المالي</h2></div>

      <div class="fin-grid-2x2">
        <div class="fin-square-card income">
          <div class="fsc-icon"><i class="fas fa-arrow-down"></i></div>
          <div class="fsc-num">{{ totalIncome }}</div>
          <div class="fsc-label">إجمالي الإيرادات</div>
        </div>
        <div class="fin-square-card expense">
          <div class="fsc-icon"><i class="fas fa-arrow-up"></i></div>
          <div class="fsc-num">{{ totalExpense }}</div>
          <div class="fsc-label">إجمالي المصروفات</div>
        </div>
        <div class="fin-square-card balance">
          <div class="fsc-icon"><i class="fas fa-wallet"></i></div>
          <div class="fsc-num">{{ totalBalance }}</div>
          <div class="fsc-label">الرصيد الحالي</div>
        </div>
        <div class="fin-square-card debts">
          <div class="fsc-icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="fsc-num">{{ totalDebts }}</div>
          <div class="fsc-label">الديون المستحقة</div>
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

      <div class="fin-acts" v-if="can('finance.add')">
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
            <div style="display:flex;align-items:center;gap:10px">
              <div style="text-align:left">
                <div class="famount" :class="f.type">{{ f.type==='income'?'+':'-' }} {{ formatMoney(f.amount) }}</div>
                <span class="ftype">{{ f.type==='income'?'إيراد':'مصروف' }}</span>
              </div>
              <div class="fin-actions" v-if="can('finance.edit') || can('finance.del')">
                <button v-if="can('finance.edit')" class="fin-edit-btn" @click="editFinance(f)" title="تعديل"><i class="fas fa-pen"></i></button>
                <button v-if="can('finance.del')" class="fin-del-btn" @click="delFinance(f.id)" title="حذف"><i class="fas fa-times"></i></button>
              </div>
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

    const filteredIncome = computed(() => filteredRecords.value.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0));
    const filteredExpense = computed(() => filteredRecords.value.filter(f => f.type === 'expense').reduce((a, f) => a + f.amount, 0));

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

    function editFinance(f) {
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit" style="color:var(--primary)"></i> تعديل العملية';
      document.getElementById('modalBody').innerHTML =
        '<div class="form-wrap" style="padding:0">' +
        '<div class="form-group"><label>الوصف</label><input type="text" id="fEditDesc" value="' + f.desc + '"></div>' +
        '<div class="form-group"><label>المبلغ (دينار)</label><input type="number" id="fEditAmount" value="' + f.amount + '"></div>' +
        (f.type === 'expense' ? '<div class="form-group"><label>فئة المصروف</label><select id="fEditCategory">' + expenseCategories.map(c => '<option ' + (c.name === f.category ? 'selected' : '') + '>' + c.name + '</option>').join('') + '</select></div>' : '') +
        '<div class="form-actions">' +
        '<button class="primary" onclick="saveFinanceEdit(' + f.id + ')">حفظ التعديل</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
      openModal();
    }

    function delFinance(id) {
      if (!confirm('⚠️ هل أنت متأكد من حذف هذه العملية المالية؟')) return;
      const idx = finRecords.findIndex(f => f.id === id);
      if (idx !== -1) finRecords.splice(idx, 1);
      saveAllData();
      showToast('🗑️ تم الحذف');
    }

    return {
      searchQuery, filterType, dateFrom, dateTo,
      filteredGroups,
      totalIncome: computed(() => formatMoney(filteredIncome.value)),
      totalExpense: computed(() => formatMoney(filteredExpense.value)),
      totalBalance: computed(() => formatMoney(filteredIncome.value - filteredExpense.value)),
      totalDebts: computed(() => formatMoney(subs.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0))),
      addFinance, editFinance, delFinance, formatMoney, can
    };
  }
};
