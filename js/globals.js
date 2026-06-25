/* ============================================================
   globals.js - دوال عامة تستخدم من خارج Vue (مودالات)
   ============================================================ */

window.saveAlertDays = function() {
  const val = parseInt(document.getElementById('alertDaysSelect').value);
  if(val >= 2 && val <= 7) {
    alertDays = val;
    saveAllData();
    showToast('✅ تم ضبط مدة التنبيه: ' + val + ' أيام');
    closeModal();
  }
};

window.saveTowerInfo = function() {
  towerInfo.name = document.getElementById('tName').value;
  towerInfo.address = document.getElementById('tAddress').value;
  towerInfo.phone = document.getElementById('tPhone').value;
  saveAllData();
  showToast('✅ تم حفظ معلومات البرج');
  closeModal();
};

window.saveFinanceEdit = function(id) {
  const f = finRecords.find(x => x.id === id);
  if (!f) return;
  const desc = document.getElementById('fEditDesc')?.value?.trim();
  const amount = parseInt(document.getElementById('fEditAmount')?.value);
  if (!desc) { showToast('⚠️ أدخل الوصف'); return; }
  if (!amount) { showToast('⚠️ أدخل المبلغ'); return; }
  f.desc = desc;
  f.amount = amount;
  if (f.type === 'expense') {
    f.category = document.getElementById('fEditCategory')?.value || f.category;
  }
  saveAllData();
  closeModal();
  showToast('✅ تم التعديل');
};

window.saveFinance = function(type) {
  const amount = parseInt(document.getElementById('fAmount').value);
  if(!amount) { showToast('⚠️ أدخل المبلغ'); return; }
  const desc = document.getElementById('fDesc').value.trim() || (type === 'expense' ? 'مصروف' : 'إيراد');
  finRecords.unshift({
    id: finId++,
    date: todayStr(),
    desc: desc,
    amount: amount,
    type: type,
    category: type === 'expense' ? document.getElementById('fCategory')?.value : undefined,
    subId: null,
    area: document.getElementById('fArea')?.value || '',
    tower: document.getElementById('fTower')?.value || '',
    point: document.getElementById('fPoint')?.value || ''
  });
  saveAllData();
  closeModal();
  showToast('✅ تمت الإضافة');
};

// ===== دوال إدارة أنواع الاشتراك =====
window.openEditSubscriptionType = function(id) {
  const t = subscriptionTypes.find(x => x.id === id);
  if(!t) { showToast('⚠️ النوع غير موجود'); return; }
  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-tags" style="color:var(--primary)"></i> تعديل نوع الاشتراك';
  document.getElementById('modalBody').innerHTML =
    '<div class="form-wrap" style="padding:0">' +
    '<div class="form-group"><label>الاسم</label><input type="text" id="st_name_' + id + '" value="' + t.name + '"></div>' +
    '<div class="form-row"><div class="form-group"><label>السعر (دينار)</label><input type="number" id="st_price_' + id + '" value="' + t.price + '"></div>' +
    '<div class="form-group"><label>المدة (أيام)</label><input type="number" id="st_days_' + id + '" value="' + t.days + '"></div></div>' +
    '<div class="form-actions">' +
    '<button class="primary" onclick="saveSubscriptionType(' + id + ')">حفظ</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
  openModal();
};

// ===== دوال إدارة أنواع الاشتراك =====
window.addSubscriptionType = function() {
  const name = document.getElementById('new_st_name')?.value?.trim();
  const price = parseInt(document.getElementById('new_st_price')?.value);
  const days = parseInt(document.getElementById('new_st_days')?.value);
  if(!name || !price || !days) { showToast('⚠️ املأ جميع الحقول'); return; }
  const maxId = subscriptionTypes.reduce((m, t) => Math.max(m, t.id), 0);
  subscriptionTypes.push({ id: maxId + 1, name, price, days });
  saveAllData();
  showToast('✅ تم إضافة نوع الاشتراك: ' + name);
  closeModal();
};

window.saveSubscriptionType = function(id) {
  const name = document.getElementById('st_name_' + id)?.value?.trim();
  const price = parseInt(document.getElementById('st_price_' + id)?.value);
  const days = parseInt(document.getElementById('st_days_' + id)?.value);
  if(!name || !price || !days) { showToast('⚠️ املأ جميع الحقول'); return; }
  const t = subscriptionTypes.find(x => x.id === id);
  if(t) { t.name = name; t.price = price; t.days = days; }
  saveAllData();
  showToast('✅ تم تعديل نوع الاشتراك');
  closeModal();
};

window.deleteSubscriptionType = function(id) {
  if(!confirm('⚠️ هل أنت متأكد من حذف هذا النوع؟')) return;
  const idx = subscriptionTypes.findIndex(x => x.id === id);
  if(idx !== -1) subscriptionTypes.splice(idx, 1);
  saveAllData();
  showToast('🗑️ تم حذف النوع');
  closeModal();
};

// ===== دوال إدارة المناطق =====
window.addArea = function() {
  const name = document.getElementById('new_area_name')?.value?.trim();
  if(!name) { showToast('⚠️ أدخل اسم المنطقة'); return; }
  if(areas.includes(name)) { showToast('⚠️ المنطقة موجودة بالفعل'); return; }
  areas.push(name);
  saveAllData();
  showToast('✅ تم إضافة المنطقة: ' + name);
  closeModal();
};

window.saveArea = function(oldName) {
  const newName = document.getElementById('area_' + oldName)?.value?.trim();
  if(!newName) { showToast('⚠️ أدخل اسم المنطقة'); return; }
  const idx = areas.indexOf(oldName);
  if(idx !== -1) areas[idx] = newName;
  saveAllData();
  showToast('✅ تم تعديل المنطقة');
  closeModal();
};

window.deleteArea = function(name) {
  if(!confirm('⚠️ هل أنت متأكد من حذف المنطقة "' + name + '"؟')) return;
  const idx = areas.indexOf(name);
  if(idx !== -1) areas.splice(idx, 1);
  saveAllData();
  showToast('🗑️ تم حذف المنطقة');
  closeModal();
};

// ===== دوال إدارة قوالب الواتساب =====
window.addTemplate = function() {
  const title = document.getElementById('new_tpl_title')?.value?.trim();
  const msg = document.getElementById('new_tpl_msg')?.value?.trim();
  if(!title || !msg) { showToast('⚠️ املأ جميع الحقول'); return; }
  const maxId = waTemplates.reduce((m, t) => Math.max(m, t.id), 0);
  waTemplates.push({ id: maxId + 1, title, msg, icon: 'fa-edit' });
  saveAllData();
  showToast('✅ تم إضافة القالب');
  closeModal();
};

