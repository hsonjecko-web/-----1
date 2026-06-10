/* ============================================================
   FinancePage.js - صفحة الصندوق المالي
   ============================================================ */

var FinancePage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-coins"></i> الصندوق المالي</h2></div>

      <div class="fin-stats">
        <div class="stat-card">
          <div class="top"><div class="icon green"><i class="fas fa-arrow-down"></i></div></div>
          <div class="num" style="color:var(--success)">{{ finIncome }}</div>
          <div class="label">إجمالي الإيرادات</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon red"><i class="fas fa-arrow-up"></i></div></div>
          <div class="num" style="color:var(--danger)">{{ finExpense }}</div>
          <div class="label">إجمالي المصروفات</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon cyan"><i class="fas fa-wallet"></i></div></div>
          <div class="num" style="color:var(--primary)">{{ finBalance }}</div>
          <div class="label">الرصيد الحالي</div>
        </div>
        <div class="stat-card">
          <div class="top"><div class="icon orange"><i class="fas fa-exclamation-triangle"></i></div></div>
          <div class="num" style="color:var(--warning)">{{ finDebts }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
      </div>

      <div class="fin-acts">
        <button class="gr" @click="addFinance('income')"><i class="fas fa-plus-circle"></i> إضافة إيراد</button>
        <button class="rd" @click="addFinance('expense')"><i class="fas fa-minus-circle"></i> إضافة مصروف</button>
      </div>

      <div class="shead"><h2><i class="fas fa-history"></i> سجل العمليات</h2></div>
      <div class="fin-list">
        <div v-for="f in finRecords" :key="f.id" class="fin-item">
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
    </div>
  `,
  setup() {
    const totalIncome = computed(() => finRecords.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0));
    const totalExpense = computed(() => finRecords.filter(f => f.type === 'expense').reduce((a, f) => a + f.amount, 0));

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
      finRecords,
      finIncome: computed(() => formatMoney(totalIncome.value)),
      finExpense: computed(() => formatMoney(totalExpense.value)),
      finBalance: computed(() => formatMoney(totalIncome.value - totalExpense.value)),
      finDebts: computed(() => formatMoney(subs.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0))),
      addFinance,
      formatMoney
    };
  }
};
