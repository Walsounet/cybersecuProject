<template>
  <div class="container-fluid">
    <h3 style="margin-top: 20px; margin-bottom: 25px;">Gestão Utilizador</h3>
    <div class="card text-center">
      <div class="card-body">
        <form>
          <div class="card-header bg-transparent" style="text-align: center">
              <h5>Mudar password</h5>
          </div>
          <div class="card-body text-dark">
            <div style="padding: 10px 20px">
              <div class="mb-3">
                  <label for="formGroupExampleInput" class="form-label"><b>Password atual</b></label>
                  <input type="password" class="form-control" id="formGroupExampleInput" placeholder="Password currente" v-model="password">
                  <div v-if="errors.password != null" class="errorMessages" style="margin-bottom: 15px">
                      <small style="color: #a94442; margin-left: 5px;">{{ errors.password }}</small>
                  </div>
              </div>
              <div class="mb-3">
                  <label for="formGroupExampleInput2" class="form-label"><b>Nova Password</b></label>
                  <input type="password" class="form-control" id="formGroupExampleInput2" placeholder="Nova Password" v-model="newpassword">
                  <div v-if="errors.newpassword != null" class="errorMessages" style="margin-bottom: 15px">
                      <small style="color: #a94442; margin-left: 5px;">{{ errors.newpassword }}</small>
                  </div>
              </div>
              <button type="button" class="btn btn-primary" style="margin-bottom: 5px; width: 100%" @click="changePassword()">Alterar Password</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import { useCounterStore } from "../../stores/counter"
export default {
  name: "Gerirutilizador",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
        password: null,
        newpassword: null,
        errors: {password: null, newpassword: null}
    };
  },
  computed: {

  },
  methods: {
    changePassword(){
      if(this.password == null || this.password == ""){
        this.errors.password = "A password não pode estar vazia"
        return
      }else{
        this.errors.password = null
      }
      if(this.newpassword == null || this.newpassword == "" || this.newpassword.length < 3){
        this.errors.newpassword = "A nova password tem de ter no minimo 3 caracteres"
        return
      }else{
        this.errors.newpassword = null
      }
      this.$axios.put("admin/changepassword", {
            "password": this.password,
            "newpassword": this.newpassword
          })
        .then((response) => {
          this.password = null
          this.newpassword = null
          this.$toast.success("Password atualizada");
        })
        .catch((error) => {
          console.log(error.response)
          this.$toast.error(error.response.data.message);
          
        });
    }
  },
  mounted() {
    
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.errorMessages{
  background-color: #f2dede; 
  border-radius: 3px;
  text-align: center
}
</style>