window.saveTemplate = function(id) {
  const title = document.getElementById('tpl_title_' + id)?.value?.trim();
  const msg = document.getElementById('tpl_msg_' + id)?.value?.trim();
  if(!title || !msg) { showToast('⚠️ املأ جميع الحقول'); return; }
  const t = waTemplates.find(x => x.id === id);
  if(t) { t.title = title; t.msg = msg; }
  saveAllData();
  showToast('✅ تم تعديل القالب');
  closeModal();
};

window.deleteTemplate = function(id) {
  if(!confirm('⚠️ هل أنت متأكد من حذف هذا القالب؟')) return;
  const idx = waTemplates.findIndex(x => x.id === id);
  if(idx !== -1) waTemplates.splice(idx, 1);
  saveAllData();
  showToast('🗑️ تم حذف القالب');
  closeModal();
};

// ===== دوال إدارة فئات المصروفات =====
window.addExpenseCategory = function() {
  const name = document.getElementById('new_cat_name')?.value?.trim();
  if(!name) { showToast('⚠️ أدخل اسم الفئة'); return; }
  const maxId = expenseCategories.reduce((m, c) => Math.max(m, c.id), 0);
  expenseCategories.push({ id: maxId + 1, name });
  saveAllData();
  showToast('✅ تم إضافة الفئة: ' + name);
  closeModal();
};

window.saveExpenseCategory = function(id) {
  const name = document.getElementById('cat_name_' + id)?.value?.trim();
  if(!name) { showToast('⚠️ أدخل اسم الفئة'); return; }
  const c = expenseCategories.find(x => x.id === id);
  if(c) c.name = name;
  saveAllData();
  showToast('✅ تم تعديل الفئة');
  closeModal();
};

window.deleteExpenseCategory = function(id) {
  if(!confirm('⚠️ هل أنت متأكد من حذف هذه الفئة؟')) return;
  const idx = expenseCategories.findIndex(x => x.id === id);
  if(idx !== -1) expenseCategories.splice(idx, 1);
  saveAllData();
  showToast('🗑️ تم حذف الفئة');
  closeModal();
};

// ===== دوال إدارة المستخدمين =====
window.openAddUser = function() {
  const permCheckbox = function(key, label) {
    return '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer"><input type="checkbox" id="perm_' + key.replace(/\./g, '_') + '" checked> ' + label + '</label>';
  };

  let permHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0">';
  permHtml += permCheckbox('subscribers.view', 'عرض المشتركين');
  permHtml += permCheckbox('subscribers.add', 'إضافة مشترك');
  permHtml += permCheckbox('subscribers.edit', 'تعديل مشترك');
  permHtml += permCheckbox('subscribers.del', 'حذف مشترك');
  permHtml += permCheckbox('subscribers.renew', 'تجديد');
  permHtml += permCheckbox('subscribers.settle', 'تسديد');
  permHtml += permCheckbox('finance.view', 'عرض الصندوق');
  permHtml += permCheckbox('finance.add', 'إضافة مالية');
  permHtml += permCheckbox('finance.edit', 'تعديل مالية');
  permHtml += permCheckbox('finance.del', 'حذف مالية');
  permHtml += permCheckbox('whatsapp', 'واتساب');
  permHtml += permCheckbox('reports', 'التقارير');
  permHtml += permCheckbox('archive', 'الأرشيف');
  permHtml += permCheckbox('notifications', 'الإشعارات');
  permHtml += permCheckbox('settings.view', 'الإعدادات');
  permHtml += permCheckbox('settings.manageUsers', 'إدارة المستخدمين');
  permHtml += '</div>';

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus" style="color:var(--success)"></i> إضافة مستخدم جديد';
  document.getElementById('modalBody').innerHTML =
    '<div class="form-wrap" style="padding:0">' +
    '<div class="form-group"><label>الاسم الكامل</label><input type="text" id="newUserName" placeholder="مثال: أحمد علي"></div>' +
    '<div class="form-group"><label>اسم المستخدم</label><input type="text" id="newUserUsername" placeholder="مثال: ahmed"></div>' +
    '<div class="form-group"><label>كلمة المرور</label><input type="text" id="newUserPassword" placeholder="********"></div>' +
    '<div style="font-size:13px;font-weight:700;color:var(--text2);margin-top:6px">الصلاحيات:</div>' +
    permHtml +
    '<div class="form-actions">' +
    '<button class="success" onclick="confirmAddUser()">إضافة</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
  openModal();
};

window.confirmAddUser = function() {
  const name = document.getElementById('newUserName')?.value?.trim();
  const username = document.getElementById('newUserUsername')?.value?.trim();
  const password = document.getElementById('newUserPassword')?.value?.trim();
  if(!name || !username || !password) { showToast('⚠️ املأ جميع الحقول'); return; }
  if(users.find(u => u.username === username)) { showToast('⚠️ اسم المستخدم موجود مسبقاً'); return; }

  const getPerm = function(key) {
    const el = document.getElementById('perm_' + key.replace(/\./g, '_'));
    return el ? el.checked : false;
  };

  const maxId = users.reduce((m, u) => Math.max(m, u.id), 0);
  users.push({
    id: maxId + 1, name, username, password, lastLogin: null,
    permissions: {
      dashboard: true,
      subscribers: { view: getPerm('subscribers.view'), add: getPerm('subscribers.add'), edit: getPerm('subscribers.edit'), del: getPerm('subscribers.del'), renew: getPerm('subscribers.renew'), settle: getPerm('subscribers.settle') },
      finance: { view: getPerm('finance.view'), add: getPerm('finance.add'), edit: getPerm('finance.edit'), del: getPerm('finance.del') },
      whatsapp: getPerm('whatsapp'), reports: getPerm('reports'), archive: getPerm('archive'), notifications: getPerm('notifications'),
      settings: { view: getPerm('settings.view'), manageUsers: getPerm('settings.manageUsers'), manageTypes: false, manageAreas: false, manageTowers: false, manageTemplates: false, manageAlerts: false }
    }
  });
  saveAllData();
  closeModal();
  showToast('✅ تم إضافة المستخدم: ' + name);
};

