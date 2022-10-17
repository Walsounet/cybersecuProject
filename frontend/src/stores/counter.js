import { defineStore } from 'pinia'
import axios from "axios";

export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    selectedAnoletivo: null,
    selectedCourse: null,
    ano: null,
    semestre: null,
    anosletivos: [],
    courses: [],
    coursesToVSelect: [],
    courseWithUCs: [],
    tipoTurnoCurso: [],
    turnoToManage: null,
    aberturasByCourse: [],
    aberturasByCourseDeleted: [],
    yearsCourse: [],
    pedidosByCourse: [],
    pedidosByCourseAntigos: [],
    aberturaConfirmacaoTodos: [],
    aberturaConfirmacao123: [],
    aberturaConfirmacao1: [],
    aberturaConfirmacao2: [],
    aberturaConfirmacao3: [],
    aberturaInscricaoTodos: [],
    aberturaInscricao123: [],
    aberturaInscricao1: [],
    aberturaInscricao2: [],
    aberturaInscricao3: [],
    utilizadorLogado: []
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    async getAnosLetivos() {
      try {
        let response = await axios.get("anoletivo")
        this.anosletivos = response.data
        return response.data; 
      } catch (error) {
        console.log(error.response)
        throw error
      }
    },
    async getCourses(tipo = 0) {
      try {
        let response = await axios.get("cursoauth")
        this.courses = response.data
        if (this.courses.length == 1 && tipo == 1) {
          this.getCourseWithUCs(this.courses[0].id)
        } else if (this.courses.length == 1 && tipo == 2) {
          this.getAberturasByCourse(this.courses[0].id)
        } else if (this.courses.length == 1 && tipo == 3) {
          this.getPedidosByCourse(this.courses[0].id)
        }
        this.coursesToVSelect = []
        this.courses.forEach(curso => {
          this.coursesToVSelect.push({label: "["+curso.codigo+"] "+curso.nome, code: curso.id})
        });
        return response.data;
      } catch (error) {
        console.log(error.response)
        throw error
      }
    },
    async getCourseWithUCs(courseId){
      console.log(courseId)
      try {
        let response = await axios.get("cursoauth/cadeiras/" + courseId + "/" + this.selectedAnoletivo + "/" + this.semestre)
        this.courseWithUCs = response.data.cadeiras
        this.tipoTurnoCurso = []
        response.data.tiposTurnos.forEach(turno => {
          this.tipoTurnoCurso.push({tipo: turno,vagas: null})
        })
        console.log(this.tipoTurnoCurso)
      } catch {
        console.log(error.response);
        throw error
      }        
    },
    async getPedidosByCourse(courseId){
      if(this.courses.length > 1 && this.pedidosByCourse.length != 0){
        this.pedidosByCourse = []
        this.pedidosByCourseAntigos = []
      }
      try {
        let response = await axios.get("curso/pedidos/" + courseId + "/" + this.selectedAnoletivo + "/" + this.semestre)
        this.pedidosByCourse = response.data.pedidos;
        this.pedidosByCourseAntigos = response.data.pedidosntigos;
        console.log(response)
      } catch {
        console.log(error.response);
        throw error
      }        
    },
    async getAberturasByCourse(courseId){
      try {
        let response = await axios.get("curso/aberturas/" + courseId + "/" + this.selectedAnoletivo + "/" + this.semestre)
        this.aberturasByCourse = response.data.aberturasAtivas
        this.aberturasByCourseDeleted = response.data.aberturasDeleted
        console.log(this.aberturasByCourseDeleted)
        this.yearsCourse = []
        for (let i = 0; i <= this.aberturasByCourse.totalanos; i++) {
          this.yearsCourse.push(i)
        }
        this.aberturaConfirmacaoTodos = []
        this.aberturaConfirmacao123 = []
        this.aberturaConfirmacao1 = []
        this.aberturaConfirmacao2 = []
        this.aberturaConfirmacao3 = []
        this.aberturaInscricaoTodos = []
        this.aberturaInscricao123 = []
        this.aberturaInscricao1 = []
        this.aberturaInscricao2 = []
        this.aberturaInscricao3 = []
        if(this.aberturasByCourse.aberturas.length != 0){
          this.aberturasByCourse.aberturas.forEach(abertura => {
            if(abertura.ano == 0 && abertura.tipoAbertura == 0){
              this.aberturaConfirmacaoTodos = abertura
            } else if(abertura.tipoAbertura == 0){
              this.aberturaConfirmacao123.push(abertura)
              if(abertura.ano == 1){
                this.aberturaConfirmacao1 = abertura
              } else if(abertura.ano == 2){
                this.aberturaConfirmacao2 = abertura
              } else if(abertura.ano == 3){
                this.aberturaConfirmacao3 = abertura
              }
            } else if(abertura.ano == 0 && abertura.tipoAbertura == 1){
              this.aberturaInscricaoTodos = abertura
            } else if(abertura.tipoAbertura == 1){
              this.aberturaInscricao123.push(abertura)
              if(abertura.ano == 1){
                this.aberturaInscricao1 = abertura
              } else if(abertura.ano == 2){
                this.aberturaInscricao2 = abertura
              } else if(abertura.ano == 3){
                this.aberturaInscricao3 = abertura
              }
            }
          });
        }
      } catch {
        console.log(error.response);
        throw error
      }
    },
    async login(credentials, tipoLogin) {
        localStorage.removeItem("adminState");
        localStorage.removeItem("coordenadorState");
        localStorage.removeItem("professorState");
        localStorage.removeItem("alunoState");
      try {
        let response = await axios.post("login", credentials);
        console.log(response.data)
        //se for admin mas é coordenador tbm
        if (response.data.access_token && response.data.tipo == 1 && response.data.isCoordenador == 1 && tipoLogin == 2) {
          sessionStorage.setItem("tokenCoordenador", response.data.access_token);
          sessionStorage.setItem("isCoordenadorPrincial", response.data.isCoordenadorPrincipal);
          localStorage.setItem("coordenadorState", true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${sessionStorage.tokenCoordenador}`;
        }
        //se for admin mas é professor tbm
        if (response.data.access_token && response.data.tipo == 3 && response.data.isProfessor == 1 && tipoLogin == 1) {
          sessionStorage.setItem("tokenProfessor", response.data.access_token);
          localStorage.setItem("professorState", true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${sessionStorage.tokenProfessor}`;
        }
        //se for coordenador mas é professor tbm
        if (response.data.access_token && response.data.tipo == 2 && response.data.isProfessor == 1 && tipoLogin == 1) {
          sessionStorage.setItem("tokenProfessor", response.data.access_token);
          localStorage.setItem("professorState", true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${sessionStorage.tokenProfessor}`;
        }
        if (response.data.access_token && response.data.tipo == 3 && tipoLogin == 3) {
          sessionStorage.setItem("tokenAdmin", response.data.access_token);
          localStorage.setItem("adminState", true);
          console.log(sessionStorage.tokenAdmin)
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${sessionStorage.tokenAdmin}`;
        }
        if (response.data.access_token && response.data.tipo == 2 && tipoLogin == 2) {
          sessionStorage.setItem("tokenCoordenador", response.data.access_token);
          localStorage.setItem("coordenadorState", true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${sessionStorage.tokenCoordenador}`;
        }
        if (response.data.access_token && response.data.tipo == 1 && tipoLogin == 1) {
          sessionStorage.setItem("tokenProfessor", response.data.access_token);
          localStorage.setItem("professorState", true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${sessionStorage.tokenProfessor}`;
        }
        if (response.data.access_token && response.data.tipo == 0 && tipoLogin == 0) {
          sessionStorage.setItem("tokenAluno", response.data.access_token);
          localStorage.setItem("alunoState", true);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${sessionStorage.tokenAluno}`;
        }
        this.utilizadorLogado = response.data
      } catch (error) {
        delete axios.defaults.headers.common.Authorization;
        sessionStorage.removeItem("tokenAdmin");
        localStorage.removeItem("adminState");
        sessionStorage.removeItem("tokenCoordenador");
        localStorage.removeItem("coordenadorState");
        sessionStorage.removeItem("tokenProfessor");
        localStorage.removeItem("professorState");
        sessionStorage.removeItem("tokenAluno");
        localStorage.removeItem("alunoState");
        this.utilizadorLogado = null
        console.log(error)
        throw error;
      }
    },
  }
})
