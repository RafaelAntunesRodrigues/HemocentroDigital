<template>
  <q-page padding>
    <div>
      <q-card class="custom-card">
        <q-card-section>
          <h5>Cadastrar Animal</h5>
        </q-card-section>
      </q-card>
    </div>
    <q-card>
      <q-card-section>
        <div class="q-pa-md">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="row q-col-gutter-sm"
          >
            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.nomeAnimal"
              label="Nome do Animal *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Digite o Nome do Animal',
              ]"
            />

            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.raca"
              label="Raça do Animal *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Digite a Raça do Animal',
              ]"
            />

            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.tipo"
              label="Tipo do Animal *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Digite o Tipo do Animal (cão, gato)',
              ]"
            />

            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.idade"
              label="Idade do Animal *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Digite a Idade do Animal',
              ]"
              type="number"
            />

            <q-select
              outlined
              class="col-lg-6 col-xs-12"
              v-model="form.sexo"
              label="Sexo do Animal"
              :options="options"
              lazy-rules
              :rules="[(val) => val !== null || 'Selecione o sexo do Animal']"
            />

            <q-select
              outlined
              class="col-lg-6 col-xs-12"
              v-model="selectedClient"
              label="CPF do Cliente"
              :options="
                clients.map((client) => ({
                  label: `${client.cpf} - ${client.nome}`,
                  value: client.userId,
                }))
              "
              lazy-rules
              :rules="[
                (val) =>
                  val !== null || 'Selecione um Cliente para esse animal',
              ]"
            />

            <div class="col-lg-12 col-xs-12 d-flex justify-end row">
              <div>
                <q-btn
                  no-caps
                  label="Cancelar"
                  :to="{ name: 'animais' }"
                  color="negative"
                  style="width: 120px"
                />
              </div>
              <div class="q-ml-md">
                <q-btn
                  class="text-white"
                  no-caps
                  label="Confirmar"
                  @click="confirm()"
                  style="background-color: #26335d; width: 120px"
                />
              </div>
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

export default {
  name: "formAnimais",

  setup() {
    const $q = useQuasar();
    const clients = ref([]);
    const selectedClient = ref(null);
    const form = ref({
      nomeAnimal: "",
      raca: null,
      sexo: null,
      tipo: null,
      idade: null,
    });

    const submit = async () => {
      const body = {
        nome: form.value.nomeAnimal,
        raca: form.value.raca,
        sexo: form.value.sexo,
        tipo: form.value.tipo,
        idade: parseFloat(form.value.idade),
        ativo: true,
      };

      try {
        const response = await api.post(
          `api/Cliente/IncluirAnimal?id=${selectedClient.value.value}`,
          body
        );
        console.log(body);
        console.log("Response:", response);

        $q.notify({
          message: "Cadastrado com sucesso.",
          color: "secondary",
        });
      } catch (error) {
        console.error("Erro ao cadastrar animal:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await api.get("/api/Cliente");
        clients.value = response.data.$values;
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    const confirm = () => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja cadastrar?",
        ok: "Sim",
        cancel: "Cancelar",
      }).onOk(() => {
        submit();
      });
    };

    const onReset = () => {
      form.value.nomeAnimal = " ";
      form.value.raca = " ";
      form.value.sexo = " ";
      form.value.tipo = " ";
      form.value.idade = " ";
      selectedClient.value = null;
    };

    onMounted(() => {
      fetchClients();
    });

    return {
      clients,
      selectedClient,
      form,
      confirm,
      onReset,
      options: ["Macho", "Fêmea"],
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
