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
      let html = '<div class="form-wrap" style="padding:0">';
      subscriptionTypes.forEach(t => {
        html += '<div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--glass-border)">' +
          '<span style="flex:1;font-weight:700">' + t.name + '</span>' +
          '<span style="color:var(--text2)">' + t.price.toLocaleString() + ' دينار</span>' +
          '<span style="color:var(--primary)">' + t.days + ' يوم</span>' +
          '</div>';
      });
      html += '<div style="margin-top:14px;color:var(--text3);font-size:12px">للتعديل: سيتم تفعيل التحرير قريباً</div></div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-tags" style="color:var(--primary)"></i> أنواع الاشتراك';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageAreas() {
      let html = '<div class="form-wrap" style="padding:0">';
      areas.forEach(a => {
        html += '<div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--glass-border)">' +
          '<span><i class="fas fa-map-pin" style="color:var(--primary)"></i></span>' +
          '<span style="flex:1">' + a + '</span></div>';
      });
      html += '</div>';
      document.getElementById('modalTitle').innerHTML = '<i class="fas fa-map-marker-alt" style="color:var(--success)"></i> المناطق';
      document.getElementById('modalBody').innerHTML = html;
      openModal();
    }

    function manageTemplates() {
      let html = '<div class="form-wrap" style="padding:0">';
      waTemplates.forEach(t => {
        html += '<div style="padding:12px 0;border-bottom:1px solid var(--glass-border)">' +
          '<div style="font-weight:700;margin-bottom:4px">' + t.title + '</div>' +
          '<div style="font-size:12px;color:var(--text2);white-space:pre-line">' + t.msg.substring(0, 60) + '...</div></div>';
      });
      html += '<div style="margin-top:14px;color:var(--text3);font-size:12px">للتعديل: سيتم تفعيل التحرير قريباً</div></div>';
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
        html += '<div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--glass-border)">' +
          '<span><i class="fas fa-receipt" style="color:var(--danger)"></i></span>' +
          '<span style="flex:1">' + c.name + '</span></div>';
      });
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
