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
        <div class="stat-card" data-accent="purple" @click="showCardDetail('total')">
          <div class="top">
            <div class="icon cyan"><i class="fas fa-users"></i></div>
          </div>
          <div class="num">{{ totalSubs }}</div>
          <div class="label">إجمالي المشتركين</div>
        </div>
        <div class="stat-card" data-accent="teal" @click="showCardDetail('active')">
          <div class="top">
            <div class="icon green"><i class="fas fa-wifi"></i></div>
          </div>
          <div class="num">{{ activeSubs }}</div>
          <div class="label">مشتركين فعالين</div>
        </div>
        <div class="stat-card" data-accent="coral" @click="showCardDetail('expired')">
          <div class="top">
            <div class="icon red"><i class="fas fa-ban"></i></div>
          </div>
          <div class="num">{{ expiredSubs }}</div>
          <div class="label">اشتراكات منتهية</div>
        </div>
        <div class="stat-card" data-accent="gold" @click="showCardDetail('inactive')">
          <div class="top">
            <div class="icon orange"><i class="fas fa-user-clock"></i></div>
          </div>
          <div class="num">{{ inactiveSubs }}</div>
          <div class="label">غير مفعلين</div>
        </div>
        <div class="stat-card" data-accent="rose" @click="showCardDetail('debts')">
          <div class="top"><div class="icon red"><i class="fas fa-coins"></i></div></div>
          <div class="num">{{ debtsTotal }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
        <div class="stat-card" data-accent="mint" @click="showCardDetail('balance')">
          <div class="top"><div class="icon green"><i class="fas fa-wallet"></i></div></div>
          <div class="num">{{ balanceTotal }}</div>
          <div class="label">الرصيد الحالي</div>
        </div>
        <div class="stat-card span2" data-accent="orange" @click="showCardDetail('expiring')">
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
          <div class="qicon red"><i class="fas fa-archive"></i></div><span>الأرشيف المالي</span>
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
      const listId = 'cardSubList_' + Date.now();
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-list"></i> ' + title + ' (<span id="' + listId + '_cnt">' + list.length + '</span>)';
      document.getElementById('modalBody').innerHTML =
        '<div style="position:sticky;top:0;z-index:2;background:var(--bg2);padding-bottom:8px"><input type="text" id="' + listId + '_search" placeholder="🔍 بحث بالاسم أو الهاتف..." style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif;outline:none" onkeyup="window._filterCardList(\'' + listId + '\')"></div>' +
        '<div id="' + listId + '_wrap">' +
        list.map(s => '<div class="sub-card" data-search="' + (s.name + ' ' + s.phone).toLowerCase() + '" onclick="closeModal();window.location.href=\'#/sub-detail/' + s.id + '\'" style="cursor:pointer">' +
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
      window._filterCardList = function(id) {
        const q = document.getElementById(id + '_search')?.value.toLowerCase().trim();
        const all = document.querySelectorAll('#' + id + '_wrap .sub-card');
        let visible = 0;
        all.forEach(el => {
          const match = !q || el.dataset.search.includes(q);
          el.style.display = match ? '' : 'none';
          if(match) visible++;
        });
        const cnt = document.getElementById(id + '_cnt');
        if(cnt) cnt.textContent = visible;
      };
    }

    return {
      totalSubs: computed(() => subs.length),
      activeSubs: computed(() => subs.filter(s => s.status === 'active').length),
      expiredSubs: computed(() => subs.filter(s => s.status === 'expired').length),
      inactiveSubs: computed(() => subs.filter(s => s.status === 'inactive' || s.status === 'disabled').length),
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
      alertDays,
      can
    };
  }
};

/* ============================================================
   SubscribersPage.js - صفحة المشتركين
   ============================================================ */

var SubscribersPage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-users"></i> المشتركين</h2>
        <a @click="$router.push('/add-sub')"><i class="fas fa-plus"></i> إضافة</a>
      </div>

      <div class="search-bar">
        <div class="input-wrap">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="بحث بالاسم أو الهاتف..." v-model="searchQuery">
        </div>
        <button class="filter-btn" @click="showFilters=!showFilters">
          <i class="fas fa-sliders-h"></i>
        </button>
      </div>

      <div class="filter-row" v-if="showFilters">
        <div class="filter-chip" :class="{ active: currentFilter==='all' }" @click="currentFilter='all'">الكل</div>
        <div class="filter-chip" :class="{ active: currentFilter==='active' }" @click="currentFilter='active'">فعال</div>
        <div class="filter-chip" :class="{ active: currentFilter==='expired' }" @click="currentFilter='expired'">منتهي</div>
        <div class="filter-chip" :class="{ active: currentFilter==='inactive' }" @click="currentFilter='inactive'">غير مفعل</div>
        <div class="filter-chip" :class="{ active: currentFilter==='disabled' }" @click="currentFilter='disabled'">معطل</div>
        <div class="filter-chip" :class="{ active: currentFilter==='paid' }" @click="currentFilter='paid'">مدفوع</div>
        <div class="filter-chip" :class="{ active: currentFilter==='debt' }" @click="currentFilter='debt'">غير مدفوع</div>
      </div>

      <div class="subs-list">
        <div v-for="s in filteredList" :key="s.id" class="sub-card" :class="s.status" @click="$router.push('/sub-detail/'+s.id)">
          <div class="avatar" :class="s.status==='active'?'on':s.status==='expired'?'off':s.status==='disabled'?'disabled':'wait'">{{ s.name.charAt(0) }}</div>
          <div class="info">
            <div class="name">
              {{ s.name }}
              <span class="status-icon" :class="s.status==='active'?'on':s.status==='expired'?'off':s.status==='disabled'?'disabled':'wait'">
                <i class="fas" :class="s.status==='active'?'fa-check-circle':s.status==='expired'?'fa-times-circle':s.status==='disabled'?'fa-pause-circle':'fa-clock'"></i>
              </span>
            </div>
            <div class="phone"><i class="fas fa-phone"></i> {{ s.phone }}</div>
            <div class="meta">
              <span class="type"><i class="fas fa-wifi"></i> {{ s.type }}</span>
              <span :class="s.paid?'paid':'debt'"><i class="fas" :class="s.paid?'fa-check-circle':'fa-exclamation-circle'"></i> {{ s.paid?'مدفوع':'آجل' }}</span>
              <span v-if="s.status==='active'" class="remaining"><i class="fas fa-clock"></i> {{ daysBetween(new Date(s.end),new Date()) }} يوم</span>
              <span v-if="s.status==='expired'" class="unpaid"><i class="fas fa-times-circle"></i> منتهي</span>
              <span v-if="s.status==='disabled'" class="disabled-badge"><i class="fas fa-pause-circle"></i> معطل</span>
              <span v-if="s.status==='inactive'" class="disabled-badge"><i class="fas fa-clock"></i> غير مفعل</span>
            </div>
          </div>
          <div class="status-bar" :class="s.status"></div>
        </div>
        <p v-if="!filteredList.length" style="color:var(--text3);padding:30px;text-align:center;font-size:14px">
          🔍 لا توجد نتائج
        </p>
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const route = useRoute();
    const searchQuery = ref('');
    const showFilters = ref(false);
    const currentFilter = ref(route.query.filter || 'all');

    const filteredList = computed(() => {
      let list = subs.filter(s => !s.archived);
      const q = searchQuery.value.toLowerCase();
      if(q) list = list.filter(s => s.name.includes(q) || s.phone.includes(q));
      if(currentFilter.value === 'active') list = list.filter(s => s.status === 'active');
      else if(currentFilter.value === 'expired') list = list.filter(s => s.status === 'expired');
      else if(currentFilter.value === 'inactive') list = list.filter(s => s.status === 'inactive');
      else if(currentFilter.value === 'disabled') list = list.filter(s => s.status === 'disabled');
      else if(currentFilter.value === 'paid') list = list.filter(s => s.paid);
      else if(currentFilter.value === 'debt') list = list.filter(s => !s.paid);
      return list;
    });

    return { searchQuery, showFilters, currentFilter, filteredList, daysBetween };
  }
};

/* ============================================================
   AddSubPage.js - صفحة إضافة مشترك جديد
   ============================================================ */

