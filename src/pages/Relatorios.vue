<template>
  <q-page class="q-pa-md">
    <!-- Botão de gerar relatório e lista suspensa -->
    <div class="q-gutter-md flex q-pa-sm">
      <q-select
        v-model="selectedReport"
        :options="reportOptions"
        label="Selecione o Relatório"
        outlined
        dense
        style="width: 300px"
      />
      <q-btn
        label="Gerar Relatório"
        color="primary"
        dense
        :disabled="!selectedReport"
        @click="fetchReport"
      />
    </div>

    <!-- Tabela para exibição dos dados -->
    <q-table
      v-if="!loading"
      :rows="reportData"
      :columns="columns"
      row-key="id"
      no-data-label="Nenhum dado disponível"
      flat
      dense
      class="q-mt-md"
    />

    <!-- Indicador de carregamento -->
    <q-spinner v-if="loading" color="primary" size="50px" class="q-mt-md" />

    <!-- Botão de exportar para Excel -->
    <div class="q-mt-md">
      <q-btn
        label="Exportar para Excel"
        color="green"
        outline
        dense
        :disable="!reportData.length"
        @click="exportToExcel"
      />
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { api } from "src/boot/axios";
import * as XLSX from "xlsx";

export default {
  name: "RelatoriosPage",
  setup() {
    const reportOptions = ref([
      { label: "Estoque de Sangue", value: "estoque" },
      { label: "Agendamentos", value: "agendamentos" },
      { label: "Doadores", value: "doadores" },
      { label: "Consultas", value: "consultas" },
    ]);
    
    const selectedReport = ref(null);  // Armazena o tipo de relatório selecionado
    const reportData = ref([]);  // Dados que serão exibidos na tabela
    const columns = ref([]);  // Colunas para a tabela
    const loading = ref(false);  // Indicador de carregamento
    const tempDataForExcel = ref([]);  // Tabela temporária apenas para exportação

    // Função para buscar os dados do relatório
    const fetchReport = async () => {
      if (!selectedReport.value) return; // Se não houver um relatório selecionado, não faz nada

      loading.value = true;  // Ativa o carregamento
      reportData.value = [];  // Limpa os dados anteriores
      columns.value = [];  // Limpa as colunas anteriores
      tempDataForExcel.value = [];  // Limpa a tabela temporária para exportação

      try {
        const token = localStorage.getItem("token"); // Obtém o token do localStorage
        if (!token) throw new Error("Token não encontrado");  // Verifica se o token existe

        // Chamada para a API para buscar os dados do relatório
        const response = await api.get(`https://localhost:7237/api/Relatorios/${selectedReport.value.value}`, {
          headers: { Authorization: `Bearer ${token}` },  // Envia o token de autenticação no cabeçalho
        });

        reportData.value = response.data;  // Armazena os dados do relatório
        tempDataForExcel.value = response.data;  // Preenche a tabela temporária para exportação
        // Cria as colunas dinamicamente a partir dos dados recebidos
        columns.value = Object.keys(response.data[0] || {}).map((key) => ({
          name: key,
          field: key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          align: "left",
        }));
      } catch (error) {
        console.error("Erro ao buscar relatório:", error);  // Exibe erro caso haja falha na requisição
      } finally {
        loading.value = false;  // Desativa o indicador de carregamento
      }
    };

    // Função para exportar os dados para um arquivo Excel
    const exportToExcel = () => {
      try {
        // Valida se há dados disponíveis
        if (!Array.isArray(tempDataForExcel.value) || !tempDataForExcel.value.length) return;

        // Cria a worksheet e o workbook
        const worksheet = XLSX.utils.json_to_sheet(tempDataForExcel.value);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

        // Gera o nome do arquivo e escreve o arquivo
        const sanitizeFileName = (name) => name.replace(/[\/\\?%*:|"<>]/g, "-");
        const fileName = `${sanitizeFileName(selectedReport.value.value)}-relatorio.xlsx`;
        XLSX.writeFile(workbook, fileName);
      } catch (error) {
        console.error("Erro ao exportar para Excel:", error);
      }
    };

    return {
      reportOptions,
      selectedReport,
      reportData,
      columns,
      loading,
      fetchReport,
      exportToExcel,
    };
  },
};
</script>

<style scoped>
.q-gutter-md > * {
  margin-right: 16px;
}
.flex {
  display: flex;
  align-items: center;
}
</style>
