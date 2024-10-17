<template>
  <q-page padding>
    <div>
      <q-card class="custom-card">
        <q-card-section>
          <h5>Cadastrar Veterinário</h5>
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
              v-model="form.cpf"
              label="CPF Veterinário *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Digite o CPF do Veterinário',
              ]"
            />

            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.nome"
              label="Nome *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Digite o nome do Veterinário',
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
                  (val && val.length > 0) ||
                  'Digite o sobrenome do Veterinário',
              ]"
            />

            <q-input
              outlined
              class="col-lg-12 col-xs-12"
              filled
              v-model="form.email"
              label="E-mail *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Digite o E-mail do Veterinário',
              ]"
            />

            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.telefone"
              label="Telefone *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Digite o Contato do Veterinário',
              ]"
            />

            <div class="col-lg-12 col-xs-12">
              <q-editor v-model="editor" min-height="5rem" />
            </div>

            <div class="col-lg-12 col-xs-12 d-flex justify-end row">
              <div>
                <q-btn
                  label="Cancelar"
                  no-caps
                  :to="{ name: 'veterinarios' }"
                  color="negative"
                  style="width: 120px"
                />
              </div>
              <div class="q-ml-md">
                <q-btn
                  label="Confirmar"
                  no-caps
                  type="submit"
                  class="text-white"
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
import { defineComponent, ref } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
console.log("Isso não está funcionando");

export default defineComponent({
  name: "formVeterinario",

  setup() {
    3;
    const $q = useQuasar();
    const form = ref({
      cpf: "",
      nome: "",
      sobrenome: "",
      email: "",
      telefone: "",
    });

    const submit = async () => {
      const body = {
        cpf: form.value.cpf,
        nome: form.value.nome,
        sobrenome: form.value.sobrenome,
        email: form.value.email,
        telefone: form.value.telefone,
        ativo: true,
      };

      try {
        const response = await api.post(
          `/api/Veterinario/api/Clinica/AssociarVeterinario?clinicaId=1`,
          body
        );
        console.log(body);
        console.log("Response:", response);

        $q.notify({
          message: "Cadastrado com sucesso.",
          color: "secondary",
        });
      } catch (error) {
        console.error("Erro ao cadastrar veterinário:", error);
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
      form.value.cpf = " ";
      form.value.nome = " ";
      form.value.sobrenome = " ";
      form.value.email = " ";
      form.value.telefone = " ";
      selectedClinica.value = null;
    };

    return {
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
  /* Defina a altura desejada */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>
