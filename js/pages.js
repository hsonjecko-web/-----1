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

      <div class="stats">
        <div class="stat-card xl clickable" @click="$router.push('/subscribers')">
          <div class="top">
            <div class="icon cyan"><i class="fas fa-users"></i></div>
            <span class="trend up"><i class="fas fa-arrow-up"></i> {{ totalSubs }}</span>
          </div>
          <div class="num">{{ totalSubs }}</div>
          <div class="label">إجمالي المشتركين</div>
        </div>
        <div class="stat-card sm clickable" @click="$router.push('/subscribers')">
          <div class="top">
            <div class="icon green"><i class="fas fa-wifi"></i></div>
          </div>
          <div class="num">{{ activeSubs }}</div>
          <div class="label">مشتركين فعالين</div>
        </div>
        <div class="stat-card sm clickable" @click="goFilter('expired')">
          <div class="top">
            <div class="icon red"><i class="fas fa-ban"></i></div>
          </div>
          <div class="num">{{ expiredSubs }}</div>
          <div class="label">اشتراكات منتهية</div>
        </div>
        <div class="stat-card sm clickable" @click="goFilter('inactive')">
          <div class="top">
            <div class="icon orange"><i class="fas fa-user-clock"></i></div>
          </div>
          <div class="num">{{ inactiveSubs }}</div>
          <div class="label">غير مفعلين</div>
        </div>
        <div class="stat-card sm clickable" @click="goFilter('disabled')">
          <div class="top">
            <div class="icon" style="background:rgba(100,116,139,.15);color:var(--text3)"><i class="fas fa-pause-circle"></i></div>
          </div>
          <div class="num">{{ disabledSubs }}</div>
          <div class="label">معطلين</div>
        </div>
        <div class="stat-card xl clickable" @click="$router.push('/finance')">
          <div class="top"><div class="icon red"><i class="fas fa-coins"></i></div></div>
          <div class="num">{{ debtsTotal }}</div>
          <div class="label">الديون المستحقة</div>
        </div>
        <div class="stat-card lg clickable" @click="$router.push('/finance')">
          <div class="top"><div class="icon green"><i class="fas fa-wallet"></i></div></div>
          <div class="num">{{ balanceTotal }}</div>
          <div class="label">الرصيد الحالي</div>
        </div>
        <div class="stat-card lg clickable" @click="$router.push('/subscribers')">
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
        <div v-for="s in filteredList" :key="s.id" class="sub-card" @click="$router.push('/sub-detail/'+s.id)">
          <div class="avatar" :class="{ off: s.status!=='active' }">{{ s.name.charAt(0) }}</div>
          <div class="info">
            <div class="name">
              {{ s.name }}
              <span class="dot" :class="s.status==='active'?'on':s.status==='expired'?'off':s.status==='disabled'?'disabled':'wait'"></span>
            </div>
            <div class="phone"><i class="fas fa-phone" style="font-size:10px;color:var(--text3)"></i> {{ s.phone }}</div>
            <div class="meta">
              <span class="type">{{ s.type }}</span>
              <span :class="s.paid?'paid':'debt'">{{ s.paid?'مدفوع':'غير مدفوع' }}</span>
              <span v-if="s.status==='expired'" style="background:var(--danger-glow);color:var(--danger)">منتهي</span>
              <span v-if="s.status==='disabled'" style="background:var(--text3);color:#fff">معطل</span>
            </div>
          </div>
          <div class="actions">
            <button @click.stop="$router.push('/sub-detail/'+s.id)" title="تعديل"><i class="fas fa-edit"></i></button>
            <button class="gr" @click.stop="renewSub(s.id)" title="تجديد"><i class="fas fa-sync"></i></button>
            <button class="gr" @click.stop="sendWADirect(s)" title="واتساب" style="color:var(--success)"><i class="fab fa-whatsapp"></i></button>
          </div>
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

    function renewSub(id) {
      const s = subs.find(x => x.id === id);
      if(!s) return;
      if(!s.paid && s.status === 'expired') {
        showToast('⚠️ ' + s.name + ' مطلوب منه اشتراك قديم غير مدفوع (' + formatMoney(s.amount) + ')');
      } else {
        router.push('/sub-detail/' + id);
      }
    }

    function sendWADirect(s) {
      window.open('https://wa.me/' + s.phone + '?text=' + encodeURIComponent('مرحباً ' + s.name + '،'), '_blank');
      showToast('✅ تم فتح واتساب لـ ' + s.name);
    }

    return { searchQuery, showFilters, currentFilter, filteredList, renewSub, sendWADirect };
  }
};

