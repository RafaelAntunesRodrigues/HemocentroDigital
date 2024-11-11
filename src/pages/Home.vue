<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
});
</script>

<template>
  <div class="q-pa-md">
    <q-toolbar class="text-red shadow-2 rounded-borders no-shadow" style="background-color: #ffffff">
      <q-toolbar-title>Hemocentro Digital</q-toolbar-title>
      <q-space />

      <div class="q-pa-md q-gutter-sm">
        <q-btn flat style="color: #ff0000; width: 120px" label="Login" text-color="#ff0000" no-caps
          @click="$router.push('/login')" />
        <q-btn style="background: #ff0000; color: white; width: 120px" label="Cadastre-se" no-caps
        @click="$router.push('/cadastro')"/>
      </div>
    </q-toolbar>
  </div>
  <div class="q-pa-md items-center q-gutter-md">
    <div class="row justify-center" style="background-color: #ffffff">
      <div class="col-12 col-md-6 text-center">
        <q-card class="my-card no-shadow q-pa-md" style="background-color: #ffffff;">
          <q-card-section style="font-size: 55px; color: #ff0000">
            Doações Rápidas, Vidas Salvas
          </q-card-section>
          <q-card-section style="color: #ff0000">
            Hemocentro: sua doação faz a diferença!
          </q-card-section>
          <div class="q-pa-md q-gutter-sm">
            <q-btn style="background: #ff0000; color: white; width: 240px" label="Status Sangue" no-caps @click="$router.push('/estoque-home')"/>
            <q-btn outline style="color: #ff0000; width: 120px" label="Avisos" text-color="#ff0000" no-caps @click="$router.push('/avisos-home')"/>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-6 text-center">
        <q-img src="../assets/HomeImage.jpg" style="height: 400px; width: 100%; border-radius: 36px" />
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: #ffffff;
}

.q-toolbar-title {
  font-size: 24px;
  font-weight: bold;
}

.my-card {
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.q-img {
  object-fit: cover;
}
</style>
