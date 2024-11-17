<template>
  <q-page padding>
    <q-table
      :title="'Agendamentos (' + rows.length + ')'"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:header-cell-acoes="props">
        <q-th :props="props">Ações</q-th>
      </template>
      <template v-slot:top>
        <span class="text-h5">
          Agendamentos
          <span class="text-h6" style="color: rgb(167, 167, 167)">
            ({{ rows.length }})
          </span>
        </span>
        <q-space />
        <q-btn
          class="text-white"
          no-caps
          :disable="loading"
          label="Cadastrar Agendamento"
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
            :to="{ name: 'editAgendamento' }"
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

      <template v-slot:body-cell-doadorId="props">
        <q-td :props="props">
          {{ getDoadorNome(props.row.doadorId) }}
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="props.row.status === 'Concluído' ? 'green' : 'red'">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>

    <!-- Modal para Cadastro de Agendamento -->
    <q-dialog v-model="modalOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Cadastrar Agendamento</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="agendamento.Codigo"
            outlined
            label="Código"
            class="q-my-sm"
          />
          <q-input
            v-model="agendamento.DataAgendamento"
            outlined
            label="Data do Agendamento"
            type="date"
            class="q-my-sm"
          />
          <q-input
            v-model="agendamento.Local"
            outlined
            label="Local"
            class="q-my-sm"
          />
          <!-- Campo DoadorId como Select -->
          <q-select
            v-model="agendamento.DoadorId"
            outlined
            label="Selecionar Doador"
            :options="doadoresOptions"
            option-label="name"
            option-value="id"
            class="q-my-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="closeModal" />
          <q-btn flat label="Salvar" color="primary" @click="cadastrarAgendamento" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

const filtroNome = ref("");

export default defineComponent({
  name: "AgendamentosPage",

  setup() {
    const rows = ref([]);
    const columns = ref([
      {
        name: "codigo",
        field: "codigo",
        label: "Código",
        sortable: true,
        align: "left",
      },
      {
        name: "dataAgendamento",
        field: "dataAgendamento",
        label: "Data do Agendamento",
        sortable: true,
        align: "left",
        format: (val) => (val ? new Date(val).toLocaleDateString("pt-BR") : "-"), // Formatar a data para exibição
      },
      {
        name: "local",
        field: "local",
        label: "Local",
        sortable: true,
        align: "left",
      },
      {
        name: "doadorNome",
        field: "doadorNome",
        label: "Nome do Doador",
        sortable: false,
        align: "left",
      },
      {
        name: "acoes",
        field: "acoes",
        label: "Ações",
        align: "right",
      },
    ]);

    const agendamento = ref({
      Codigo: "",
      DataAgendamento: "",
      Local: "",
      DoadorId: null,
    });

    const modalOpen = ref(false);
    const doadoresOptions = ref([]);
    const $q = useQuasar();

    const openModal = () => {
      fetchDoadores(); // Carregar doadores ao abrir o modal
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
      // Limpar os campos do agendamento ao fechar o modal
      agendamento.value = {
        Codigo: "",
        DataAgendamento: "",
        Local: "",
        DoadorId: null,
      };
    };

    const fetchDoadores = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.get("https://localhost:7237/api/Doadores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          doadoresOptions.value = response.data.map((doador) => ({
            id: doador.id,
            name: doador.name,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar doadores:", error);
        $q.notify({
          message: "Erro ao buscar doadores. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    const cadastrarAgendamento = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

      agendamento.value = {
        Codigo: agendamento.value.Codigo,
        DataAgendamento: agendamento.value.DataAgendamento,
        Local: agendamento.value.Local,
        DoadorId: agendamento.value.DoadorId.id,
      };

        const response = await api.post(
          "https://localhost:7237/api/AgendamentoDoacoes",
          agendamento.value,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          $q.notify({
            message: "Agendamento cadastrado com sucesso.",
            color: "positive",
          });
          closeModal(); // Fecha o modal após o cadastro
          fetchData(); // Atualiza a lista de agendamentos
        }
      } catch (error) {
        console.error("Erro ao cadastrar agendamento:", error);
        $q.notify({
          message: "Erro ao cadastrar agendamento. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    const confirm = (id) => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja excluir o agendamento?",
        ok: "Sim",
        cancel: "Cancelar",
      }).onOk(() => {
        deleteRow(id);
      });
    };

    const deleteRow = async (id) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.delete(
          `https://localhost:7237/api/AgendamentoDoacoes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          $q.notify({
            message: "Agendamento excluído com sucesso.",
            color: "secondary",
          });
          fetchData(); // Atualiza a lista de agendamentos após exclusão
        }
      } catch (error) {
        console.error("Erro ao excluir agendamento:", error);
        $q.notify({
          message: "Erro ao excluir agendamento. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.get(
          "https://localhost:7237/api/AgendamentoDoacoes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        rows.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    const getDoadorNome = (doadorId) => {
      const doador = doadoresOptions.value.find((d) => d.id === doadorId);
      return doador ? doador.name : "Desconhecido";
    };

    const handleFilterChange = () => {
      fetchData();
    };

    watch(filtroNome, handleFilterChange);

    onMounted(() => {
      fetchData();
      fetchDoadores(); // Carregar doadores inicialmente
    });

    return {
      columns,
      rows,
      confirm,
      filtroNome,
      modalOpen,
      openModal,
      closeModal,
      cadastrarAgendamento,
      agendamento,
      doadoresOptions,
      getDoadorNome,
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
