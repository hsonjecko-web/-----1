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

window.saveFinance = function(type) {
  const desc = document.getElementById('fDesc').value.trim();
  const amount = parseInt(document.getElementById('fAmount').value);
  if(!desc || !amount) { showToast('⚠️ املأ جميع الحقول'); return; }
  finRecords.unshift({
    id: finId++,
    date: todayStr(),
    desc: desc,
    amount: amount,
    type: type,
    category: type === 'expense' ? document.getElementById('fCategory')?.value : undefined
  });
  saveAllData();
  closeModal();
  showToast('✅ تمت الإضافة');
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
