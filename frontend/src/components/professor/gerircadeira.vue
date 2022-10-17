<template>
  <div class="container-fluid">
    <h3 v-if="this.cadeira != null" style="margin-top: 20px; margin-bottom: 25px;">Gestão da UC: {{ this.cadeira.nome}}</h3>
    <h5 v-if="this.cadeira != null">{{ this.cadeira.curso.nome}}</h5>
    <div v-if="hasValue" class="card">
      <div class="card-body">
        <div v-if="this.cadeira != null" style="margin-bottom:20px;" class="text-center">
          <span style="margin-right: 35px; font-size: 20px;" class="hoverclick" v-bind:class="{ 'turnoactive': activeTurno[0]}" @click="getStats()">Todos</span>
          <span style="margin-right: 35px; font-size: 20px;" class="hoverclick" v-for="(turno,index) in this.cadeira.turnos" :key="turno" @click="getStatsTurno(turno.id)" v-bind:class="{ 'turnoactive': activeTurno[(index+1)]}">{{ turno.numero != 0 ? turno.tipo+turno.numero : turno.tipo }}</span>
        </div>
        <div class="row text-center">
            <div class="col">
                <div class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-header card-title"><h6>Total de Inscritos</h6></div>
                    <div class="card-body">
                        {{this.totalinscritos}}
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-header"><h6>Não Repetentes</h6></div>
                    <div class="card-body">
                        {{this.totalnaorepetentes}}
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-header"><h6>Repetentes</h6></div>
                    <div class="card-body">
                        {{this.totalrepetentes}}
                    </div>
                </div>
            </div>
            <div class="col">
                <div v-if="this.totalnaoinscritos != null" class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-header"><h6>Não Inscritos</h6></div>
                    <div class="card-body">
                        {{this.totalnaoinscritos}}
                    </div>
                </div>
                <div v-else class="card bg-light mb-3" style="max-width: 18rem;">
                    <div class="card-header"><h6>Número de vagas</h6></div>
                    <div class="card-body">
                        {{this.totalinscritos + "/" + (this.nrvagasturno == null ? "-" : this.nrvagasturno)}}
                    </div>
                </div>
            </div>
        </div>
        <br>
        <button v-if="this.turno != null" class="float-end btn btn-success text-right" @click="downloadExcel()">Download lista estudantes (.xls)</button>
        <button v-else class="float-end btn btn-success text-right" @click="downloadExcelCadeira()">Download lista estudantes (.xls)</button>
        <br>
        <table class="table" style="text-align:left;">
          <thead>
            <tr>
              <th scope="col">Número</th>
              <th scope="col">Nome do Aluno</th>
              <th scope="col">Email</th>
              <th scope="col">Repetente </th>
              <th scope="col" v-if="this.turno == null">Inscrito Turno</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="aluno in dadosInscritos" :key="aluno">
              <td>{{ aluno.login }}</td>
              <td>{{ aluno.nome }}</td>
              <td></td>
              <td>{{ aluno.nrinscricoes == 1 ? "Não" : "Sim"}}</td>
              <td v-if="this.turno == null">{{ aluno.idTurno != null ? "Sim" : "Não" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <br><br>
</template>

<script>
import { useCounterStore } from "../../stores/counter"
export default {
  name: "GerirCadeira",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
        dadosInscritos:[],
        totalinscritos:0,
        totalrepetentes:0,
        totalnaorepetentes:0,
        totalnaoinscritos:0,
        nrvagasturno:0,
        cadeira:null,
        activeTurno:[],
        turnoescolhido: null,
        turno: null,
        turnoInfo: [],
        turnorepetentes:0
    };
  },
  computed: {
    hasValue(){
      if(this.activeTurno.length > 0){
        return true
      }
      if (this.counterStore.selectedAnoletivo != null && this.counterStore.semestre != null) {
        this.getCadeiraInfo()
        return true
      } 
      return false
    }
  },
  methods: {
    getStats(){
      this.$axios.get("cadeirasprofessor/stats/"+this.$route.params.cadeiraId + "/" + this.counterStore.selectedAnoletivo)
        .then((response) => {
          this.totalinscritos = response.data.totalinscritos
          this.totalrepetentes = response.data.totalrepetentes
          this.totalnaorepetentes = response.data.totalnaorepetentes
          this.totalnaoinscritos = response.data.totalnaoinscritos
          this.dadosInscritos = response.data.alunos
          this.activeTurno.forEach((value, index) => {
              this.activeTurno[index] = false
          });
          this.activeTurno[0] = true;
          this.counterStore.turnoToManage = null
          this.turno = null
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    getStatsTurno(turnoid = this.counterStore.turnoToManage){
      console.log(turnoid)
      this.$axios.get("turnosprofessor/stats/"+turnoid)
        .then((response) => {
          this.totalinscritos = response.data.totalinscritos
          this.totalrepetentes = response.data.totalrepetentes
          this.totalnaorepetentes = response.data.totalnaorepetentes
          this.totalnaoinscritos = response.data.totalnaoinscritos
          this.dadosInscritos = response.data.alunos
          console.log(response.data.alunos)
          this.turno = response.data.turno
          this.cadeira.turnos.forEach((value, index) => {
            if(value.id == turnoid){
              this.nrvagasturno = value.vagastotal
              this.activeTurno[index+1] = true
            }else{
              this.activeTurno[index+1] = false
            }
          });
          this.activeTurno[0] = false;
          this.counterStore.turnoToManage = turnoid
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCadeiraInfo(){
      this.$axios.get("cadeirasprofessor/cadeira/"+this.$route.params.cadeiraId+"/"+this.counterStore.selectedAnoletivo)
        .then((response) => {
          this.cadeira = response.data.cadeira
          console.log(this.cadeira)
          this.activeTurno.splice(0)
          this.activeTurno.push(false)
          this.cadeira.turnos.forEach((value, index) => {
              this.activeTurno.push(false)
          });
        })
        .catch((error) => {
          console.log(error.response)
        }).finally(() => {
          if(this.counterStore.turnoToManage == null){
            this.getStats()
          }else{
            this.getStatsTurno()
          }
        });
    },
    downloadExcel(){
      this.$axios.get("turno/export/" + this.counterStore.turnoToManage, {
            headers: {"Accept": "application/vnd.ms-excel"},
            responseType: "blob"
          })
        .then((response) => {
          //let filename = response.headers['content-disposition'].split('filename=')[1];
          const url = URL.createObjectURL(new Blob([response.data], {
              type: 'application/vnd.ms-excel'
          }))
          const link = document.createElement('a')
          link.href = url
          console.log(this.turno)
          link.setAttribute('download', "turnos_" + this.turno.tipo + (this.turno.numero == 0 ? "" : this.turno.numero) + "_" + this.turno.cadeira.nome + ".xls")
          document.body.appendChild(link)
          link.click()
        })
        .catch((error) => {
          this.$toast.error(error);
        });
    },
    downloadExcelCadeira(){
      console.log(this.cadeira)
      this.$axios.get("cadeirasprofessor/export/" + this.cadeira.id, {
            headers: {"Accept": "application/vnd.ms-excel"},
            responseType: "blob"
          })
        .then((response) => {
          //let filename = response.headers['content-disposition'].split('filename=')[1];
          const url = URL.createObjectURL(new Blob([response.data], {
              type: 'application/vnd.ms-excel'
          }))
          const link = document.createElement('a')
          link.href = url
          console.log(this.turno)
          link.setAttribute('download', this.cadeira.nome + ".xls")
          document.body.appendChild(link)
          link.click()
        })
        .catch((error) => {
          this.$toast.error(error);
        });
    }
  },
  mounted() {
   
  },
};
</script>

<style>
.centered {
  position: absolute;
  left: 50%;
  margin-left: -100px;
}
.turnoactive {
  font-weight: bold;
  text-decoration: underline;
}
.hoverclick:hover{
  cursor: pointer;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>