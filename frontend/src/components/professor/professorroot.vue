<template>
  <div class="container-fluid">
    <div class="row">
        <div class="col-md-3" style="padding-left: 0px;">
            <nav>
                <div class="d-flex flex-column flex-shrink-0 p-3 bg-light sidebar-container" style="width: 280px; min-height: 100vh;">
                    <a class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none" style="margin-left: 75px;">
                        <span class="fs-4" style="text-align:center;">Professor</span>
                    </a>
                    <span style="text-align:center;">{{ utilizadorLogado.login }}</span>
                    <span style="text-align:center;">{{ utilizadorLogado.nome ? utilizadorLogado.nome.replace(/([a-z]+) .* ([a-z]+)/i, "$1 $2") : " " }}</span>
                    <hr>
                    <label >Ano letivo:</label>
                    <select id="asd" class="form-select form-select-sm" aria-label=".form-select-sm example" v-model="this.counterStore.selectedAnoletivo">
                        <option  v-for="anoletivo in anosLetivos" :key="anoletivo" v-bind:value="anoletivo.id">
                        {{ anoletivo.anoletivo }}
                        </option>
                    </select>
                    <hr>
                    <ul class="nav nav-pills flex-column mb-auto">
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'vercadeiras' }"
                            :to="{ name: 'vercadeiras' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="mortarboard"/>
                                Unidades Curriculares
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
  name: "ProfessorRoot",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
        utilizadorLogado: [],
        anosLetivos: []
    };
  },
  methods: {
    logout(){
      sessionStorage.removeItem("tokenProfessor");
      localStorage.removeItem("professorState");
      this.$router.push("/professorlogin");
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
    }
  },
  mounted() {
      this.getAnosLetivos()
      this.getInfoUtilizadorLogado()
  },
};
</script>

<style>

</style>