var AddSubPage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas" :class="editId?'fa-edit':'fa-user-plus'"></i> {{ editId ? 'تعديل مشترك' : 'إضافة مشترك جديد' }}</h2>
        <a @click="$router.push(editId ? '/sub-detail/' + editId : '/subscribers')">رجوع</a>
      </div>

      <div class="as-steps">
        <div class="as-step" :class="{ done: step > 1, active: step === 1 }" @click="step >= 1 && goStep(1)">
          <div class="as-step-num">1</div>
          <span>البيانات</span>
        </div>
        <div class="as-step-line" :class="{ done: step > 1 }"></div>
        <div class="as-step" :class="{ done: step > 2, active: step === 2 }" @click="step >= 2 && goStep(2)">
          <div class="as-step-num">2</div>
          <span>البرج</span>
        </div>
        <div class="as-step-line" :class="{ done: step > 2 }"></div>
        <div class="as-step" :class="{ active: step === 3 }">
          <div class="as-step-num">3</div>
          <span>الاشتراك</span>
        </div>
      </div>

      <transition name="wa-slide" mode="out-in">
        <div key="step1" v-if="step === 1">
          <div class="shead"><h2><i class="fas fa-user-circle"></i> البيانات الأساسية</h2></div>
          <div class="form-wrap">
            <div class="form-group">
              <label><i class="fas fa-user"></i> اسم المشترك</label>
              <input type="text" placeholder="الاسم الكامل" v-model="form.name" ref="nameInput">
            </div>
            <div class="form-group">
              <label><i class="fas fa-phone"></i> رقم الهاتف</label>
              <input type="text" placeholder="0770 xxx xxxx" v-model="form.phone" maxlength="11" @input="filterPhone">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-wifi"></i> اسم الشبكة (SSID)</label>
                <input type="text" placeholder="اسم الشبكة" v-model="form.ssid">
              </div>
              <div class="form-group">
                <label><i class="fas fa-key"></i> كلمة المرور</label>
                <input type="text" placeholder="كلمة المرور" v-model="form.pass">
              </div>
            </div>
            <div class="form-group">
              <label><i class="fas fa-map-marker-alt"></i> المنطقة</label>
              <select v-model="form.area">
                <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>
            <div class="form-group">
              <label><i class="fas fa-network-wired"></i> IP الراوتر <span style="color:var(--text3);font-weight:400">(اختياري)</span></label>
              <input type="text" placeholder="192.168.1.1" v-model="form.ip" dir="ltr">
            </div>
            <div class="form-actions" style="margin-top:8px">
              <button class="primary" @click="goStep(2)">التالي <i class="fas fa-arrow-left"></i></button>
            </div>
          </div>
        </div>

        <div key="step2" v-else-if="step === 2">
          <div class="selected-badge" @click="goStep(1)">
            <i class="fas fa-user"></i> {{ form.name || 'الاسم' }} · {{ form.area }}
            <i class="fas fa-pen" style="font-size:10px;margin-right:4px;opacity:.6"></i>
          </div>
          <div class="shead"><h2><i class="fas fa-broadcast-tower"></i> البرج والنقطة</h2></div>
          <div class="form-wrap">
            <div class="form-group">
              <label><i class="fas fa-broadcast-tower"></i> البرج</label>
              <select v-model="form.tower" @change="form.point = ''">
                <option v-for="t in towers" :key="t.id" :value="t.name">{{ t.name }}</option>
              </select>
            </div>
            <div class="form-group" v-if="currentTower && currentTower.points.length">
              <label><i class="fas fa-map-pin"></i> النقطة</label>
              <select v-model="form.point">
                <option value="">بدون نقطة</option>
                <option v-for="p in currentTower.points" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="form-actions" style="margin-top:8px">
              <button class="secondary" @click="goStep(1)"><i class="fas fa-arrow-right"></i> السابق</button>
              <button class="primary" @click="goStep(3)">التالي <i class="fas fa-arrow-left"></i></button>
            </div>
          </div>
        </div>

        <div key="step3" v-else-if="step === 3">
          <div class="selected-badge" @click="goStep(2)">
            <i class="fas fa-broadcast-tower"></i> {{ form.tower }}{{ form.point ? ' - ' + form.point : '' }}
            <i class="fas fa-pen" style="font-size:10px;margin-right:4px;opacity:.6"></i>
          </div>
          <div class="shead"><h2><i class="fas fa-tag"></i> الاشتراك</h2></div>
          <div class="form-wrap">
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-tag"></i> نوع الباقة</label>
                <select v-model="form.type" @change="onTypeChange">
                  <option v-for="t in subscriptionTypes" :key="t.id" :value="t.name">{{ t.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label><i class="fas fa-dollar-sign"></i> المبلغ</label>
                <input type="text" :value="formatMoney(form.amount)" readonly
                       style="color:var(--primary);font-weight:800;cursor:default;font-size:15px;letter-spacing:0.5px">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-calendar"></i> تاريخ التفعيل</label>
                <input type="date" v-model="form.start" @change="updateEndDate">
              </div>
              <div class="form-group">
                <label><i class="fas fa-calendar-check"></i> ينتهي في</label>
                <input type="date" :value="form.end" readonly style="color:var(--primary);font-weight:800">
              </div>
            </div>
            <div class="form-group">
              <label><i class="fas fa-money-bill-wave"></i> حالة الدفع</label>
              <div style="display:flex;gap:8px">
                <button type="button" class="as-paid-btn" :class="{ active: form.paid }" @click="form.paid = true">
                  <i class="fas fa-check-circle"></i> مدفوع
                </button>
                <button type="button" class="as-paid-btn" :class="{ active: !form.paid }" @click="form.paid = false">
                  <i class="fas fa-clock"></i> آجل
                </button>
              </div>
            </div>
            <div class="form-group">
              <label><i class="fas fa-sticky-note"></i> ملاحظات <span style="color:var(--text3);font-weight:400">(اختياري)</span></label>
              <textarea placeholder="أي ملاحظات إضافية..." v-model="form.notes"></textarea>
            </div>
            <div class="form-actions" style="margin-top:8px">
              <button class="secondary" @click="goStep(2)"><i class="fas fa-arrow-right"></i> السابق</button>
              <button class="success" @click="saveSub(false)"><i class="fas fa-save"></i> {{ editId ? 'حفظ التعديلات' : 'حفظ' }}</button>
              <button v-if="!editId" class="primary" @click="saveSub(true)"><i class="fas fa-plus-circle"></i> حفظ + إضافة جديد</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  `,
  setup() {
    const router = useRouter();
    const route = useRoute();
    const nameInput = ref(null);
    const step = ref(1);
    const editId = ref(null);

    const form = reactive({
      name: '', phone: '', ssid: '', pass: '', ip: '',
      area: areas[0], type: subscriptionTypes[1]?.name || 'شهري',
      tower: towers[0]?.name || '', point: '',
      amount: subscriptionTypes[1]?.price || 25000,
      start: todayStr(), end: '', notes: '',
      paid: true
    });

    const currentTower = computed(() => towers.find(t => t.name === form.tower));

    // Load edit data if edit mode
    const eid = parseInt(route.query.edit);
    if (eid) {
      const s = subs.find(x => x.id === eid);
      if (s) {
        editId.value = eid;
        form.name = s.name;
        form.phone = s.phone;
        form.ssid = s.ssid;
        form.pass = s.pass;
        form.ip = s.ip || '';
        form.area = s.area;
        form.tower = s.tower || towers[0]?.name || '';
        form.point = s.point || '';
        form.type = s.type;
        form.amount = s.amount;
        form.start = s.start;
        form.end = s.end;
        form.notes = s.notes || '';
        form.paid = s.paid;
        step.value = 3;
      }
    }

    function filterPhone() {
      form.phone = form.phone.replace(/\D/g, '').slice(0, 11);
    }

    function updateEndDate() {
      if(!form.start) return;
      const end = calcEndFromType(form.type, form.start);
      form.end = end.toISOString().split('T')[0];
    }

    function onTypeChange() {
      const found = subscriptionTypes.find(t => t.name === form.type);
      if (found) form.amount = found.price;
      updateEndDate();
    }

    updateEndDate();

    function goStep(s) {
      if (s > step.value) {
        if (step.value === 1) {
          if (!form.name.trim()) { showToast('⚠️ الرجاء إدخال اسم المشترك'); return; }
          if (!form.phone.trim()) { showToast('⚠️ الرجاء إدخال رقم الهاتف'); return; }
          form.phone = form.phone.replace(/\D/g, '').slice(0, 11);
          if (form.phone.length !== 11) { showToast('⚠️ رقم الهاتف يجب أن يكون 11 رقم'); return; }
        }
      }
      step.value = s;
      if (s === 1) setTimeout(() => nameInput.value?.focus(), 300);
    }

    function saveSub(addAnother) {
      if(!form.name.trim()) { showToast('⚠️ الرجاء إدخال اسم المشترك'); return; }
      if(!form.phone.trim()) { showToast('⚠️ الرجاء إدخال رقم الهاتف'); return; }
      form.phone = form.phone.replace(/\D/g, '').slice(0, 11);
      if(form.phone.length !== 11) { showToast('⚠️ رقم الهاتف يجب أن يكون 11 رقم'); return; }

      const ssid = form.ssid.trim() || 'NetTower-' + form.name;
      const pass = form.pass.trim() || '12345678';

      if (editId.value) {
        const s = subs.find(x => x.id === editId.value);
        if (s) {
          s.name = form.name.trim();
          s.phone = form.phone;
          s.ssid = ssid;
          s.pass = pass;
          s.ip = form.ip.trim() || '';
          s.area = form.area;
          s.tower = form.tower;
          s.point = form.point;
          s.type = form.type;
          s.amount = form.amount || 0;
          s.start = form.start || todayStr();
          s.end = form.end || todayStr();
          s.paid = form.paid;
          s.notes = form.notes.trim();
        }
        saveAllData();
        showToast('✅ تم تعديل بيانات ' + form.name);
        router.push('/sub-detail/' + editId.value);
        return;
      }

      subs.push({
        id: nextId++,
        name: form.name.trim(),
        phone: form.phone,
        ssid, pass,
        ip: form.ip.trim() || '',
        area: form.area,
        tower: form.tower,
        point: form.point,
        type: form.type,
        amount: form.amount || 0,
        start: form.start || todayStr(),
        end: form.end || todayStr(),
        status: 'active',
        paid: form.paid,
        notes: form.notes.trim(),
        archived: false,
        freeCount: 0,
        freeDates: [],
        prevDebt: 0,
        debtHistory: []
      });

      saveAllData();
      showToast('✅ تم إضافة المشترك ' + form.name + ' بنجاح');

      if(addAnother) {
        form.name = ''; form.phone = ''; form.ssid = ''; form.pass = ''; form.ip = '';
        form.notes = ''; form.start = todayStr(); form.point = '';
        form.type = subscriptionTypes[1]?.name || 'شهري';
        form.tower = towers[0]?.name || '';
        form.amount = subscriptionTypes[1]?.price || 25000;
        form.paid = true;
        step.value = 1;
        updateEndDate();
        setTimeout(() => nameInput.value?.focus(), 100);
      } else {
        router.push('/subscribers');
      }
    }

    return { form, areas, towers, currentTower, subscriptionTypes, nameInput, step, updateEndDate, onTypeChange, goStep, saveSub, formatMoney, filterPhone, editId };
  }
};

/* ============================================================
   SubDetailPage.js - صفحة تفاصيل المشترك
   ============================================================ */

var SubDetailPage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-id-card"></i> تفاصيل المشترك</h2>
        <a @click="$router.push('/subscribers')">رجوع</a>
      </div>

      <div v-if="sub" class="detail-card">
        <div class="dhead">
          <h3><i class="fas fa-user-circle" style="color:var(--primary)"></i> {{ sub.name }}</h3>
          <span class="sbadge" :class="sub.status==='active'?'active':sub.status==='expired'?'inactive':'pending'">
            {{ sub.status==='active'?'فعال':sub.status==='expired'?'منتهي':'غير مفعل' }}
          </span>
        </div>
        <div class="dbody">
          <div class="row"><span class="label"><i class="fas fa-phone"></i> الهاتف</span><span class="value">{{ sub.phone }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-wifi"></i> اسم الشبكة</span><span class="value">{{ sub.ssid }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-key"></i> كلمة المرور</span><span class="value">{{ sub.pass }}</span></div>
          <div class="row" v-if="sub.ip"><span class="label"><i class="fas fa-network-wired"></i> IP الراوتر</span><span class="value ltr" dir="ltr">{{ sub.ip }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-map-marker-alt"></i> المنطقة</span><span class="value">{{ sub.area }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-tag"></i> نوع الاشتراك</span><span class="value primary">{{ sub.type }}</span></div>
          <div class="row" v-if="sub.tower"><span class="label"><i class="fas fa-broadcast-tower"></i> البرج</span><span class="value">{{ sub.tower }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-map-pin"></i> النقطة</span><span class="value">{{ sub.point || 'لا يوجد' }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-calendar-plus"></i> تاريخ التفعيل</span><span class="value">{{ sub.start }}</span></div>
          <div class="row">
            <span class="label"><i class="fas fa-calendar-times"></i> تاريخ الانتهاء</span>
            <span class="value" :class="subDays<0?'danger':'success'">{{ sub.end }}</span>
          </div>
          <div class="row">
            <span class="label"><i class="fas fa-hourglass-half"></i> الأيام المتبقية</span>
            <span class="value" :class="subDays<0?'danger':subDays<=3?'warning':'success'">
              {{ subDays<0?'انتهى':subDays+' يوم' }}
            </span>
          </div>
          <div class="row">
            <span class="label"><i class="fas fa-dollar-sign"></i> حالة الدفع</span>
            <span class="value" :class="sub.paid?'success':'danger'">{{ sub.paid?'مدفوع':'غير مدفوع' }}</span>
          </div>
          <div class="row">
            <span class="label"><i class="fas fa-tag"></i> قيمة الاشتراك</span>
            <span class="value">{{ formatMoney(sub.amount) }}</span>
          </div>
          <div v-for="d in activeDebts" :key="d.id" class="row" style="flex-wrap:wrap">
            <span class="label"><i class="fas fa-calendar-alt"></i> دين {{ d.date }}</span>
            <span class="value" style="display:flex;flex-wrap:wrap;gap:4px;align-items:center">
              <span style="color:var(--danger);font-weight:800">{{ formatMoney(d.remaining) }}</span>
              <span v-if="d.payments && d.payments.length" style="font-size:11px;color:var(--text3)">({{ d.payments.length }} دفعات)</span>
              <span style="font-size:11px;color:var(--text3);width:100%">{{ d.note }}</span>
            </span>
          </div>
          <div v-if="activeDebts.length > 1" class="row" style="border-top:2px solid var(--danger);padding-top:10px;margin-top:4px">
            <span class="label"><i class="fas fa-calculator"></i> المجموع</span>
            <span class="value danger" style="font-size:17px">{{ formatMoney(totalActiveDebt) }}</span>
          </div>
          <div class="row" v-if="sub.notes">
            <span class="label"><i class="fas fa-sticky-note"></i> ملاحظات</span>
            <span class="value">{{ sub.notes }}</span>
          </div>
        </div>
      </div>

      <div v-if="!sub" style="padding:40px;text-align:center;color:var(--text3)">المشترك غير موجود</div>

      <div v-if="sub" class="detail-actions">
        <button v-if="can('subscribers.edit')" class="cy" @click="quickEdit"><i class="fas fa-edit"></i> تعديل</button>
        <button v-if="can('subscribers.renew')" class="gr" @click="openRenew(sub.id)"><i class="fas fa-sync"></i> تجديد</button>
        <button v-if="can('subscribers.settle') && calcTotalDebt(sub)>0" class="ow" @click="openSettle(sub.id)"><i class="fas fa-hand-holding-usd"></i> تسديد</button>
        <button v-if="can('subscribers.edit')" class="ow" @click="activateFree"><i class="fas fa-gift"></i> تفعيل مجاني</button>
        <button v-if="can('subscribers.edit')" class="rd" @click="toggleStatus">
          <i class="fas" :class="sub.status==='active'?'fa-pause':'fa-play'"></i>
          {{ sub.status==='active'?'إيقاف':'تشغيل' }}
        </button>
        <button v-if="can('whatsapp')" class="gr" @click="sendWA"><i class="fab fa-whatsapp"></i> واتساب</button>
        <button v-if="can('subscribers.del')" class="ow" @click="archiveSub"><i class="fas fa-archive"></i> أرشفة</button>
        <button v-if="can('subscribers.del')" class="rd" @click="deleteSub"><i class="fas fa-trash"></i> حذف</button>
      </div>
    </div>
  `,
  setup() {
    const route = useRoute();
    const router = useRouter();

    const sub = computed(() => subs.find(s => s.id === parseInt(route.params.id)));
    const subDays = computed(() => sub.value ? daysBetween(new Date(sub.value.end), new Date()) : 0);

    const activeDebts = computed(() => {
      if (!sub.value) return [];
      const debts = [];
      if (sub.value.debtHistory) {
        sub.value.debtHistory.forEach(d => {
          if (d.remaining > 0) debts.push({...d});
        });
      }
      const hasDebtHistory = debts.length > 0;
      if (!sub.value.paid && !hasDebtHistory) {
        debts.push({
          id: 'current',
          date: sub.value.start || '—',
          amount: sub.value.amount || 0,
          remaining: sub.value.amount || 0,
          note: 'الاشتراك الحالي',
          payments: []
        });
      }
      return debts;
    });

    const totalActiveDebt = computed(() => {
      return activeDebts.value.reduce((a, d) => a + (d.remaining || 0), 0);
    });

    function openRenew(id) {
      window.openRenewModal(id);
    }

    function openSettle(id) {
      window.openSettleModal(id);
    }

    function quickEdit() {
      if(sub.value) window.openQuickEditModal(sub.value.id);
    }

    function activateFree() {
      if(sub.value) window.openFreeModal(sub.value.id);
    }

    function toggleStatus() {
      if(!sub.value) return;
      sub.value.status = sub.value.status === 'active' ? 'inactive' : 'active';
      saveAllData();
      showToast(sub.value.status === 'active' ? '▶️ تم التشغيل' : '⏸️ تم الإيقاف');
    }

    function sendWA() {
      if(!sub.value) return;
      window.open('https://wa.me/' + sub.value.phone, '_blank');
    }

    function archiveSub() {
      if(!sub.value) return;
      const idx = subs.findIndex(x => x.id === sub.value.id);
      if(idx === -1) return;
      const s = subs.splice(idx, 1)[0];
      s.archived = true;
      archivedSubs.push(s);
      saveAllData();
      showToast('📦 تم أرشفة المشترك');
      router.push('/subscribers');
    }

    function deleteSub() {
      if(!sub.value) return;
      if(!confirm('⚠️ هل أنت متأكد من حذف هذا المشترك؟')) return;
      const idx = subs.findIndex(x => x.id === sub.value.id);
      if(idx !== -1) subs.splice(idx, 1);
      saveAllData();
      showToast('🗑️ تم حذف المشترك');
      router.push('/subscribers');
    }

    return { sub, subDays, activeDebts, totalActiveDebt, openRenew, openSettle, quickEdit, activateFree, toggleStatus, sendWA, archiveSub, deleteSub, formatMoney, calcTotalDebt, can };
  }
};

/* ============================================================
   WhatsAppPage.js - صفحة إرسال واتساب
   ============================================================ */

var WhatsAppPage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fab fa-whatsapp"></i> إرسال واتساب</h2></div>

      <div style="padding:0 20px 8px;display:flex;gap:6px;flex-wrap:wrap" v-if="selectedSub">
        <span class="selected-badge" @click="goStep(1)" style="margin:0;font-size:12px;padding:6px 12px">
          <i class="fas fa-user"></i> {{ selectedSub.name }}
        </span>
        <span class="selected-badge" @click="goStep(2)" style="margin:0;font-size:12px;padding:6px 12px" v-if="selectedTpl !== null">
          <i class="fas fa-file-alt"></i> {{ waTemplates[selectedTpl]?.title }}
        </span>
        <span v-if="fromDetail" class="selected-badge" style="margin:0;font-size:12px;padding:6px 12px;background:var(--success-glow);color:var(--success);cursor:default">
          <i class="fas fa-arrow-right"></i> من التفاصيل
        </span>
      </div>

      <div class="wa-steps">
        <div class="wa-step" :class="{ done: step > 1, active: step === 1 }" @click="step >= 1 && goStep(1)">
          <div class="wa-step-num">1</div>
          <span>اختر مشترك</span>
        </div>
        <div class="wa-step-line" :class="{ done: step > 1 }"></div>
        <div class="wa-step" :class="{ done: step > 2, active: step === 2 }" @click="step >= 2 && goStep(2)">
          <div class="wa-step-num">2</div>
          <span>اختر قالب</span>
        </div>
        <div class="wa-step-line" :class="{ done: step > 2 }"></div>
        <div class="wa-step" :class="{ active: step === 3 }">
          <div class="wa-step-num">3</div>
          <span>إرسال</span>
        </div>
      </div>

      <transition name="wa-slide" mode="out-in">
        <div key="step1" v-if="step === 1">
          <div class="search-bar">
            <div class="input-wrap">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="ابحث عن مشترك..." v-model="waSearch" ref="searchInput">
            </div>
          </div>
          <div class="subs-list wa-subs">
            <div v-for="s in waFiltered" :key="s.id" class="sub-card"
                 :class="{ selected: selectedSub?.id===s.id }"
                 @click="pickSub(s)">
              <div class="avatar">{{ s.name.charAt(0) }}</div>
              <div class="info">
                <div class="name" style="color:var(--text)">{{ s.name }} <span style="color:var(--primary);font-size:11px;font-weight:400">#{{ s.id }}</span></div>
                <div class="phone">{{ s.phone }}</div>
              </div>
              <div class="wa-check" :class="{ checked: selectedSub?.id===s.id }">
                <i class="fas" :class="selectedSub?.id===s.id?'fa-check-circle':'fa-circle'" style="color:var(--primary)"></i>
              </div>
            </div>
            <p v-if="!waFiltered.length" style="color:var(--text3);padding:30px;text-align:center">لا يوجد مشتركين</p>
          </div>
        </div>

        <div key="step2" v-else-if="step === 2">
          <div class="selected-badge" @click="goStep(1)">
            <i class="fas fa-user"></i> {{ selectedSub?.name }}
            <i class="fas fa-pen" style="font-size:10px;margin-right:4px;opacity:.6"></i>
          </div>
          <div class="whatsapp-templates">
            <div v-for="(t,i) in waTemplates" :key="t.id" class="wa-tpl"
                 :class="{ active: i===selectedTpl }" @click="pickTpl(i)">
              <div class="tpl-title">
                <i class="fas" :class="t.icon" style="color:var(--primary)"></i> {{ t.title }}
              </div>
              <div class="tpl-preview">{{ t.msg.substring(0,70) }}...</div>
            </div>
          </div>
        </div>

        <div key="step3" v-else-if="step === 3">
          <div class="selected-badge" @click="goStep(2)">
            <i class="fas fa-file-alt"></i> {{ waTemplates[selectedTpl]?.title }}
            <i class="fas fa-pen" style="font-size:10px;margin-right:4px;opacity:.6"></i>
          </div>
          <div class="selected-badge" style="margin-top:4px" @click="goStep(1)">
            <i class="fas fa-user"></i> {{ selectedSub?.name }}
            <i class="fas fa-pen" style="font-size:10px;margin-right:4px;opacity:.6"></i>
          </div>
          <div class="wa-preview">
            <div class="label"><i class="fas fa-eye" style="color:var(--primary)"></i> معاينة الرسالة</div>
            <div class="msg" style="white-space:pre-line">{{ previewMsg }}</div>
          </div>
          <button class="wa-send-btn" @click="sendWA" style="background:linear-gradient(135deg,var(--primary),var(--primary-end));box-shadow:0 4px 24px var(--primary-glow)">
            <i class="fab fa-whatsapp"></i> إرسال عبر واتساب
          </button>
        </div>
      </transition>
    </div>
  `,
  setup() {
    const route = useRoute();
    const router = useRouter();
    const waSearch = ref('');
    const selectedSub = ref(null);
    const selectedTpl = ref(null);
    const step = ref(1);
    const searchInput = ref(null);
    const fromDetail = ref(false);

    const waFiltered = computed(() => {
      let list = subs;
      const q = waSearch.value.toLowerCase();
      if(q) list = list.filter(s => s.name.includes(q) || s.phone.includes(q));
      return list;
    });

    const previewMsg = computed(() => {
      const tpl = waTemplates[selectedTpl.value];
      if(!tpl || !selectedSub.value) return '';
      return tpl.msg
        .replace(/{name}/g, selectedSub.value.name)
        .replace(/{phone}/g, selectedSub.value.phone)
        .replace(/{type}/g, selectedSub.value.type)
        .replace(/{end}/g, selectedSub.value.end)
        .replace(/{amount}/g, selectedSub.value.amount)
        .replace(/{towerPhone}/g, towerInfo.phone);
    });

    // Check for query params from detail page
    onMounted(() => {
      const subId = parseInt(route.query.subId);
      const tplIdx = parseInt(route.query.tpl);
      if (subId) {
        const s = subs.find(x => x.id === subId);
        if (s) {
          selectedSub.value = s;
          fromDetail.value = true;
          if (!isNaN(tplIdx) && tplIdx >= 0 && tplIdx < waTemplates.length) {
            selectedTpl.value = tplIdx;
            step.value = 3;
          } else {
            step.value = 2;
          }
        }
      }
    });

    function pickSub(s) {
      selectedSub.value = s;
      fromDetail.value = false;
      setTimeout(() => step.value = 2, 200);
    }

    function pickTpl(i) {
      selectedTpl.value = i;
      setTimeout(() => step.value = 3, 200);
    }

    function goStep(s) {
      step.value = s;
      if (s === 1) setTimeout(() => searchInput.value?.focus(), 300);
    }

    function sendWA() {
      if(!selectedSub.value) return;
      const tpl = waTemplates[selectedTpl.value];
      let msg = tpl.msg
        .replace(/{name}/g, selectedSub.value.name)
        .replace(/{phone}/g, selectedSub.value.phone)
        .replace(/{type}/g, selectedSub.value.type)
        .replace(/{end}/g, selectedSub.value.end)
        .replace(/{amount}/g, selectedSub.value.amount)
        .replace(/{towerPhone}/g, towerInfo.phone);
      window.open('https://wa.me/' + selectedSub.value.phone + '?text=' + encodeURIComponent(msg), '_blank');
      showToast('✅ تم فتح واتساب');
    }

    return { waSearch, selectedSub, selectedTpl, step, searchInput, waFiltered, previewMsg, pickSub, pickTpl, goStep, sendWA, waTemplates, fromDetail };
  }
};

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
          <div class="fsc-num">{{ cIncome }}</div>
          <div class="fsc-label">إجمالي الإيرادات</div>
        </div>
        <div class="fin-square-card expense">
          <div class="fsc-icon"><i class="fas fa-arrow-up"></i></div>
          <div class="fsc-num">{{ cExpense }}</div>
          <div class="fsc-label">إجمالي المصروفات</div>
        </div>
        <div class="fin-square-card balance">
          <div class="fsc-icon"><i class="fas fa-wallet"></i></div>
          <div class="fsc-num">{{ cBalance }}</div>
          <div class="fsc-label">الرصيد الحالي</div>
        </div>
        <div class="fin-square-card debts">
          <div class="fsc-icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="fsc-num">{{ cDebts }}</div>
          <div class="fsc-label">الديون المستحقة</div>
        </div>
      </div>

      <div class="filter-panel">
        <div class="fp-row">
          <div class="fp-group" style="flex:2">
            <label>🔍 بحث</label>
            <input type="text" placeholder="كلمة بحث..." v-model="f.search" style="padding:8px 12px;font-size:13px">
          </div>
          <div class="fp-group">
            <label>📅 من تاريخ</label>
            <input type="date" v-model="f.dateFrom" style="padding:8px 12px;font-size:13px">
          </div>
          <div class="fp-group">
            <label>📅 إلى تاريخ</label>
            <input type="date" v-model="f.dateTo" style="padding:8px 12px;font-size:13px">
          </div>
          <button class="search-btn" style="margin-top:20px;padding:8px 14px;font-size:12px" @click="applyFilters"><i class="fas fa-search"></i> بحث</button>
          <button class="search-btn" style="margin-top:20px;padding:8px 14px;font-size:12px;background:var(--bg2);color:var(--text)" @click="showAdvFilter=!showAdvFilter">
            <i class="fas fa-sliders-h"></i>
          </button>
        </div>
        <div class="fp-row" v-if="showAdvFilter">
          <div class="fp-group">
            <label>النوع</label>
            <select v-model="f.type" style="padding:6px 10px;font-size:12px">
              <option value="all">الكل</option>
              <option value="income">إيرادات</option>
              <option value="expense">مصروفات</option>
            </select>
          </div>
          <div class="fp-group">
            <label>الحالة</label>
            <select v-model="f.status" style="padding:6px 10px;font-size:12px">
              <option value="all">الكل</option>
              <option value="active">فعال</option>
              <option value="expired">منتهي</option>
              <option value="inactive">غير مفعل</option>
              <option value="disabled">معطل</option>
            </select>
          </div>
          <div class="fp-group">
            <label>📍 المنطقة</label>
            <select v-model="f.area" @change="f.tower='all';f.point='all'" style="padding:6px 10px;font-size:12px">
              <option value="all">كل المناطق</option>
              <option v-for="a in allAreas" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="fp-group">
            <label>📡 البرج</label>
            <select v-model="f.tower" @change="f.point='all'" style="padding:6px 10px;font-size:12px">
              <option value="all">كل الأبراج</option>
              <option v-for="t in allTowers" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="fp-group">
            <label>📍 النقطة</label>
            <select v-model="f.point" style="padding:6px 10px;font-size:12px">
              <option value="all">كل النقاط</option>
              <option v-for="p in filteredPoints" :key="p" :value="p">{{ p }}</option>
            </select>
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
          <div v-for="ff in group" :key="ff.id" class="fin-item">
            <div class="fleft">
              <div class="fdate">{{ ff.date }}</div>
              <div class="fdesc">{{ ff.desc }}</div>
              <div v-if="ff.area || ff.tower" style="font-size:10px;color:var(--text3);margin-top:2px">
                <i class="fas fa-map-marker-alt" style="font-size:8px"></i> {{ ff.area || '—' }} · {{ ff.tower || '—' }}{{ ff.point ? ' - ' + ff.point : '' }}
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div style="text-align:left">
                <div class="famount" :class="ff.type">{{ ff.type==='income'?'+':'-' }} {{ formatMoney(ff.amount) }}</div>
                <span class="ftype">{{ ff.type==='income'?'إيراد':'مصروف' }}</span>
              </div>
              <div class="fin-actions" v-if="can('finance.edit') || can('finance.del')">
                <button v-if="can('finance.edit')" class="fin-edit-btn" @click="editFinance(ff)" title="تعديل"><i class="fas fa-pen"></i></button>
                <button v-if="can('finance.del')" class="fin-del-btn" @click="delFinance(ff.id)" title="حذف"><i class="fas fa-times"></i></button>
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
    const f = reactive({ search:'', type:'all', status:'all', dateFrom:'', dateTo:'', area:'all', tower:'all', point:'all' });
    const showAdvFilter = ref(false);
    const af = reactive({ ...f });
    function applyFilters() { Object.assign(af, f); }

    function matchesFilters(r) {
      if(af.type !== 'all' && r.type !== af.type) return false;
      if(af.dateFrom && r.date < af.dateFrom) return false;
      if(af.dateTo && r.date > af.dateTo) return false;
      if(af.search) { const q = af.search.toLowerCase(); if(!r.desc.toLowerCase().includes(q)) return false; }
      if(af.area !== 'all' && r.area !== af.area) return false;
      if(af.tower !== 'all' && r.tower !== af.tower) return false;
      if(af.point !== 'all' && r.point !== af.point) return false;
      if(af.status !== 'all') {
        const sub = r.subId ? subs.find(s => s.id === r.subId) : null;
        if(!sub || sub.status !== af.status) return false;
      }
      return true;
    }

    const filteredRecords = computed(() => finRecords.filter(matchesFilters));

    const filteredGroups = computed(() => {
      const m = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      const groups = {};
      filteredRecords.value.forEach(r => {
        const [y, month] = r.date.substring(0, 7).split('-');
        const label = m[parseInt(month)] + ' ' + y;
        if(!groups[label]) groups[label] = [];
        groups[label].push(r);
      });
      return groups;
    });

    const allAreas = computed(() => [...areas].sort());
    const allTowers = computed(() => towers.map(t => t.name).sort());
    const filteredPoints = computed(() => {
      if (f.tower === 'all') return [...new Set(towers.flatMap(t => t.points))].sort();
      const tower = towers.find(t => t.name === f.tower);
      return tower ? [...tower.points].sort() : [];
    });

    const cIncome = computed(() => formatMoney(finRecords.filter(f => f.type === 'income').reduce((a, r) => a + r.amount, 0)));
    const cExpense = computed(() => formatMoney(finRecords.filter(f => f.type === 'expense').reduce((a, r) => a + r.amount, 0)));
    const cBalance = computed(() => formatMoney(finRecords.filter(f => f.type === 'income').reduce((a, r) => a + r.amount, 0) - finRecords.filter(f => f.type === 'expense').reduce((a, r) => a + r.amount, 0)));
    const cDebts = computed(() => formatMoney(subs.reduce((a, s) => a + calcTotalDebt(s), 0)));

    function addFinance(type) {
      const title = type === 'income' ? 'إضافة إيراد' : 'إضافة مصروف';
      document.getElementById('modalTitle').innerHTML = '<i class="fas ' + (type === 'income' ? 'fa-plus-circle' : 'fa-minus-circle') + '" style="color:' + (type === 'income' ? 'var(--success)' : 'var(--danger)') + '"></i> ' + title;
      const areaOptsHtml = '<option value="">اختياري</option>' + areas.map(a => '<option value="' + a + '">' + a + '</option>').join('');
      const towerOptsHtml = '<option value="">اختياري</option>' + towers.map(t => '<option value="' + t.name + '">' + t.name + '</option>').join('');
      document.getElementById('modalBody').innerHTML =
        '<div class="form-wrap" style="padding:0">' +
        (type === 'expense' ? '<div class="form-group"><label>فئة المصروف</label><select id="fCategory">' + expenseCategories.map(c => '<option>' + c.name + '</option>').join('') + '</select></div>' : '') +
        '<div class="form-group"><label>المبلغ (دينار)</label><input type="number" id="fAmount" placeholder="0"></div>' +
        '<div class="form-group"><label>ملاحظات <span style="color:var(--text3);font-weight:400">(اختياري)</span></label><input type="text" id="fDesc" placeholder="' + (type === 'income' ? 'اشتراك شهري' : 'فاتورة كهرباء') + '"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        '<div class="form-group"><label>المنطقة</label><select id="fArea">' + areaOptsHtml + '</select></div>' +
        '<div class="form-group"><label>البرج</label><select id="fTower" onchange="window._updateFinancePoints()">' + towerOptsHtml + '</select></div></div>' +
        '<div class="form-group"><label>النقطة</label><select id="fPoint"><option value="">اختياري</option></select></div>' +
        '<div class="form-actions">' +
        '<button class="' + (type === 'income' ? 'primary' : 'danger') + '" onclick="saveFinance(\'' + type + '\')">حفظ</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
      window._updateFinancePoints = function() {
        const sel = document.getElementById('fTower');
        const pt = document.getElementById('fPoint');
        if(!sel || !pt) return;
        const tower = towers.find(t => t.name === sel.value);
        pt.innerHTML = '<option value="">اختياري</option>' + (tower ? tower.points.map(p => '<option value="' + p + '">' + p + '</option>').join('') : '');
      };
      openModal();
    }

    function editFinance(ff) {
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit" style="color:var(--primary)"></i> تعديل العملية';
      document.getElementById('modalBody').innerHTML =
        '<div class="form-wrap" style="padding:0">' +
        '<div class="form-group"><label>الوصف</label><input type="text" id="fEditDesc" value="' + ff.desc + '"></div>' +
        '<div class="form-group"><label>المبلغ (دينار)</label><input type="number" id="fEditAmount" value="' + ff.amount + '"></div>' +
        (ff.type === 'expense' ? '<div class="form-group"><label>فئة المصروف</label><select id="fEditCategory">' + expenseCategories.map(c => '<option ' + (c.name === ff.category ? 'selected' : '') + '>' + c.name + '</option>').join('') + '</select></div>' : '') +
        '<div class="form-actions">' +
        '<button class="primary" onclick="saveFinanceEdit(' + ff.id + ')">حفظ التعديل</button>' +
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

    return { f, showAdvFilter, applyFilters, filteredGroups, allAreas, allTowers, filteredPoints, cIncome, cExpense, cBalance, cDebts, addFinance, editFinance, delFinance, formatMoney, can };
  }
};

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
          <div class="filter-chip" :class="{ active: finArchiveFilter==='all' }" @click="finArchiveFilter='all'">كل السجلات</div>
          <div class="filter-chip" :class="{ active: finArchiveFilter==='archived' }" @click="finArchiveFilter='archived'">مؤرشف</div>
          <div class="filter-chip" :class="{ active: finArchiveFilter==='current' }" @click="finArchiveFilter='current'">حالي</div>
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
            <div v-for="f in group" :key="f.id" class="fin-item" :class="{ 'fin-item-archived': f.archived }">
              <div class="fleft">
                <div class="fdate">{{ f.date }}</div>
                <div class="fdesc">{{ f.desc }}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span v-if="f.archived" class="archived-badge"><i class="fas fa-archive"></i> مؤرشف</span>
                <div style="text-align:left">
                  <div class="famount" :class="f.type">{{ f.type==='income'?'+':'-' }} {{ formatMoney(f.amount) }}</div>
                  <span class="ftype">{{ f.type==='income'?'إيراد':'مصروف' }}</span>
                </div>
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
    const finArchiveFilter = ref('all');
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

      if(finArchiveFilter.value === 'archived') list = list.filter(f => f.archived);
      else if(finArchiveFilter.value === 'current') list = list.filter(f => !f.archived);

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

    return { tab, finSearch, finFilter, finArchiveFilter, finDateFrom, finDateTo, subSearch, finGroups, filteredArchived, restoreSub, permaDelete, formatMoney };
  }
};

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

      <div class="filter-row" style="padding:0 20px 12px">
        <div class="filter-chip" :class="{ active: repTab==='finance' }" @click="repTab='finance'">السجل المالي</div>
        <div class="filter-chip" :class="{ active: repTab==='subs' }" @click="repTab='subs'">المشتركين</div>
        <div class="filter-chip" :class="{ active: repTab==='debts' }" @click="repTab='debts'">الديون</div>
      </div>

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
                <span v-if="(s.debtHistory||[]).length > 0" class="remaining">{{ (s.debtHistory||[]).length }} دفعات</span>
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

    const filteredSubs = computed(() => {
      let list = [...subs];
      const q = subSearch.value.toLowerCase();
      if (q) list = list.filter(x => x.name.toLowerCase().includes(q) || x.phone.includes(q) || x.area.toLowerCase().includes(q));
      if (subStatusFilter.value !== 'all') list = list.filter(x => x.status === subStatusFilter.value);
      if (subAreaFilter.value !== 'all') list = list.filter(x => x.area === subAreaFilter.value);
      return list;
    });

    const filteredDebtors = computed(() => {
      let list = subs.filter(s => calcTotalDebt(s) > 0);
      const q = debtSearch.value.toLowerCase();
      if (q) list = list.filter(x => x.name.toLowerCase().includes(q) || x.phone.includes(q));
      if (debtAreaFilter.value !== 'all') list = list.filter(x => x.area === debtAreaFilter.value);
      return list;
    });

    const totalDebtAll = computed(() => formatMoney(filteredDebtors.value.reduce((a, s) => a + calcTotalDebt(s), 0)));
    const debtorsCount = computed(() => filteredDebtors.value.length);

    const rActive = computed(() => subs.filter(s => s.status === 'active').length);
    const rExpired = computed(() => subs.filter(s => s.status === 'expired').length);
    const rInactive = computed(() => subs.filter(s => s.status === 'inactive' || s.status === 'disabled').length);
    const rDebts = computed(() => formatMoney(subs.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0)));
    const rPayments = computed(() => formatMoney(finRecords.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0)));
    const rArchived = computed(() => archivedSubs.length);

    return {
      searchQuery, filterType, dateFrom, dateTo, repTab,
      subSearch, subStatusFilter, subAreaFilter,
      debtSearch, debtAreaFilter,
      filteredRecords, filteredGroups, repAreas,
      filteredSubs, filteredDebtors,
      totalDebtAll, debtorsCount,
      rActive, rExpired, rInactive, rDebts, rPayments, rArchived,
      formatMoney, calcTotalDebt
    };
  }
};

/* ============================================================
   NotificationsPage.js - صفحة الإشعارات
   ============================================================ */

var NotificationsPage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-bell"></i> الإشعارات</h2>
        <a @click="markAllRead"><i class="fas fa-check-double"></i> تحديد الكل</a>
      </div>
      <div class="notif-list">
        <div v-for="n in notifs" :key="n.text" class="notif-item">
          <div class="nicon" :class="n.color"><i class="fas" :class="n.icon"></i></div>
          <div class="ntext">
            <p v-html="n.text"></p>
            <div class="ntime">{{ n.time }}</div>
          </div>
        </div>
        <p v-if="!notifs.length" style="color:var(--text3);padding:20px;text-align:center">✅ لا توجد إشعارات</p>
      </div>
    </div>
  `,
  setup() {
    const notifs = computed(() => {
      const n = [];
      subs.forEach(s => {
        const d = daysBetween(new Date(s.end), new Date());
        if(s.status === 'expired') {
          n.push({
            text: '<strong>انتهاء اشتراك:</strong> ' + s.name + ' (' + s.type + ') انتهى',
            time: 'الآن', icon: 'fa-exclamation-circle', color: 'red'
          });
        }
        else if(d >= 0 && d <= alertDays) {
          n.push({
            text: '<strong>اقتراب الانتهاء:</strong> ' + s.name + ' سينتهي بعد ' + d + ' أيام',
            time: 'الآن', icon: 'fa-clock', color: 'orange'
          });
        }
        if(!s.paid && s.status === 'active') {
          n.push({
            text: '<strong>عدم دفع:</strong> ' + s.name + ' لم يدفع اشتراكه (' + formatMoney(s.amount) + ')',
            time: 'الآن', icon: 'fa-money-bill-wave', color: 'red'
          });
        }
        if(s.status === 'disabled') {
          n.push({
            text: '<strong>اشتراك معطل:</strong> ' + s.name + ' (' + s.type + ') معطل',
            time: 'الآن', icon: 'fa-pause-circle', color: 'orange'
          });
        }
      });
      return n.slice(0, 20);
    });

    function markAllRead() {
      showToast('✅ تم تحديد الكل كمقروء');
    }

    return { notifs, markAllRead };
  }
};

