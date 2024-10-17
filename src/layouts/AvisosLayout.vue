<template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar style="background-color: #ff0000">
          <q-btn
            flat
            dense
            round
            icon="arrow_back"
            aria-label="Voltar"
            @click="$router.push('/')"
          />
          <q-toolbar-title> Hemocentro </q-toolbar-title>
        </q-toolbar>
      </q-header>
  
      <q-page-container style="background-color: #ffffff">
        <router-view />
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  export default {
    name: "AvisosLayout",
  };
  </script>
  