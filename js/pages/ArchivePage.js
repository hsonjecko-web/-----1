/* ============================================================
   ArchivePage.js - صفحة الأرشيف
   ============================================================ */

var ArchivePage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-archive"></i> الأرشيف</h2></div>

      <div class="filter-row" style="display:flex;padding:0 20px 12px">
        <div class="filter-chip" :class="{ active: tab==='subs' }" @click="tab='subs'">المشتركين المؤرشفين</div>
        <div class="filter-chip" :class="{ active: tab==='finance' }" @click="tab='finance'">العمليات المالية</div>
      </div>

      <div v-if="tab==='subs'" class="archive-list">
        <div v-for="s in archivedSubs" :key="s.id" class="arch-card">
          <div style="width:42px;height:42px;border-radius:12px;background:var(--bg2);display:grid;place-items:center;font-size:18px;font-weight:800;color:var(--text3);flex-shrink:0">{{ s.name.charAt(0) }}</div>
          <div class="ainfo">
            <h4>{{ s.name }}</h4>
            <p>{{ s.phone }} · {{ s.type }} · {{ s.area }}</p>
          </div>
          <div class="aacts">
            <button @click="restoreSub(s.id)" title="استعادة"><i class="fas fa-undo"></i></button>
            <button class="rd" @click="permaDelete(s.id)" title="حذف نهائي"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <p v-if="!archivedSubs.length" style="color:var(--text3);padding:40px;text-align:center;font-size:14px">
          <i class="fas fa-box-open" style="font-size:48px;display:block;margin-bottom:14px;opacity:.2"></i>الأرشيف فارغ
        </p>
      </div>

      <div v-if="tab==='finance'" class="archive-list">
        <div class="search-bar" style="padding:0 0 10px">
          <div class="input-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="بحث..." v-model="finSearch">
          </div>
        </div>
        <div class="filter-row" style="display:flex;padding:0 0 12px">
          <div class="filter-chip" :class="{ active: finFilter==='all' }" @click="finFilter='all'">الكل</div>
          <div class="filter-chip" :class="{ active: finFilter==='income' }" @click="finFilter='income'">إيرادات</div>
          <div class="filter-chip" :class="{ active: finFilter==='expense' }" @click="finFilter='expense'">مصروفات</div>
        </div>
        <div v-for="(group, month) in finGroups" :key="month" style="margin-bottom:16px">
          <div style="font-weight:800;color:var(--primary);margin-bottom:8px;padding:0 4px">{{ month }}</div>
          <div v-for="f in group" :key="f.id" class="fin-item" style="margin-bottom:6px">
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
        <p v-if="!finGroups.length" style="color:var(--text3);padding:20px;text-align:center">لا توجد عمليات مالية</p>
      </div>
    </div>
  `,
  setup() {
    const tab = ref('subs');
    const finSearch = ref('');
    const finFilter = ref('all');

    function restoreSub(id) {
      const idx = archivedSubs.findIndex(s => s.id === id);
      if(idx === -1) return;
      const s = archivedSubs.splice(idx, 1)[0];
      s.archived = false;
      subs.push(s);
      saveAllData();
      showToast('🔄 تم استعادة المشترك');
    }

    function permaDelete(id) {
      if(!confirm('⚠️ الحذف النهائي لا يمكن التراجع عنه. هل أنت متأكد؟')) return;
      const idx = archivedSubs.findIndex(s => s.id === id);
      if(idx !== -1) archivedSubs.splice(idx, 1);
      saveAllData();
      showToast('🗑️ تم الحذف النهائي');
    }

    const finGroups = computed(() => {
      let list = [...finRecords];
      const q = finSearch.value.toLowerCase();
      if(q) list = list.filter(f => f.desc.includes(q));
      if(finFilter.value === 'income') list = list.filter(f => f.type === 'income');
      else if(finFilter.value === 'expense') list = list.filter(f => f.type === 'expense');
      const groups = {};
      list.forEach(f => {
        const month = f.date.substring(0, 7);
        const monthNames = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const [y, m] = month.split('-');
        const label = monthNames[parseInt(m)] + ' ' + y;
        if(!groups[label]) groups[label] = [];
        groups[label].push(f);
      });
      return groups;
    });

    return { tab, finSearch, finFilter, archivedSubs, finGroups, restoreSub, permaDelete, formatMoney };
  }
};
