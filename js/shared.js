/* ============================================================
   shared.js - دوال Vue و Vue Router المشتركة بين كل الملفات
   يجب تحميل هذا الملف بعد CDN وقبل أي ملف آخر
   ============================================================ */

const { ref, reactive, computed, watch, onMounted, provide, inject, createApp } = Vue;
const { useRouter, useRoute, createRouter, createWebHashHistory } = VueRouter;
