<template>
  <q-page padding>
    <div>
      <q-card class="custom-card">
        <q-card-section>
          <h5>Editar Veterinário</h5>
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
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.email"
              label="Contato *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Digite o Contato do Veterinário',
              ]"
            />

            <q-input
              outlined
              class="col-lg-12 col-xs-12"
              filled
              v-model="form.contato"
              label="E-mail *"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Digite o E-mail do Veterinário',
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

export default defineComponent({
  name: "editVeterinario",

  setup() {
    const form = ref({
      cpf: "",
      nome: "",
      sobrenome: "",
      email: "",
      contato: "",
    });
    return {
      form,
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
