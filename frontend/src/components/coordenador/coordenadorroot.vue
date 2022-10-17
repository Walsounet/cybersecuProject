<template>
  <div class="container-fluid">
    <div class="row">
        <div class="col-md-3" style="padding-left: 0px;">
            <nav>
                <div class="d-flex flex-column flex-shrink-0 p-3 bg-light sidebar-container" style="width: 280px; min-height: 100vh;">
                    <a class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none" style="margin-left:50px;">
                        <span class="fs-4" style="text-align:center;">Coordenador</span>
                    </a>
                    <span style="text-align:center;">{{ utilizadorLogado.login }}</span>
                    <span style="text-align:center;">{{ utilizadorLogado.nome ? utilizadorLogado.nome.replace(/([a-z]+) .* ([a-z]+)/i, "$1 $2") : " " }}</span>
                    <hr>
                    <label >Ano letivo:</label>
                    <select id="asd" class="form-select form-select-sm" aria-label=".form-select-sm example" v-model="this.counterStore.selectedAnoletivo" v-on:change="onChangeAnoSemestre">
                        <option  v-for="anoletivo in anosLetivos" :key="anoletivo" v-bind:value="anoletivo.id">
                        {{ anoletivo.anoletivo }}
                        </option>
                    </select>
                    <label>Semestre:</label>
                    <select class="form-select form-select-sm" aria-label=".form-select-sm example" v-model="this.counterStore.semestre" v-on:change="onChangeAnoSemestre">
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                    <hr>
                    <ul class="nav nav-pills flex-column mb-auto">
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'dashboardC' }"
                            :to="{ name: 'dashboardC' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="display"/>
                                Dashboard
                            </router-link>
                        </li>
                        <li v-if="this.coordenadorPrincipal" class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerircoordenadoresC' }"
                            :to="{ name: 'gerircoordenadoresC' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="person-lines-fill" />
                                Gerir Coordenadores
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerircursosC' || $route.name === 'gerircadeiraC'}"
                            :to="{ name: 'gerircursosC' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="mortarboard"/>
                                Gerir Cursos
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'geriralunosC' }"
                            :to="{ name: 'geriralunosC' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="people"/>
                                Estudantes
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerirconfirmacoesC' }"
                            :to="{ name: 'gerirconfirmacoesC' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="clipboard2-check"/>
                                Gerir Confirmações UC
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerirperiodosC' }"
                            :to="{ name: 'gerirperiodosC' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="calendar-event"/>
                                Gerir Períodos
                            </router-link>
                        </li>
                    </ul>
                    <hr>
                    <div>
                        <a type="button" class="d-flex align-items-center link-dark text-decoration-none" @click="logout()">
                            <!--<img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">-->
                            <strong>Logout</strong>
                        </a>
                    </div>
                </div>
            </nav>
        </div>  
        <div class="col-md-8">
            <main>
                <router-view></router-view>
            </main>
        </div>
    </div>
  </div>    
</template>

<script>
import { useCounterStore } from "../../stores/counter"
export default {
  name: "CoordenadorRoot",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
        utilizadorLogado: [],
        coordenadorPrincipal: true,
        anosLetivos: []
    };
  },
  methods: {
    logout(){
      sessionStorage.removeItem("tokenCoordenador");
      localStorage.removeItem("coordenadorState");
      localStorage.removeItem("isCoordenadorPrincial");
      this.$router.push("/coordenadorlogin");
    },
    getAnosLetivos(){
        this.$axios.get("anoletivo")
        .then((response) => {
            this.anosLetivos = response.data
            this.anosLetivos.forEach((anoLetivo) => {
                if (anoLetivo.ativo == 1) {
                    this.counterStore.selectedAnoletivo = anoLetivo.id
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
            this.utilizadorLogado = response.data.data
        })
        .catch((error) => {
            console.log(error.response);
        });
    },
    onChangeAnoSemestre(){
        this.counterStore.courses = []
    }
  },
  mounted() {
      if(sessionStorage.getItem("tokenCoordenador") && sessionStorage.getItem('isCoordenadorPrincial') == 0){
          this.coordenadorPrincipal  = false
      }
      this.getAnosLetivos()
      this.getInfoUtilizadorLogado()
  },
};
</script>

<style>

</style>