window.openEditUser = function(userId) {
  const u = users.find(x => x.id === userId);
  if (!u) return;

  const permCheckbox = function(key, label) {
    const parts = key.split('.');
    let obj = u.permissions;
    for (let i = 0; i < parts.length; i++) {
      if (obj === undefined || obj === null) break;
      obj = obj[parts[i]];
    }
    const checked = obj === true ? 'checked' : '';
    return '<label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer"><input type="checkbox" id="perm_' + key.replace(/\./g, '_') + '" ' + checked + '> ' + label + '</label>';
  };

  let permHtml = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:10px 0">';
  permHtml += permCheckbox('subscribers.view', 'عرض المشتركين');
  permHtml += permCheckbox('subscribers.add', 'إضافة مشترك');
  permHtml += permCheckbox('subscribers.edit', 'تعديل مشترك');
  permHtml += permCheckbox('subscribers.del', 'حذف مشترك');
  permHtml += permCheckbox('subscribers.renew', 'تجديد');
  permHtml += permCheckbox('subscribers.settle', 'تسديد');
  permHtml += permCheckbox('finance.view', 'عرض الصندوق');
  permHtml += permCheckbox('finance.add', 'إضافة مالية');
  permHtml += permCheckbox('finance.edit', 'تعديل مالية');
  permHtml += permCheckbox('finance.del', 'حذف مالية');
  permHtml += permCheckbox('whatsapp', 'واتساب');
  permHtml += permCheckbox('reports', 'التقارير');
  permHtml += permCheckbox('archive', 'الأرشيف');
  permHtml += permCheckbox('notifications', 'الإشعارات');
  permHtml += permCheckbox('settings.view', 'الإعدادات');
  permHtml += permCheckbox('settings.manageUsers', 'إدارة المستخدمين');
  permHtml += '</div>';

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-edit" style="color:var(--primary)"></i> تعديل مستخدم: ' + u.name;
  document.getElementById('modalBody').innerHTML =
    '<div class="form-wrap" style="padding:0">' +
    '<div class="form-group"><label>الاسم الكامل</label><input type="text" id="editUserName" value="' + u.name + '"></div>' +
    '<div class="form-group"><label>اسم المستخدم</label><input type="text" id="editUserUsername" value="' + u.username + '"></div>' +
    '<div class="form-group"><label>كلمة المرور <span style="color:var(--text3);font-weight:400">(اترك فارغاً إن لم ترد التغيير)</span></label><input type="text" id="editUserPassword" placeholder="******"></div>' +
    '<div style="font-size:13px;font-weight:700;color:var(--text2);margin-top:6px">الصلاحيات:</div>' +
    permHtml +
    '<div class="form-actions">' +
    (userId !== 1 ? '<button class="danger" onclick="confirmDeleteUser(' + userId + ')" style="flex:0.5"><i class="fas fa-trash"></i> حذف</button>' : '') +
    '<button class="success" onclick="confirmEditUser(' + userId + ')">حفظ</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';
  openModal();
};

window.confirmEditUser = function(userId) {
  const u = users.find(x => x.id === userId);
  if (!u) return;
  const name = document.getElementById('editUserName')?.value?.trim();
  const username = document.getElementById('editUserUsername')?.value?.trim();
  if(!name || !username) { showToast('⚠️ املأ الاسم واسم المستخدم'); return; }

  const existing = users.find(x => x.username === username && x.id !== userId);
  if(existing) { showToast('⚠️ اسم المستخدم موجود مسبقاً'); return; }

  const password = document.getElementById('editUserPassword')?.value?.trim();
  if(password) u.password = password;

  u.name = name;
  u.username = username;

  const getPerm = function(key) {
    const el = document.getElementById('perm_' + key.replace(/\./g, '_'));
    return el ? el.checked : false;
  };

  u.permissions = {
    dashboard: true,
    subscribers: { view: getPerm('subscribers.view'), add: getPerm('subscribers.add'), edit: getPerm('subscribers.edit'), del: getPerm('subscribers.del'), renew: getPerm('subscribers.renew'), settle: getPerm('subscribers.settle') },
    finance: { view: getPerm('finance.view'), add: getPerm('finance.add'), edit: getPerm('finance.edit'), del: getPerm('finance.del') },
    whatsapp: getPerm('whatsapp'), reports: getPerm('reports'), archive: getPerm('archive'), notifications: getPerm('notifications'),
    settings: { view: getPerm('settings.view'), manageUsers: getPerm('settings.manageUsers'), manageTypes: false, manageAreas: false, manageTowers: false, manageTemplates: false, manageAlerts: false }
  };

  saveAllData();
  closeModal();
  showToast('✅ تم تعديل المستخدم: ' + name);
};

window.confirmDeleteUser = function(userId) {
  if(userId === 1) { showToast('⚠️ لا يمكن حذف المدير العام'); return; }
  if(!confirm('⚠️ هل أنت متأكد من حذف هذا المستخدم؟')) return;
  const idx = users.findIndex(x => x.id === userId);
  if(idx !== -1) users.splice(idx, 1);
  saveAllData();
  closeModal();
  showToast('🗑️ تم حذف المستخدم');
};

// ===== إعادة رسم مودال الأبراج (حتى تظهر النقاط الجديدة فوراً) =====
window.renderTowersModal = function() {
  let html = '<div class="form-wrap" style="padding:0"><div style="font-size:12px;color:var(--text3);margin-bottom:8px">إدارة الأبراج والنقاط التابعة لكل برج</div>';
  towers.forEach(t => {
    html += '<div style="padding:10px 0;border-bottom:1px solid var(--glass-border)">' +
      '<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">' +
      '<i class="fas fa-broadcast-tower" style="color:var(--success);font-size:16px"></i>' +
      '<input type="text" id="tower_name_' + t.id + '" value="' + t.name + '" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
      '<button onclick="saveTower(' + t.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--success);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-check"></i></button>' +
      '<button onclick="deleteTower(' + t.id + ')" style="padding:6px 10px;border-radius:8px;border:none;background:var(--danger);color:#fff;cursor:pointer;font-size:12px"><i class="fas fa-trash"></i></button>' +
      '</div>' +
      '<div style="margin-right:24px">';
    t.points.forEach((p, pi) => {
      html += '<div style="display:flex;gap:4px;align-items:center;margin-bottom:4px">' +
        '<i class="fas fa-map-pin" style="color:var(--primary);font-size:11px"></i>' +
        '<span style="flex:1;font-size:12px;color:var(--text2);padding:4px 8px;background:var(--bg2);border-radius:6px">' + p + '</span>' +
        '<button onclick="deleteTowerPoint(' + t.id + ',' + pi + ')" style="padding:3px 8px;border-radius:6px;border:none;background:var(--danger);color:#fff;cursor:pointer;font-size:10px"><i class="fas fa-times"></i></button></div>';
    });
    html += '<div style="display:flex;gap:4px;align-items:center;margin-top:4px">' +
      '<input type="text" id="new_point_' + t.id + '" placeholder="نقطة جديدة" style="flex:1;padding:5px 8px;border-radius:6px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:12px;font-family:Tajawal,sans-serif">' +
      '<button onclick="addTowerPoint(' + t.id + ')" style="padding:5px 10px;border-radius:6px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-size:11px"><i class="fas fa-plus"></i></button></div>' +
      '</div></div>';
  });
  html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--glass-border)">' +
    '<input type="text" id="new_tower_name" placeholder="اسم البرج الجديد" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);font-size:13px;font-family:Tajawal,sans-serif">' +
    '<button onclick="addTower()" style="margin-top:6px;padding:8px 14px;border-radius:8px;border:none;background:var(--primary);color:#fff;cursor:pointer;font-size:13px"><i class="fas fa-plus"></i> إضافة برج</button></div>';
  html += '</div>';
  document.getElementById('modalBody').innerHTML = html;
};

