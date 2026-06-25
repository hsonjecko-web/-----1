var SubscribersPage = {
  template: `
    <div class="page">
      <div class="shead">
        <h2><i class="fas fa-users"></i> المشتركين</h2>
        <a @click="$router.push('/add-sub')" v-if="can('subscribers.add')"><i class="fas fa-plus"></i> إضافة</a>
      </div>

      <div class="search-bar">
        <div class="input-wrap">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="بحث بالاسم أو الهاتف..." v-model="searchQuery">
        </div>
        <button class="filter-btn" @click="showFilters=!showFilters">
          <i class="fas fa-sliders-h"></i>
        </button>
      </div>

      <div class="filter-row" v-if="showFilters">
        <div class="filter-chip" :class="{ active: currentFilter==='all' }" @click="currentFilter='all'">الكل</div>
        <div class="filter-chip" :class="{ active: currentFilter==='active' }" @click="currentFilter='active'">فعال</div>
        <div class="filter-chip" :class="{ active: currentFilter==='expired' }" @click="currentFilter='expired'">منتهي</div>
        <div class="filter-chip" :class="{ active: currentFilter==='inactive' }" @click="currentFilter='inactive'">غير مفعل</div>
        <div class="filter-chip" :class="{ active: currentFilter==='paid' }" @click="currentFilter='paid'">مدفوع</div>
        <div class="filter-chip" :class="{ active: currentFilter==='debt' }" @click="currentFilter='debt'">غير مدفوع</div>
      </div>

      <div class="subs-list">
        <div v-for="s in filteredList" :key="s.id" class="sub-card" @click="$router.push('/sub-detail/'+s.id)">
          <div class="avatar" :class="{ on: s.status==='active', off: s.status!=='active' }">{{ s.name.charAt(0) }}</div>
          <div class="info">
            <div class="name">
              {{ s.name }}
              <span class="dot" :class="s.status==='active'?'on':s.status==='expired'?'off':'wait'"></span>
            </div>
            <div class="phone"><i class="fas fa-phone" style="font-size:10px;color:var(--text3)"></i> {{ s.phone }}</div>
            <div class="meta">
              <span class="type">{{ s.type }}</span>
              <span :class="s.paid?'paid':'debt'">{{ s.paid?'مدفوع':'غير مدفوع' }}</span>
              <span v-if="s.status==='expired'" style="background:var(--danger-glow);color:var(--danger)">منتهي</span>
            </div>
          </div>
          <div class="actions">
            <button @click.stop="$router.push('/sub-detail/'+s.id)" title="تعديل"><i class="fas fa-edit"></i></button>
            <button v-if="can('subscribers.renew')" class="gr" @click.stop="renewSub(s.id)" title="تجديد"><i class="fas fa-sync"></i></button>
            <button v-if="can('whatsapp')" class="gr" @click.stop="sendWADirect(s)" title="واتساب" style="color:var(--success)"><i class="fab fa-whatsapp"></i></button>
          </div>
        </div>
        <p v-if="!filteredList.length" style="color:var(--text3);padding:30px;text-align:center;font-size:14px">
          🔍 لا توجد نتائج
        </p>
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const showFilters = ref(false);
    const currentFilter = ref('all');

    const filteredList = computed(() => {
      let list = subs.filter(s => !s.archived);
      const q = searchQuery.value.toLowerCase();
      if(q) list = list.filter(s => s.name.includes(q) || s.phone.includes(q));
      if(currentFilter.value === 'active') list = list.filter(s => s.status === 'active');
      else if(currentFilter.value === 'expired') list = list.filter(s => s.status === 'expired');
      else if(currentFilter.value === 'inactive') list = list.filter(s => s.status === 'inactive');
      else if(currentFilter.value === 'paid') list = list.filter(s => s.paid);
      else if(currentFilter.value === 'debt') list = list.filter(s => !s.paid);
      return list;
    });

    function renewSub(id) {
      const s = subs.find(x => x.id === id);
      if(!s) return;
      if(!s.paid && s.status === 'expired') {
        showToast('⚠️ ' + s.name + ' مطلوب منه اشتراك قديم غير مدفوع (' + s.amount + ' دينار)');
      } else {
        router.push('/sub-detail/' + id);
      }
    }

    function sendWADirect(s) {
      window.open('https://wa.me/' + s.phone + '?text=' + encodeURIComponent('مرحباً ' + s.name + '،'), '_blank');
      showToast('✅ تم فتح واتساب لـ ' + s.name);
    }

    return { searchQuery, showFilters, currentFilter, filteredList, renewSub, sendWADirect, can };
  }
};