/* ============================================================
   SettingsPage.js - صفحة الإعدادات
   ============================================================ */

var SettingsPage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-cog"></i> الإعدادات</h2></div>
      <div class="settings-list">
        <div class="set-card" @click="manageUsers" v-if="can('settings.manageUsers')">
          <div class="sicon"><i class="fas fa-users-cog"></i></div>
          <div class="sinfo">
            <h4>المستخدمين والصلاحيات</h4>
            <p>إدارة المستخدمين وصلاحياتهم · {{ users.length }} مستخدم</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageSubscriptions" v-if="can('settings.manageTypes')">
          <div class="sicon"><i class="fas fa-tags"></i></div>
          <div class="sinfo">
            <h4>أنواع الاشتراك</h4>
            <p>إدارة الباقات والتسعير والمدة</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageAreas" v-if="can('settings.manageAreas')">
          <div class="sicon green"><i class="fas fa-map-marker-alt"></i></div>
          <div class="sinfo">
            <h4>المناطق</h4>
            <p>إضافة وتعديل المناطق</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageTemplates" v-if="can('settings.manageTemplates')">
          <div class="sicon orange"><i class="fab fa-whatsapp"></i></div>
          <div class="sinfo">
            <h4>الرسائل الجاهزة</h4>
            <p>تعديل قوالب واتساب</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageAlerts" v-if="can('settings.manageAlerts')">
          <div class="sicon orange"><i class="fas fa-clock"></i></div>
          <div class="sinfo">
            <h4>التنبيهات</h4>
            <p>مدة التنبيه قبل انتهاء الاشتراك: {{ alertDays }} أيام</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageExpenseCategories" v-if="can('settings.manageTypes')">
          <div class="sicon red"><i class="fas fa-receipt"></i></div>
          <div class="sinfo">
            <h4>فئات المصروفات</h4>
            <p>إضافة وتعديل فئات الصرف</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageTowers" v-if="can('settings.manageTowers')">
          <div class="sicon green"><i class="fas fa-broadcast-tower"></i></div>
          <div class="sinfo">
            <h4>الأبراج والنقاط</h4>
            <p>إدارة الأبراج والنقاط التابعة لكل برج</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageTowerInfo" v-if="can('settings.manageTowers')">
          <div class="sicon green"><i class="fas fa-building"></i></div>
          <div class="sinfo">
            <h4>معلومات البرج</h4>
            <p>{{ towerInfo.name }} - {{ towerInfo.phone }}</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageColors">
          <div class="sicon" style="background:linear-gradient(135deg,var(--primary),var(--primary-end))"><i class="fas fa-palette" style="color:#fff"></i></div>
          <div class="sinfo">
            <h4>ألوان التطبيق</h4>
            <p>{{ colorLabel }}</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
      </div>
    </div>
  `,
  setup() {
    const accentNames = {
      default: 'الافتراضي (بنفسجي)',
      silver: 'فضي',
      bronze: 'برونزي',
      gold: 'ذهبي',
      gray: 'رمادي',
      mint: 'نعناعي فاتح'
    };
    const currentAccent = ref(localStorage.getItem('nettower-accent') || 'default');
    const colorLabel = computed(() => accentNames[currentAccent.value] || 'الافتراضي (بنفسجي)');

    function manageColors() {
      var html = '<div style="padding:0">' +
        '<div style="font-size:13px;color:var(--text2);margin-bottom:14px;padding:0 4px">اختر اللون الرئيسي للتطبيق:</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">';
      var list = [
        {id:'default', label:'بنفسجي', color:'#6c5ce7', end:'#5341cd'},
        {id:'silver', label:'فضي', color:'#9e9eb0', end:'#8a8a9a'},
        {id:'bronze', label:'برونزي', color:'#cd7f32', end:'#a8651a'},
        {id:'gold', label:'ذهبي', color:'#c9a84c', end:'#b8942e'},
        {id:'gray', label:'رمادي', color:'#7a7a8a', end:'#666676'},
        {id:'mint', label:'نعناعي', color:'#48c9b0', end:'#36b89e'}
      ];
      list.forEach(function(a) {
        html += '<div class="color-opt" data-id="' + a.id + '" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:14px;border:2px solid var(--glass-border);cursor:pointer;transition:.2s;background:var(--card)" onclick="pickAccent(\'' + a.id + '\')">' +
          '<div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,' + a.color + ',' + a.end + ');box-shadow:0 4px 12px rgba(0,0,0,.15)"></div>' +
          '<span style="font-size:12px;font-weight:700;color:var(--text)">' + a.label + '</span>' +
          (a.id === (localStorage.getItem('nettower-accent') || 'default') ? '<span style="font-size:10px;color:var(--success)"><i class="fas fa-check"></i> الحالي</span>' : '') +
          '</div>';
      });
      html += '</div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-palette" style="color:var(--primary)"></i> ألوان التطبيق';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    window.pickAccent = function(id) {
      var html = document.documentElement;
      if (id === 'default') {
        html.removeAttribute('data-accent');
        localStorage.removeItem('nettower-accent');
      } else {
        html.setAttribute('data-accent', id);
        localStorage.setItem('nettower-accent', id);
      }
      currentAccent.value = id;
      showToast('🎨 تم تغيير اللون إلى ' + (accentNames[id] || id));
      closeModal();
    };

    function manageUsers() {
      let html = '<div class="form-wrap" style="padding:0">';
      users.forEach(u => {
        const permStr = u.permissions.settings.manageUsers ? 'مدير نظام' : 'مستخدم';
        html += '<div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--glass-border);cursor:pointer" onclick="openEditUser(' + u.id + ')">' +
          '<div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--primary),var(--primary-end));display:grid;place-items:center;font-size:16px;color:#fff;font-weight:800">' + u.name.charAt(0) + '</div>' +
          '<div style="flex:1">' +
          '<div style="font-weight:700;font-size:14px">' + u.name + '</div>' +
          '<div style="font-size:11px;color:var(--text3)">@' + u.username + ' · ' + permStr + '</div></div>' +
          '<i class="fas fa-chevron-left" style="color:var(--text3);font-size:12px"></i></div>';
      });
      html += '<div style="margin-top:14px">' +
        '<button class="primary" onclick="openAddUser()" style="padding:12px 24px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--primary),var(--primary-end));color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:Tajawal,sans-serif"><i class="fas fa-plus"></i> إضافة مستخدم جديد</button></div>' +
        '</div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-users-cog" style="color:var(--primary)"></i> إدارة المستخدمين';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageSubscriptions() {
      let html = '<div class="form-wrap" style="padding:0">';
      subscriptionTypes.forEach(t => {
        html += '<div class="set-item">' +
          '<span style="flex:1;font-weight:700">' + t.name + '</span>' +
          '<span style="color:var(--text2);font-size:13px">' + t.price.toLocaleString() + ' دينار</span>' +
          '<span style="color:var(--primary);font-size:13px">' + t.days + ' يوم</span>' +
          '<div class="set-item-acts">' +
          '<button class="save-btn" onclick="openEditSubscriptionType(' + t.id + ')"><i class="fas fa-pen"></i></button>' +
          '<button class="del-btn" onclick="deleteSubscriptionType(' + t.id + ')"><i class="fas fa-trash"></i></button></div></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus"></i> إضافة نوع جديد</div>' +
        '<div class="set-add-row">' +
        '<input type="text" id="new_st_name" placeholder="الاسم" style="flex:2">' +
        '<input type="number" id="new_st_price" placeholder="السعر" class="small">' +
        '<input type="number" id="new_st_days" placeholder="المدة (يوم)" class="small">' +
        '<button onclick="addSubscriptionType()"><i class="fas fa-plus"></i> إضافة</button></div></div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-tags" style="color:var(--primary)"></i> أنواع الاشتراك';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageAreas() {
      let html = '<div class="form-wrap" style="padding:0">';
      areas.forEach(a => {
        html += '<div class="set-item">' +
          '<div class="set-item-icon"><i class="fas fa-map-pin"></i></div>' +
          '<input type="text" id="area_' + a + '" value="' + a + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--bg2);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif;outline:none">' +
          '<div class="set-item-acts">' +
          '<button class="save-btn" onclick="saveArea(\'' + a + '\')"><i class="fas fa-check"></i></button>' +
          '<button class="del-btn" onclick="deleteArea(\'' + a + '\')"><i class="fas fa-trash"></i></button></div></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus"></i> إضافة منطقة جديدة</div>' +
        '<div class="set-add-row">' +
        '<input type="text" id="new_area_name" placeholder="اسم المنطقة">' +
        '<button onclick="addArea()"><i class="fas fa-plus"></i> إضافة</button></div></div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-map-marker-alt" style="color:var(--success)"></i> المناطق';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageTemplates() {
      let html = '<div class="form-wrap" style="padding:0">';
      waTemplates.forEach(t => {
        html += '<div class="set-item" style="flex-direction:column;align-items:stretch;gap:6px">' +
          '<div style="display:flex;align-items:center;gap:8px">' +
          '<div class="set-item-icon"><i class="fab fa-whatsapp"></i></div>' +
          '<input type="text" id="tpl_title_' + t.id + '" value="' + t.title + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--bg2);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif;outline:none">' +
          '<div class="set-item-acts">' +
          '<button class="save-btn" onclick="saveTemplate(' + t.id + ')"><i class="fas fa-check"></i></button>' +
          '<button class="del-btn" onclick="deleteTemplate(' + t.id + ')"><i class="fas fa-trash"></i></button></div></div>' +
          '<textarea id="tpl_msg_' + t.id + '" style="padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--bg2);color:var(--text);font-size:12px;font-family:Tajawal,sans-serif;outline:none;resize:vertical;min-height:50px">' + t.msg + '</textarea></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus"></i> إضافة قالب جديد</div>' +
        '<div class="set-add-row"><input type="text" id="new_tpl_title" placeholder="عنوان القالب"></div>' +
        '<div class="set-add-row" style="margin-top:6px"><textarea id="new_tpl_msg" placeholder="نص الرسالة..." style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif;outline:none;resize:vertical;min-height:60px"></textarea></div>' +
        '<div class="set-add-row" style="margin-top:6px"><button onclick="addTemplate()" style="width:100%"><i class="fas fa-plus"></i> إضافة قالب</button></div></div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit" style="color:var(--warning)"></i> الرسائل الجاهزة';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageAlerts() {
      const opts = [2, 3, 4, 5, 6, 7];
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-clock" style="color:var(--warning)"></i> مدة التنبيه';
      document.getElementById('modalBody').innerHTML =
        '<div class="form-wrap" style="padding:0">' +
        '<div class="form-group"><label>تنبيه قبل انتهاء الاشتراك بـ (أيام)</label>' +
        '<select id="alertDaysSelect">' +
        opts.map(d => '<option value="' + d + '" ' + (d === alertDays ? 'selected' : '') + '>' + d + ' أيام</option>').join('') +
        '</select></div>' +
        '<div class="form-actions">' +
        '<button class="primary" onclick="saveAlertDays()">حفظ</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
      openModal();
    }

    function manageExpenseCategories() {
      let html = '<div class="form-wrap" style="padding:0">';
      expenseCategories.forEach(c => {
        html += '<div class="set-item">' +
          '<div class="set-item-icon"><i class="fas fa-receipt"></i></div>' +
          '<input type="text" id="cat_name_' + c.id + '" value="' + c.name + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--bg2);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif;outline:none">' +
          '<div class="set-item-acts">' +
          '<button class="save-btn" onclick="saveExpenseCategory(' + c.id + ')"><i class="fas fa-check"></i></button>' +
          '<button class="del-btn" onclick="deleteExpenseCategory(' + c.id + ')"><i class="fas fa-trash"></i></button></div></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus"></i> إضافة فئة جديدة</div>' +
        '<div class="set-add-row">' +
        '<input type="text" id="new_cat_name" placeholder="اسم الفئة">' +
        '<button onclick="addExpenseCategory()"><i class="fas fa-plus"></i> إضافة</button></div></div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-receipt" style="color:var(--danger)"></i> فئات المصروفات';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageTowers() {
      window.renderTowersModal();
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-broadcast-tower" style="color:var(--success)"></i> إدارة الأبراج والنقاط';
      openModal();
    }

    function manageTowerInfo() {
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-building" style="color:var(--success)"></i> معلومات البرج';
      document.getElementById('modalBody').innerHTML =
        '<div class="form-wrap" style="padding:0">' +
        '<div class="form-group"><label>اسم البرج</label><input type="text" id="tName" value="' + towerInfo.name + '"></div>' +
        '<div class="form-group"><label>العنوان</label><input type="text" id="tAddress" value="' + towerInfo.address + '"></div>' +
        '<div class="form-group"><label>رقم الهاتف (واتساب)</label><input type="text" id="tPhone" value="' + towerInfo.phone + '"></div>' +
        '<div class="form-actions">' +
        '<button class="primary" onclick="saveTowerInfo()">حفظ</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
      openModal();
    }

    return { alertDays, towerInfo, users, can, manageUsers, manageSubscriptions, manageAreas, manageTemplates, manageAlerts, manageExpenseCategories, manageTowers, manageTowerInfo, manageColors, colorLabel };
  }
};