// ===== دوال إدارة الأبراج =====
window.addTower = function() {
  const name = document.getElementById('new_tower_name')?.value?.trim();
  if(!name) { showToast('⚠️ أدخل اسم البرج'); return; }
  const maxId = towers.reduce((m, t) => Math.max(m, t.id), 0);
  towers.push({ id: maxId + 1, name, points: [] });
  saveAllData();
  showToast('✅ تم إضافة البرج: ' + name);
  window.renderTowersModal();
};

window.saveTower = function(id) {
  const name = document.getElementById('tower_name_' + id)?.value?.trim();
  if(!name) { showToast('⚠️ أدخل اسم البرج'); return; }
  const t = towers.find(x => x.id === id);
  if(t) t.name = name;
  saveAllData();
  showToast('✅ تم تعديل البرج');
  window.renderTowersModal();
};

window.deleteTower = function(id) {
  if(!confirm('⚠️ هل أنت متأكد من حذف هذا البرج؟')) return;
  const idx = towers.findIndex(x => x.id === id);
  if(idx !== -1) towers.splice(idx, 1);
  saveAllData();
  showToast('🗑️ تم حذف البرج');
  window.renderTowersModal();
};

// ===== دوال إدارة النقاط =====
window.addTowerPoint = function(towerId) {
  const name = document.getElementById('new_point_' + towerId)?.value?.trim();
  if(!name) { showToast('⚠️ أدخل اسم النقطة'); return; }
  const t = towers.find(x => x.id === towerId);
  if(t) t.points.push(name);
  saveAllData();
  showToast('✅ تم إضافة النقطة');
  window.renderTowersModal();
};

window.deleteTowerPoint = function(towerId, idx) {
  if(!confirm('⚠️ هل أنت متأكد من حذف هذه النقطة؟')) return;
  const t = towers.find(x => x.id === towerId);
  if(t) t.points.splice(idx, 1);
  saveAllData();
  showToast('🗑️ تم حذف النقطة');
  window.renderTowersModal();
};

// ===== دوال التجديد (Renewal) =====
window.openRenewModal = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  if (s.status === 'active') {
    const daysLeft = daysBetween(new Date(s.end), new Date());
    if (daysLeft > 0) {
      showToast('⚠️ لا يمكن التجديد، الاشتراك لا يزال ساري المفعول (' + daysLeft + ' يوم متبقي)');
      return;
    }
  }

  const unpaidAmount = !s.paid ? s.amount : 0;
  const totalDebt = calcTotalDebt(s);
  const isExpired = s.status === 'expired';
  const hasDebt = totalDebt > 0;

  let html = '<div class="form-wrap" style="padding:0">';

  if (hasDebt && isExpired) {
    var debtRows = '';
    if (s.debtHistory) {
      s.debtHistory.forEach(function(d) {
        if (d.remaining <= 0) return;
        debtRows += '<div class="debt-grid-item"><span class="dgi-label">' + d.date + '</span><span class="dgi-value warn">' + formatMoney(d.remaining) + '</span></div>';
      });
    }
    html += '<div class="debt-box">' +
      '<div class="debt-box-title"><i class="fas fa-exclamation-triangle"></i> ⚠️ عليه دين سابق</div>' +
      '<div class="debt-grid">' +
      (unpaidAmount > 0 ? '<div class="debt-grid-item"><span class="dgi-label">غير مدفوعة (الحالية)</span><span class="dgi-value warn">' + formatMoney(unpaidAmount) + '</span></div>' : '') +
      debtRows +
      '<div class="debt-grid-item total"><span class="dgi-label">الإجمالي</span><span class="dgi-value" id="dgiTotal">' + formatMoney(totalDebt) + '</span></div>' +
      '</div></div>';
  }

  const typeOpts = subscriptionTypes.filter(t => t.name !== 'مجاني').map(t =>
    '<option value="' + t.id + '" ' + (t.name === s.type ? 'selected' : '') + '>' + t.name + ' - ' + formatMoney(t.price) + '</option>'
  ).join('');

  html += '<div class="form-group"><label><i class="fas fa-tag"></i> نوع الباقة</label>' +
    '<select id="renewType" onchange="renewOnTypeChange(' + subId + ')">' + typeOpts + '</select></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label><i class="fas fa-dollar-sign"></i> المبلغ</label>' +
    '<input type="text" id="renewAmount" readonly style="color:var(--primary);font-weight:800;font-size:15px;cursor:default"></div>' +
    '<div class="form-group"><label><i class="fas fa-calendar"></i> تاريخ التفعيل</label>' +
    '<input type="date" id="renewStart" value="' + todayStr() + '" onchange="renewOnTypeChange(' + subId + ')"></div></div>' +
    '<div class="form-row">' +
    '<div class="form-group"><label><i class="fas fa-calendar-check"></i> ينتهي في</label>' +
    '<input type="date" id="renewEnd" readonly style="color:var(--primary);font-weight:800;cursor:default"></div></div>' +
    '<div class="form-group"><label><i class="fas fa-money-bill-wave"></i> حالة الدفع</label>' +
    '<div style="display:flex;gap:8px">' +
    '<button type="button" class="as-paid-btn active" id="renewPaidBtn" onclick="window._renewPaid=true;document.getElementById(\'renewPaidBtn\').classList.add(\'active\');document.getElementById(\'renewDebtBtn\').classList.remove(\'active\');renewOnTypeChange(' + subId + ')"><i class="fas fa-check-circle"></i> مدفوع</button>' +
    '<button type="button" class="as-paid-btn" id="renewDebtBtn" onclick="window._renewPaid=false;document.getElementById(\'renewDebtBtn\').classList.add(\'active\');document.getElementById(\'renewPaidBtn\').classList.remove(\'active\');renewOnTypeChange(' + subId + ')"><i class="fas fa-clock"></i> آجل</button></div></div>' +
    '<div class="form-group"><label><i class="fas fa-sticky-note"></i> ملاحظات</label>' +
    '<textarea id="renewNotes" placeholder="ملاحظات التجديد..." style="min-height:50px"></textarea></div>' +
    '<div class="renew-summary" id="renewSummary"></div>' +
    '<div class="form-actions" style="margin-top:10px">' +
    '<button class="success" onclick="confirmRenewal(' + subId + ')"><i class="fas fa-check"></i> تأكيد التجديد</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-sync" style="color:var(--success)"></i> تجديد اشتراك ' + s.name;
  document.getElementById('modalBody').innerHTML = html;

  window._renewPaid = true;
  renewOnTypeChange(subId);
  openModal();
};

