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
            <span class="value danger">{{ sub.amount }} دينار</span>
          </div>
          <div class="row" v-if="sub.notes">
            <span class="label"><i class="fas fa-sticky-note"></i> ملاحظات</span>
            <span class="value">{{ sub.notes }}</span>
          </div>
        </div>
      </div>

      <div v-if="!sub" style="padding:40px;text-align:center;color:var(--text3)">المشترك غير موجود</div>

      <div v-if="sub" class="detail-actions">
        <button class="cy" @click="renewSub"><i class="fas fa-sync"></i> تجديد</button>
        <button class="gr" @click="activateFree"><i class="fas fa-gift"></i> تفعيل مجاني</button>
        <button class="rd" @click="toggleStatus">
          <i class="fas" :class="sub.status==='active'?'fa-pause':'fa-play'"></i>
          {{ sub.status==='active'?'إيقاف':'تشغيل' }}
        </button>
        <button class="gr" @click="sendWA"><i class="fab fa-whatsapp"></i> واتساب</button>
        <button class="ow" @click="archiveSub"><i class="fas fa-archive"></i> أرشفة</button>
        <button class="rd" @click="deleteSub"><i class="fas fa-trash"></i> حذف</button>
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
          '<p style="font-weight:700">المبلغ المستحق: <span style="color:var(--danger)">' + sub.value.amount + ' دينار</span></p>' +
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
      d.setDate(d.getDate() + 30);
      sub.value.end = d.toISOString().split('T')[0];
      sub.value.status = 'active';
      sub.value.paid = true;
      saveAllData();
      showToast('🎁 تم تفعيل اشتراك مجاني لمدة 30 يوماً');
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

    function showModal(title, body) {
      document.getElementById('modalTitle').innerHTML = title;
      document.getElementById('modalBody').innerHTML = body;
      openModal();
    }

    return { sub, subDays, renewSub, activateFree, toggleStatus, sendWA, archiveSub, deleteSub };
  }
};
