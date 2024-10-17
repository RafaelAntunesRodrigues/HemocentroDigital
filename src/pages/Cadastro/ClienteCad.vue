<template>
  <q-page padding>
    <div>
      <q-card class="custom-card">
        <q-card-section>
          <h5>Cadastrar Cliente</h5>
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
              v-model="form.nome"
              label="Nome *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Digite o nome do cliente ',
              ]"
            />

            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.sobrenome"
              label="Sobrenome *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Digite o sobrenome do cliente',
              ]"
            />

            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.cpf"
              label="CPF *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Digite um CPF válido',
              ]"
            />
            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.telefone"
              label="Telefone"
            />
            <q-input
              outlined
              class="col-lg-12 col-xs-12"
              filled
              v-model="form.email"
              label="E-mail *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Digite um e-mail válido',
              ]"
            />

            <div class="col-lg-12 col-xs-12">
              <q-editor v-model="editor" min-height="5rem" />
            </div>

            <div class="col-lg-12 col-xs-12 d-flex justify-end row">
              <div>
                <q-btn
                  no-caps
                  label="Cancelar"
                  :to="{ name: 'clientes' }"
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
import { defineComponent, onMounted, ref } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "cadCliente",

  setup() {
    const $q = useQuasar();
    const clients = ref([]);
    const form = ref({
      nome: "",
      sobrenome: "",
      email: "",
      cpf: "",
      telefone: "",
    });

    const submit = async () => {
      const body = {
        nome: form.value.nome,
        sobrenome: form.value.sobrenome,
        email: form.value.email,
        cpf: form.value.cpf,
        telefone: form.value.telefone,
        ativo: true,
        senha: "123",
      };
      try {
        const response = await api.post(
          `api/Cliente/api/Clinica/CadastrarCliente?clinicaId=1`,
          body
        );
        console.log(body);
        console.log("Response:", response);

        $q.notify({
          message: "Cadastrado com sucesso.",
          color: "secondary",
        });
      } catch (error) {
        console.error("Erro no cadastro:", error);
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
      form.value.nome = " ";
      form.value.sobrenome = " ";
      form.value.email = " ";
      form.value.cpf = " ";
      form.value.telefone = " ";
    };

    return {
      clients,
      form,
      confirm,
      onReset,
    };
  },
});
</script>

<style scoped>
.custom-card {
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>
