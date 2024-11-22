<template>
  <q-page padding>
    <q-table
      :title="'Consultas (' + rows.length + ')'"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:header-cell-acoes="props">
        <q-th :props="props">Ações</q-th>
      </template>
      <template v-slot:top>
        <span class="text-h5">
          Consultas
          <span class="text-h6" style="color: rgb(167, 167, 167)">
            ({{ rows.length }})
          </span>
        </span>
        <q-space />
        <q-btn
          v-if="isAdmin"
          class="text-white"
          no-caps
          :disable="loading"
          label="Cadastrar Consulta"
          @click="openModal"
          style="background-color: #26335d; width: 160px"
        />
      </template>

      <template v-slot:body-cell-acoes="props">
        <q-td :props="props">
          <q-btn
            style="margin-right: 5px"
            icon="edit"
            color="primary"
            dense
            :to="{ name: 'editConsulta' }"
          >
          </q-btn>
          <q-btn
            icon="delete"
            color="negative"
            dense
            @click="confirm(props.row.id)"
          >
          </q-btn>
        </q-td>
      </template>

      <template v-slot:body-cell-dataConsulta="props">
        <q-td :props="props">
          {{ formatDate(props.row.dataConsulta) }}
        </q-td>
      </template>
    </q-table>

    <!-- Modal para Cadastro de Consultas -->
    <q-dialog v-model="modalOpen" persistent>
      <q-card style="min-width: 600px; max-width: 800px;">
        <q-card-section>
          <div class="text-h6">Cadastrar Consulta</div>
        </q-card-section>

        <q-card-section>
          <!-- Campo Agendamento como Select -->
          <q-select
            v-model="consulta.AgendamentoId"
            outlined
            label="Selecionar Agendamento"
            :options="agendamentosOptions"
            option-label="codigo"
            option-value="id"
            class="q-my-sm"
          />
          <!-- Campo Data da Consulta -->
          <q-input
            v-model="consulta.DataConsulta"
            outlined
            label="Data da Consulta"
            type="date"
            class="q-my-sm"
          />
          <!-- Campo Status como Select -->
          <q-select
            v-model="consulta.Status"
            outlined
            label="Status"
            :options="['Agendado', 'Concluído', 'Cancelado']"
            class="q-my-sm"
          />
          <!-- Campo Observacoes -->
          <q-input
            v-model="consulta.Observacoes"
            outlined
            label="Observações"
            class="q-my-sm"
          />
          <!-- Campo Duração em Minutos -->
          <q-input
            v-model="consulta.DuracaoMinutos"
            outlined
            label="Duração (minutos)"
            type="number"
            class="q-my-sm"
          />
          <!-- Campo Tipo de Consulta como Select -->
          <q-select
            v-model="consulta.TipoConsulta"
            outlined
            label="Tipo de Consulta"
            :options="['Presencial', 'Online']"
            class="q-my-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="closeModal" />
          <q-btn flat label="Salvar" color="primary" @click="cadastrarConsulta" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default defineComponent({
  name: "ConsultasPage",

  setup() {
    const rows = ref([]);
    const columns = ref([
      {
        name: "doadorName",
        field: "doadorName",
        label: "Nome do Doador",
        sortable: true,
        align: "left",
      },
      {
        name: "dataAgendamento",
        field: "dataAgendamento",
        label: "Data Agendamento",
        sortable: true,
        align: "left",
      },
      {
        name: "dataConsulta",
        field: "DataConsulta",
        label: "Data da Consulta",
        sortable: true,
        align: "left",
      },
      {
        name: "status",
        field: "status",
        label: "Status",
        sortable: true,
        align: "left",
      },
      {
        name: "observacoes",
        field: "observacoes",
        label: "Observações",
        sortable: true,
        align: "left",
      },
      {
        name: "duracaoMinutos",
        field: "duracaoMinutos",
        label: "Duração (minutos)",
        sortable: true,
        align: "left",
      },
      {
        name: "local",
        field: "local",
        label: "Local",
        sortable: true,
        align: "left",
      },
      {
        name: "tipoConsulta",
        field: "tipoConsulta",
        label: "Tipo de Consulta",
        sortable: true,
        align: "left",
      },
      {
        name: "acoes",
        field: "acoes",
        label: "Ações",
        align: "right",
      },
    ]);

    const consulta = ref({
      AgendamentoId: null,
      DataConsulta: "",
      Status: "",
      Observacoes: "",
      DuracaoMinutos: 0,
      TipoConsulta: "",
    });

    const modalOpen = ref(false);
    const agendamentosOptions = ref([]);
    const isAdmin = ref(false);
    const $q = useQuasar();

    const openModal = () => {
      fetchAgendamentos(); // Carregar agendamentos ao abrir o modal
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
      consulta.value = {
        AgendamentoId: null,
        DataConsulta: "",
        Status: "",
        Observacoes: "",
        DuracaoMinutos: 0,
        TipoConsulta: "",
      };
    };

    const fetchAgendamentos = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.get("https://localhost:7237/api/AgendamentoDoacoes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          agendamentosOptions.value = response.data.map((agendamento) => ({
            id: agendamento.id,
            codigo: agendamento.codigo,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        $q.notify({
          message: "Erro ao buscar agendamentos. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    const cadastrarConsulta = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        consulta.value.AgendamentoId = consulta.value.AgendamentoId.id;

        const response = await api.post(
          "https://localhost:7237/api/Consulta",
          consulta.value,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          $q.notify({
            message: "Consulta cadastrada com sucesso.",
            color: "positive",
          });
          closeModal(); // Fecha o modal após o cadastro
          fetchData(); // Atualiza a lista de consultas
        }
      } catch (error) {
        console.error("Erro ao cadastrar consulta:", error);
        $q.notify({
          message: error.response?.data || "Erro ao cadastrar consulta. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    const deleteRow = async (id) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.delete(
          `https://localhost:7237/api/Consulta/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          $q.notify({
            message: "Consulta excluída com sucesso.",
            color: "secondary",
          });
          fetchData(); // Atualiza a lista de consultas após exclusão
        }
      } catch (error) {
        console.error("Erro ao excluir consulta:", error);
        $q.notify({
          message: "Erro ao excluir consulta. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    const confirm = (id) => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja excluir a consulta?",
        ok: "Sim",
        cancel: "Cancelar",
      }).onOk(() => {
        deleteRow(id);
      });
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const doadorId = localStorage.getItem("doadorId");
        const response = await api.get(`https://localhost:7237/api/Doadores/${doadorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);
        if (response.status === 200) {
          isAdmin.value = response.data.isAdmin;

          // Se não for admin, filtrar apenas as consultas do próprio doador
          if (!isAdmin.value) {
            const consultasResponse = await api.get(
              `https://localhost:7237/api/Consulta/GetConsultaByDoadorId/${doadorId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            rows.value = consultasResponse.data;
          } else {
            // Se for admin, buscar todas as consultas
            const consultasResponse = await api.get("https://localhost:7237/api/Consulta", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            rows.value = consultasResponse.data;
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
    };

    onMounted(() => {
      fetchData();
    });

    return {
      columns,
      rows,
      confirm,
      modalOpen,
      openModal,
      closeModal,
      cadastrarConsulta,
      consulta,
      agendamentosOptions,
      formatDate,
      isAdmin,
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
