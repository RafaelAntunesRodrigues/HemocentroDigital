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
        <div class="q-pa-md">
          <q-input
            outlined
            class="col-lg-6 col-xs-12"
            filled
            v-model="filtroCPF"
            label="Filtrar por CPF"
            dense
          />
        </div>
        <q-btn
          class="text-white"
          no-caps
          :disable="loading"
          label="Cadastrar"
          :to="{ name: 'cadDoador' }"
          style="background-color: #26335d; width: 120px"
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

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.status === 'Concluído' ? 'red' : 'green'"
          >
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>
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

    const fetchData = async () => {
      try {
        // Obtém o token do localStorage (ou de onde ele estiver armazenado)
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token não encontrado");
        }

        // Faz a requisição com o cabeçalho Authorization
        const response = await api.get("https://localhost:7237/api/Doadores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const doadores = response.data; // A resposta contém um array de objetos

        rows.value = filtroCPF.value
          ? doadores.filter((doador) =>
              doador.cpf && doador.cpf.includes(filtroCPF.value)
            )
          : doadores;
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    const $q = useQuasar();

    const confirm = (id) => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja excluir?",
        ok: "Sim",
        cancel: "Cancelar",
      }).onOk(() => {
        deleteRow(id);
        $q.notify({
          message: "Excluído com sucesso.",
          color: "secondary",
        });
      });
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
