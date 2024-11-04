<template>
  <q-page class="q-pa-xl login-background">
    <div class="q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.push('/')"
        >Voltar</q-btn
      >
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <div class="text-h4 text-bold q-mt-md q-mv-xl">Acessar Conta</div>
        <div class="text-subtitle1 text-grey-6 q-mt-md q-mv-xl">
          Se você já possui cadastro, faça login com seu email e senha.
        </div>
        <div class="q-my-xl text-grey-7">
          <h7>Endereço de Email</h7>
          <q-input
            class="q-mt-sm"
            outlined
            v-model="login.email"
            label="Email"
          />
        </div>
        <div class="q-my-xl text-grey-7">
          <h7>Senha</h7>
          <q-input
            class="q-mt-sm"
            v-model="login.senha"
            outlined
            label="Senha"
            :type="login.isPwd ? 'password' : 'text'"
          >
            <template v-slot:append>
              <q-icon
                :name="login.isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="login.isPwd = !login.isPwd"
              />
            </template>
          </q-input>
          <div class="q-pa-md text-grey-6">
            <q-checkbox v-model="val">Lembrar-se de mim</q-checkbox>
          </div>
          <q-btn
            class="full-width"
            style="background: #ff0000; color: white; padding: 25px"
            label="Acessar"
            @click="fazerLogin"
          />
          <div v-if="erroLogin" class="mensagem-erro">
            {{ erroLogin }}
          </div>
        </div>
        <div class="q-mt-md text-center">
          Não possui uma conta?
          <router-link :to="{ name: 'cadastro' }">Cadastre-se</router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { api } from "src/boot/axios";

export default {
  name: "PageLogin",
  data() {
    return {
      login: {
        email: "",
        senha: "",
        isPwd: true,
      },
      erroLogin: null,
    };
  },

  setup() {
    return {
      val: ref(false),
    };
  },

  methods: {
  async fazerLogin() {
    const email = this.login.email;
    const senha = this.login.senha;

    try {
      const response = await api.post('https://localhost:7237/api/Login', {
        email: email,
        password: senha,
      });

      // Se a resposta tiver status 200, o login foi bem-sucedido
      if (response && response.status === 200) {
        
        localStorage.setItem('token', response.data);
        this.$router.push({ name: "consultas" });
      } else {
        // Tratar outros status de sucesso diferentes de 200 (por precaução)
        this.erroLogin =
          "Email ou Senha incorretos. Por favor, tente novamente.";
      }
    } catch (error) {
      console.error("Erro durante o login:", error);

      // Tratamento seguro para erro que pode não conter todos os campos esperados
      if (error.response && error.response.data) {
        this.erroLogin = error.response.data.message || "Erro durante o login. Por favor, tente novamente.";
      } else {
        this.erroLogin = "Erro durante o login. Por favor, tente novamente.";
      }
    }
  },
}
,
};
</script>

<style scoped>
.login-background {
  background-color: #ffffff;
}

.mensagem-erro {
  color: #ff0000;
  margin-top: 10px;
}
</style>
