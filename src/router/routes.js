const routes = [
  {
    path: "/", // Redireciona a rota raiz ("/") para "/home"
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("pages/Home.vue"),
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      { path: "", name: "login", component: () => import("pages/Login.vue") },
    ],
  },
  {
    path: "/cadastro",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        name: "cadastro",
        component: () => import("pages/Cadastro.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "consultas",
        name: "consultas",
        component: () => import("pages/Consultas.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "doadores",
        name: "doadores",
        component: () => import("pages/Clientes.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "agendamentos",
        name: "agendamentos",
        component: () => import("pages/Agendamento.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "veterinarios",
        name: "veterinarios",
        component: () => import("pages/Veterinarios.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "animais",
        name: "animais",
        component: () => import("pages/Animais.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "avisos",
        name: "avisos",
        component: () => import("pages/Avisos.vue"),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: "/avisos-home",
    component: () => import("layouts/AvisosLayout.vue"),
    children: [
      {
        path: "",
        name: "avisosHome",
        component: () => import("pages/AvisosHomePage.vue"),
        meta: { requiresAuth: true }
      },
    ],
  },
  {
    path: "/home",
    component: () => import("pages/Home.vue"),
  },
];

export default routes;
