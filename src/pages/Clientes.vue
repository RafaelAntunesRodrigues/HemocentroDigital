<template>
  <q-page padding>
    <q-table
      :title="'Clientes (' + rows.length + ')'"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:header-cell-acoes="props">
        <q-th :props="props">Ações</q-th>
      </template>
      <template v-slot:top>
        <span class="text-h5"
          >Clientes
          <span class="text-h6" style="color: rgb(167, 167, 167)"
            >({{ rows.length }})</span
          ></span
        >
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
          :to="{ name: 'cadCliente' }"
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
            :to="{ name: 'editCliente' }"
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
            >{{ props.row.status }}</q-badge
          >
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
  name: "ClientesPage",

  setup() {
    const rows = ref([]);
    const columns = ref([
      {
        name: "nome",
        field: "nome",
        label: "Nome",
        sortable: true,
        align: "left",
      },
      {
        name: "sobrenome",
        field: "sobrenome",
        label: "Sobrenome",
        sortable: true,
        align: "left",
      },
      {
        name: "cpf",
        field: "cpf",
        label: "CPF do Cliente",
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
        name: "telefone",
        field: "telefone",
        label: "Telefone Contato",
        sortable: true,
        align: "left",
        filter: true,
      },
      {
        name: "acoes",
        field: "acoes",
        label: "Ações",
        sortable: true,
        align: "right",
      },
    ]);

    const fetchData = async () => {
      try {
        const response = await api.get("/api/Cliente");

        const clientes = response.data.$values;

        rows.value = clientes;


        rows.value = filtroCPF.value
          ? clientes.filter((cliente) => cliente.cpf.includes(filtroCPF.value))
          : clientes;
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
