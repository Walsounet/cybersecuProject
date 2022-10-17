<template>
  <div class="container-fluid">
    <h3 style="margin-top: 20px; margin-bottom: 25px;">Gestão de Coordenadores</h3>
    <div v-if="adminLogged" class="card text-center">
      <div class="card-header">
        Coordenadores de Cada Curso na Aplicação
      </div>
      <div class="card-body">
        <div class="table-responsive" style="max-height: 350px;">
          <table class="table" style="text-align: left;">
            <thead style="position: sticky; top: 0; z-index: 1; background-color:white;">
              <tr >
                <th scope="col">Curso</th>
                <th scope="col">Nº de Coordenadores</th>
                <th scope="col">Login </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in coursesWithCoordinatores" :key="course" @click="selectedCourseFunc(course)" class="hoverclick">
                <td>{{ "["+course.codigo+"] "+course.nome }}</td>
                <td>{{ course.coordenadores.length }}</td>
                <td scope="col">
                  <p v-for="coordenador in course.coordenadores" :key="coordenador">{{ coordenador.utilizador.login }}</p> 
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-if="!adminLogged" class="card text-center">
      <div class="card-header">
        Coordenadores  {{ hasMoreThanOneCurso ? "por curso na aplicação" : "de curso na aplicação"}}
      </div>
      <div class="card-body">
        <div class="table-responsive" style="max-height: 350px;">
          <table class="table" style="text-align: left;">
            <thead style="position: sticky; top: 0; z-index: 1; background-color:white;">
              <tr >
                <th scope="col">Curso</th>
                <th scope="col">Nº de Coordenadores</th>
                <th scope="col">Login </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="course in coursesWithCoordinatores" :key="course" @click="selectedCourseFunc(course)" class="hoverclick">
                <td>{{ "["+course.codigo+"] "+course.nome }}</td>
                <td>{{ course.coordenadores.length }}</td>
                <td scope="col">
                  <p v-for="coordenador in course.coordenadores" :key="coordenador">{{ coordenador.utilizador.login }}</p> 
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-sm-6">
        <div class="card border-light mb-3" style="max-width: 32rem;">
          <div class="card-header">Adicionar Coordenador</div>
          <div class="card-body">
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Curso:</label>
              <span v-if="this.counterStore.courses[0]">
                <label v-if="!hasMoreThanOneCurso">&nbsp;&nbsp;{{ this.counterStore.courses[0].nome }}</label>
              </span>
              <v-select v-if="hasMoreThanOneCurso" aria-label=".form-select-sm example" code="code" :options="this.counterStore.coursesToVSelect" single-line v-model="selectedCourse">
              </v-select>
              <div v-if="hasErrorCurso" class="errorMessages">
                <small style="color: #a94442; margin-left: 5px;">{{ grantRoleError.idCurso }}</small>
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Tipo de Coordenador:</label>
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" v-model="roleId" ref="focus" :disabled="!adminLogged">
                <option value="null">Selecione uma opção</option>
                <option value="0">Coordenador</option>
                <option value="1">Subcoordenador</option>
              </select>
              <div v-if="hasErrorTipo"  class="errorMessages">
                <small style="color: #a94442; margin-left: 5px;">{{ grantRoleError.tipo }}</small>
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Login/Email:</label>
              <input type="name" class="form-control" id="exampleFormControlInput1" placeholder="Login/Email" v-model="login">
              <div v-if="hasErrorLogin" class="errorMessages">
                <small style="color: #a94442; margin-left: 5px;">{{ grantRoleError.login }}</small>
              </div>
            </div>
            <button class="btn btn-primary" @click="grantCoordinatorRole(selectedCourse, roleId, login)">Submeter</button>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card border-light mb-3" style="max-width: 32rem;">
          <div class="card-header">Remover Coordenador</div>
          <div class="card-body">
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Curso:</label>
              <label v-if="!hasMoreThanOneCurso && this.counterStore.courses[0]">&nbsp;&nbsp;{{ this.counterStore.courses[0].nome }}</label>
              <v-select v-if="hasMoreThanOneCurso" aria-label=".form-select-sm example" code="code" :options="this.counterStore.coursesToVSelect" single-line v-model="selectedCourseRemove" @option:selected="getCoordinatorsByCourse(selectedCourseRemove.code)">
              </v-select>
              <div v-if="hasErrorCursoNullRemover" class="errorMessages">
                <small style="color: #a94442; margin-left: 5px;">{{ nullCurso }}</small>
              </div>
              <div v-if="hasErrorCursoRemover" class="errorMessages">
                <small style="color: #a94442; margin-left: 5px;">{{ grantRoleError.login }}</small>
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Coordenador:</label>
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" v-model="selectedCoordinator">
                <option value="null">Selecione um coordenador</option>
                <option v-for="coordenador in coordinatoresByCourse" :key="coordenador" v-bind:value="coordenador.id">
                {{ coordenador.utilizador.login }}
                </option>
              </select>
              <div v-if="hasErrorLoginNullRemover" class="errorMessages">
                <small style="color: #a94442; margin-left: 5px;">{{ nullCoordenador }}</small>
              </div>
              <div v-if="hasErrorLoginRemover" class="errorMessages">
                <small style="color: #a94442; margin-left: 5px;">{{ grantRoleError.login }}</small>
              </div>
            </div>
            <small></small>
            <button class="btn btn-danger" @click="revokeCoordinatorRole(selectedCoordinator, selectedCourseRemove)">Remover</button>
          </div>
        </div>
      </div>
    </div>
    <br><br><br>
  </div>    
