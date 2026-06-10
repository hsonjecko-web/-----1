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
        archived: false
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
