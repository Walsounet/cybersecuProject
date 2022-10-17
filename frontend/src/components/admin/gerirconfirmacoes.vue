<template>
  <div class="container-fluid">
    <h3 style="margin-top: 20px; margin-bottom: 25px;">Gerir pedidos de inscrição nas UC's</h3>
    <v-select v-if="this.counterStore.courses.length > 1" aria-label=".form-select-sm example" code="code" :options="this.counterStore.coursesToVSelect" single-line v-model="selectedCourse" @option:selected="selectCourse(selectedCourse)">
    </v-select>
    <br>
    <div class="accordion-item" v-if="this.counterStore.pedidosByCourseAntigos.length >= 1">
      <h2 class="accordion-header" id="headingTwo">
        <button class="accordion-button" :class="{collapsed:this.collapsed[0]}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" :aria-expanded="this.collapsed[0]" aria-controls="collapseTwo" @click="changeCollapsed(0)">
            Pedidos resolvidos
        </button>
      </h2>
      <div id="collapseTwo" class="accordion-collapse" :class="{collapse:this.collapsed[0]}" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          <div class="table-wrapper-scroll-y my-custom-scrollbar">
            <table class="table" style="text-align: left;">
              <thead>
                <tr>
                  <th scope="col">Estudante</th>
                  <th scope="col">Unidades Curriculares</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr class="tableRow" v-for="pedido in this.counterStore.pedidosByCourseAntigos" :key="pedido">
                  <td>{{pedido.utilizador.login}}<br>{{pedido.utilizador.nome}}</td>
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
    </div>
    <div class="row">
      <div class="col-md-5">
        <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-white" style="width: 100%; margin-top:5px;">
          <a class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
            <span class="fs-5 fw-semibold">Lista de pedidos</span>
          </a>
          <div class="list-group list-group-flush border-bottom scrollarea">
            <a type="button" v-for="pedido in this.counterStore.pedidosByCourse" :key="pedido.id" class="list-group-item list-group-item-action py-3 lh-tight" :class="{ active: selectedPedido.id == pedido.id }" @click="openPedido(pedido)">
              <div class="d-flex w-100 align-items-center justify-content-between">
                <strong class="mb-1">{{ pedido.utilizador.login }}</strong>
                <small class="active" :class="{ 'text-muted': selectedPedido.id != pedido.id}">{{ pedido.data.replace('.000000Z', '').replace('T', ' ') }}</small>
              </div>
              <div class="col-10 mb-1 small">{{ pedido.utilizador.nome }}</div>
              <div v-if="courseInfo">
                <div v-if="courseInfo.code != pedido.utilizador.idCurso" class="col-10 mb-1 small">{{ "["+pedido.utilizador.codigoCurso+"] "+pedido.utilizador.curso }}</div>
              </div>
            </a>
          </div>
          <div v-if="this.counterStore.pedidosByCourse.length == 0">
            <p style="margin-left: 16px; margin-top: 15px;">Não existem pedidos pendentes.</p>
          </div>
        </div>
      </div>
      <div class="col-md-7">
          <a class="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom" style="margin-top:5px;">
            <span class="fs-5 fw-semibold">Detalhes do pedido</span>
          </a>
          <div v-if="pedidoForm == true" style="margin-left: 16px;">
            <div v-if="courseInfo">
              <label v-if="courseInfo.code != selectedPedido.utilizador.idCurso" for="inputEmail3" class="col-sm-2 col-form-label">Curso:</label>
              <label v-if="courseInfo.code != selectedPedido.utilizador.idCurso" class="col-sm-10 col-form-label">{{ "["+selectedPedido.utilizador.codigoCurso+"] "+selectedPedido.utilizador.curso }}</label>
            </div>
            <label for="inputEmail3" class="col-sm-2 col-form-label">Login:</label>
            <label class="col-sm-10 col-form-label">{{ selectedPedido.utilizador.login }}</label>
            <label for="inputEmail3" class="col-sm-2 col-form-label">Nome:</label>
            <label class="col-sm-10 col-form-label">{{ selectedPedido.utilizador.nome }}</label>
            <label for="inputEmail3" class="col-sm-2 col-form-label">Data:</label>
            <label class="col-sm-10 col-form-label">{{ selectedPedido.data.replace('.000000Z', '').replace('T', ' ') }}</label>
            <label for="inputEmail3" class="col-sm-4 col-form-label" style="margin-top: 10px; margin-bottom: 10px;">UC's requeridas:</label>
            <div v-for="cadeira in selectedPedido.cadeiras" :key="cadeira.id" style="margin-left: 30px;">
              <input class="form-check-input" style="margin-right: 10px" type="checkbox" :value="cadeira.id" v-model="approvedCadeiras">
              <label class="form-check-label">
                {{ "["+cadeira.cadeira.codigo+"] "+cadeira.cadeira.nome }}
              </label>
            </div>
            <label class="col-sm-2 col-form-label" style="margin-top: 15px;">Justificação:</label>
            <p style="margin-left: 30px;">{{ selectedPedido.descricao }}</p>
            <div style="text-align: center;">
              <button type="button" class="btn btn-primary" style="margin-right: 5px;" @click="handleRequest(selectedPedido, 0)">Aprovar Selecionadas</button>
              <button type="button" class="btn btn-danger" @click="handleRequest(selectedPedido, 1)">Rejeitar Pedido</button> 
            </div> 
          </div>
          <div v-else>
            <p style="margin-left: 16px; margin-top: 15px;">Selecione um pedido.</p>
          </div>
      </div>
    </div>
  </div>
  <br><br><br>
