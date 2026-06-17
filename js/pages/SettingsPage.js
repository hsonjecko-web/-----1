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
        <div class="set-card" @click="manageTowerInfo" v-if="can('settings.manageTowers')">
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
    function manageUsers() {
      let html = '<div class="form-wrap" style="padding:0">';
      users.forEach(u => {
        const permStr = u.permissions.settings.manageUsers ? 'مدير نظام' : 'مستخدم';
        html += '<div style="display:flex;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid var(--glass-border);cursor:pointer" onclick="openEditUser(' + u.id + ')">' +
          '<div style="width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,var(--primary),#5341cd);display:grid;place-items:center;font-size:16px;color:#fff;font-weight:800">' + u.name.charAt(0) + '</div>' +
          '<div style="flex:1">' +
          '<div style="font-weight:700;font-size:14px">' + u.name + '</div>' +
          '<div style="font-size:11px;color:var(--text3)">@' + u.username + ' · ' + permStr + '</div></div>' +
          '<i class="fas fa-chevron-left" style="color:var(--text3);font-size:12px"></i></div>';
      });
      html += '<div style="margin-top:14px">' +
        '<button class="primary" onclick="openAddUser()" style="padding:12px 24px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--primary),#5341cd);color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:Tajawal,sans-serif"><i class="fas fa-plus"></i> إضافة مستخدم جديد</button></div>' +
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

    return { alertDays, towerInfo, users, can, manageUsers, manageSubscriptions, manageAreas, manageTemplates, manageAlerts, manageExpenseCategories, manageTowerInfo };
  }
};
