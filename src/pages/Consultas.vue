<template>
  <q-page padding>
    <q-card class="custom-card q-pa-md">
      <q-card-section>
        <q-input outlined filled v-model="filtroCPF" label="Filtrar por CPF" dense mask="###.###.###-##" fill-mask
          unmasked-value />
      </q-card-section>
    </q-card>
    <ConsultasTable :type="'Consultas'" :formEdit="'editConsulta'" :formCad="'formConsulta'" :rows="rows"
      :columns="columns" :getStatusBadgeColor="getStatusBadgeColor" :confirm="confirm" />
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import ConsultasTable from "src/components/TableVue.vue";

export default defineComponent({
  name: 'ConsultasPage',

  components: {
    ConsultasTable,
  },

  setup() {

    const rows = ref([])
    const filtroCPF = ref('');

    const getStatusBadgeColor = (status) => {
      console.log('status', status)
      switch (status) {
        case 'Concluída':
          return 'green';
        case 'Cancelada':
          return 'red';
        default:
          return 'orange';
      }
    };

    const columns = ref([
      { name: 'IdConsulta', field: 'IdConsulta', label: 'Id', sortable: true, align: 'left' },
      { name: 'tipo', field: 'tipo', label: 'Tipo do Animal', sortable: true, align: 'left' },
      { name: 'nomeAnimal', field: 'nomeAnimal', label: 'Nome do Animal', sortable: true, align: 'left' },
      { name: 'contato', field: 'contato', label: 'Contato', sortable: true, align: 'left' },
      { name: 'CPF', field: 'CPF', label: 'CPF do Cliente', sortable: true, align: 'left' },
      { name: 'veterinario', field: 'veterinario', label: 'Veterinário', sortable: true, align: 'left' },
      { name: 'DataConsulta', field: 'DataConsulta', label: 'Data', sortable: true, align: 'left' },
      { name: 'status', field: 'Status', label: 'Status', sortable: true, align: 'left', filter: true },

      { name: 'acoes', field: 'acoes', label: 'Ações', sortable: true, align: 'right' },
    ])

    const fetchData = async () => {
      try {
        const response = await api.get('/api/Consulta');
        const consultas = response.data.map(consulta => {
          return {
            ...consulta,
            nomeAnimal: consulta.Animal.Nome,
            tipo: consulta.Animal.Tipo,
            veterinario: `${consulta.Veterinarios.Nome} ${consulta.Veterinarios.Sobrenome}`,
            contato: consulta.Animal.Clientes.Telefone,
            CPF: consulta.Animal.Clientes.CPF
          };
        });


        rows.value = filtroCPF.value
          ? consultas.filter(consulta => consulta.CPF.includes(filtroCPF.value))
          : consultas;

        console.log(consultas);
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }

    }

    const handleFilterChange = () => {
      fetchData();
    };
    watch(filtroCPF, handleFilterChange);

    const $q = useQuasar();

    const confirm = (id) => {

      $q.dialog({
        title: 'Confirmar',
        message: 'Tem certeza que deseja Cancelar a Consulta?',
        ok: 'Sim',
        cancel: 'Não'
      }).onOk(() => {
        deleteRow(id)
      })
    }

    const deleteRow = async (id) => {
      const response = await api.delete(`/api/Consulta/${id}`);

      console.log('Response:', response);
      $q.notify({
        message: 'Consulta Cancelada com sucesso.',
        color: 'secondary'
      })

      fetchData()

    }

    onMounted(() => {
      fetchData()
    })

    return {
      columns,
      rows,
      confirm,
      filtroCPF,
      getStatusBadgeColor,
    }
  }
})
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

