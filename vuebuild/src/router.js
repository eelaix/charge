import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [
  {
    path: '',
    redirect: '/0'
  },
  {
    path: '/:id',
    name: 'chargerbk',
    component: () => import('@/Chargerbk.vue')
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

export default router