window.renewOnTypeChange = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;
  const sel = document.getElementById('renewType');
  const tpl = subscriptionTypes.find(t => t.id === parseInt(sel.value));
  if (!tpl) return;

  document.getElementById('renewAmount').value = formatMoney(tpl.price);

  const start = document.getElementById('renewStart').value || todayStr();
  const end = calcEndFromType(tpl.name, start);
  document.getElementById('renewEnd').value = end.toISOString().split('T')[0];

  updateRenewSummary(s, tpl);
};

window.updateRenewSummary = function(s, tpl) {
  if (!s || !tpl) return;
  const unpaidAmount = !s.paid ? s.amount : 0;
  const totalDebt = calcTotalDebt(s);
  const start = document.getElementById('renewStart').value || todayStr();
  const end = document.getElementById('renewEnd').value;

  let summary = '<div class="pay-summary">';
  summary += '<div class="ps-row"><span>الباقة</span><span>' + tpl.name + '</span></div>';
  summary += '<div class="ps-row"><span>المبلغ</span><span class="ps-green">' + formatMoney(tpl.price) + '</span></div>';
  summary += '<div class="ps-row"><span>من</span><span>' + start + '</span></div>';
  summary += '<div class="ps-row"><span>إلى</span><span>' + end + '</span></div>';
  summary += '<div class="ps-divider"></div>';
  summary += '<div class="ps-row"><span>حالة الدفع</span><span>' + (window._renewPaid !== false ? 'مدفوع' : 'آجل') + '</span></div>';
  if (totalDebt > 0) {
    summary += '<div class="ps-divider"></div>';
    if (unpaidAmount > 0) {
      summary += '<div class="ps-row"><span>غير مدفوعة (الحالية)</span><span class="ps-red">' + formatMoney(unpaidAmount) + '</span></div>';
    }
    if (s.prevDebt > 0) {
      summary += '<div class="ps-row"><span>الدين السابق</span><span class="ps-red">' + formatMoney(s.prevDebt) + '</span></div>';
    }
    summary += '<div class="ps-row" style="margin-top:4px;font-size:11px">';
    if (window._renewPaid !== false) {
      if ((s.debtHistory || []).some(function(d) { return d.remaining > 0; })) {
        summary += '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> الاشتراك الجديد مدفوع - الديون السابقة باقية</span>';
      } else {
        summary += '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> مدفوع</span>';
      }
    } else {
      summary += '<span style="color:var(--warning)"><i class="fas fa-arrow-left"></i> يبقى الدين السابق ويضاف الجديد كدين</span>';
    }
    summary += '</div>';
  }
  summary += '</div>';

  const el = document.getElementById('renewSummary');
  if (el) el.innerHTML = summary;
};

window.confirmRenewal = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  const tplId = parseInt(document.getElementById('renewType').value);
  const tpl = subscriptionTypes.find(t => t.id === tplId);
  if (!tpl || tpl.name === 'مجاني') { showToast('⚠️ الرجاء اختيار باقة صالحة'); return; }

  const start = document.getElementById('renewStart').value;
  if (!start) { showToast('⚠️ الرجاء تحديد تاريخ التفعيل'); return; }
  const end = document.getElementById('renewEnd').value;
  const notes = document.getElementById('renewNotes').value.trim();

  s.type = tpl.name;
  s.amount = tpl.price;
  s.start = start;
  s.end = end;
  s.status = 'active';
  s.notes = notes;

  if (window._renewPaid !== false) {
    finRecords.unshift({ id: finId++, date: todayStr(), desc: 'تجديد اشتراك - ' + s.name + ' (' + tpl.name + ')', amount: tpl.price, type: 'income', subId: s.id, area: s.area, tower: s.tower || '', point: s.point || '' });
    s.paid = true;
    showToast('✅ تم تجديد اشتراك ' + s.name + ' (مدفوع)');
  } else {
    // آجل: إضافة دين جديد للسجل + بقاء الديون القديمة
    if (!s.debtHistory) s.debtHistory = [];
    s.debtHistory.push({
      id: nextDebtId++,
      amount: tpl.price,
      remaining: tpl.price,
      date: todayStr(),
      note: 'إضافة من تجديد (' + tpl.name + ')',
      payments: []
    });
    s.paid = false;
    recalcPrevDebt(s);
    showToast('✅ تم تجديد اشتراك ' + s.name + ' (آجل - أضيف دين جديد)');
  }

  saveAllData();
  closeModal();
};

// ===== دوال إعادة التفعيل (Reactivate) =====
window.reactOnTypeChange = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;
  const sel = document.getElementById('reactType');
  const tpl = subscriptionTypes.find(t => t.id === parseInt(sel.value));
  if (!tpl) return;
  const start = document.getElementById('reactStart').value || todayStr();
  const end = calcEndFromType(tpl.name, start);
  document.getElementById('reactEnd').value = end.toISOString().split('T')[0];
};

window.confirmReactivate = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;
  const sel = document.getElementById('reactType');
  const tpl = subscriptionTypes.find(t => t.id === parseInt(sel.value));
  if (!tpl) { showToast('⚠️ الرجاء اختيار باقة'); return; }
  const start = document.getElementById('reactStart').value;
  if (!start) { showToast('⚠️ الرجاء تحديد تاريخ التفعيل'); return; }
  const end = document.getElementById('reactEnd').value;
  s.type = tpl.name;
  s.amount = tpl.price;
  s.start = start;
  s.end = end;
  s.status = 'active';
  s.paid = window._reactPaid !== false;
  saveAllData();
  closeModal();
  showToast('✅ تم إعادة تفعيل ' + s.name);
};

