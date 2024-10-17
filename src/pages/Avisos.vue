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
          
          <!-- Formulário para adicionar novo aviso -->
          <q-card class="q-pa-md q-mb-lg">
            <q-card-section>
              <div class="text-h6">Adicionar Novo Aviso</div>
              <q-input
                class="q-mt-sm"
                outlined
                v-model="novoAviso.titulo"
                label="Título"
              />
              <q-input
                class="q-mt-sm"
                outlined
                v-model="novoAviso.local"
                label="Local"
              />
              <q-input
                class="q-mt-sm"
                outlined
                v-model="novoAviso.descricao"
                label="Descrição"
                type="textarea"
              />
              <q-btn
                class="q-mt-md"
                style="background: #ff0000; color: white"
                label="Adicionar Aviso"
                @click="adicionarAviso"
              />
            </q-card-section>
          </q-card>
  
          <!-- Lista de avisos -->
          <div v-for="aviso in avisos" :key="aviso.id" class="q-mb-lg">
            <q-card class="q-pa-md">
              <q-card-section>
                <div class="text-h6">{{ aviso.titulo }}</div>
                <div class="text-subtitle2 text-grey-6">{{ aviso.local }}</div>
                <div class="q-mt-md">{{ aviso.descricao }}</div>
                <div class="q-mt-md text-grey-6">Data: {{ aviso.data }}</div>
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
    name: "AvisosNecessidadeSangue",
    setup() {
      const avisos = ref([
        {
          id: 1,
          titulo: "Urgente: Necessidade de Sangue Tipo O+",
          local: "Hospital das Clínicas, São Paulo",
          descricao: "Estamos com uma grande necessidade de sangue tipo O+ para atender pacientes em estado crítico. Por favor, doe se puder.",
          data: "2024-10-01",
        },
        {
          id: 2,
          titulo: "Doação de Sangue Tipo AB-",
          local: "Hemocentro de Campinas",
          descricao: "O Hemocentro de Campinas está precisando urgentemente de doadores de sangue tipo AB-. Sua doação pode salvar vidas.",
          data: "2024-10-05",
        },
        // Adicione mais avisos conforme necessário
      ]);
  
      const novoAviso = ref({
        titulo: "",
        local: "",
        descricao: "",
        data: new Date().toISOString().split('T'), // Adiciona a data atual
      });
  
      const adicionarAviso = () => {
        if (novoAviso.value.titulo && novoAviso.value.local && novoAviso.value.descricao) {
          avisos.value.push({
            id: avisos.value.length + 1,
            titulo: novoAviso.value.titulo,
            local: novoAviso.value.local,
            descricao: novoAviso.value.descricao,
            data: novoAviso.value.data,
          });
          novoAviso.value.titulo = "";
          novoAviso.value.local = "";
          novoAviso.value.descricao = "";
          novoAviso.value.data = new Date().toISOString().split('T'); // Reseta a data para a data atual
        }
      };
  
      // Parte comentada para comunicação com a API de back-end
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
  
      const adicionarAviso = async () => {
        if (novoAviso.value.titulo && novoAviso.value.local && novoAviso.value.descricao) {
          try {
            const response = await api.post("/api/avisos", {
              titulo: novoAviso.value.titulo,
              local: novoAviso.value.local,
              descricao: novoAviso.value.descricao,
              data: novoAviso.value.data,
            });
            avisos.value.push(response.data);
            novoAviso.value.titulo = "";
            novoAviso.value.local = "";
            novoAviso.value.descricao = "";
            novoAviso.value.data = new Date().toISOString().split('T'); // Reseta a data para a data atual
          } catch (error) {
            console.error("Erro ao adicionar aviso:", error);
          }
        }
      };
      */
  
      return {
        avisos,
        novoAviso,
        adicionarAviso,
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
  