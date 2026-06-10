/* ============================================================
   ReportsPage.js - صفحة التقارير
   ============================================================ */

var ReportsPage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-chart-bar"></i> التقارير</h2></div>
      <div class="report-cards">
        <div v-for="r in reports" :key="r.label" class="rep-card">
          <div class="rnum" :class="r.color">{{ r.num }}</div>
          <div class="rlabel">{{ r.label }}</div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const activeCount = subs.filter(s => s.status === 'active').length;
    const expiredCount = subs.filter(s => s.status === 'expired').length;
    const inactiveCount = subs.filter(s => s.status === 'inactive').length;
    const debts = formatMoney(subs.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0));
    const payments = formatMoney(finRecords.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0));
    const archivedCount = archivedSubs.length;

    return {
      reports: [
        { num: activeCount, label: 'مشتركين فعالين', color: 'cyan' },
        { num: expiredCount, label: 'اشتراكات منتهية', color: 'red' },
        { num: inactiveCount, label: 'غير مفعلين', color: 'orange' },
        { num: debts, label: 'الديون المستحقة', color: 'red' },
        { num: payments, label: 'إجمالي المدفوعات', color: 'green' },
        { num: archivedCount, label: 'المؤرشفين', color: 'cyan' }
      ]
    };
  }
};
