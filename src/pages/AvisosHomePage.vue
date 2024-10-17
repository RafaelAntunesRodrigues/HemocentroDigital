<template>
    <q-page class="q-pa-xl avisos-background">
      <div class="q-mb-md">
        <q-btn flat round icon="arrow_back" @click="$router.push('/')"
          >Voltar</q-btn
        >
      </div>
  
      <div class="row justify-center">
        <div class="col-12 col-md-8">
          <div class="text-h4 text-bold q-mt-md q-mv-xl">Avisos de Necessidade de Sangue</div>
          
          <!-- Lista de avisos -->
          <div v-for="aviso in avisos" :key="aviso.id" class="q-mb-lg">
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h6">{{ aviso.titulo }}</div>
                <div class="text-subtitle2 text-grey-6">{{ aviso.local }}</div>
                <div class="q-mt-md">{{ aviso.descricao }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "AvisosHomePage",
    setup() {
      const avisos = ref([
        {
          id: 1,
          titulo: "Urgente: Necessidade de Sangue Tipo O+",
          local: "Hospital das Clínicas, São Paulo",
          descricao: "Estamos com uma grande necessidade de sangue tipo O+ para atender pacientes em estado crítico. Por favor, doe se puder.",
        },
        {
          id: 2,
          titulo: "Doação de Sangue Tipo AB-",
          local: "Hemocentro de Campinas",
          descricao: "O Hemocentro de Campinas está precisando urgentemente de doadores de sangue tipo AB-. Sua doação pode salvar vidas.",
        },
        // Adicione mais avisos conforme necessário
      ]);
  
      // Parte comentada para consumir uma API de back-end
      /*
      import { onMounted } from "vue";
      import { api } from "src/boot/axios"; // Certifique-se de ajustar o caminho conforme necessário
  
      onMounted(async () => {
        try {
          const response = await api.get("/api/avisos"); // Ajuste a URL conforme necessário
          avisos.value = response.data;
        } catch (error) {
          console.error("Erro ao buscar avisos:", error);
        }
      });
      */
  
      return {
        avisos,
      };
    },
  };
  </script>
  
  <style scoped>
  .avisos-background {
    background-color: #ffffff;
  }
  
  .q-card {
    border: 1px solid #ff0000;
  }
  
  .q-card-section {
    color: #ff0000;
  }
  </style>
  