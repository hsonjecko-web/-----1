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
