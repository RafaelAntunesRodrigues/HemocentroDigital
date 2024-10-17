<template>
  <q-page padding>
    <div>
      <q-card class="custom-card">
        <q-card-section>
          <h5>Editar Consulta</h5>
        </q-card-section>
      </q-card>
    </div>
    <q-card>
      <q-card-section>
        <div class="q-pa-md">
          <q-form @submit="onSubmit" @reset="onReset" class="row q-col-gutter-sm">
            <q-input mask="##/##/#### ##:##" fill-mask outlined class="col-lg-6 col-xs-12" filled
              v-model="form.dataConsulta" label="Data *" lazy-rules
              :rules="[val => val && val.length > 0 || 'Digite a Data da Consulta']" />

            <q-select outlined class="col-lg-6 col-xs-12" v-model="form.idVeterinario" label="Veterinário *"
              :options="veterinarios.map(vet => ({ label: `${vet.cpf} - ${vet.nome}`, value: vet.userId }))"
              @input="fetchAnimals" lazy-rules :rules="[val => val !== null || 'Selecione um Veterinário']" />

            <q-select outlined class="col-lg-6 col-xs-12" v-model="selectedAnimal" label="Animal *"
              :options="animals.map(animal => ({ label: `${animal.animalId} - ${animal.nome} - ${animal.tipo}`, value: animal.animalId }))"
              lazy-rules :rules="[val => val !== null || 'Selecione um Animal']" />


            <q-select outlined class="col-lg-6 col-xs-12" v-model="selectedClient" label="CPF do Cliente"
              :options="clients.map(client => ({ label: `${client.cpf} - ${client.nome}`, value: client.userId }))"
              @input="fetchAnimals" lazy-rules :rules="[val => val !== null || 'Selecione um Cliente']" />

            <q-select outlined class="col-lg-12 col-xs-12" v-model="form.status" label="Status da Consulta"
              :options="options" lazy-rules :rules="[val => val !== null || 'Selecione um Status da Consulta']" />

            <div class="col-lg-12 col-xs-12">
              <q-editor v-model="form.descricao" min-height="5rem" />
            </div>

            <div class="col-lg-12 col-xs-12 d-flex justify-end row">
              <div>
                <q-btn no-caps label="Cancelar" :to="{ name: 'consultas' }" color="negative" style="width: 120px" />
              </div>
              <div class="q-ml-md">
                <q-btn class="text-white" no-caps label="Confirmar" @click="confirm()"
                  style="background-color: #26335d; width: 120px;" />
              </div>
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { useRoute } from "vue-router";
import { useQuasar } from 'quasar'

export default defineComponent({
  name: "editConsulta",



  setup() {
    const route = useRoute();
    const $q = useQuasar();
    const clients = ref([]);
    const veterinarios = ref([]);
    const selectedClient = ref(null);
    const selectedAnimal = ref();
    const animals = ref([]);
    const form = ref({
      dataConsulta: '',
      descricao: '',
      idAnimal: null,
      idVeterinario: null,
      status: null
    });

    const fetchData = async () => {
      try {
        const consultaId = route.params.id;
        const response = await api.get(`api/Consulta/${consultaId}`);
        const consultaData = response.data;

        form.value.dataConsulta = consultaData.dataConsulta;
        form.value.descricao = consultaData.descricao;
        form.value.status = consultaData.status;

        selectedAnimal.value = consultaData.animalId;


        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };


    const editar = async () => {
      try {
        const response = await api.put('/api/Consulta', {
          idVeterinario: form.value.idVeterinario.value,
          animalId: selectedAnimal.value,
          descricao: form.value.descricao,
          dataConsulta: form.value.dataConsulta,
          idConsulta: route.params.id,
          status: form.value.status

        });

        console.log('Response:', response);
        $q.notify({
          message: 'Editado com sucesso.',
          color: 'secondary'
        })

      } catch (error) {
        console.error('Erro ao gravar Consulta:', error);
      }
    };

    const confirm = () => {

      $q.dialog({
        title: 'Confirmar',
        message: 'Tem certeza que deseja editar a Consulta?',
        ok: 'Sim',
        cancel: 'Não'
      }).onOk(() => {
        editar();
      })
    }
    const fetchClients = async () => {
      try {
        const response = await api.get('/api/Cliente');
        clients.value = response.data.$values;
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    // const onReset = () => {
    //   form.value.idVeterinario = null;
    //   selectedAnimal = null;
    //   form.value.descricao = '';
    //   form.value.dataConsulta = '';
    //   selectedClient.value = null;

    // };

    const fetchVets = async () => {
      try {
        const response = await api.get('/api/Veterinario');
        veterinarios.value = response.data.$values;
        console.log(veterinarios.value)
      } catch (error) {
        console.error('Erro ao buscar veterinarios:', error);
      }
    };

    const fetchAnimalsInit = async () => {
      try {
        const response = await api.get(`/api/Animal`);
        console.log(response.data.$values);
        animals.value = response.data.$values;
      } catch (error) {
        animals.value = [];
        console.error('Erro ao buscar animais:', error);
      }

    };

    const fetchAnimals = async () => {
      try {
        const response = await api.get(`/api/Animal/${selectedClient.value.value}/animais`);

        animals.value = response.data.$values;
      } catch (error) {
        animals.value = [];
        console.error('Erro ao buscar animais:', error);
      }

    };

    const handleFilterChange = () => {
      fetchAnimals();
    };
    watch(selectedClient, handleFilterChange);

    onMounted(() => {
      fetchData();
      fetchClients();
      fetchVets();
      fetchAnimalsInit();
    });

    return {
      form,
      veterinarios,
      fetchAnimals,
      animals,
      clients,
      selectedClient,
      selectedAnimal,
      options: [
        'Cancelada', 'Agendada', 'Concluída'
      ],
      confirm,
    };
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
  align-items: center;
  margin-bottom: 20px;
}
</style>
