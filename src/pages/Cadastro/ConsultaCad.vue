<template>
    <q-page padding>
        <div>
            <q-card class="custom-card">
                <q-card-section>
                    <h5>Cadastrar Consulta</h5>
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

                        <q-select outlined class="col-lg-6 col-xs-12" v-model="form.idAnimal" label="Animal *"
                            :options="animals.map(animal => ({ label: `${animal.animalId} - ${animal.nome} - ${animal.tipo}`, value: animal.animalId }))"
                            lazy-rules :rules="[val => val !== null || 'Selecione um Animal']" />


                        <q-select outlined class="col-lg-6 col-xs-12" v-model="selectedClient" label="CPF do Cliente"
                            :options="clients.map(client => ({ label: `${client.cpf} - ${client.nome}`, value: client.userId }))"
                            @input="fetchAnimals" lazy-rules :rules="[val => val !== null || 'Selecione um Cliente']" />

                        <div class="col-lg-12 col-xs-12">
                            <q-editor v-model="form.descricao" min-height="5rem" />
                        </div>

                        <div class="col-lg-12 col-xs-12 d-flex justify-end row">
                            <div>
                                <q-btn no-caps label="Cancelar" :to="{ name: 'consultas' }" color="negative"
                                    style="width: 120px" />
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
import { ref, onMounted, watch } from 'vue'
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar'

export default {
    name: 'formConsulta',

    setup() {
        const $q = useQuasar();
        const clients = ref([]);
        const veterinarios = ref([]);
        const selectedClient = ref(null);
        const animals = ref([]);
        const form = ref({
            dataConsulta: '',
            descricao: '',
            idAnimal: null,
            idVeterinario: null
        });

        const submit = async () => {
            try {
                const response = await api.post('/api/Consulta', {
                    idVeterinario: form.value.idVeterinario.value,
                    idAnimal: form.value.idAnimal.value,
                    descricao: form.value.descricao,
                    dataConsulta: form.value.dataConsulta,
                    status: "",
                });

                console.log('Response:', response);
                $q.notify({
                    message: 'Cadastrado com sucesso.',
                    color: 'secondary'
                })

                onReset();

            } catch (error) {
                console.error('Erro ao gravar Consulta:', error);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await api.get('/api/Cliente');
                clients.value = response.data.$values;
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
            }
        };

        const fetchVets = async () => {
            try {
                const response = await api.get('/api/Veterinario');
                veterinarios.value = response.data.$values;
                console.log(veterinarios.value)
            } catch (error) {
                console.error('Erro ao buscar veterinarios:', error);
            }
        };

        const fetchAnimals = async () => {
            try {
                console.log(selectedClient.value.value)
                console.log(`/api/Animal/${selectedClient.value.value}/animais`)

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

        const confirm = () => {

            $q.dialog({
                title: 'Confirmar',
                message: 'Tem certeza que deseja cadastrar?',
                ok: 'Sim',
                cancel: 'Cancelar'
            }).onOk(() => {
                submit();
            })
        }

        const onReset = () => {
            form.value.idVeterinario = null;
            form.value.idAnimal = null;
            form.value.descricao = '';
            form.value.dataConsulta = '';
            selectedClient.value = null;

        };

        onMounted(() => {
            fetchClients();
            fetchVets();
        });

        return {
            clients,
            selectedClient,
            veterinarios,
            animals,
            form,
            fetchAnimals,
            confirm,
            onReset
        };
    },
};
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

