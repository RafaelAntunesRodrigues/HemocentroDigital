<template>
  <q-page padding>
    <q-card class="custom-card q-pa-md">
      <q-card-section>
        <q-input
          outlined
          filled
          v-model="filtroCPF"
          label="Filtrar por CPF"
          dense
          mask="###.###.###-##"
          fill-mask
          unmasked-value
        />
      </q-card-section>
    </q-card>
    <AnimaisTable
      :type="'Animais'"
      :formEdit="'editAnimal'"
      :params="{ idCliente: 'clienteId', idAnimal: 'animalId' }"
      :formCad="'formAnimais'"
      :rows="rows"
      :columns="columns"
      :getSexoBadgeColor="getSexoBadgeColor"
      :getStatusBadgeColor="getStatusBadgeColor"
      :confirm="confirm"
    />
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import AnimaisTable from "src/components/TableVue.vue";
export default defineComponent({
  name: "AnimaisPage",

  setup() {
    const rows = ref([]);
    const filtroCPF = ref("");

    const getSexoBadgeColor = (sexo) => {
      switch (sexo) {
        case "Macho":
          return "blue";
        case "Fêmea":
          return "pink";
      }
    };

    const getStatusBadgeColor = (status) => {
      console.log("status", status);
      switch (status) {
        case "Ativo":
          return "green";
        case "Inativo":
          return "red";
      }
    };

    const columns = ref([
      {
        name: "animalId",
        field: "animalId",
        label: "Id",
        sortable: true,
        align: "left",
      },
      {
        name: "tipo",
        field: "tipo",
        label: "Tipo do Animal",
        sortable: true,
        align: "left",
      },
      {
        name: "nome",
        field: "nome",
        label: "Nome do Animal",
        sortable: true,
        align: "left",
      },
      {
        name: "raca",
        field: "raca",
        label: "Raça",
        sortable: true,
        align: "left",
      },
      {
        name: "sexo",
        field: "sexo",
        label: "Sexo do Animal",
        sortable: true,
        align: "left",
      },
      {
        name: "clienteNome",
        field: "clienteNome",
        label: "Nome do Cliente",
        sortable: true,
        align: "left",
      },
      {
        name: "cpfCliente",
        field: "cpfCliente",
        label: "CPF do Cliente",
        sortable: true,
        align: "left",
      },
      {
        name: "ativo",
        field: "ativo",
        label: "status do Animal",
        sortable: true,
        align: "left",
      },
      {
        name: "idade",
        field: "idade",
        label: "Idade do Animal",
        sortable: true,
        align: "left",
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
        const response = await api.get("/api/Animal");
        const animais = response.data.$values;

        // Carrego o cliente para cada animal
        const ClientePromisse = animais.map(async (animal) => {
          const clientResponse = await api.get(
            `/api/Cliente/${animal.clienteId}`
          );
          animal.clienteNome = `${clientResponse.data.nome} ${clientResponse.data.sobrenome}`;
          animal.cpfCliente = clientResponse.data.cpf;
          animal.ativo = animal.ativo ? "Ativo" : "Inativo";
          return animal;
        });

        // Espero carregar o cliente
        const animalComCliente = await Promise.all(ClientePromisse);
        rows.value = filtroCPF.value
          ? animalComCliente.filter((animal) =>
              animal.cpfCliente.includes(filtroCPF.value)
            )
          : animalComCliente;
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    const handleFilterChange = () => {
      fetchData();
    };
    watch(filtroCPF, handleFilterChange);

    const $q = useQuasar();

    const confirm = (idAnimal) => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja Excluir este Animal?",
        ok: "Sim",
        cancel: "Não",
      }).onOk(() => {
        deleteRow(idAnimal);
      });
    };

    const deleteRow = async (id) => {
      const response = await api.delete(`/api/Animal/${id}`);

      console.log("Response:", response);
      $q.notify({
        message: "Animal Inativado com sucesso.",
        color: "secondary",
      });

      fetchData();
    };

    onMounted(() => {
      fetchData();
    });

    return {
      columns,
      rows,
      confirm,
      filtroCPF,
      getSexoBadgeColor,
      getStatusBadgeColor,
    };
  },

  components: {
    AnimaisTable,
  },
});
</script>

<style scoped>
.custom-card {
  height: 70px;
  /* Defina a altura desejada */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;

  margin-bottom: 20px;
}
</style>