</template>

<script>
import { useCounterStore } from "../../stores/counter"
export default {
  name: "GerirCoordenadores",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
        coursesWithCoordinatores: [],
        coordinatoresByCourse: [],
        selectedCourseRemove: null,
        selectedCourse: null,
        roleId: null,
        login: null,
        selectedCoordinator: null,
        adminLogged: false,
        coordenadorLogged: false,
        grantRoleError: null,
        revokeRoleError: null,
        nullCoordenador: null,
        nullCurso: null
    };
  },
  computed: {
    hasMoreThanOneCurso(){
      if (this.counterStore.courses.length > 1) {
        return true
      }
      if (this.counterStore.courses[0]) {
        this.getCoordinatorsByCourse(this.counterStore.courses[0].id)
      }
      return false
    },
    hasErrorCurso(){
      if (this.grantRoleError != null) {
        if (this.grantRoleError.idCurso) {
          return true
        }  
      }
      return false
    },
    hasErrorTipo(){
      if (this.grantRoleError != null) {
        if (this.grantRoleError.tipo) {
          return true
        }
      }
      return false
    },
    hasErrorLogin(){
      if (this.grantRoleError != null) {
        if (this.grantRoleError.login) {
          return true
        }
      }
      return false
    },
    hasErrorCursoRemover(){
      if (this.revokeRoleError != null) {
        if (this.revokeRoleError.idCurso) {
          return true
        }
      }
      return false
    },
    hasErrorCursoNullRemover(){
      if (this.nullCurso != null) {
        return true
      }
      return false
    },
    hasErrorLoginNullRemover(){
      if (this.nullCoordenador != null) {
        return true
      }
      return false
    },
    hasErrorLoginRemover(){
      if (this.revokeRoleError != null) {
        if (this.revokeRoleError.login) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    getCoursesCoordinators(){
      this.$axios.get("cursoauth/coordenadores")
        .then((response) => {
          this.coursesWithCoordinatores = response.data;
          this.counterStore.coursesToVSelect = []
          this.coursesWithCoordinatores.forEach(curso => {
            this.counterStore.coursesToVSelect.push({label: "["+curso.codigo+"] "+curso.nome, code: curso.id})
          });
        })
        .catch((error) => {
          //console.log(error.response);
        });
    },
    grantCoordinatorRole(course, type, login){
      if (course == null && this.adminLogged) {
        this.grantRoleError = []
        this.grantRoleError['idCurso'] = "Deve selecionar um curso."
        throw "O curso não foi selecionado"
      }
      if (course == null) {
        course = []
        course["code"] = this.counterStore.courses[0].id
      }
      this.$axios.post("coordenador", {
            "login": login,
            "idCurso": course.code,
            "tipo": parseInt(type)
          })
        .then((response) => {
          this.$toast.success("Role concedido a " + login + "!",);
          if (this.adminLogged) {
            this.getCoursesCoordinators()
          }
          if (!this.adminLogged) {
            this.getCoordinatorsByCourse(course.code)
            this.getCoursesCoordinators()
          }
          this.login = null
          this.grantRoleError = null
          this.revokeRoleError = null
          this.nullCoordenador = null
          this.nullCurso = null
        })
        .catch((error) => {
          this.grantRoleError = error.response.data
          if (this.grantRoleError.idCurso) {
            this.grantRoleError.idCurso = "Deve selecionar um curso."
          }
          if (this.grantRoleError.tipo) {
            this.grantRoleError.tipo = "Deve selecionar o tipo de coordenador."
          }
          if (this.grantRoleError.login) {
            this.grantRoleError.login = "Login/Email não encontrado."
          }
          if (this.grantRoleError.login2) {
            this.grantRoleError.login = this.grantRoleError.login2
          }
          //console.log(error.response)
          this.$toast.error("Não foi possível conceder o role a este utilizador!");
        });
    },
    getCoordinatorsByCourse(courseId){
      this.$axios.get("curso/coordenadores/" + courseId)
        .then((response) => {
          //console.log(response.data);
          this.coordinatoresByCourse = response.data.coordenadores;
        })
        .catch((error) => {
          //console.log(error.response);
        });
    },
    revokeCoordinatorRole(coordinatorId, course){
      if (course == null && coordinatorId == null && this.adminLogged) {
        this.nullCurso = "Deve selecionar um curso"
        this.nullCoordenador = "Deve selecionar um coordenador"
        this.$toast.error("Não foi possível retirar o role a este utilizador!");
        return
      }
      if (coordinatorId == null || coordinatorId == "null") {
        this.nullCoordenador = "Deve selecionar um coordenador"
        this.$toast.error("Não foi possível retirar o role a este utilizador!");
        return
      }
      if (course == null) {
        course = []
        course["code"] = this.counterStore.courses[0].id
      }
      this.$axios.delete("coordenador/" + coordinatorId)
        .then((response) => {
          this.$toast.success("Role retirado com sucesso!");
          this.selectedCoordinator = null
          if (this.adminLogged) {
            this.getCoursesCoordinators()
          }
          this.getCoordinatorsByCourse(course.code)
          this.grantRoleError = null
          this.revokeRoleError = null
          this.nullCoordenador = null
          this.nullCurso = null
        })
        .catch((error) => {
          this.$toast.error("Não foi possível retirar o role a este utilizador!");
        });
    },
    selectedCourseFunc(course){
      let curso = {label: "[" + course.codigo + "] "+course.nome,code:course.id}
      this.selectedCourse = curso
      this.selectedCourseRemove = curso
      this.getCoordinatorsByCourse(this.selectedCourseRemove.code)
      this.$refs.focus.focus();
    },
  },
  mounted() {
    if (localStorage.getItem("adminState") && sessionStorage.getItem("tokenAdmin")) {
      this.adminLogged = true
    }else{
      this.roleId = 1
    }
    this.counterStore.getCourses()
    this.getCoursesCoordinators()
   /*  if (!this.hasMoreThanOneCurso && this.counterStore.courses[0]) {
      
      console.log(this.coordinatoresByCourse)
    } */
  },
};
</script>

<style>
.errorMessages{
  background-color: #f2dede; 
  border-radius: 3px;
  text-align: center
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.hoverclick:hover{
  cursor: pointer;
}
</style>