// ===== دوال التفعيل المجاني (Free Activation) =====
window.openFreeModal = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  let historyHtml = '';
  if (s.freeDates && s.freeDates.length > 0) {
    historyHtml = '<div style="margin:10px 0;padding:10px;background:var(--bg2);border-radius:10px">' +
      '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px"><i class="fas fa-history"></i> سجل التفعيلات المجانية:</div>';
    s.freeDates.forEach(d => {
      historyHtml += '<div style="font-size:11px;color:var(--text3);padding:3px 0;display:flex;align-items:center;gap:4px">' +
        '<i class="fas fa-calendar-day" style="color:var(--warning);font-size:9px"></i> ' + d + '</div>';
    });
    historyHtml += '<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--glass-border);font-size:12px;font-weight:700;color:var(--warning)">' +
      'الإجمالي: ' + (s.freeCount || 0) + ' يوم</div></div>';
  } else {
    historyHtml = '<div style="font-size:12px;color:var(--text3);text-align:center;padding:10px">لا توجد تفعيلات مجانية سابقة</div>';
  }

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-gift" style="color:var(--warning)"></i> تفعيل مجاني - ' + s.name;
  document.getElementById('modalBody').innerHTML =
    '<div class="form-wrap" style="padding:0">' +
    '<div style="font-size:13px;color:var(--text2);margin-bottom:8px;padding:10px 14px;background:var(--bg2);border-radius:10px">' +
    '<i class="fas fa-info-circle" style="color:var(--warning)"></i> أدخل عدد الأيام المجانية للتفعيل.</div>' +
    '<div class="free-day-input">' +
    '<label>عدد الأيام:</label>' +
    '<input type="number" id="freeDaysInput" value="1" min="1" max="365">' +
    '</div>' +
    historyHtml +
    '<div class="form-actions" style="margin-top:14px">' +
    '<button class="success" onclick="confirmFreeActivation(' + subId + ')"><i class="fas fa-gift"></i> تفعيل</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';

  openModal();
};

window.confirmFreeActivation = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  const days = parseInt(document.getElementById('freeDaysInput').value);
  if (!days || days < 1) { showToast('⚠️ أدخل عدد الأيام'); return; }

  s.type = 'مجاني';
  s.amount = 0;
  s.start = todayStr();
  const d = new Date();
  d.setDate(d.getDate() + days);
  s.end = d.toISOString().split('T')[0];
  s.status = 'active';
  s.paid = true;
  s.freeCount = (s.freeCount || 0) + 1;
  if (!s.freeDates) s.freeDates = [];
  s.freeDates.push(todayStr() + ' (' + days + ' يوم)');

  saveAllData();
  closeModal();
  showToast('🎁 تم تفعيل ' + days + ' يوم مجاني لـ ' + s.name);
};

// ===== دوال مساعدة لمودال التسديد الجديد =====
window.updateSettleTotal = function() {
  const checkboxes = document.querySelectorAll('.debt-checkbox:checked');
  let total = 0;
  checkboxes.forEach(function(cb) { total += parseInt(cb.dataset.amount) || 0; });
  var el = document.getElementById('settleTotalDisplay');
  if (el) el.innerHTML = 'الإجمالي المحدد: ' + formatMoney(total);
  var amt = document.getElementById('settleAmount');
  if (amt) amt.value = total;
};

window.updateSettleChecks = function() {
  var amt = parseInt(document.getElementById('settleAmount').value);
  if (!amt || amt <= 0) return;
  var checkboxes = document.querySelectorAll('.debt-checkbox');
  checkboxes.forEach(function(cb) { cb.checked = false; });
  var remaining = amt;
  // ابدأ من آخر checkbox (الاشتراك الحالي أو آخر دين) → الأحدث أولاً
  for (var i = checkboxes.length - 1; i >= 0; i--) {
    if (remaining <= 0) break;
    var dAmt = parseInt(checkboxes[i].dataset.amount);
    if (dAmt <= remaining) {
      checkboxes[i].checked = true;
      remaining -= dAmt;
    }
  }
  window.updateSettleTotal();
};

// ===== مودال تسديد المستحقات (Settle) =====
window.openSettleModal = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  const debtInHistory = (s.debtHistory || []).some(function(d) { return d.remaining > 0; });
  const unpaidAmount = (!s.paid) ? (s.amount || 0) : 0;
  const totalDebt = calcTotalDebt(s);

  if (totalDebt <= 0) {
    showToast('⚠️ لا يوجد ديون مستحقة');
    return;
  }

  var html = '<div class="form-wrap" style="padding:0">';

  // قائمة الديون الفردية - كل دين مع checkbox
  if ((s.debtHistory || []).filter(function(d) { return d.remaining > 0; }).length > 0 || unpaidAmount > 0) {
    html += '<div style="margin-bottom:12px">';
    html += '<div style="font-size:13px;font-weight:700;color:var(--text2);margin-bottom:8px;display:flex;align-items:center;gap:6px">' +
      '<i class="fas fa-list"></i> اختر الديون التي تريد تسديدها:</div>';

    // ديون debtHistory
    if (s.debtHistory) {
      s.debtHistory.forEach(function(d, i) {
        if (d.remaining <= 0) return;
        html += '<div class="settle-debt-item">' +
          '<label class="settle-debt-check">' +
          '<input type="checkbox" class="debt-checkbox" data-index="' + i + '" data-amount="' + d.remaining + '" onchange="updateSettleTotal()">' +
          '<div class="settle-debt-info">' +
          '<div class="settle-debt-note"><i class="fas fa-circle" style="font-size:6px;color:var(--danger);margin-left:4px"></i> ' + (d.note || 'دين') + '</div>' +
          '<div class="settle-debt-meta">' + d.date + (d.payments && d.payments.length ? ' · ' + d.payments.length + ' دفعات' : '') + '</div>' +
          '</div>' +
          '<div class="settle-debt-amount">' + formatMoney(d.remaining) + '</div>' +
          '</label>' +
          '</div>';
      });
    }

    // الاشتراك الحالي غير المدفوع
    if (unpaidAmount > 0) {
      html += '<div class="settle-debt-item" style="border-color:var(--warning)">' +
        '<label class="settle-debt-check">' +
        '<input type="checkbox" class="debt-checkbox" data-index="current" data-amount="' + unpaidAmount + '" onchange="updateSettleTotal()">' +
        '<div class="settle-debt-info">' +
        '<div class="settle-debt-note" style="color:var(--warning)"><i class="fas fa-clock" style="margin-left:4px"></i> الاشتراك الحالي (غير مدفوع)</div>' +
        '<div class="settle-debt-meta">' + s.type + ' · ' + s.start + ' → ' + s.end + '</div>' +
        '</div>' +
        '<div class="settle-debt-amount warn">' + formatMoney(unpaidAmount) + '</div>' +
        '</label>' +
        '</div>';
    }

    html += '</div>';
  }

  // Custom amount
  html += '<div class="settle-custom-row">' +
    '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px;display:flex;align-items:center;gap:6px">' +
    '<i class="fas fa-dollar-sign" style="color:var(--success);font-size:14px"></i> أو أدخل مبلغاً مخصصاً:</div>' +
    '<div style="display:flex;gap:8px">' +
    '<input type="number" id="settleAmount" value="0" min="0" max="' + totalDebt + '" placeholder="أدخل المبلغ..." style="flex:1;font-size:16px;font-weight:800;padding:12px 16px;border-radius:12px;border:1px solid var(--glass-border);background:var(--card);color:var(--text);outline:none;font-family:Tajawal,sans-serif" onchange="updateSettleChecks()" oninput="updateSettleChecks()">' +
    '<button type="button" class="as-paid-btn" onclick="document.getElementById(\'settleAmount\').value=' + totalDebt + ';updateSettleChecks()" style="flex:0;padding:12px 24px;white-space:nowrap"><i class="fas fa-check-double"></i> الكل</button>' +
    '</div>' +
    '<div class="settle-total" id="settleTotalDisplay">الإجمالي المحدد: ' + formatMoney(0) + '</div>' +
    '</div>';

  // Notes
  html += '<div class="form-group" style="margin-top:8px"><label><i class="fas fa-sticky-note"></i> ملاحظات <span style="color:var(--text3);font-weight:400">(اختياري)</span></label>' +
    '<textarea id="settleNotes" placeholder="ملاحظات عملية الدفع..." style="min-height:50px"></textarea></div>' +
    '<div class="form-actions" style="margin-top:10px">' +
    '<button class="success" onclick="confirmSettle(' + subId + ')"><i class="fas fa-check"></i> تأكيد التسديد</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-hand-holding-usd" style="color:var(--success)"></i> تسديد المستحقات - ' + s.name;
  document.getElementById('modalBody').innerHTML = html;
  openModal();
};

