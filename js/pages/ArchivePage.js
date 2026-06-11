/* ============================================================
   ArchivePage.js - صفحة الأرشيف
   ============================================================ */

var ArchivePage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-archive"></i> الأرشيف</h2></div>

      <div class="filter-row" style="padding:0 20px 12px">
        <div class="filter-chip" :class="{ active: tab==='finance' }" @click="tab='finance'">سجل العمليات المالية</div>
        <div class="filter-chip" :class="{ active: tab==='subs' }" @click="tab='subs'">المشتركين المؤرشفين</div>
      </div>

      <div v-if="tab==='finance'">
        <div class="search-bar">
          <div class="input-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="بحث في الوصف..." v-model="finSearch">
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-chip" :class="{ active: finFilter==='all' }" @click="finFilter='all'">الكل</div>
          <div class="filter-chip" :class="{ active: finFilter==='income' }" @click="finFilter='income'">إيرادات</div>
          <div class="filter-chip" :class="{ active: finFilter==='expense' }" @click="finFilter='expense'">مصروفات</div>
        </div>
        <div class="filter-row">
          <div style="display:flex;gap:8px;flex:1">
            <div style="flex:1;min-width:0">
              <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:2px">من تاريخ</label>
              <input type="date" v-model="finDateFrom" style="width:100%;padding:8px 10px;font-size:13px;border-radius:10px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-family:inherit">
            </div>
            <div style="flex:1;min-width:0">
              <label style="font-size:11px;color:var(--text3);display:block;margin-bottom:2px">إلى تاريخ</label>
              <input type="date" v-model="finDateTo" style="width:100%;padding:8px 10px;font-size:13px;border-radius:10px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-family:inherit">
            </div>
          </div>
        </div>

        <div class="fin-list">
          <div v-for="(group, month) in finGroups" :key="month" style="margin-bottom:16px">
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
          <p v-if="!Object.keys(finGroups).length" style="color:var(--text3);padding:40px;text-align:center;font-size:14px">
            <i class="fas fa-inbox" style="font-size:48px;display:block;margin-bottom:14px;opacity:.2"></i>لا توجد عمليات مطابقة
          </p>
        </div>
      </div>

      <div v-if="tab==='subs'" class="archive-list">
        <div class="search-bar">
          <div class="input-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="بحث في الاسم أو الهاتف أو المنطقة..." v-model="subSearch">
          </div>
        </div>
        <div v-for="s in filteredArchived" :key="s.id" class="arch-card">
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
        <p v-if="!filteredArchived.length" style="color:var(--text3);padding:40px;text-align:center;font-size:14px">
          <i class="fas fa-box-open" style="font-size:48px;display:block;margin-bottom:14px;opacity:.2"></i>الأرشيف فارغ
        </p>
      </div>
    </div>
  `,
  setup() {
    const tab = ref('finance');
    const finSearch = ref('');
    const finFilter = ref('all');
    const finDateFrom = ref('');
    const finDateTo = ref('');
    const subSearch = ref('');

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

    const filteredArchived = computed(() => {
      let list = [...archivedSubs];
      const q = subSearch.value.toLowerCase();
      if (q) {
        list = list.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.phone.includes(q) ||
          s.area.toLowerCase().includes(q) ||
          (s.type || '').toLowerCase().includes(q)
        );
      }
      return list;
    });

    const finGroups = computed(() => {
      let list = [...finRecords];
      const q = finSearch.value.toLowerCase();
      if(q) list = list.filter(f => f.desc.toLowerCase().includes(q));
      if(finFilter.value === 'income') list = list.filter(f => f.type === 'income');
      else if(finFilter.value === 'expense') list = list.filter(f => f.type === 'expense');
      if (finDateFrom.value) list = list.filter(f => f.date >= finDateFrom.value);
      if (finDateTo.value) list = list.filter(f => f.date <= finDateTo.value);

      const m = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const groups = {};
      list.forEach(f => {
        const [y, month] = f.date.substring(0, 7).split('-');
        const label = m[parseInt(month)] + ' ' + y;
        if(!groups[label]) groups[label] = [];
        groups[label].push(f);
      });
      return groups;
    });

    return { tab, finSearch, finFilter, finDateFrom, finDateTo, subSearch, finGroups, filteredArchived, restoreSub, permaDelete, formatMoney };
  }
};
