<template>
  <div class="container-fluid">
    <h3 style="margin-top: 20px; margin-bottom: 25px;">Estudantes</h3>
    <div class="card">
      <div class="card-header">
        Informações de Estudante
      </div>
      <div class="card-body">
        <div class="mb-3">
          <input type="name" class="form-control" id="exampleFormControlInput1" placeholder="Insira o número do estudante a pesquisar" v-model="login">
        </div>
        <div v-if="hasError" class="errorMessages" style="margin-bottom: 16px;">
          <small style="color: #a94442; margin-left: 5px;">{{ errorMsg }}</small>
        </div>
        <button class="btn btn-primary" @click="getAlunoInfo()">Pesquisar</button>
        <hr>
        <h5 v-if="alunoRequested && infoAluno.length != 0" class="card-title" style="margin-bottom: 15px">{{ infoAluno[0].nome + " (" + infoAluno[0].login + ")" }}</h5>
        <!-- CARD TAB -->
        <div v-if="alunoRequested" class="card text-center">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">  
              <li class="nav-item">
                <a class="nav-link" role="button" :class="{ active: navTabs[0] == true }" @click="navTabs[0] = true;navTabs[1] = false;navTabs[2] = false;navTabs[3] = false;">UC's Inscritas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" role="button" :class="{ active: navTabs[1] == true }" @click="navTabs[0] = false;navTabs[1] = true;navTabs[2] = false;navTabs[3] = false;">UC's Aprovadas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" role="button" :class="{ active: navTabs[2] == true }" @click="navTabs[0] = false;navTabs[1] = false;navTabs[2] = true;navTabs[3] = false;">Pedidos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" role="button" :class="{ active: navTabs[3] == true }" @click="navTabs[0] = false;navTabs[1] = false;navTabs[2] = false;navTabs[3] = true;">Horário atual</a>
              </li>
            </ul>
          </div>
          <div v-if="navTabs[0] == true" class="card-body">
            <div v-if="this.ucsInscritas.length == 0">
              <h6 class="card-title" style="margin-bottom:25px;">Unidades curriculares</h6>
              <p style="margin-bottom:25px;">O estudante não esta inscrito em nenhuma unidade curricular</p>
            </div>
            <div v-else>
              <div v-for="curso in this.ucsInscritas" :key="curso">
                <h6>{{"["+ curso.codigo +"] "+curso.nome}}</h6>
                <table class="table" style="text-align: left;">
                  <thead>
                    <tr>
                      <th scope="col">Unidade Curricular</th>
                      <th scope="col">Número de inscrições</th>
                      <th scope="col">Turnos inscritos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="tableRow" v-for="cadeira in curso.cadeiras" :key="cadeira">
                      <td>{{ "["+cadeira.uc.codigo+"] "+cadeira.uc.nome }}</td>
                      <td>{{ cadeira.uc.nrinscricoes }}</td>
                      <td>
                        <p v-for="turno in cadeira.turnos" :key="turno">
                          {{turno.tipo + (turno.numero == 0 ? "" : turno.numero)}}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div v-if="navTabs[1] == true" class="card-body">
            <div v-if="this.ucsAprovadas.length == 0">
              <h6 class="card-title" style="margin-bottom:25px;">Unidades curriculares</h6>
              <p style="margin-bottom:25px;">O estudante não foi aprovado em nenhuma unidade curricular até ao momento</p>
            </div>
            <div v-else>
              <div v-for="curso in this.ucsAprovadas" :key="curso">
                <h6>{{curso.nome}}</h6>
                <table class="table" style="text-align: left;">
                  <thead>
                    <tr>
                      <th scope="col">Unidade Curricular</th>
                      <th scope="col">Número de inscrições</th>
                      <th scope="col">Ano letivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="tableRow" v-for="cadeira in curso.cadeiras" :key="cadeira">
                      <td>{{ "["+cadeira.codigo+"] "+cadeira.nome }}</td>
                      <td>{{ cadeira.nrinscricoes }}</td>
                      <td>{{ cadeira.anoletivo }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div v-if="navTabs[2] == true" class="card-body">
            <div v-if="this.pedidos.length == 0">
              <h6 class="card-title" style="margin-bottom:25px;">Pedidos de confirmação de unidades curriculares</h6>
              <p style="margin-bottom:25px;">O estudante não tem nenhum pedido de confirmação de unidades curriculares</p>
            </div>
            <div v-else>
              <div>
                <table class="table" style="text-align: left;">
                  <thead>
                    <tr>
                      <th scope="col">Curso</th>
                      <th scope="col">Ano letivo</th>
                      <th scope="col">Unidades Curriculares</th>
                      <th scope="col">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="tableRow" v-for="pedido in this.pedidos" :key="pedido">
                      <td>{{pedido.cadeiras[0].cadeira.curso}}</td>
                      <td>{{pedido.anoletivo.anoletivo}}</td>
                      <td>
                        <p v-for="cadeira in pedido.cadeiras" :key="cadeira">
                          {{cadeira.cadeira.nome  + (cadeira.aceite == 1 ? " (aceite)" : (cadeira.aceite == 0 ? " (rejeitada)" : ""))}}
                        </p>
                      </td>
                      <td>{{(pedido.estado == 1 ? "Pendente" : ((pedido.estado == 2) ? "Aceite" : ((pedido.estado == 3) ? "Recusado" : "Parcial")))}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div v-if="navTabs[3] == true" class="card-body">
            <vue-cal locale="pt-br" :selected-date="dataInicialHorario" hide-view-selector :time-cell-height="30" :time-from="8 * 60" :time-to="24 * 60" :time-step="30" :disable-views="['years', 'year', 'month','day']" :hide-weekdays="[7]" :events="horario">
              <template v-slot:event="{ event }">
                <div class="vuecal__event-title" style="color:#666666;!important" v-html="event.title" />
                <div class="vuecal__event-content" style="color:#666666;!important" v-html="event.content" />
              </template>
            </vue-cal>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br><br><br>
</template>

<script>
import { useCounterStore } from "../../stores/counter"
import { defineComponent } from 'vue'
export default {
  name: "GerirAlunos",
  component: {defineComponent},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
      login: null,
      navTabs: [true,false,false],
      ucsInscritas: [],
      ucsAprovadas: [],
      pedidos: [],
      alunoRequested: false,
      infoAluno: [],
      errorMsg: null,
      horario: [],
      dataInicialHorario: null,
    };
  },
  computed: {
    hasError(){
      if (this.errorMsg != null) {
        return true
      }
      return false
    },
  },
  methods: {
    getAlunoInfo(){
      this.pedidos = []
      this.ucsInscritas = []
      this.ucsAprovadas = []
      if (this.counterStore.selectedAnoletivo == null || this.counterStore.semestre == null) {
        this.$toast.error("Ano letivo e semestre não selecionados")
        return
      }
      this.$axios.get("estudante/dados/" + this.login + "/" +  this.counterStore.selectedAnoletivo + "/" + this.counterStore.semestre)
        .then((response) => {
          console.log(response.data)
          this.pedidos = response.data["pedidos"]
          this.ucsInscritas = response.data["cadeirasInscritas"]
          this.ucsAprovadas = response.data["cadeirasAprovadas"]
          this.infoAluno = response.data["aluno"]
          this.alunoRequested = true
          this.horario = response.data.horario.horario
          this.dataInicialHorario = response.data.horario.data
        })
        .catch((error) => {
          console.log(error.response);
          this.errorMsg = error.response.data
          this.$toast.error("Não foi possível procurar este utilizador!");
        });
    }
  },
  mounted() {},
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