window.confirmSettle = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  const amount = parseInt(document.getElementById('settleAmount').value);
  if (!amount || amount <= 0) { showToast('⚠️ الرجاء إدخال مبلغ صحيح'); return; }

  const totalDebt = calcTotalDebt(s);
  if (amount > totalDebt) { showToast('⚠️ المبلغ أكبر من إجمالي الدين (' + formatMoney(totalDebt) + ')'); return; }

  const notes = document.getElementById('settleNotes').value.trim();

  // قراءة الديون المحددة من checkboxes
  var checkboxes = document.querySelectorAll('.debt-checkbox:checked');
  var checkedDebts = [];
  checkboxes.forEach(function(cb) {
    var idx = cb.dataset.index;
    checkedDebts.push({
      type: idx === 'current' ? 'current' : 'history',
      index: idx === 'current' ? -1 : parseInt(idx),
      amount: parseInt(cb.dataset.amount)
    });
  });

  var remaining = amount;

  if (checkedDebts.length > 0) {
    // فقط الديون المحددة
    var checkedTotal = checkedDebts.reduce(function(a, d) { return a + d.amount; }, 0);
    if (amount > checkedTotal) {
      showToast('⚠️ المبلغ المدخل (' + formatMoney(amount) + ') أكبر من الديون المحددة (' + formatMoney(checkedTotal) + ')');
      return;
    }
    for (var di = 0; di < checkedDebts.length; di++) {
      if (remaining <= 0) break;
      var d = checkedDebts[di];
      if (d.type === 'current') {
        var payCur = Math.min(remaining, d.amount);
        if (payCur >= s.amount) s.paid = true;
        remaining -= payCur;
      } else {
        var debt = s.debtHistory[d.index];
        if (!debt) continue;
        var payDebt = Math.min(remaining, debt.remaining);
        debt.remaining -= payDebt;
        if (!debt.payments) debt.payments = [];
        debt.payments.push({ amount: payDebt, date: todayStr() });
        remaining -= payDebt;
      }
    }
  } else {
    // لا يوجد تحديد → ادفع الاشتراك الحالي أولاً (الأحدث)، ثم الديون القديمة
    if (remaining > 0 && !s.paid) {
      var payCur = Math.min(remaining, s.amount);
      if (payCur >= s.amount) s.paid = true;
      remaining -= payCur;
    }
    if (remaining > 0 && s.debtHistory) {
      for (var hi = 0; hi < s.debtHistory.length; hi++) {
        if (remaining <= 0) break;
        var dh = s.debtHistory[hi];
        if (dh.remaining <= 0) continue;
        var pay = Math.min(remaining, dh.remaining);
        dh.remaining -= pay;
        if (!dh.payments) dh.payments = [];
        dh.payments.push({ amount: pay, date: todayStr() });
        remaining -= pay;
      }
    }
  }

  // تحديث prevDebt
  recalcPrevDebt(s);

  // إزالة الديون التي أصبحت بصفر
  s.debtHistory = (s.debtHistory || []).filter(function(d) { return d.remaining > 0; });

  // تسجيل في الصندوق
  finRecords.unshift({
    id: finId++,
    date: todayStr(),
    desc: 'تسديد مستحقات - ' + s.name + (notes ? ' (' + notes + ')' : ''),
    amount: amount,
    type: 'income',
    subId: s.id,
    area: s.area,
    tower: s.tower || '',
    point: s.point || ''
  });

  saveAllData();
  closeModal();
  showToast('✅ تم تسديد مبلغ ' + formatMoney(amount) + ' من مستحقات ' + s.name);
};

