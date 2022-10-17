<template>
  <div class="container-fluid">
    <div class="row">
        <div style="margin-top: 65px">
            <div class="card mb-3" style="width: 30%">
                <div class="card-header bg-transparent" style="text-align: center">
                    <label style="margin-top: 10px;">AGIT - Aplicação de Gestão de Inscrição nos Turnos</label>
                    <h5>Login - Coordenador</h5>
                </div>
                <div class="card-body text-dark">
                    <div style="padding: 10px 20px">
                        <div class="mb-3">
                            <label for="formGroupExampleInput" class="form-label"><b>Utilizador</b></label>
                            <input type="text" class="form-control" id="formGroupExampleInput" placeholder="Nome de Utilizador" v-model="credentials.login">
                            <div v-if="hasNullLogin" class="errorMessages" style="margin-bottom: 15px">
                                <small style="color: #a94442; margin-left: 5px;">{{ nullLogin }}</small>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="formGroupExampleInput2" class="form-label"><b>Password</b></label>
                            <input type="password" class="form-control" id="formGroupExampleInput2" placeholder="Password" v-model="credentials.password">
                            <div v-if="hasNullPassword" class="errorMessages" style="margin-bottom: 15px">
                                <small style="color: #a94442; margin-left: 5px;">{{ nullPassword }}</small>
                            </div>
                            <div v-if="hasError" class="errorMessages" style="margin-bottom: 15px">
                                <small style="color: #a94442; margin-left: 5px;">{{ messageError.message }}</small>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary" style="margin-bottom: 5px; width: 100%" @click="login()">Login</button>
                    </div>
                </div>
            </div>
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
        credentials: {
            login: null,
            password: null
        },
        nullLogin: null,
        nullPassword: null,
        messageError: null
    };
  },
  computed: {
    hasError(){
      if (this.messageError != null) {
        if (this.messageError.message) {
          return true
        }
      }
      return false
    },
    hasNullLogin(){
      if (this.nullLogin != null) {
          return true
      }
      return false
    },
    hasNullPassword(){
      if (this.nullPassword != null) {
        return true
      }
      return false
    },
  },
  methods: {
    async login(){
        this.nullLogin = null
        this.nullPassword = null
        this.messageError = null
        if (this.credentials.login == null && this.credentials.password == null) {
            this.nullLogin = "Preencha o seu login"
            this.nullPassword = "Preencha a sua password"
            this.$toast.error("Não foi possível fazer login");
            throw "Error"
        } else if (this.credentials.password == null) {
            this.nullPassword = "Preencha a sua password"
            this.$toast.error("Não foi possível fazer login");
            throw "Error"
        }
        var tipoLogin = 2
        try {
            await this.counterStore.login(this.credentials, tipoLogin)
            if (this.counterStore.utilizadorLogado.tipo != 2) {
                if (this.counterStore.utilizadorLogado.isCoordenador == 0) {
                    sessionStorage.removeItem("tokenAluno");
                    localStorage.removeItem("alunoState");
                    sessionStorage.removeItem("tokenAdmin");
                    localStorage.removeItem("adminState");
                    sessionStorage.removeItem("tokenProfessor");
                    localStorage.removeItem("professorState");
                    throw "Não tem permissões!"
                }
            } 
            this.$router.push({ name: "coordenadorroot" });
        } catch (error) {
            if (error.response) {
              if ((this.credentials.login != null && this.credentials.password != null) || this.credentials.password != null) {
                  this.messageError = error.response.data
                  console.log(this.messageError.message)
              }
            }
            this.$toast.error("Não foi possível fazer login");
        }
      }
  },
  mounted() {

  },
};
</script>

<style scoped>
.card {
    margin: 0 auto;
    float: none;
    margin-bottom: 10px;
}

</style>