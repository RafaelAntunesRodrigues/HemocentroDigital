<template>
  <q-page class="q-pa-xl login-background">
    <div class="q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.push('/login')">
        Voltar
      </q-btn>
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
            v-model="cadastro.name"
            label="Nome"
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
            v-model="cadastro.telefone"
            label="Número de Celular"
            type="number"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Tipo Sanguíneo</h7>
          <q-select
            class="q-mt-sm"
            outlined
            v-model="cadastro.tipoSanguineo"
            label="Tipo Sanguíneo"
            :options="[ 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-' ]"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Data de Nascimento</h7>
          <q-input
            class="q-mt-sm"
            v-model="cadastro.dataNasc"
            outlined
            label="Data de Nascimento"
            type="date"
          />
        </div>
        <div class="q-my-lg text-grey-7">
          <h7>Peso (kg)</h7>
          <q-input
            class="q-mt-sm"
            outlined
            v-model="cadastro.peso"
            label="Peso"
            type="number"
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
        <q-btn
          class="full-width q-mt-xl"
          style="background: #ff0000; color: white; padding: 25px"
          label="Cadastrar"
          @click="registerDoador"
        />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message" style="color: green">
          {{ successMessage }}
        </p>
      </div>
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
        name: "",
        email: "",
        telefone: "",
        tipoSanguineo: "",
        dataNasc: "",
        peso: "",
        password: "",
        isPwd: true,
      },
      successMessage: "",
      errorMessage: "",
    };
  },

  setup() {
    return {
      val: ref(false),
    };
  },

  methods: {
    async registerDoador() {
      try {
        // Montar o payload conforme o ViewModel do backend
        const doadorData = {
          name: this.cadastro.name,
          email: this.cadastro.email,
          password: this.cadastro.password,
          telafone: parseInt(this.cadastro.telefone),
          tipoSanguineo: this.cadastro.tipoSanguineo,
          dataNasc: this.cadastro.dataNasc,
          peso: this.cadastro.peso,
        };

        const response = await api.post("https://localhost:7237/api/Doadores", doadorData);
        if (response.status === 200) {
          this.successMessage = "Cadastrado com sucesso!";
          this.errorMessage = "";
          setTimeout(() => {
            this.$router.push({ name: "login" }); 
          }, 2000);
        } else {
          this.errorMessage =
            "Erro ao cadastrar. Verifique os dados e tente novamente.";
        }
      } catch (error) {
        console.error(error.response.data);
        if (error.response.data != null){
          this.errorMessage =  error.response.data;
        }
        else{
        this.errorMessage = "Erro ao cadastrar. Por favor, tente novamente.";
        }
      }
    },

    navigateToLogin() {
      const router = useRouter();
      router.push({ name: "login" });
    },

    clearErrorMessage() {
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
