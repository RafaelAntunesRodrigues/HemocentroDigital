<template>
    <q-page padding>
        <div>
            <q-card class="custom-card">
                <q-card-section>
                    <h5>Editar Animal</h5>
                </q-card-section>
            </q-card>
        </div>
        <q-card>
            <q-card-section>
                <div class="q-pa-md">
                    <q-form @submit="onSubmit" @reset="onReset" class="row q-col-gutter-sm">
                        <q-input outlined class="col-lg-6 col-xs-12" filled v-model="form.nomeAnimal"
                            label="Nome do Animal *" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite o Nome do Animal']" />

                        <q-input outlined class="col-lg-6 col-xs-12" filled v-model="form.raca" label="Raça do Animal *"
                            lazy-rules :rules="[val => val && val.length > 0 || 'Digite a Raça do Animal']" />

                        <q-input outlined class="col-lg-6 col-xs-12" filled v-model="form.tipo" label="Tipo do Animal *"
                            lazy-rules :rules="[val => val && val.length > 0 || 'Digite o Tipo do Animal (cão, gato)']" />


                        <q-input outlined class="col-lg-6 col-xs-12" filled v-model="form.idade" label="Idade do Animal *"
                            lazy-rules :rules="[val => val && val.length > 0 || 'Digite a Idade do Animal']"
                            type="number" />

                        <q-select outlined class="col-lg-12 col-xs-12" v-model="form.sexo" label="Sexo do Animal"
                            :options="options" lazy-rules :rules="[val => val !== null || 'Selecione o sexo do Animal']" />

                        <div class="col-lg-12 col-xs-12 d-flex justify-end row">
                            <div>
                                <q-btn no-caps label="Cancelar" :to="{ name: 'animais' }" color="negative"
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
import { defineComponent, ref, onMounted, watch } from "vue";
import { api } from "src/boot/axios";
import { useRoute } from "vue-router";
import { useQuasar } from 'quasar'

export default defineComponent({
    name: "editAnimal",

    setup() {
        const route = useRoute();
        const $q = useQuasar();
        const form = ref({
            nomeAnimal: '',
            raca: null,
            sexo: null,
            tipo: null,
            idade: null
        });
        //COMPLETAR OS CAMPOS COM AS INFORMAÇÕES DO ANIMAL
        const fetchData = async () => {
            try {
                const animalId = route.params.idAnimal;
                const response = await api.get(`api/Animal/${animalId}`);
                const animalData = response.data;

                form.value.nomeAnimal = animalData.nome;
                form.value.raca = animalData.raca;
                form.value.tipo = animalData.tipo;
                form.value.sexo = animalData.sexo;
                form.value.idade = animalData.idade;

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        //FAZER UMA REQUISIÇÃO DE EDITAR
        const editar = async () => {
            const animalId = parseInt(route.params.idAnimal, 10);
            const clienteId = parseInt(route.params.idCliente, 10);

            const requestBody = {
                animalId: animalId,
                nome: form.value.nomeAnimal,
                raca: form.value.raca,
                sexo: form.value.sexo,
                tipo: form.value.tipo,
                idade: form.value.idade,
                ativo: true,
                clienteId: clienteId,
            };

            try {
                const response = await api.put('/api/Animal', requestBody);

                console.log('Response:', response);

                $q.notify({
                    message: 'Editado com sucesso.',
                    color: 'secondary'
                });

            } catch (error) {
                console.error('Erro ao editar animal:', error);
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

        onMounted(() => {
            fetchData();
        });

        return {
            form,
            options: [
                'Macho', 'Fêmea'
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
  