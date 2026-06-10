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
  const amount = parseInt(document.getElementById('fAmount').value);
  if(!amount) { showToast('⚠️ أدخل المبلغ'); return; }
  const desc = document.getElementById('fDesc').value.trim() || (type === 'expense' ? 'مصروف' : 'إيراد');
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
window._selectedDebtOpt = 0;

window.openRenewModal = function(subId) {
  const s = subs.find(x => x.id === subId);
  if (!s) return;

  // نتحقق إذا المشترك عليه دين (آجل) سواء كان نشط أو منتهي
  const unpaidAmount = !s.paid ? s.amount : 0;
  const totalDebt = s.prevDebt + unpaidAmount;
  const hasDebt = totalDebt > 0;

  let html = '<div class="form-wrap" style="padding:0">';

  if (hasDebt) {
    html += '<div class="debt-box">' +
      '<div class="debt-box-title"><i class="fas fa-exclamation-triangle"></i> عليه دين سابق</div>' +
      '<div class="debt-grid">' +
      (unpaidAmount > 0 ? '<div class="debt-grid-item"><span class="dgi-label">غير مدفوعة (الحالية)</span><span class="dgi-value warn">' + formatMoney(unpaidAmount) + '</span></div>' : '') +
      '<div class="debt-grid-item"><span class="dgi-label">الدين السابق</span><span class="dgi-value warn">' + formatMoney(s.prevDebt) + '</span></div>' +
      '<div class="debt-grid-item total"><span class="dgi-label">المجموع</span><span class="dgi-value" id="dgiTotal">' + formatMoney(totalDebt) + '</span></div>' +
      '</div></div>' +
      '<div class="debt-options">' +
      '<div class="debt-opt selected" onclick="selectDebtOption(0, this)" data-opt="0">' +
      '<input type="radio" name="debtOpt" checked>' +
      '<div class="dopt-check"><i class="fas fa-circle"></i></div>' +
      '<div class="dopt-content"><div class="dopt-label"><i class="fas fa-plus-circle"></i> تجديد + إضافة دين جديد</div>' +
      '<div class="dopt-desc">يبقى الدين السابق كاملاً ويضاف الاشتراك الجديد كدين إضافي</div></div></div>' +
      '<div class="debt-opt" onclick="selectDebtOption(1, this)" data-opt="1">' +
      '<input type="radio" name="debtOpt">' +
      '<div class="dopt-check"><i class="fas fa-circle"></i></div>' +
      '<div class="dopt-content"><div class="dopt-label"><i class="fas fa-check-double"></i> تسديد السابق + إضافة دين جديد</div>' +
      '<div class="dopt-desc">يتم تسديد الدين السابق كاملاً ويبقى الاشتراك الجديد كدين</div></div></div>' +
      '<div class="debt-opt" onclick="selectDebtOption(2, this)" data-opt="2">' +
      '<input type="radio" name="debtOpt">' +
      '<div class="dopt-check"><i class="fas fa-circle"></i></div>' +
      '<div class="dopt-content"><div class="dopt-label"><i class="fas fa-check-circle"></i> تسديد السابق + دفع الحالي</div>' +
      '<div class="dopt-desc">يتم تسديد الدين السابق والاشتراك الجديد مدفوع بالكامل</div></div></div></div>';
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
    '<div class="form-group"><label><i class="fas fa-sticky-note"></i> ملاحظات</label>' +
    '<textarea id="renewNotes" placeholder="ملاحظات التجديد..." style="min-height:50px"></textarea></div>' +
    '<div class="renew-summary" id="renewSummary"></div>' +
    '<div class="form-actions" style="margin-top:10px">' +
    '<button class="success" onclick="confirmRenewal(' + subId + ')"><i class="fas fa-check"></i> تأكيد التجديد</button>' +
    '<button class="secondary" onclick="closeModal()">إلغاء</button></div></div>';

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-sync" style="color:var(--success)"></i> تجديد اشتراك ' + s.name;
  document.getElementById('modalBody').innerHTML = html;

  window._selectedDebtOpt = 0;
  renewOnTypeChange(subId);
  openModal();
};

window.selectDebtOption = function(idx, el) {
  window._selectedDebtOpt = idx;
  document.querySelectorAll('.debt-opt').forEach(o => o.classList.remove('selected'));
  if (el) el.classList.add('selected');
  const sel = document.getElementById('renewType');
  if (sel) {
    const s = subs.find(x => x.id === parseInt(document.querySelector('[onclick*="confirmRenewal"]')?.getAttribute('onclick')?.match(/\d+/)?.[0] || '0'));
    const tpl = subscriptionTypes.find(t => t.id === parseInt(sel.value));
    if (tpl && s) updateRenewSummary(s, tpl);
  }
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
  const totalDebt = s.prevDebt + unpaidAmount;
  const start = document.getElementById('renewStart').value || todayStr();
  const end = document.getElementById('renewEnd').value;
  const opt = window._selectedDebtOpt;

  let summary = '<div class="pay-summary">';
  summary += '<div class="ps-row"><span>الباقة</span><span>' + tpl.name + '</span></div>';
  summary += '<div class="ps-row"><span>المبلغ</span><span class="ps-green">' + formatMoney(tpl.price) + '</span></div>';
  summary += '<div class="ps-row"><span>من</span><span>' + start + '</span></div>';
  summary += '<div class="ps-row"><span>إلى</span><span>' + end + '</span></div>';
  if (totalDebt > 0) {
    summary += '<div class="ps-divider"></div>';
    summary += '<div class="ps-row"><span>الدين السابق</span><span class="ps-red">' + formatMoney(totalDebt) + '</span></div>';
    summary += '<div class="ps-row" style="margin-top:4px;font-size:11px">';
    if (opt === 0) summary += '<span style="color:var(--warning)"><i class="fas fa-arrow-left"></i> يضاف الجديد (' + formatMoney(tpl.price) + ') إلى الدين</span>';
    else if (opt === 1) summary += '<span style="color:var(--success)"><i class="fas fa-arrow-left"></i> يسدد السابق، ويبقى الجديد (' + formatMoney(tpl.price) + ') دين</span>';
    else if (opt === 2) summary += '<span style="color:var(--success)"><i class="fas fa-arrow-left"></i> يسدد السابق والجديد بالكامل</span>';
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
  const opt = window._selectedDebtOpt || 0;
  const unpaidAmount = !s.paid ? s.amount : 0;
  const currentDebt = s.prevDebt + unpaidAmount;

  s.type = tpl.name;
  s.amount = tpl.price;
  s.start = start;
  s.end = end;
  s.status = 'active';
  s.notes = notes;

  if (currentDebt > 0) {
    if (opt === 0) {
      s.prevDebt = currentDebt + tpl.price;
      s.paid = false;
      s.debtHistory.push({ amount: tpl.price, date: todayStr(), note: 'إضافة من تجديد (' + tpl.name + ')' });
      showToast('✅ تم تجديد اشتراك ' + s.name + ' مع إضافة دين جديد');
    } else if (opt === 1) {
      finRecords.unshift({ id: finId++, date: todayStr(), desc: 'تسديد دين سابق - ' + s.name, amount: currentDebt, type: 'income' });
      s.prevDebt = tpl.price;
      s.paid = false;
      s.debtHistory.push({ amount: tpl.price, date: todayStr(), note: 'إضافة من تجديد (' + tpl.name + ')' });
      showToast('✅ تم تسديد الدين السابق (' + formatMoney(currentDebt) + ') وتجديد اشتراك ' + s.name);
    } else if (opt === 2) {
      finRecords.unshift({ id: finId++, date: todayStr(), desc: 'تسديد دين سابق - ' + s.name, amount: currentDebt, type: 'income' });
      finRecords.unshift({ id: finId++, date: todayStr(), desc: 'تجديد اشتراك - ' + s.name + ' (' + tpl.name + ')', amount: tpl.price, type: 'income' });
      s.prevDebt = 0;
      s.paid = true;
      showToast('✅ تم تسديد الدين السابق (' + formatMoney(currentDebt) + ') وتجديد اشتراك ' + s.name);
    }
  } else {
    s.paid = false;
    showToast('✅ تم تجديد اشتراك ' + s.name);
  }

  saveAllData();
  closeModal();
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
