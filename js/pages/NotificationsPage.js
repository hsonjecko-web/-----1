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
            text: '<strong>عدم دفع:</strong> ' + s.name + ' لم يدفع اشتراكه (' + s.amount + ' دينار)',
            time: 'الآن', icon: 'fa-money-bill-wave', color: 'red'
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