</template>

<script>
import { useCounterStore } from "../../stores/counter"
export default {
  name: "GerirConfirmacoes",
  component: {},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  data() {
    return {
        selectedCourse: null,
        courseInfo: null,
        pedidoForm: false,
        selectedPedido: [],
        allRequestCaderias: [],
        approvedCadeiras: [],
        rejectedCadeiras: [],
        collapsed: [true]
    };
  },
  computed: {
    
  },
  methods: {
    selectCourse(course){
      this.pedidoForm = false
      if(this.selectedPedido.length != 0){
        this.selectedPedido = []
      }
      this.courseInfo = course
      if (this.counterStore.selectedAnoletivo == null || this.counterStore.semestre == null) {
        this.$toast.error("Ano letivo e semestre não selecionados")
        return
      }
      this.counterStore.getPedidosByCourse(course.code)
    },
    openPedido(pedido){
      this.pedidoForm = true
      this.selectedPedido = pedido
    },
    handleRequest(pedido, type){
      for (let index = 0; index < pedido.cadeiras.length; index++) {
        this.allRequestCaderias.push(pedido.cadeiras[index].id)
      }
      if (this.approvedCadeiras.length != 0) {
        this.rejectedCadeiras = this.allRequestCaderias.filter(x => !this.approvedCadeiras.includes(x))
      } else {
        this.rejectedCadeiras = this.allRequestCaderias
      }
      this.$axios.put("curso/pedidos/" + pedido.id, {
            "pedidosucsAprovadasIds": this.approvedCadeiras,
            "pedidosucsReprovadasIds": this.rejectedCadeiras
          })
        .then((response) => {
          if (type == 0) {
            this.$toast.success("Pedido aprovado com sucesso!");
          } else {
            this.$toast.success("Pedido rejeitado com sucesso!");
          }
          this.pedidoForm = false
          this.counterStore.getPedidosByCourse(this.selectedCourse.code)
        })
        .catch((error) => {
          if (type == 0) {
            this.$toast.error("Não foi possível aprovadar o pedido!");
          } else {
            this.$toast.error("Não foi possível rejeitar o pedido!");
          }
        })
        .finally(() => {
          this.allRequestCaderias = []
          this.approvedCadeiras = []
          this.rejectedCadeiras = [] 
        });
    },
    hasMoreThanOneCurso(){
      if (this.counterStore.courses.length == 1 && this.counterStore.pedidosByCourse.length == 0 ) {
        this.counterStore.getCourses(3)
        return true
      }
      /* if (this.counterStore.courses.length > 1) {
        return false
      } */
      return false
    },
    changeCollapsed(number){
      this.collapsed[number] = (this.collapsed[number] == true ? false : true)
    }
  },
  mounted() {
    this.counterStore.pedidosByCourse = []
    this.counterStore.getCourses()
    this.hasMoreThanOneCurso()
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
.my-custom-scrollbar {
  position: relative;
  height: 400px;
  overflow: auto;
}
.table-wrapper-scroll-y {
  display: block;
}
</style>