<template>
  <q-page padding>
    <div>
      <q-card class="custom-card">
        <q-card-section>
          <h5>Cadastrar Agendamento</h5>
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
            <!-- Data do Agendamento -->
            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.data"
              label="Data do Agendamento *"
              type="date"
              lazy-rules
              :rules="[
                (val) => !!val || 'Escolha uma data para o agendamento',
              ]"
            />

            <!-- Horário do Agendamento -->
            <q-input
              outlined
              class="col-lg-6 col-xs-12"
              filled
              v-model="form.hora"
              label="Horário do Agendamento *"
              type="time"
              lazy-rules
              :rules="[
                (val) => !!val || 'Escolha um horário para o agendamento',
              ]"
            />

            <div class="col-lg-12 col-xs-12 d-flex justify-end row">
              <div>
                <q-btn
                  no-caps
                  label="Cancelar"
                  :to="{ name: 'agendamentos' }"
                  color="negative"
                  style="width: 120px"
                />
              </div>
              <div class="q-ml-md">
                <q-btn
                  class="text-white"
                  no-caps
                  label="Confirmar"
                  @click="confirm"
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

export default defineComponent({
  name: "cadAgendamento",

  setup() {
    const $q = useQuasar();
    const form = ref({
      data: "",
      hora: "",
    });

    const submit = async () => {
      const body = {
        data: form.value.data,
        hora: form.value.hora,
      };
      try {
        await api.post("api/Agendamento/CadastrarAgendamento", body);
        $q.notify({
          message: "Agendamento cadastrado com sucesso.",
          color: "secondary",
        });
      } catch (error) {
        console.error("Erro ao cadastrar agendamento:", error);
      }
    };

    const confirm = () => {
      $q.dialog({
        title: "Confirmar",
        message: "Tem certeza que deseja cadastrar este agendamento?",
        ok: "Sim",
        cancel: "Cancelar",
      }).onOk(() => {
        submit();
      });
    };

    const onReset = () => {
      form.value = {
        data: "",
        hora: "",
      };
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
</style>
