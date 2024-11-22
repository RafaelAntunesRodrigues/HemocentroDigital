<template>
  <q-page padding>
    <q-table
      :title="'Doadores (' + rows.length + ')'"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:header-cell-acoes="props">
        <q-th :props="props">Ações</q-th>
      </template>
      <template v-slot:top>
        <span class="text-h5">
          Doadores
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
          label="Cadastrar Doador"
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
            :to="{ name: 'editDoador' }"
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

      <template v-slot:body-cell-dataNasc="props">
        <q-td :props="props">
          {{ formatDate(props.row.dataNasc) }}
        </q-td>
      </template>
    </q-table>

    <!-- Modal para Cadastro de Doadores -->
    <q-dialog v-model="modalOpen" persistent>
      <q-card style="width: 600px; max-width: 90%; height: auto; max-height: 90%;">
        <q-card-section>
          <div class="text-h6">Cadastrar Doador</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="doador.name"
            outlined
            label="Nome"
            class="q-my-sm"
          />
          <q-input
            v-model="doador.email"
            outlined
            label="E-mail"
            class="q-my-sm"
          />
          <q-input
            v-model="doador.telafone"
            outlined
            label="Telefone Contato"
            type="tel"
            class="q-my-sm"
          />
          <q-select
            v-model="doador.tipoSanguineo"
            outlined
            label="Tipo Sanguíneo"
            :options="[
              'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
            ]"
            class="q-my-sm"
          />
          <q-input
            v-model="doador.dataNasc"
            outlined
            label="Data de Nascimento"
            type="date"
            class="q-my-sm"
          />
          <q-input
            v-model="doador.peso"
            outlined
            label="Peso (kg)"
            type="number"
            class="q-my-sm"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="closeModal" />
          <q-btn flat label="Salvar" color="primary" @click="cadastrarDoador" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

const filtroCPF = ref("");

export default defineComponent({
  name: "DoadoresPage",

  setup() {
    const rows = ref([]);
    const columns = ref([
      {
        name: "name",
        field: "name",
        label: "Nome",
        sortable: true,
        align: "left",
      },
      {
        name: "email",
        field: "email",
        label: "E-mail",
        sortable: true,
        align: "left",
      },
      {
        name: "telafone",
        field: "telafone",
        label: "Telefone Contato",
        sortable: true,
        align: "left",
      },
      {
        name: "tipoSanguineo",
        field: "tipoSanguineo",
        label: "Tipo Sanguíneo",
        sortable: true,
        align: "left",
      },
      {
        name: "dataNasc",
        field: "dataNasc",
        label: "Data de Nascimento",
        sortable: true,
        align: "left",
      },
      {
        name: "peso",
        field: "peso",
        label: "Peso (kg)",
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

    const doador = ref({
      name: "",
      email: "",
      password: "",
      telafone: "",
      tipoSanguineo: "",
      dataNasc: "",
      peso: "",
    });

    const modalOpen = ref(false);
    const $q = useQuasar();
    const isAdmin = ref(false);
    const openModal = () => {
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
      // Limpar os campos do doador ao fechar o modal
      doador.value = {
        name: "",
        email: "",
        password: "",
        telafone: "",
        tipoSanguineo: "",
        dataNasc: "",
        peso: "",
      };
    };

    const cadastrarDoador = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        const response = await api.post(
          "https://localhost:7237/api/Doadores",
          doador.value,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          $q.notify({
            message: "Doador cadastrado com sucesso.",
            color: "positive",
          });
          closeModal(); // Fecha o modal após o cadastro
          fetchData(); // Atualiza a lista de doadores
        }
      } catch (error) {
        console.error("Erro ao cadastrar doador:", error);

          $q.notify({
            message: "Erro ao cadastrar doador. Por favor, tente novamente.",
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
          `https://localhost:7237/api/Doadores/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          $q.notify({
            message: "Doador excluído com sucesso.",
            color: "secondary",
          });
          fetchData(); // Atualiza a lista de doadores após exclusão
        }
      } catch (error) {
        console.error("Erro ao excluir doador:", error);
        $q.notify({
          message: "Erro ao excluir doador. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    const confirm = (id) => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja excluir o doador?",
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

        const userResponse = await api.get(`https://localhost:7237/api/Doadores/${doadorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        isAdmin.value = userResponse.data.isAdmin;

        

        const url = isAdmin.value
          ? "https://localhost:7237/api/Doadores"
          : `https://localhost:7237/api/Doadores/${doadorId}`;


        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (isAdmin.value){
          rows.value = response.data;  
        }else{
        var listDoador = [];
        listDoador.push(response.data);
        rows.value = listDoador;
        }
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
    };

    const handleFilterChange = () => {
      fetchData();
    };
    watch(filtroCPF, handleFilterChange);

    onMounted(() => {
      fetchData();
    });

    return {
      columns,
      rows,
      confirm,
      filtroCPF,
      modalOpen,
      openModal,
      closeModal,
      cadastrarDoador,
      doador,
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