/* ============================================================
   HomePage.js - صفحة لوحة التحكم الرئيسية
   ============================================================ */

var HomePage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-chart-simple"></i> نظرة عامة</h2>
        <a @click="$router.push('/subscribers')"><i class="fas fa-arrow-left"></i> عرض الكل</a>
      </div>

      <div class="stats home-stats">
        <div class="stat-card clickable" @click="$router.push('/subscribers')">
          <div class="top">
            <div class="icon cyan"><i class="fas fa-users"></i></div>
            <span class="trend up"><i class="fas fa-arrow-up"></i> {{ totalSubs }}</span>
          </div>
          <div class="num">{{ totalSubs }}</div>
          <div class="label">إجمالي المشتركين</div>
        </div>
        <div class="stat-card clickable" @click="$router.push('/subscribers')">
          <div class="top">
            <div class="icon green"><i class="fas fa-wifi"></i></div>
          </div>
          <div class="num">{{ activeSubs }}</div>
          <div class="label">مشتركين فعالين</div>
        </div>
        <div class="stat-card clickable" @click="goFilter('expired')">
          <div class="top">
            <div class="icon red"><i class="fas fa-ban"></i></div>
          </div>
          <div class="num">{{ expiredSubs }}</div>
          <div class="label">اشتراكات منتهية</div>
        </div>
        <div class="stat-card clickable" @click="goFilter('inactive')">
          <div class="top">
            <div class="icon orange"><i class="fas fa-user-clock"></i></div>
          </div>
          <div class="num">{{ inactiveSubs }}</div>
          <div class="label">غير مفعلين</div>
        </div>
        <div class="stat-card clickable" @click="goFilter('disabled')">
          <div class="top">
            <div class="icon" style="background:rgba(100,116,139,.15);color:var(--text3)"><i class="fas fa-pause-circle"></i></div>
          </div>
          <div class="num">{{ disabledSubs }}</div>
          <div class="label">معطلين</div>
        </div>
        <div class="stat-card clickable" @click="$router.push('/finance')">
          <div class="top"><div class="icon red"><i class="fas fa-coins"></i></div></div>
          <div class="num">{{ debtsTotal }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
        <div class="stat-card clickable" @click="$router.push('/finance')">
          <div class="top"><div class="icon green"><i class="fas fa-wallet"></i></div></div>
          <div class="num">{{ balanceTotal }}</div>
          <div class="label">الرصيد الحالي</div>
        </div>
        <div class="stat-card clickable" @click="$router.push('/subscribers')">
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
        <div class="qa" @click="$router.push('/add-sub')">
          <div class="qicon cyan"><i class="fas fa-user-plus"></i></div><span>إضافة مشترك</span>
        </div>
        <div class="qa" @click="$router.push('/subscribers')">
          <div class="qicon green"><i class="fas fa-sync"></i></div><span>تجديد اشتراك</span>
        </div>
        <div class="qa" @click="$router.push('/whatsapp')">
          <div class="qicon green"><i class="fab fa-whatsapp"></i></div><span>إرسال واتساب</span>
        </div>
        <div class="qa" @click="$router.push('/finance')">
          <div class="qicon orange"><i class="fas fa-coins"></i></div><span>الصندوق المالي</span>
        </div>
        <div class="qa" @click="$router.push('/reports')">
          <div class="qicon purple"><i class="fas fa-chart-bar"></i></div><span>التقارير</span>
        </div>
        <div class="qa" @click="$router.push('/archive')">
          <div class="qicon red"><i class="fas fa-archive"></i></div><span>الأرشيف المالي</span>
        </div>
      </div>

      <div class="shead">
        <h2><i class="fas fa-clock"></i> اشتراكات تنتهي قريباً</h2>
        <a @click="$router.push('/subscribers')">المزيد</a>
      </div>
      <div class="subs-list">
        <div v-for="s in expiringSoon" :key="s.id" class="sub-card" :class="s.status" @click="$router.push('/sub-detail/'+s.id)">
          <div class="avatar" :class="s.status==='active'?'on':s.status==='expired'?'off':s.status==='disabled'?'disabled':'wait'">{{ s.name.charAt(0) }}</div>
          <div class="info">
            <div class="name">
              {{ s.name }}
              <span class="status-icon" :class="s.status==='active'?'on':s.status==='expired'?'off':'wait'">
                <i class="fas" :class="s.status==='active'?'fa-check-circle':s.status==='expired'?'fa-times-circle':'fa-clock'"></i>
              </span>
            </div>
            <div class="phone"><i class="fas fa-phone"></i> {{ s.phone }}</div>
            <div class="meta">
              <span class="type"><i class="fas fa-wifi"></i> {{ s.type }}</span>
              <span :class="s.paid?'paid':'debt'"><i class="fas" :class="s.paid?'fa-check-circle':'fa-exclamation-circle'"></i> {{ s.paid?'مدفوع':'آجل' }}</span>
              <span v-if="s.status==='active'" class="remaining"><i class="fas fa-clock"></i> {{ daysBetween(new Date(s.end),new Date()) }} يوم</span>
              <span v-if="s.status==='expired'" class="unpaid"><i class="fas fa-times-circle"></i> منتهي</span>
            </div>
          </div>
          <div class="status-bar" :class="s.status"></div>
        </div>
        <p v-if="!expiringSoon.length" style="color:var(--text3);padding:20px;text-align:center;font-size:14px">
          ✅ لا توجد اشتراكات تنتهي قريباً
        </p>
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    function goFilter(filter) {
      router.push('/subscribers?filter=' + filter);
    }
    return {
      totalSubs: computed(() => subs.length),
      activeSubs: computed(() => subs.filter(s => s.status === 'active').length),
      expiredSubs: computed(() => subs.filter(s => s.status === 'expired').length),
      inactiveSubs: computed(() => subs.filter(s => s.status === 'inactive').length),
      disabledSubs: computed(() => subs.filter(s => s.status === 'disabled').length),
      debtsTotal: computed(() => {
        const d = subs.reduce((a, s) => a + calcTotalDebt(s), 0);
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
      daysBetween,
      alertDays,
      goFilter
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
      name: '', phone: '', ssid: '', pass: '',
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
        form.name = ''; form.phone = ''; form.ssid = ''; form.pass = '';
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
          <span class="sbadge" :class="statusClass">{{ statusLabel }}</span>
        </div>
        <div class="dbody">
          <div class="row"><span class="label"><i class="fas fa-phone"></i> الهاتف</span><span class="value ltr" dir="ltr">{{ sub.phone }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-wifi"></i> اسم الشبكة</span><span class="value ltr" dir="ltr">{{ sub.ssid }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-key"></i> كلمة المرور</span><span class="value ltr" dir="ltr">{{ sub.pass }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-map-marker-alt"></i> المنطقة</span><span class="value">{{ sub.area }}</span></div>
          <div class="row" v-if="sub.tower"><span class="label"><i class="fas fa-broadcast-tower"></i> البرج</span><span class="value" v-html="sub.tower + (sub.point ? ' <small style=color:var(--text3)>- ' + sub.point + '</small>' : '')"></span></div>
          <div class="row"><span class="label"><i class="fas fa-tag"></i> نوع الاشتراك</span><span class="value primary">{{ sub.type }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-dollar-sign"></i> مبلغ الاشتراك</span><span class="value primary" style="font-weight:900;font-size:16px">{{ formatMoney(sub.amount) }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-calendar-plus"></i> تاريخ التفعيل</span><span class="value">{{ sub.start }}</span></div>
          <div class="row">
            <span class="label"><i class="fas fa-calendar-times"></i> تاريخ الانتهاء</span>
            <span class="value" :class="subDays<0?'danger':subDays<=3?'warning':'success'">{{ sub.end }}</span>
          </div>
          <div class="row">
            <span class="label"><i class="fas fa-hourglass-half"></i> الأيام المتبقية</span>
            <span class="value" :class="subDays<0?'danger':subDays<=3?'warning':'success'" style="font-weight:900">
              {{ subDays<0 ? 'انتهى' : subDays + ' يوم' }}
            </span>
          </div>
          <div class="row">
            <span class="label"><i class="fas fa-money-bill-wave"></i> حالة الدفع</span>
            <span class="value" :class="sub.paid?'success':'danger'">{{ sub.paid ? 'مدفوع' : 'آجل' }}</span>
          </div>
          <div class="row" v-if="sub.prevDebt > 0">
            <span class="label"><i class="fas fa-exclamation-triangle" style="color:var(--danger)"></i> دين سابق</span>
            <span class="value danger" style="font-weight:900;font-size:16px">{{ formatMoney(sub.prevDebt) }}</span>
          </div>
          <div class="row" v-if="(sub.prevDebt||0) + (sub.paid?0:sub.amount) > 0" style="cursor:pointer;background:var(--warning-glow);border-radius:8px;padding:4px 8px;margin-top:2px" @click="settleSub" title="اضغط لتسديد المستحقات">
            <span class="label"><i class="fas fa-hand-holding-usd" style="color:var(--success)"></i> إجمالي المستحقات <small style="color:var(--text3);font-weight:400">(اضغط للدفع)</small></span>
            <span class="value success" style="font-weight:900;font-size:16px">{{ formatMoney((sub.prevDebt||0) + (sub.paid?0:sub.amount)) }}</span>
          </div>
          <div v-if="sub.debtHistory && sub.debtHistory.length" style="margin-top:4px">
            <div style="font-size:12px;font-weight:700;color:var(--text2);padding:6px 0 4px;display:flex;align-items:center;gap:6px">
              <i class="fas fa-list" style="font-size:11px"></i> سجل الديون
            </div>
            <div v-for="(d, i) in sub.debtHistory" :key="i" style="font-size:11px;color:var(--text3);padding:4px 10px;background:var(--danger-glow);border-radius:6px;margin-bottom:3px;display:flex;justify-content:space-between">
              <span><i class="fas fa-circle" style="font-size:6px;color:var(--danger);margin-left:4px"></i> {{ d.note }}</span>
              <span style="font-weight:700;color:var(--danger)">{{ formatMoney(d.amount) }} | {{ d.date }}</span>
            </div>
          </div>
          <div class="row" v-if="sub.notes">
            <span class="label"><i class="fas fa-sticky-note"></i> ملاحظات</span>
            <span class="value">{{ sub.notes }}</span>
          </div>
          <div class="row" v-if="sub.freeCount > 0">
            <span class="label"><i class="fas fa-gift" style="color:var(--warning)"></i> تفعيل مجاني</span>
            <span class="value warning">{{ sub.freeCount }} يوم</span>
          </div>
          <div v-if="sub.freeDates && sub.freeDates.length" style="margin-top:4px">
            <div style="font-size:12px;font-weight:700;color:var(--text2);padding:6px 0 4px;display:flex;align-items:center;gap:6px">
              <i class="fas fa-history" style="font-size:11px"></i> سجل التفعيلات المجانية
            </div>
            <div v-for="(d, i) in sub.freeDates" :key="i" style="font-size:11px;color:var(--text3);padding:4px 10px;background:var(--warning-glow);border-radius:6px;margin-bottom:3px">
              <i class="fas fa-gift" style="color:var(--warning);font-size:10px"></i> {{ d }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="!sub" style="padding:40px;text-align:center;color:var(--text3)">المشترك غير موجود</div>

      <div v-if="sub" class="detail-actions">
        <button class="cy" @click="editSub"><i class="fas fa-edit"></i> تعديل</button>
        <button class="gr" @click="renewSub"><i class="fas fa-sync"></i> تجديد</button>
        <button v-if="(sub.prevDebt||0) + (sub.paid?0:sub.amount) > 0" class="cy" @click="settleSub"><i class="fas fa-hand-holding-usd"></i> تسديد</button>
        <button class="gr" @click="openFreeModal(sub.id)"><i class="fas fa-gift"></i> مجاني</button>
        <button class="gr" @click="sendWA"><i class="fab fa-whatsapp"></i> واتساب</button>
        <button v-if="sub.status==='expired'" class="gr" @click="reactivateSub">
          <i class="fas fa-play-circle"></i> إعادة تفعيل
        </button>
        <button v-if="sub.status==='active'||sub.status==='expired'" class="ow" @click="disableSub">
          <i class="fas fa-pause-circle"></i> تعطيل
        </button>
        <button v-if="sub.status==='disabled'" class="gr" @click="enableSub">
          <i class="fas fa-play-circle"></i> تفعيل
        </button>
        <button v-if="sub.status==='inactive'" class="gr" @click="reactivateSub">
          <i class="fas fa-play-circle"></i> تفعيل
        </button>
        <button v-if="sub.status==='inactive'" class="rd" @click="deleteSub">
          <i class="fas fa-trash"></i> حذف
        </button>
      </div>
    </div>
  `,
  setup() {
    const route = useRoute();
    const router = useRouter();

    const sub = computed(() => subs.find(s => s.id === parseInt(route.params.id)));
    const subDays = computed(() => sub.value ? daysBetween(new Date(sub.value.end), new Date()) : 0);
    const statusLabel = computed(() => {
      if (!sub.value) return '';
      const m = { active: 'فعال', expired: 'منتهي', disabled: 'معطل', inactive: 'غير مفعل' };
      return m[sub.value.status] || 'غير مفعل';
    });
    const statusClass = computed(() => {
      if (!sub.value) return '';
      const m = { active: 'active', expired: 'inactive', disabled: 'disabled', inactive: 'pending' };
      return m[sub.value.status] || 'pending';
    });

    function editSub() {
      if (sub.value) router.push('/add-sub?edit=' + sub.value.id);
    }

    function renewSub() {
      if (sub.value) window.openRenewModal(sub.value.id);
    }

    function settleSub() {
      if (sub.value) window.openSettleModal(sub.value.id);
    }

    function reactivateSub() {
      const s = sub.value;
      if (!s) return;
      const now = todayStr();
      const end = calcEndFromType(s.type, now).toISOString().split('T')[0];
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-play-circle" style="color:var(--success)"></i> إعادة تفعيل ' + s.name;
      document.getElementById('modalBody').innerHTML =
        '<div class="form-wrap" style="padding:0">' +
        '<div class="form-group"><label><i class="fas fa-tag"></i> الباقة</label>' +
        '<select id="reactType" onchange="reactOnTypeChange(' + s.id + ')">' +
        subscriptionTypes.filter(t => t.name !== 'مجاني').map(t =>
          '<option value="' + t.id + '" ' + (t.name === s.type ? 'selected' : '') + '>' + t.name + ' - ' + formatMoney(t.price) + '</option>'
        ).join('') + '</select></div>' +
        '<div class="form-row"><div class="form-group"><label><i class="fas fa-calendar"></i> تاريخ التفعيل</label>' +
        '<input type="date" id="reactStart" value="' + now + '" onchange="reactOnTypeChange(' + s.id + ')"></div>' +
        '<div class="form-group"><label><i class="fas fa-calendar-check"></i> ينتهي</label>' +
        '<input type="date" id="reactEnd" value="' + end + '" readonly style="color:var(--primary);font-weight:800"></div></div>' +
        '<div class="form-group"><label><i class="fas fa-money-bill-wave"></i> حالة الدفع</label>' +
        '<div style="display:flex;gap:8px">' +
        '<button type="button" class="as-paid-btn active" id="reactPaidBtn" onclick="window._reactPaid=true;document.getElementById(\'reactPaidBtn\').classList.add(\'active\');document.getElementById(\'reactDebtBtn\').classList.remove(\'active\')"><i class="fas fa-check-circle"></i> مدفوع</button>' +
        '<button type="button" class="as-paid-btn" id="reactDebtBtn" onclick="window._reactPaid=false;document.getElementById(\'reactDebtBtn\').classList.add(\'active\');document.getElementById(\'reactPaidBtn\').classList.remove(\'active\')"><i class="fas fa-clock"></i> آجل</button></div></div>' +
        '<div class="form-actions"><button class="success" onclick="confirmReactivate(' + s.id + ')"><i class="fas fa-check"></i> تفعيل</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
      window._reactPaid = true;
      openModal();
    }

    function disableSub() {
      if (!sub.value) return;
      sub.value.status = 'disabled';
      saveAllData();
      showToast('⏸️ تم تعطيل ' + sub.value.name);
    }

    function enableSub() {
      if (!sub.value) return;
      sub.value.status = 'active';
      saveAllData();
      showToast('▶️ تم إعادة تفعيل ' + sub.value.name);
    }

    function sendWA() {
      if (!sub.value) return;
      router.push('/whatsapp?subId=' + sub.value.id + '&tpl=0');
    }

    function deleteSub() {
      if (!sub.value) return;
      if (!confirm('⚠️ هل أنت متأكد من حذف ' + sub.value.name + ' بشكل نهائي؟')) return;
      const idx = subs.findIndex(x => x.id === sub.value.id);
      if (idx !== -1) subs.splice(idx, 1);
      saveAllData();
      showToast('🗑️ تم حذف المشترك');
      router.push('/subscribers');
    }

    return { sub, subDays, statusLabel, statusClass, editSub, renewSub, settleSub, reactivateSub, disableSub, enableSub, sendWA, deleteSub, formatMoney, openFreeModal };
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
                <div class="name">{{ s.name }}</div>
                <div class="phone">{{ s.phone }}</div>
              </div>
              <div class="wa-check" :class="{ checked: selectedSub?.id===s.id }">
                <i class="fas" :class="selectedSub?.id===s.id?'fa-check-circle':'fa-circle'"></i>
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
                <i class="fas" :class="t.icon" style="color:var(--success)"></i> {{ t.title }}
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
          <button class="wa-send-btn" @click="sendWA">
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
        (type === 'expense' ? '<div class="form-group"><label>فئة المصروف</label><select id="fCategory">' + expenseCategories.map(c => '<option>' + c.name + '</option>').join('') + '</select></div>' : '') +
        '<div class="form-group"><label>المبلغ (دينار)</label><input type="number" id="fAmount" placeholder="0"></div>' +
        '<div class="form-group"><label>ملاحظات <span style="color:var(--text3);font-weight:400">(اختياري)</span></label><input type="text" id="fDesc" placeholder="' + (type === 'income' ? 'اشتراك شهري' : 'فاتورة كهرباء') + '"></div>' +
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
      finDebts: computed(() => formatMoney(subs.reduce((a, s) => a + calcTotalDebt(s), 0))),
      addFinance,
      formatMoney
    };
  }
};

/* ============================================================
   ArchivePage.js - صفحة الأرشيف
   ============================================================ */

var ArchivePage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fas fa-archive"></i> الأرشيف</h2></div>

      <div class="filter-row" style="display:flex">
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
        <div class="search-bar">
          <div class="input-wrap">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="بحث..." v-model="finSearch">
          </div>
        </div>
        <div class="filter-row" style="display:flex">
          <div class="filter-chip" :class="{ active: finFilter==='all' }" @click="finFilter='all'">الكل</div>
          <div class="filter-chip" :class="{ active: finFilter==='income' }" @click="finFilter='income'">إيرادات</div>
          <div class="filter-chip" :class="{ active: finFilter==='expense' }" @click="finFilter='expense'">مصروفات</div>
        </div>
        <div v-if="monthSummaries.length" class="fin-stats" style="margin:0 0 12px">
          <div v-for="sum in monthSummaries" :key="sum.month" class="stat-card">
            <div class="num" style="font-size:14px;font-weight:800;color:var(--primary);margin-top:0">{{ sum.month }}</div>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:4px;font-size:12px">
              <div style="display:flex;justify-content:space-between;color:var(--success)"><span>إيرادات</span><span style="font-weight:700">{{ sum.income }}</span></div>
              <div style="display:flex;justify-content:space-between;color:var(--danger)"><span>مصروفات</span><span style="font-weight:700">{{ sum.expense }}</span></div>
              <div style="display:flex;justify-content:space-between;color:var(--primary);border-top:1px solid var(--glass-border);padding-top:4px;margin-top:2px"><span>الصافي</span><span style="font-weight:700">{{ sum.net }}</span></div>
            </div>
          </div>
        </div>
        <div v-for="(group, month) in finGroups" :key="month" style="margin-bottom:16px">
          <div style="font-weight:800;color:var(--primary);margin-bottom:8px;padding:0 4px">{{ month }}</div>
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

    const monthSummaries = computed(() => {
      let list = [...finRecords];
      const q = finSearch.value.toLowerCase();
      if(q) list = list.filter(f => f.desc.includes(q));
      if(finFilter.value === 'income') list = list.filter(f => f.type === 'income');
      else if(finFilter.value === 'expense') list = list.filter(f => f.type === 'expense');
      const byMonth = {};
      list.forEach(f => {
        const key = f.date.substring(0, 7);
        if(!byMonth[key]) byMonth[key] = { income: 0, expense: 0 };
        if(f.type === 'income') byMonth[key].income += f.amount;
        else byMonth[key].expense += f.amount;
      });
      const monthNames = ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      return Object.keys(byMonth).sort().reverse().map(k => {
        const [y, m] = k.split('-');
        return {
          month: monthNames[parseInt(m)] + ' ' + y,
          income: formatMoney(byMonth[k].income),
          expense: formatMoney(byMonth[k].expense),
          net: formatMoney(byMonth[k].income - byMonth[k].expense)
        };
      });
    });

    return { tab, finSearch, finFilter, archivedSubs, finGroups, monthSummaries, restoreSub, permaDelete, formatMoney };
  }
};

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
    const disabledCount = subs.filter(s => s.status === 'disabled').length;
    const debts = formatMoney(subs.reduce((a, s) => a + calcTotalDebt(s), 0));
    const payments = formatMoney(finRecords.filter(f => f.type === 'income').reduce((a, f) => a + f.amount, 0));
    const archivedCount = archivedSubs.length;

    return {
      reports: [
        { num: activeCount, label: 'مشتركين فعالين', color: 'cyan' },
        { num: disabledCount, label: 'معطلين', color: 'cyan' },
        { num: expiredCount, label: 'اشتراكات منتهية', color: 'red' },
        { num: inactiveCount, label: 'غير مفعلين', color: 'orange' },
        { num: debts, label: 'الديون المستحقة', color: 'red' },
        { num: payments, label: 'إجمالي المدفوعات', color: 'green' },
        { num: archivedCount, label: 'المؤرشفين', color: 'cyan' }
      ]
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
        <div class="set-card" @click="manageSubscriptions">
          <div class="sicon"><i class="fas fa-tags"></i></div>
          <div class="sinfo">
            <h4>أنواع الاشتراك</h4>
            <p>إدارة الباقات والتسعير والمدة</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageAreas">
          <div class="sicon green"><i class="fas fa-map-marker-alt"></i></div>
          <div class="sinfo">
            <h4>المناطق</h4>
            <p>إضافة وتعديل المناطق</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageTemplates">
          <div class="sicon orange"><i class="fab fa-whatsapp"></i></div>
          <div class="sinfo">
            <h4>الرسائل الجاهزة</h4>
            <p>تعديل قوالب واتساب</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageAlerts">
          <div class="sicon orange"><i class="fas fa-clock"></i></div>
          <div class="sinfo">
            <h4>التنبيهات</h4>
            <p>مدة التنبيه قبل انتهاء الاشتراك: {{ alertDays }} أيام</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageExpenseCategories">
          <div class="sicon red"><i class="fas fa-receipt"></i></div>
          <div class="sinfo">
            <h4>فئات المصروفات</h4>
            <p>إضافة وتعديل فئات الصرف</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageTowers">
          <div class="sicon green"><i class="fas fa-broadcast-tower"></i></div>
          <div class="sinfo">
            <h4>الأبراج</h4>
            <p>إدارة الأبراج والنقاط</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
        <div class="set-card" @click="manageTowerInfo">
          <div class="sicon green"><i class="fas fa-building"></i></div>
          <div class="sinfo">
            <h4>معلومات البرج</h4>
            <p>{{ towerInfo.name }} - {{ towerInfo.phone }}</p>
          </div>
          <i class="fas fa-chevron-left sarrow"></i>
        </div>
      </div>
    </div>
  `,
  setup() {
    function manageSubscriptions() {
      let html = '<div class="set-modal-desc"><i class="fas fa-info-circle" style="color:var(--primary)"></i> تعديل الأنواع الموجودة أو إضافة نوع جديد. السعر بالدينار العراقي.</div>';
      subscriptionTypes.forEach(t => {
        html += '<div class="set-item"><div class="set-item-icon"><i class="fas fa-tag"></i></div>' +
          '<div class="field"><input type="text" id="st_name_' + t.id + '" value="' + t.name + '" placeholder="اسم النوع"></div>' +
          '<div class="field"><input type="number" id="st_price_' + t.id + '" value="' + t.price + '" class="small" placeholder="السعر"></div>' +
          '<div class="field"><input type="number" id="st_days_' + t.id + '" value="' + t.days + '" class="small" placeholder="أيام"></div>' +
          '<div class="set-item-acts"><button class="save-btn" onclick="saveSubscriptionType(' + t.id + ')"><i class="fas fa-check"></i></button>' +
          '<button class="del-btn" onclick="deleteSubscriptionType(' + t.id + ')"><i class="fas fa-trash"></i></button></div></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus-circle"></i> إضافة نوع جديد</div>' +
        '<div class="set-add-row">' +
        '<input type="text" id="new_st_name" placeholder="اسم النوع">' +
        '<input type="number" id="new_st_price" placeholder="السعر" class="small">' +
        '<input type="number" id="new_st_days" placeholder="أيام" class="small">' +
        '<button onclick="addSubscriptionType()"><i class="fas fa-plus"></i> إضافة</button></div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-tags" style="color:var(--primary)"></i> أنواع الاشتراك';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageAreas() {
      let html = '<div class="set-modal-desc"><i class="fas fa-info-circle" style="color:var(--primary)"></i> تعديل المناطق الموجودة أو إضافة منطقة جديدة.</div>';
      areas.forEach(a => {
        html += '<div class="set-item"><div class="set-item-icon" style="color:var(--success)"><i class="fas fa-map-pin"></i></div>' +
          '<div class="field"><input type="text" id="area_' + a + '" value="' + a + '" placeholder="اسم المنطقة"></div>' +
          '<div class="set-item-acts"><button class="save-btn" onclick="saveArea(\'' + a + '\')"><i class="fas fa-check"></i></button>' +
          '<button class="del-btn" onclick="deleteArea(\'' + a + '\')"><i class="fas fa-trash"></i></button></div></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus-circle"></i> إضافة منطقة جديدة</div>' +
        '<div class="set-add-row">' +
        '<input type="text" id="new_area_name" placeholder="اسم المنطقة">' +
        '<button onclick="addArea()"><i class="fas fa-plus"></i> إضافة</button></div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-map-marker-alt" style="color:var(--success)"></i> المناطق';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageTemplates() {
      let html = '<div class="set-modal-desc"><i class="fas fa-info-circle" style="color:var(--warning)"></i> تعديل القوالب الموجودة أو إضافة قالب جديد. استخدم {name}, {phone}, {type}, {end}, {amount}, {towerPhone}.</div>';
      waTemplates.forEach(t => {
        html += '<div class="set-item" style="flex-wrap:wrap;padding-bottom:8px"><div class="set-item-icon" style="color:var(--success)"><i class="fab fa-whatsapp"></i></div>' +
          '<div class="field" style="flex:2"><input type="text" id="tpl_title_' + t.id + '" value="' + t.title + '" placeholder="عنوان القالب"></div>' +
          '<div class="set-item-acts"><button class="save-btn" onclick="saveTemplate(' + t.id + ')"><i class="fas fa-check"></i></button>' +
          '<button class="del-btn" onclick="deleteTemplate(' + t.id + ')"><i class="fas fa-trash"></i></button></div>' +
          '<div style="width:100%;margin-top:4px"><textarea id="tpl_msg_' + t.id + '" style="width:100%;padding:7px 10px;border-radius:7px;border:1px solid var(--glass-border);background:var(--bg2);color:var(--text);font-size:12px;font-family:Tajawal,sans-serif;resize:vertical;min-height:45px" rows="2">' + t.msg + '</textarea></div></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus-circle"></i> إضافة قالب جديد</div>' +
        '<input type="text" id="new_tpl_title" placeholder="عنوان القالب" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif;margin-bottom:6px;outline:none">' +
        '<textarea id="new_tpl_msg" placeholder="نص الرسالة..." style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:12px;font-family:Tajawal,sans-serif;resize:vertical;min-height:45px;outline:none;margin-bottom:6px" rows="2"></textarea>' +
        '<button onclick="addTemplate()" style="padding:8px 14px;border-radius:8px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-size:13px;font-weight:700;font-family:Tajawal,sans-serif"><i class="fas fa-plus"></i> إضافة قالب</button></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit" style="color:var(--warning)"></i> الرسائل الجاهزة';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageAlerts() {
      const opts = [2, 3, 4, 5, 6, 7];
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-clock" style="color:var(--warning)"></i> مدة التنبيه';
      document.getElementById('modalBody').innerHTML =
        '<div class="set-modal-desc"><i class="fas fa-info-circle" style="color:var(--warning)"></i> حدد عدد الأيام التي تسبق انتهاء الاشتراك لإرسال تنبيه.</div>' +
        '<div style="padding:4px 0"><div class="form-group"><label>تنبيه قبل انتهاء الاشتراك بـ</label>' +
        '<select id="alertDaysSelect">' +
        opts.map(d => '<option value="' + d + '" ' + (d === alertDays ? 'selected' : '') + '>' + d + ' أيام</option>').join('') +
        '</select></div>' +
        '<div class="form-actions" style="margin-top:16px">' +
        '<button class="primary" onclick="saveAlertDays()"><i class="fas fa-check"></i> حفظ</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
      openModal();
    }

    function manageExpenseCategories() {
      let html = '<div class="set-modal-desc"><i class="fas fa-info-circle" style="color:var(--danger)"></i> إدارة فئات المصروفات لإضافتها عند تسجيل مصروف جديد.</div>';
      expenseCategories.forEach(c => {
        html += '<div class="set-item"><div class="set-item-icon" style="color:var(--danger)"><i class="fas fa-receipt"></i></div>' +
          '<div class="field"><input type="text" id="cat_name_' + c.id + '" value="' + c.name + '" placeholder="اسم الفئة"></div>' +
          '<div class="set-item-acts"><button class="save-btn" onclick="saveExpenseCategory(' + c.id + ')"><i class="fas fa-check"></i></button>' +
          '<button class="del-btn" onclick="deleteExpenseCategory(' + c.id + ')"><i class="fas fa-trash"></i></button></div></div>';
      });
      html += '<div class="set-add-section"><div class="set-add-title"><i class="fas fa-plus-circle"></i> إضافة فئة جديدة</div>' +
        '<div class="set-add-row">' +
        '<input type="text" id="new_cat_name" placeholder="اسم الفئة">' +
        '<button onclick="addExpenseCategory()"><i class="fas fa-plus"></i> إضافة</button></div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-receipt" style="color:var(--danger)"></i> فئات المصروفات';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageTowers() {
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-broadcast-tower" style="color:var(--success)"></i> الأبراج والنقاط';
      window.renderTowersModal();
      openModal();
    }

    function manageTowerInfo() {
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-building" style="color:var(--success)"></i> معلومات البرج';
      document.getElementById('modalBody').innerHTML =
        '<div class="set-modal-desc"><i class="fas fa-info-circle" style="color:var(--success)"></i> بيانات البرج الأساسية المستخدمة في قوالب واتساب.</div>' +
        '<div class="set-item"><div class="set-item-icon"><i class="fas fa-building"></i></div>' +
        '<div class="field"><input type="text" id="tName" value="' + towerInfo.name + '" placeholder="اسم البرج"></div></div>' +
        '<div class="set-item"><div class="set-item-icon" style="color:var(--success)"><i class="fas fa-map-marker-alt"></i></div>' +
        '<div class="field"><input type="text" id="tAddress" value="' + towerInfo.address + '" placeholder="العنوان"></div></div>' +
        '<div class="set-item"><div class="set-item-icon" style="color:var(--success)"><i class="fas fa-phone"></i></div>' +
        '<div class="field"><input type="text" id="tPhone" value="' + towerInfo.phone + '" placeholder="رقم الهاتف"></div></div>' +
        '<div class="form-actions" style="margin-top:16px">' +
        '<button class="primary" onclick="saveTowerInfo()"><i class="fas fa-check"></i> حفظ</button>' +
        '<button class="secondary" onclick="closeModal()">إلغاء</button></div>';
      openModal();
    }

    return { alertDays, towerInfo, towers, manageSubscriptions, manageAreas, manageTemplates, manageAlerts, manageExpenseCategories, manageTowers, manageTowerInfo };
  }
};
