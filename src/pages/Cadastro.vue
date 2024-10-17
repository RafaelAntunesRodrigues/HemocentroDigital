<template>
  <q-page class="q-pa-xl login-background">
    <div class="q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.push('/login')"
        >Voltar</q-btn
      >
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <div class="text-h4 text-bold q-mt-md q-mv-xl">Cadastre-se</div>
        <div class="text-subtitle1 text-grey-6 q-mt-md q-mv-xl">
          Seja um doador integrado!
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Nome</h7>
          <q-input
            class="q-mt-sm"
            outlined
            v-model="cadastro.nome"
            label="Nome"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Sobrenome</h7>
          <q-input
            class="q-mt-sm"
            outlined
            v-model="cadastro.sobrenome"
            label="Sobrenome"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Email</h7>
          <q-input
            class="q-mt-sm"
            outlined
            v-model="cadastro.email"
            label="Email"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Número de Celular</h7>
          <q-input
            class="q-mt-sm"
            outlined
            v-model="cadastro.celular"
            label="Número de Celular"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Tipo Sanguíneo</h7>
          <q-select
            class="q-mt-sm"
            outlined
            v-model="cadastro.tipoSanguineo"
            label="Tipo Sanguíneo"
            :options="[
              'A+',
              'A-',
              'B+',
              'B-',
              'AB+',
              'AB-',
              'O+',
              'O-'
            ]"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Senha</h7>
          <q-input
            class="q-mt-sm"
            v-model="cadastro.password"
            outlined
            label="Senha"
            :type="cadastro.isPwd ? 'password' : 'text'"
            @input="clearErrorMessage"
          >
            <template v-slot:append>
              <q-icon
                :name="cadastro.isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="cadastro.isPwd = !cadastro.isPwd"
              />
            </template>
          </q-input>
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Confirmar Senha</h7>
          <q-input
            class="q-mt-sm"
            v-model="cadastro.confirmPassword"
            outlined
            label="Confirmar Senha"
            :type="cadastro.isPwd ? 'password' : 'text'"
            @input="clearErrorMessage"
          >
            <template v-slot:append>
              <q-icon
                :name="cadastro.isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="cadastro.isPwd = !cadastro.isPwd"
              />
            </template>
          </q-input>
          <q-btn
            class="full-width q-mt-xl"
            style="background: #ff0000; color: white; padding: 25px"
            label="Cadastrar"
            @click="registerClinic"
          />
          <p
            v-if="passwordsDoNotMatch"
            class="error-message"
            style="color: red"
          >
            As senhas não coincidem.
          </p>
          <p
            v-if="successMessage"
            class="success-message"
            :href="navigateToLogin()"
            style="color: green"
          >
            {{ successMessage }}
          </p>
        </div>
      </div>
      <div class="q-my-lg text-grey-7"></div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";

export default {
  name: "PageCadastro",
  data() {
    return {
      cadastro: {
        nome: "",
        sobrenome: "",
        email: "",
        celular: "",
        tipoSanguineo: "",
        password: "",
        confirmPassword: "",
        isPwd: true,
      },
      successMessage: "",
      passwordsDoNotMatch: false,
      errorMessage: "",
    };
  },

  setup() {
    return {
      val: ref(false),
    };
  },

  methods: {
    registerClinic() {
      if (this.cadastro.password !== this.cadastro.confirmPassword) {
        this.passwordsDoNotMatch = true;
        this.successMessage = "";
        this.errorMessage = "As senhas não coincidem.";
        return;
      }

      const clinicData = {
        Nome: this.cadastro.nome,
        Email: this.cadastro.email,
        Celular: this.cadastro.celular,
        TipoSanguineo: this.cadastro.tipoSanguineo,
        SenhaAcesso: this.cadastro.password,
      };

      api
        .post("/api/Clinica/Create", clinicData)
        .then((response) => {
          console.log("Registrado com sucesso:", response.data);
          this.successMessage = "Cadastrado com sucesso";
          this.passwordsDoNotMatch = false;
          this.errorMessage = "";
          setTimeout(() => {
            this.navigateToLogin(), 2000;
          });
        })
        .catch((error) => {
          console.error("Erro no cadastro:", error);
        });
    },

    navigateToLogin() {
      const router = useRouter();
      router.push({ name: "login" });
    },

    clearErrorMessage() {
      this.passwordsDoNotMatch = false;
      this.errorMessage = "";
    },
  },
};
</script>

<style scoped>
.login-background {
  background-color: #ffffff;
}

.error-message {
  color: #ff0000;
}
</style>
