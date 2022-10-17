<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link" 
            :class="{ active: $route.name === 'paginainicial' }"
            :to="{ name: 'paginainicial' }">
                Página Inicial
            </router-link> 
          </li>
          <li class="nav-item">
            <router-link class="nav-link" 
            :class="{ active: $route.name === 'confirmacaoucs' }"
            :to="{ name: 'confirmacaoucs' }">
                UC's Inscritas
            </router-link> 
          </li>
          <li class="nav-item">
            <router-link class="nav-link" 
            :class="{ active: $route.name === 'inscricaoturnos' }"
            :to="{ name: 'inscricaoturnos' }">
                Inscrição Turnos
            </router-link> 
          </li>
          <li class="nav-item">
            <router-link class="nav-link" 
            :class="{ active: $route.name === 'sobre' }"
            :to="{ name: 'sobre' }">
                Sobre
            </router-link> 
          </li>
        </ul>
        <ul class="navbar-nav" style="text-align: left;" @click="logout()">
            <li class="nav-item">
                <a class="nav-link" href="#">{{ counterStore.utilizadorLogado.nome ? counterStore.utilizadorLogado.nome.replace(/([a-z]+) .* ([a-z]+)/i, "$1 $2") : " " }} ({{ counterStore.utilizadorLogado.login }}) - Logout</a>
            </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view></router-view>
</template>

<script>
import { useCounterStore } from "../../stores/counter"
export default {
  name: "AlunoRoot",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
      utilizadorLogado: []
    };
  },
  methods: {
    logout(){
      sessionStorage.removeItem("tokenAluno");
      localStorage.removeItem("alunoState");
      this.$router.push("/login");
    },
    getAnosLetivos(){
      this.$axios.get("anoletivo")
      .then((response) => {
          this.anosLetivos = response.data
          this.anosLetivos.forEach((anoLetivo) => {
              if (anoLetivo.ativo == 1) {
                  this.counterStore.selectedAnoletivo = anoLetivo.id
                  this.counterStore.ano = anoLetivo.anoletivo
                  if (anoLetivo.semestreativo != null) {
                    this.counterStore.semestre = anoLetivo.semestreativo
                }
              }
          })
      })
      .catch((error) => {
          console.log(error.response);
      });
    },
    getInfoUtilizadorLogado(){
        this.$axios.get("utilizadorlogado")
        .then((response) => {
            this.counterStore.utilizadorLogado = response.data.data
        })
        .catch((error) => {
            console.log(error.response);
        });
    }
  },
  mounted() {
    this.getAnosLetivos()
    this.getInfoUtilizadorLogado()
  }
}
</script>

<style scoped>
.mx-auto{
  margin-left: 0px!important;
}
</style>