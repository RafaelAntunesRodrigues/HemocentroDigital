<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar style="background-color: #ff0000">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Hemocentro </q-toolbar-title>
        <q-space />
        <q-btn
          flat
          dense
          round
          icon="logout"
          aria-label="Logout"
          @click="logout"
          style="color: white"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container style="background-color: #ffffff">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useRouter } from "vue-router";

const linksList = [
  {
    title: "Consultas",
    caption: "",
    icon: "event",
    route: { name: "consultas" },
  },
  {
    title: "Doadores",
    caption: "",
    icon: "person",
    route: { name: "doadores" },
  },
  {
    title: "Agendamentos",
    caption: "",
    icon: "calendar_today",
    route: { name: "agendamentos" },
  },
  {
    title: "Avisos",
    caption: "",
    icon: "announcement",
    route: { name: "avisos" },
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();

    // Função de logout
    const logout = () => {
      // Remover o token do localStorage
      localStorage.removeItem("token");

      // Redirecionar para a página inicial (ajuste para o nome correto da rota)
      // Verifique se a rota "home" existe e ajuste se for necessário
      try {
        router.push({ name: "home" });
      } catch (error) {
        console.error("Erro ao redirecionar para a página inicial:", error);
        // Redireciona diretamente para a raiz como fallback
        router.push("/");
      }
    };

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      logout,
    };
  },
});
</script>

<style scoped>
.login-background {
  background-color: #ffffff;
}

.error-message {
  color: #ff0000;
}
</style>