// ===== مودال تعديل سريع لكل شيء =====
window.openQuickEditModal = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  const statusMap = { active: 'فعال', expired: 'منتهي', disabled: 'معطل', inactive: 'غير مفعل' };
  const areaOpts = areas.map(a => '<option value="' + a + '" ' + (s.area === a ? 'selected' : '') + '>' + a + '</option>').join('');
  const towerOpts = towers.map(t => '<option value="' + t.name + '" ' + (s.tower === t.name ? 'selected' : '') + '>' + t.name + '</option>').join('');
  const typeOpts = subscriptionTypes.filter(t => t.name !== 'مجاني').map(t =>
    '<option value="' + t.id + '" ' + (t.name === s.type ? 'selected' : '') + '>' + t.name + ' - ' + formatMoney(t.price) + '</option>'
  ).join('');
  const statusOpts = Object.entries(statusMap).map(([k, v]) =>
    '<option value="' + k + '" ' + (s.status === k ? 'selected' : '') + '>' + v + '</option>'
  ).join('');

  const html =
    '<div class="form-wrap" style="padding:0">' +

    // Row 1: name + phone
    '<div class="form-row">' +
    '<div class="form-group"><label><i class="fas fa-user"></i> الاسم</label><input type="text" id="eq_name" value="' + s.name + '"></div>' +
    '<div class="form-group"><label><i class="fas fa-phone"></i> الهاتف</label><input type="text" id="eq_phone" value="' + s.phone + '" maxlength="11"></div></div>' +

    // Row 2: ssid + pass + ip
    '<div class="form-row">' +
    '<div class="form-group"><label><i class="fas fa-wifi"></i> SSID</label><input type="text" id="eq_ssid" value="' + (s.ssid||'') + '"></div>' +
    '<div class="form-group"><label><i class="fas fa-key"></i> كلمة المرور</label><input type="text" id="eq_pass" value="' + (s.pass||'') + '"></div></div>' +
    '<div class="form-group"><label><i class="fas fa-network-wired"></i> IP الراوتر <span style="color:var(--text3);font-weight:400">(اختياري)</span></label><input type="text" id="eq_ip" value="' + (s.ip||'') + '" dir="ltr"></div>' +

    // Row 3: area + tower
    '<div class="form-row">' +
    '<div class="form-group"><label><i class="fas fa-map-marker-alt"></i> المنطقة</label><select id="eq_area">' + areaOpts + '</select></div>' +
    '<div class="form-group"><label><i class="fas fa-broadcast-tower"></i> البرج</label><select id="eq_tower" onchange="window._editUpdatePoints(' + subId + ')">' + towerOpts + '</select></div></div>' +

    // Row 4: point
    '<div class="form-group"><label><i class="fas fa-map-pin"></i> النقطة</label><select id="eq_point">' +
    '<option value="">بدون نقطة</option>' +
    (s.tower && towers.find(t => t.name === s.tower) ? towers.find(t => t.name === s.tower).points.map(p => '<option value="' + p + '" ' + (s.point === p ? 'selected' : '') + '>' + p + '</option>').join('') : '') +
    '</select></div>' +

    // Row 5: type + amount
    '<div class="form-row">' +
    '<div class="form-group"><label><i class="fas fa-tag"></i> الباقة</label><select id="eq_type" onchange="window._editTypeChange(' + subId + ')">' + typeOpts + '</select></div>' +
    '<div class="form-group"><label><i class="fas fa-dollar-sign"></i> المبلغ</label><input type="number" id="eq_amount" value="' + s.amount + '"></div></div>' +

    // Row 6: start + end
    '<div class="form-row">' +
    '<div class="form-group"><label><i class="fas fa-calendar-plus"></i> تاريخ التفعيل</label><input type="date" id="eq_start" value="' + s.start + '"></div>' +
    '<div class="form-group"><label><i class="fas fa-calendar-times"></i> تاريخ الانتهاء</label><input type="date" id="eq_end" value="' + s.end + '"></div></div>' +

    // Row 7: status
    '<div class="form-group"><label><i class="fas fa-flag"></i> حالة المشترك</label><select id="eq_status">' + statusOpts + '</select></div>' +

    // Paid/debt toggle
    '<div class="form-group"><label><i class="fas fa-money-bill-wave"></i> حالة الدفع</label>' +
    '<div style="display:flex;gap:8px">' +
    '<button type="button" class="as-paid-btn" id="eq_paid_btn" onclick="window._eqPaid=true;document.getElementById(\'eq_paid_btn\').classList.add(\'active\');document.getElementById(\'eq_debt_btn\').classList.remove(\'active\')" style="flex:1"><i class="fas fa-check-circle"></i> مدفوع</button>' +
    '<button type="button" class="as-paid-btn" id="eq_debt_btn" onclick="window._eqPaid=false;document.getElementById(\'eq_debt_btn\').classList.add(\'active\');document.getElementById(\'eq_paid_btn\').classList.remove(\'active\')" style="flex:1"><i class="fas fa-clock"></i> آجل</button></div></div>' +

    // Notes
    '<div class="form-group" style="margin-top:8px"><label><i class="fas fa-sticky-note"></i> ملاحظات</label>' +
    '<textarea id="eq_notes" style="min-height:40px">' + (s.notes||'') + '</textarea></div>' +

    // Actions
    '<div class="form-actions" style="margin-top:10px">' +
    '<button class="success" onclick="confirmQuickEdit(' + subId + ')"><i class="fas fa-check"></i> حفظ التعديلات</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit" style="color:var(--primary)"></i> تعديل بيانات ' + s.name;
  document.getElementById('modalBody').innerHTML = html;

  window._eqPaid = s.paid;
  const paidBtn = document.getElementById('eq_paid_btn');
  const debtBtn = document.getElementById('eq_debt_btn');
  if (paidBtn && debtBtn) {
    if (s.paid) { paidBtn.classList.add('active'); debtBtn.classList.remove('active'); }
    else { debtBtn.classList.add('active'); paidBtn.classList.remove('active'); }
  }

  openModal();

  // onchange for point updates
  window._editUpdatePoints = function(id) {
    const sel = document.getElementById('eq_tower');
    const pt = document.getElementById('eq_point');
    if (!sel || !pt) return;
    const tower = towers.find(t => t.name === sel.value);
    pt.innerHTML = '<option value="">بدون نقطة</option>' + (tower ? tower.points.map(p => '<option value="' + p + '">' + p + '</option>').join('') : '');
  };

  // onchange for type → auto update amount
  window._editTypeChange = function(id) {
    const sel = document.getElementById('eq_type');
    const amt = document.getElementById('eq_amount');
    if (!sel || !amt) return;
    const tpl = subscriptionTypes.find(t => t.id === parseInt(sel.value));
    if (tpl) amt.value = tpl.price;
  };

};

// تأكيد التعديل السريع
window.confirmQuickEdit = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  const name = document.getElementById('eq_name')?.value.trim();
  const phone = document.getElementById('eq_phone')?.value.trim();
  if (!name) { showToast('⚠️ الرجاء إدخال الاسم'); return; }
  if (!phone) { showToast('⚠️ الرجاء إدخال رقم الهاتف'); return; }

  s.name = name;
  s.phone = phone;
  s.ssid = document.getElementById('eq_ssid')?.value.trim() || s.ssid;
  s.pass = document.getElementById('eq_pass')?.value.trim() || s.pass;
  s.ip = document.getElementById('eq_ip')?.value.trim() || '';
  s.area = document.getElementById('eq_area')?.value || '';
  s.tower = document.getElementById('eq_tower')?.value || '';
  s.point = document.getElementById('eq_point')?.value || '';
  s.type = document.getElementById('eq_type')?.selectedOptions?.[0]?.text?.split(' - ')[0] || s.type;
  s.amount = parseInt(document.getElementById('eq_amount')?.value) || 0;
  s.start = document.getElementById('eq_start')?.value || s.start;
  s.end = document.getElementById('eq_end')?.value || s.end;
  s.status = document.getElementById('eq_status')?.value || 'active';
  s.notes = document.getElementById('eq_notes')?.value.trim() || '';
  if (window._eqPaid !== undefined) {
    s.paid = window._eqPaid;
  }

  saveAllData();
  closeModal();
  showToast('✅ تم تعديل بيانات ' + s.name);
};