/* ============================================================
   AddSubPage.js - صفحة إضافة مشترك جديد
   ============================================================ */

var AddSubPage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-user-plus"></i> إضافة مشترك جديد</h2>
        <a @click="$router.push('/subscribers')">رجوع</a>
      </div>
      <div class="form-wrap">
        <div class="form-group">
          <label><i class="fas fa-user"></i> اسم المشترك</label>
          <input type="text" placeholder="الاسم الكامل" v-model="form.name" ref="nameInput">
        </div>
        <div class="form-group">
          <label><i class="fas fa-phone"></i> رقم الهاتف</label>
          <input type="text" placeholder="07xx xxx xxxx" v-model="form.phone">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-wifi"></i> اسم الشبكة (SSID)</label>
            <input type="text" placeholder="اسم الشبكة" v-model="form.ssid">
          </div>
          <div class="form-group">
            <label><i class="fas fa-key"></i> كلمة مرور الشبكة</label>
            <input type="text" placeholder="كلمة المرور" v-model="form.pass">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-map-marker-alt"></i> المنطقة</label>
            <select v-model="form.area">
              <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
            </select>
          </div>
          <div class="form-group">
            <label><i class="fas fa-tag"></i> نوع الاشتراك</label>
            <select v-model="form.type" @change="updateEndDate">
              <option v-for="t in subscriptionTypes" :key="t.id" :value="t.name">{{ t.name }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-dollar-sign"></i> مبلغ الاشتراك</label>
            <input type="number" placeholder="0" v-model.number="form.amount">
          </div>
          <div class="form-group">
            <label><i class="fas fa-calendar"></i> تاريخ التفعيل</label>
            <input type="date" v-model="form.start" @change="updateEndDate">
          </div>
        </div>
        <div class="form-group">
          <label><i class="fas fa-calendar-check"></i> تاريخ الانتهاء (تلقائي)</label>
          <input type="date" :value="form.end" readonly style="color:var(--primary);font-weight:800">
          <span class="hint">يتم احتساب تاريخ الانتهاء حسب نوع الباقة</span>
        </div>
        <div class="form-group">
          <label><i class="fas fa-sticky-note"></i> ملاحظات</label>
          <textarea placeholder="أي ملاحظات إضافية..." v-model="form.notes"></textarea>
        </div>
        <div class="form-actions">
          <button class="primary" @click="saveSub(false)"><i class="fas fa-save"></i> حفظ</button>
          <button class="primary" @click="saveSub(true)"><i class="fas fa-plus-circle"></i> حفظ + إضافة جديد</button>
          <button class="secondary" @click="$router.push('/subscribers')">إلغاء</button>
        </div>
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const nameInput = ref(null);

    const form = reactive({
      name: '', phone: '', ssid: '', pass: '',
      area: areas[0], type: subscriptionTypes[1]?.name || 'شهري',
      amount: 25000, start: todayStr(), end: '', notes: ''
    });

    function updateEndDate() {
      if(!form.start) return;
      const end = calcEndFromType(form.type, form.start);
      form.end = end.toISOString().split('T')[0];
    }

    updateEndDate();

    function saveSub(addAnother) {
      if(!form.name.trim()) { showToast('⚠️ الرجاء إدخال اسم المشترك'); return; }
      if(!form.phone.trim()) { showToast('⚠️ الرجاء إدخال رقم الهاتف'); return; }
      if(form.phone.length < 10) { showToast('⚠️ رقم الهاتف غير صحيح (10 أرقام على الأقل)'); return; }

      const ssid = form.ssid.trim() || 'NetTower-' + form.name;
      const pass = form.pass.trim() || '12345678';

      subs.push({
        id: nextId++,
        name: form.name.trim(),
        phone: form.phone.trim(),
        ssid, pass,
        area: form.area,
        type: form.type,
        amount: form.amount || 0,
        start: form.start || todayStr(),
        end: form.end || todayStr(),
        status: 'active',
        paid: false,
        notes: form.notes.trim(),
        archived: false,
        freeCount: 0,
        freeDates: []
      });

      saveAllData();
      showToast('✅ تم إضافة المشترك ' + form.name + ' بنجاح');

      if(addAnother) {
        form.name = ''; form.phone = ''; form.ssid = ''; form.pass = '';
        form.notes = ''; form.start = todayStr();
        form.amount = 25000; form.type = subscriptionTypes[1]?.name || 'شهري';
        updateEndDate();
        setTimeout(() => nameInput.value?.focus(), 100);
      } else {
        router.push('/subscribers');
      }
    }

    return { form, areas, subscriptionTypes, nameInput, updateEndDate, saveSub };
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
          <span class="sbadge" :class="sub.status==='active'?'active':sub.status==='expired'?'inactive':sub.status==='disabled'?'disabled':'pending'">
            {{ sub.status==='active'?'فعال':sub.status==='expired'?'منتهي':sub.status==='disabled'?'معطل':'غير مفعل' }}
          </span>
        </div>
        <div class="dbody">
          <div class="row"><span class="label"><i class="fas fa-phone"></i> الهاتف</span><span class="value">{{ sub.phone }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-wifi"></i> اسم الشبكة</span><span class="value">{{ sub.ssid }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-key"></i> كلمة المرور</span><span class="value">{{ sub.pass }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-map-marker-alt"></i> المنطقة</span><span class="value">{{ sub.area }}</span></div>
          <div class="row"><span class="label"><i class="fas fa-tag"></i> نوع الاشتراك</span><span class="value primary">{{ sub.type }}</span></div>
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
          <div class="row" v-if="!sub.paid">
            <span class="label"><i class="fas fa-exclamation-triangle"></i> المبلغ المستحق</span>
            <span class="value danger">{{ formatMoney(sub.amount) }}</span>
          </div>
          <div class="row" v-if="sub.notes">
            <span class="label"><i class="fas fa-sticky-note"></i> ملاحظات</span>
            <span class="value">{{ sub.notes }}</span>
          </div>
          <div class="row" v-if="sub.freeCount > 0">
            <span class="label"><i class="fas fa-gift" style="color:var(--warning)"></i> تفعيل مجاني</span>
            <span class="value warning">{{ sub.freeCount }} مرات - آخرها: {{ sub.freeDates[sub.freeDates.length-1] }}</span>
          </div>
        </div>
      </div>

      <div v-if="!sub" style="padding:40px;text-align:center;color:var(--text3)">المشترك غير موجود</div>

      <div v-if="sub" class="detail-actions">
        <button class="cy" @click="renewSub"><i class="fas fa-sync"></i> تجديد</button>
        <button class="gr" @click="activateFree"><i class="fas fa-gift"></i> تفعيل مجاني</button>
        <button class="gr" @click="sendWA"><i class="fab fa-whatsapp"></i> واتساب</button>
        <button v-if="sub.status==='active'||sub.status==='expired'" class="ow" @click="disableSub">
          <i class="fas fa-pause-circle"></i> تعطيل
        </button>
        <button v-if="sub.status==='disabled'" class="gr" @click="enableSub">
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

    function renewSub() {
      if(!sub.value) return;
      if(!sub.value.paid && sub.value.status === 'expired') {
        showModal(
          '⚠️ تسديد الاشتراك القديم',
          '<p style="color:var(--text2);margin-bottom:14px">' + sub.value.name + ' مطلوب منه اشتراك قديم غير مدفوع:</p>' +
          '<div style="background:var(--card);border-radius:12px;padding:14px;margin-bottom:14px">' +
          '<p style="font-weight:700">المبلغ المستحق: <span style="color:var(--danger)">' + formatMoney(sub.value.amount) + '</span></p>' +
          '<p style="font-size:12px;color:var(--text2)">نوع الاشتراك: ' + sub.value.type + '</p></div>' +
          '<div class="form-actions">' +
          '<button class="success" onclick="showToast(\'✅ تم تسديد الاشتراك القديم\')">تسديد الاشتراك القديم</button>' +
          '<button class="secondary" onclick="closeModal()">إلغاء</button></div>'
        );
      } else {
        showToast('🔄 تجديد الاشتراك - قيد التطوير');
      }
    }

    function activateFree() {
      if(!sub.value) return;
      sub.value.type = 'مجاني';
      sub.value.amount = 0;
      const d = new Date();
      d.setDate(d.getDate() + 1);
      sub.value.end = d.toISOString().split('T')[0];
      sub.value.status = 'active';
      sub.value.paid = true;
      sub.value.freeCount = (sub.value.freeCount || 0) + 1;
      if(!sub.value.freeDates) sub.value.freeDates = [];
      sub.value.freeDates.push(todayStr());
      saveAllData();
      showToast('🎁 تم تفعيل اشتراك مجاني لمدة يوم واحد');
    }

    function disableSub() {
      if(!sub.value) return;
      sub.value.status = 'disabled';
      saveAllData();
      showToast('⏸️ تم تعطيل ' + sub.value.name);
    }

    function enableSub() {
      if(!sub.value) return;
      sub.value.status = 'active';
      saveAllData();
      showToast('▶️ تم إعادة تفعيل ' + sub.value.name);
    }

    function sendWA() {
      if(!sub.value) return;
      window.open('https://wa.me/' + sub.value.phone, '_blank');
    }

    function deleteSub() {
      if(!sub.value) return;
      if(!confirm('⚠️ هل أنت متأكد من حذف ' + sub.value.name + ' بشكل نهائي؟')) return;
      const idx = subs.findIndex(x => x.id === sub.value.id);
      if(idx !== -1) subs.splice(idx, 1);
      saveAllData();
      showToast('🗑️ تم حذف المشترك');
      router.push('/subscribers');
    }

    function showModal(title, body) {
      document.getElementById('modalTitle').innerHTML = title;
      document.getElementById('modalBody').innerHTML = body;
      openModal();
    }

    return { sub, subDays, renewSub, activateFree, disableSub, enableSub, sendWA, deleteSub, formatMoney, todayStr };
  }
};

/* ============================================================
   WhatsAppPage.js - صفحة إرسال واتساب
   ============================================================ */

var WhatsAppPage = {
  template: `
    <div class="page">
      <div class="shead"><h2><i class="fab fa-whatsapp"></i> إرسال واتساب</h2></div>
      <div class="search-bar">
        <div class="input-wrap">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="ابحث عن مشترك..." v-model="waSearch">
        </div>
      </div>

      <div class="shead">
        <h2><i class="fas fa-file-alt"></i> قوالب الرسائل</h2>
      </div>
      <div class="whatsapp-templates">
        <div v-for="(t,i) in waTemplates" :key="t.id" class="wa-tpl"
             :class="{ active: i===selectedTpl }" @click="selectedTpl=i">
          <div class="tpl-title">
            <i class="fas" :class="t.icon" style="color:var(--success)"></i> {{ t.title }}
          </div>
          <div class="tpl-preview">{{ t.msg.substring(0,70) }}...</div>
        </div>
      </div>

      <div class="shead">
        <h2><i class="fas fa-users"></i> اختر مشتركاً</h2>
      </div>
      <div class="subs-list">
        <div v-for="s in waFiltered" :key="s.id" class="sub-card"
             :style="selectedSub?.id===s.id?'border-color:var(--primary);box-shadow:0 0 0 2px var(--primary-glow)':''"
             @click="selectedSub=s">
          <div class="avatar">{{ s.name.charAt(0) }}</div>
          <div class="info">
            <div class="name">{{ s.name }}</div>
            <div class="phone">{{ s.phone }}</div>
          </div>
          <div style="font-size:14px" :style="{ color: selectedSub?.id===s.id?'var(--success)':'var(--text3)' }">
            <i class="fas" :class="selectedSub?.id===s.id?'fa-check-circle':'fa-circle'"></i>
          </div>
        </div>
        <p v-if="!waFiltered.length" style="color:var(--text3);padding:20px;text-align:center">لا يوجد مشتركين</p>
      </div>

      <div v-if="selectedSub" class="wa-preview">
        <div class="label"><i class="fas fa-eye" style="color:var(--primary)"></i> معاينة الرسالة</div>
        <div class="msg" style="white-space:pre-line">{{ previewMsg }}</div>
      </div>

      <button v-if="selectedSub" class="wa-send-btn" @click="sendWA">
        <i class="fab fa-whatsapp"></i> إرسال عبر واتساب
      </button>
    </div>
  `,
  setup() {
    const waSearch = ref('');
    const selectedSub = ref(null);
    const selectedTpl = ref(0);

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

    return { waSearch, selectedSub, selectedTpl, waFiltered, previewMsg, sendWA, waTemplates };
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
    const debts = formatMoney(subs.filter(s => !s.paid).reduce((a, s) => a + s.amount, 0));
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
      let html = '<div class="form-wrap" style="padding:0"><div style="font-size:12px;color:var(--text3);margin-bottom:8px">تعديل الأنواع الموجودة أو إضافة أنواع جديدة</div>';
      subscriptionTypes.forEach(t => {
        html += '<div style="display:flex;gap:6px;align-items:center;padding:6px 0;border-bottom:1px solid var(--glass-border)">' +
          '<input type="text" id="st_name_' + t.id + '" value="' + t.name + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
          '<input type="number" id="st_price_' + t.id + '" value="' + t.price + '" style="width:65px;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
          '<input type="number" id="st_days_' + t.id + '" value="' + t.days + '" style="width:55px;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
          '<button onclick="saveSubscriptionType(' + t.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--success);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-check"></i></button>' +
          '<button onclick="deleteSubscriptionType(' + t.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--danger);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>' +
          '</div>';
      });
      html += '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;padding-top:8px;border-top:1px solid var(--glass-border)">' +
        '<input type="text" id="new_st_name" placeholder="اسم النوع" style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
        '<input type="number" id="new_st_price" placeholder="السعر" style="width:65px;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
        '<input type="number" id="new_st_days" placeholder="الأيام" style="width:55px;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
        '<button onclick="addSubscriptionType()" style="padding:8px 14px;border-radius:8px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-size:13px"><i class="fas fa-plus"></i> إضافة</button></div>';
      html += '</div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-tags" style="color:var(--primary)"></i> أنواع الاشتراك';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageAreas() {
      let html = '<div class="form-wrap" style="padding:0"><div style="font-size:12px;color:var(--text3);margin-bottom:8px">تعديل المناطق الموجودة أو إضافة مناطق جديدة</div>';
      areas.forEach(a => {
        html += '<div style="display:flex;gap:6px;align-items:center;padding:6px 0;border-bottom:1px solid var(--glass-border)">' +
          '<i class="fas fa-map-pin" style="color:var(--primary);font-size:14px"></i>' +
          '<input type="text" id="area_' + a + '" value="' + a + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
          '<button onclick="saveArea(\'' + a + '\')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--success);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-check"></i></button>' +
          '<button onclick="deleteArea(\'' + a + '\')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--danger);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>' +
          '</div>';
      });
      html += '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;padding-top:8px;border-top:1px solid var(--glass-border)">' +
        '<input type="text" id="new_area_name" placeholder="اسم المنطقة الجديدة" style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
        '<button onclick="addArea()" style="padding:8px 14px;border-radius:8px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-size:13px"><i class="fas fa-plus"></i> إضافة</button></div>';
      html += '</div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-map-marker-alt" style="color:var(--success)"></i> المناطق';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageTemplates() {
      let html = '<div class="form-wrap" style="padding:0"><div style="font-size:12px;color:var(--text3);margin-bottom:8px">تعديل القوالب الموجودة أو إضافة قالب جديد</div>';
      waTemplates.forEach(t => {
        html += '<div style="padding:10px 0;border-bottom:1px solid var(--glass-border)">' +
          '<div style="display:flex;gap:6px;align-items:center;margin-bottom:4px">' +
          '<input type="text" id="tpl_title_' + t.id + '" value="' + t.title + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
          '<button onclick="saveTemplate(' + t.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--success);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-check"></i></button>' +
          '<button onclick="deleteTemplate(' + t.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--danger);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>' +
          '</div>' +
          '<textarea id="tpl_msg_' + t.id + '" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:12px;font-family:Tajawal,sans-serif;resize:vertical;min-height:50px" rows="2">' + t.msg + '</textarea></div>';
      });
      html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--glass-border)">' +
        '<input type="text" id="new_tpl_title" placeholder="عنوان القالب" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif;margin-bottom:6px">' +
        '<textarea id="new_tpl_msg" placeholder="نص الرسالة (استخدم {name}, {phone}, {type}, {end}, {amount}, {towerPhone})" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:12px;font-family:Tajawal,sans-serif;resize:vertical;min-height:50px" rows="2"></textarea>' +
        '<button onclick="addTemplate()" style="margin-top:6px;padding:8px 14px;border-radius:8px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-size:13px"><i class="fas fa-plus"></i> إضافة قالب</button></div>';
      html += '</div>';
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
      let html = '<div class="form-wrap" style="padding:0"><div style="font-size:12px;color:var(--text3);margin-bottom:8px">تعديل الفئات الموجودة أو إضافة فئة جديدة</div>';
      expenseCategories.forEach(c => {
        html += '<div style="display:flex;gap:6px;align-items:center;padding:6px 0;border-bottom:1px solid var(--glass-border)">' +
          '<i class="fas fa-receipt" style="color:var(--danger);font-size:14px"></i>' +
          '<input type="text" id="cat_name_' + c.id + '" value="' + c.name + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
          '<button onclick="saveExpenseCategory(' + c.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--success);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-check"></i></button>' +
          '<button onclick="deleteExpenseCategory(' + c.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--danger);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>' +
          '</div>';
      });
      html += '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;padding-top:8px;border-top:1px solid var(--glass-border)">' +
        '<input type="text" id="new_cat_name" placeholder="اسم الفئة الجديدة" style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
        '<button onclick="addExpenseCategory()" style="padding:8px 14px;border-radius:8px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-size:13px"><i class="fas fa-plus"></i> إضافة</button></div>';
      html += '</div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-receipt" style="color:var(--danger)"></i> فئات المصروفات';
      document.getElementById('modalBody').innerHTML = html;
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

    return { alertDays, towerInfo, manageSubscriptions, manageAreas, manageTemplates, manageAlerts, manageExpenseCategories, manageTowerInfo };
  }
};
