<template>
  <q-page class="q-pa-xl estoque-background">
    <!-- <div class="q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.push('/')"
        >Voltar</q-btn
      >
    </div> -->

    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <div class="text-h4 text-bold q-mt-md q-mv-xl">Estoque de Sangue (Quantidade de Bolsas)</div>

        <div>
          <canvas id="estoqueChart"></canvas>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { onMounted } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "EstoqueSangue",
  setup() {
    const tiposSangue = [
      { tipo: "O+", quantidade: 12 },
      { tipo: "A+", quantidade: 8 },
      { tipo: "B+", quantidade: 5 },
      { tipo: "AB+", quantidade: 3 },
      { tipo: "O-", quantidade: 9 },
      { tipo: "A-", quantidade: 6 },
      { tipo: "B-", quantidade: 4 },
      { tipo: "AB-", quantidade: 2 },
    ];

    onMounted(() => {
      const ctx = document.getElementById("estoqueChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: tiposSangue.map((sangue) => sangue.tipo),
          datasets: [
          {
           label: "Quantidade Ideal",
           data: tiposSangue.map((sangue) => (sangue.quantidade >= 10 ? sangue.quantidade : null)),
           backgroundColor: tiposSangue.map((sangue) =>
            sangue.quantidade >= 10 ? "#00c853" : "#00c853"
            ),
            borderColor: "#000000",
            borderWidth: 1,
          },
          {
            label: "Quantidade Crítica",
            data: tiposSangue.map((sangue) => (sangue.quantidade < 10 ? sangue.quantidade : null)),
            backgroundColor: tiposSangue.map((sangue) =>
              sangue.quantidade < 10 ? "#ff0000" : "#ff0000"
            ),
            borderColor: "#000000",
            borderWidth: 1,
          },


          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1000,
            easing: "easeInOutQuart",
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 5,
              },
            },
          },
        },
      });
    });
  },
};
</script>

<style scoped>
.estoque-background {
  background-color: #ffffff;
}
</style>
