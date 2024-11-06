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
        <div class="q-pa-md">
          <q-input
            outlined
            class="col-lg-6 col-xs-12"
            filled
            v-model="filtroNome"
            label="Filtrar por Nome"
            dense
          />
        </div>
        <q-btn
          class="text-white"
          no-caps
          :disable="loading"
          label="Cadastrar Agendamento"
          :to="{ name: 'cadAgendamento' }"
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

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.status === 'Concluído' ? 'green' : 'red'"
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

const filtroNome = ref("");

export default defineComponent({
  name: "AgendamentosPage",

  setup() {
    const rows = ref([]);
    const columns = ref([
      {
        name: "data",
        field: "data",
        label: "Data",
        sortable: true,
        align: "left",
      },
      {
        name: "hora",
        field: "hora",
        label: "Hora",
        sortable: true,
        align: "left",
      },
      {
        name: "status",
        field: "status",
        label: "Status",
        align: "left",
      },
    ]);

    const $q = useQuasar();

    const confirm = (id) => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja excluir o agendamento?",
        ok: "Sim",
        cancel: "Cancelar",
      }).onOk(() => {
        deleteRow(id);
        $q.notify({
          message: "Agendamento excluído com sucesso.",
          color: "secondary",
        });
      });
    };

    const handleFilterChange = () => {
      fetchData();
    };
    watch(filtroNome, handleFilterChange);

    onMounted(() => {
      fetchData();
    });

    return {
      columns,
      rows,
      confirm,
      filtroNome,
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
