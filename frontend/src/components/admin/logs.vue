<template>
  <div class="container-fluid">
    <div class="card w-100" style="margin-top: 10px;">
      <div class="card-body">
        <h5 class="card-title">Tabela de logs da aplicação</h5>
        <div class="table-responsive" style="max-height: 500px;">
          <table class="table table-responsive" >
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Ação</th>
                <th scope="col">Tabela</th>
                <th scope="col">Login</th>
                <th scope="col">Role</th>
                <th scope="col">Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.id">
                <th scope="row">{{ log.id }}</th>
                <td>{{ log.descricao }}</td>
                <td>{{ log.tabela }}</td>
                <td>{{ log.utilizador.login }}</td>
                <td>{{ log.utilizador.tipo == 3 ? "admin" : "coordenador" }}</td>
                <td>{{ log.created_at.replace('.000000Z', '').replace('T', ' ') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <br><br><br>
</template>

<script>
export default {
  name: "Logs",
  component: {},
  data() {
    return {
      logs: []
    };
  },
  methods: {
    getLogs(){
      this.$axios.get("logs")
        .then((response) => {
          this.logs = response.data
        })
        .catch((error) => {
          console.log(error.response);
        });
    }
  },
  mounted() {
    this.getLogs()
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
</style>