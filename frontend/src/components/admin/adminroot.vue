<template>
  <div class="container-fluid">
    <div class="row">
        <div class="col-md-3" style="padding-left: 0px;">
            <nav>
                <div class="d-flex flex-column flex-shrink-0 p-3 bg-light sidebar-container" style="width: 280px; min-height: 100vh;">
                    <a class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none" style="margin-left:50px;">
                        <span class="fs-4" style="text-align:center;">Administrador</span>
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
                            :class="{ active: $route.name === 'dashboard' }"    
                            :to="{ name: 'dashboard' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="display"/>
                                Dashboard
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerircoordenadores' }"
                            :to="{ name: 'gerircoordenadores' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="person-lines-fill"/>
                                Gerir Coordenadores
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerircursos' || $route.name === 'gerircadeira' }"
                            :to="{ name: 'gerircursos' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="mortarboard"/>
                                Gerir Cursos
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'geriralunos' }"
                            :to="{ name: 'geriralunos' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="people"/>
                                Estudantes
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerirperiodos' }"
                            :to="{ name: 'gerirperiodos' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="calendar-event"/>
                                Gerir Períodos
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerirconfirmacoes' }"
                            :to="{ name: 'gerirconfirmacoes' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="clipboard2-check"/>
                                Gerir Pedidos UC
                            </router-link>  
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'atualizardados' }"
                            :to="{ name: 'atualizardados' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="arrow-clockwise"/>
                                Atualizar Base Dados
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'gerirutilizador' }"
                            :to="{ name: 'gerirutilizador' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="person"/>
                                Gerir utilizador
                            </router-link>
                        </li>
                        <li class="nav-item sidebar-navigation">
                            <router-link class="nav-link link-dark" 
                            :class="{ active: $route.name === 'logs' }"
                            :to="{ name: 'logs' }">
                                <BootstrapIcon style="margin-right: 15px"
                                icon="list-columns-reverse"/>
                                Logs
                            </router-link>
                        </li>
                    </ul>
                    <hr>
                    <div>
                        <a type="button" class="d-flex align-items-center link-dark text-decoration-none" @click="logout()">
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
  name: "AdminRoot",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
        anosLetivos: [],
        utilizadorLogado: []
    };
  },
  methods: {
    logout(){
      sessionStorage.removeItem("tokenAdmin");
      localStorage.removeItem("adminState");
      this.$router.push("/adminlogin");
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
        if (this.counterStore.selectedCourse != null) {
            this.counterStore.getCourseWithUCs(this.counterStore.selectedCourse.code)
        }
        this.counterStore.aberturasByCourse = []
        this.counterStore.pedidosByCourse = []
    }
  },
  mounted() {
      this.getAnosLetivos()
      this.getInfoUtilizadorLogado()
  },
};
</script>

<style>

.sidebar-container {
  position: fixed;
  text-align: left;
  width: 220px;
  height: 100%;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.nav-link {
  border-radius: 0;
}

.btn-toggle-nav a {
  display: inline-flex;
  padding: .1875rem .5rem;
  margin-top: .125rem;
  margin-left: 1.25rem;
  text-decoration: none;
}
.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: #d2f4ea;
}

.scrollarea {
  overflow-y: auto;
}

.fw-semibold { font-weight: 600; }
.lh-tight { line-height: 1.25; }

/* .nav-link.active{
    background-color: aqua !important;
} */

.sidebar-navigation:hover{ 
    background-color: aliceblue;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>