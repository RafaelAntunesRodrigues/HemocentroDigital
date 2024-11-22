<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h5 text-center">Perfil do Usuário</div>
      </q-card-section>

      <q-card-section>
        <div class="q-mt-md">
          <q-input
            v-model="usuario.name"
            outlined
            label="Nome"
            readonly
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuario.email"
            outlined
            label="E-mail"
            readonly
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuario.telefone"
            outlined
            label="Telefone"
            readonly
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuario.tipoSanguineo"
            outlined
            label="Tipo Sanguíneo"
            readonly
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuario.dataNasc"
            outlined
            label="Data de Nascimento"
            readonly
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuario.peso"
            outlined
            label="Peso"
            readonly
            class="q-my-md full-width"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Editar" color="primary" @click="abrirModalEdicao" />
      </q-card-actions>
    </q-card>

    <!-- Modal para Edição dos Dados do Usuário -->
    <q-dialog v-model="modalAberto" persistent>
      <q-card class="q-pa-md custom-modal-card">
        <q-card-section>
          <div class="text-h6 text-center">Editar Perfil do Usuário</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="usuarioEditado.name"
            outlined
            label="Nome"
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuarioEditado.email"
            outlined
            label="E-mail"
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuarioEditado.telefone"
            outlined
            label="Telefone"
            type="tel"
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuarioEditado.tipoSanguineo"
            outlined
            label="Tipo Sanguíneo"
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuarioEditado.dataNasc"
            outlined
            label="Data de Nascimento"
            type="date"
            class="q-my-md full-width"
          />
          <q-input
            v-model="usuarioEditado.peso"
            outlined
            label="Peso"
            class="q-my-md full-width"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="fecharModalEdicao" />
          <q-btn flat label="Salvar" color="primary" @click="salvarEdicao" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

export default defineComponent({
  name: "PerfilUsuarioPage",

  setup() {
    const usuario = ref({
      name: "",
      email: "",
      tipoSanguineo: "",
      telefone: "",
      dataNasc: "",
      peso: "",
    });

    const usuarioEditado = ref({ ...usuario.value, password: "" });
    const modalAberto = ref(false);
    const $q = useQuasar();

    const abrirModalEdicao = () => {
      usuarioEditado.value = { ...usuario.value, password: "" };
      modalAberto.value = true;
    };

    const fecharModalEdicao = () => {
      modalAberto.value = false;
    };

    const salvarEdicao = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }
        const doadorId = localStorage.getItem("doadorId");

        console.log(doadorId);
        // Enviar dados editados para o servidor
        const response = await api.put(
          `https://localhost:7237/api/Doadores/${doadorId}`,
          usuarioEditado.value,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          $q.notify({
            message: "Perfil atualizado com sucesso.",
            color: "positive",
          });
          // Atualiza os dados do perfil com os novos valores
          usuario.value = { ...usuarioEditado.value };
          fecharModalEdicao();
        }
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        if (error.response.data != null) {
          $q.notify({
            message: error.response.data,
            color: "negative",
          });
        } else {
          $q.notify({
            message: "Erro ao atualizar perfil. Por favor, tente novamente.",
            color: "negative",
          });
        }
      }
    };

    const fetchDadosUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token não encontrado");
        }

        const doadorId = localStorage.getItem("doadorId");
        if (!doadorId) {
          throw new Error("ID do doador não encontrado");
        }

        // Faz a requisição para obter os dados do doador por ID
        const response = await api.get(
          `https://localhost:7237/api/Doadores/${doadorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          usuario.value = response.data;
        }
      } catch (error) {
        console.error("Erro ao buscar dados do doador:", error);
        $q.notify({
          message: "Erro ao buscar dados do doador. Por favor, tente novamente.",
          color: "negative",
        });
      }
    };

    onMounted(() => {
      fetchDadosUsuario();
    });

    return {
      usuario,
      usuarioEditado,
      modalAberto,
      abrirModalEdicao,
      fecharModalEdicao,
      salvarEdicao,
    };
  },
});
</script>

<style scoped>
.custom-card {
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  margin-bottom: 20px;
}

.full-width {
  width: 100%;
}

.custom-modal-card {
  width: 80vw; /* Ajuste para definir a largura desejada do modal, 80% da largura da janela */
  max-width: 600px; /* Pode definir um valor máximo para evitar um modal muito grande */
}
</style>
