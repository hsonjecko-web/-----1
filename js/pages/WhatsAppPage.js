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

      <div class="shead" style="padding-bottom:6px">
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

      <div class="shead" style="padding-bottom:6px">
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
