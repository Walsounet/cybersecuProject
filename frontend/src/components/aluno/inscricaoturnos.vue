<template>
  <GDialog v-model="dialogState">
    <div class="wrapper">
      <div class="content">
        <div style="text-align:right"><button class="btn btn--outline-gray" style="text-align:center" @click="dialogState = false"><BootstrapIcon style="margin-right: 2px" icon="x-lg"/> Fechar</button></div>
        <div class="title" style="text-align:center">Horários todos os turnos</div>
        <p style="text-align: center;font-size: 0.8em;">*Este horário poderá conter algum erro ou sofrer alterações*</p>
        <span>Horários dos turnos para as uc's que está inscrito</span>
        <vue-cal locale="pt-br" :selected-date="dataInicialHorario" hide-view-selector :time-cell-height="30" :time-from="8 * 60" :time-to="24 * 60" :time-step="30" :disable-views="['years', 'year', 'month','day']" :hide-weekdays="[7]" :events="horario">
          <template v-slot:event="{ event }">
            <div class="vuecal__event-title" style="color:#666666;!important" v-html="event.title" />
            <div class="vuecal__event-content" style="color:#666666;!important" v-html="event.content" />
          </template>
        </vue-cal>
      </div>
    </div>
  </GDialog>
  <GDialog v-model="popUpConfirmation" max-width="500">
    <div class="wrapper">
      <div class="content">
        <div style="text-align:right"><button class="btn btn--outline-gray" style="text-align:center" @click="popUpConfirmation = false"><BootstrapIcon style="margin-right: 2px" icon="x-lg"/> Fechar</button></div>
        <div style="text-align: center"><h5>Tem a certeza que pretende avançar com a submissão?</h5></div>
        <p style="text-align: center;font-size: 0.8em;">*Certifique-se que selecionou as opções que pretende!*</p>
        <div style="text-align: center;">
          <button type="button" class="btn btn-danger" style="width: 30%; margin-right: 5px;" @click="popUpConfirmation = false">Não</button>
          <button type="button" class="btn btn-success" style="width: 30%;" @click="submitInscricao()">Sim</button>
        </div>
      </div>
    </div>
  </GDialog>
    <div class="container-fluid">
        <div class="row">
          <div class="col-md-1">
          </div>
          <div class="col-md-10">
            <br>
            <div class="card">
              <div class="card-body">
                <h3 class="card-title" style="margin-bottom: 20px; text-align: center;">Inscrição nos Turnos</h3>
                <p class="card-title" style="text-align: center;">Ano Letivo: <b>{{ counterStore.ano }}</b> | Semestre: <b>{{ counterStore.semestre }}</b></p>
                <hr>
                <div v-if="this.buttonArray.length == 0 && noInscricoes && Object.keys(this.aberturas).length == 0" class="alert alert-danger" role="alert" style="margin-letf: 35px; margin-top: 35px;">
                  <p style="text-align: center;">Não existe nenhum período de inscrições definido.</p>
                </div>
                <!-- <div v-if="noInscricoes && Object.keys(this.aberturas).length > 0">
                  <div v-for="aberturaCurso in aberturas" :key="aberturaCurso" style="text-align: center;">
                    <h4 style="margin-bottom: 15px;">{{ "["+aberturaCurso[0].codigo+"] "+aberturaCurso[0].nome }}</h4>
                    <div v-for="aberturaAno in aberturaCurso" :key="aberturaAno.idCurso">
                      
                    </div>  
                  </div>
                </div> -->
                <div v-for="(inscricaoucs, index) in cadeirasWithTurnosPorCurso" :key="inscricaoucs.id">
                  <div v-if="this.buttonArray.length > 0" style="">
                    <div v-for="aberturaCurso in aberturas" :key="aberturaCurso" style="text-align: center;">
                      <div v-if="(aberturaCurso[0].idCurso == index && noButtonSelectedMsgs) || (aberturaCurso[0].idCurso == index && buttonArray[index])">
                        <h4 style="margin-bottom: 15px;">{{ "["+aberturaCurso[0].codigo+"] "+aberturaCurso[0].nome }}</h4>
                        <span v-for="aberturaAno in aberturaCurso" :key="aberturaAno.idCurso">
                          <div v-if="aberturaAno.isAberto == false && hasButtonSelected" class="alert alert-info" role="alert" style="margin-letf: 35px; margin-top: 10px;">
                            O período de Inscrição nos Turnos para as UC´s <b>{{ aberturaAno.ano == 0 ? "de todos os anos" : "do ano "+aberturaAno.ano }}</b> terá <b>início</b> a <b>{{ aberturaAno.dataAbertura.replace(':00.000000Z', '').replace('T', ' ') }}h</b> ({{aberturaAno.menosdeumdia ? "falta "+aberturaAno.diasAteAbertura : (aberturaAno.diasAteAbertura == 1 ? "falta " + aberturaAno.diasAteAbertura + " dia." : "faltam " + aberturaAno.diasAteAbertura + " dias.") }})
                          </div> 
                          <div v-if="aberturaAno.isAberto == true && hasButtonSelected" class="alert alert-success" style="margin-top: 10px;" role="alert">
                            O período de Inscrição nos Turnos <b>estará aberto</b> para <b>{{ aberturaAno.ano == 0 ? "todos os anos " : "o ano "+aberturaAno.ano }}</b> até a <b>{{ aberturaAno.dataEncerar.replace(':00.000000Z', '').replace('T', ' ') }}h</b> ({{aberturaAno.menosdeumdiatermino ? "falta "+aberturaAno.diasAteTerminar : (aberturaAno.diasAteTerminar == 1 ? "falta " + aberturaAno.diasAteTerminar + " dia." : "faltam " + aberturaAno.diasAteTerminar + " dias.") }})
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-if="hasButtonSelected">
                    <div style="text-align: center; margin-bottom: 25px;">
                      <button v-if="!buttonArray[index] && hasButtonSelected" type="button" class="btn btn-primary" @click="buttonArray[index] = !buttonArray[index]; noInscricoes = false; noButtonSelectedMsgs = false">Inscrever nos Turnos</button>
                    </div>
                  </div>
                  <div v-else>
                    <div style="text-align: center">
                      <button v-if="!buttonArray[index] && hasButtonSelected" type="button" class="btn btn-primary" @click="buttonArray[index] = !buttonArray[index]; noInscricoes = false; noButtonSelectedMsgs = false">Inscrever nos Turnos</button>
                    </div>
                  </div>
                  <div v-if="buttonArray[index]" style="margin-top: 15px; text-align: left; margin-bottom: 35px;">
                    <div v-for="(inscricaoucs, index2) in cadeirasWithTurnosPorCurso" :key="inscricaoucs.id">
                      <div v-if="index == index2">
                        <label class="col-5 col-form-label"><strong>Unidade Curricular </strong>(ano/nome)</label>   
                        <label class="col-7 col-form-label"><strong>Turnos diponíveis </strong>(inscritos/vagas)</label>
                        <br>
                        <div v-for="(cadeira, cadeiraIndex) in inscricaoucs" :key="cadeira.cadeira.id">
                          <div v-if="cadeira.cadeira.turnos.length != 0">
                            <label class="col-5 col-form-label" style="vertical-align: middle; float: left;">{{ "("+cadeira.cadeira.ano+"º ano) "+cadeira.cadeira.nome }}</label>   
                            <label class="col-7 col-form-label">
                              <span v-for="(turno, index) in cadeira.cadeira.turnos" :key="turno" style="margin-right: 20px;">
                                <span style="margin-left: 10px;" v-for="(turnotipo) in turno" :key="turnotipo.id">
                                  <input class="form-check-input" type="radio" :value="turnotipo.id" v-model="arrayVmodel[cadeiraIndex][index]" style="margin-right: 3px" @click="clearRadio(cadeiraIndex, index, turnotipo.id)">
                                  <label class="form-check-label" :class="{redcolor: turnotipo.vagasocupadas >= turnotipo.vagastotal }">
                                    {{ turnotipo.numero == 0 ? turnotipo.tipo : turnotipo.tipo+turnotipo.numero }}<small> ({{ turnotipo.vagasocupadas }}/{{ turnotipo.vagastotal }})</small>
                                  </label>
                                </span>
                                <br>
                              </span>
                            </label>
                          </div>
                        </div>
                        <div style="margin-top: 15px; text-align: center;">
                          <button type="button" class="btn btn-link" @click="getCadeirasWithTurnosWebSocket()">Atualizar Vagas</button>
                        </div>
                        <div style="margin-top: 15px; text-align: center;">
                          <button type="button" class="btn btn-secondary" style="margin-right: 5px;" @click="dialogState = true">Ver horários disponíveis</button>
                          <button type="button" class="btn btn-secondary" style="margin-right: 5px;" @click="getSobreposicoes()">Verificar sobreposições do meu horário</button>
                        </div>
                        <div style="margin-top: 15px; text-align: center;">
                          <button v-if="buttonArray[index]" type="button" style="margin-right: 5px;" class="btn btn-primary" @click="buttonArray[index] = !buttonArray[index]; noButtonSelectedMsgs = true">Voltar</button>
                          <button type="button" style="margin-right: 5px;" class="btn btn-warning" @click="clearRadios()">Limpar escolhas</button>
                          <!-- <button type="button" class="btn btn-success" @click="submitInscricao()">Submeter</button> -->
                          <button type="button" class="btn btn-success" @click="popUpConfirmation = true">Submeter</button>
                        </div>  
                        <br>
                      </div>
                    </div>
                  </div>
                  <div v-if="!buttonArray[index] && noButtonSelectedMsgs && this.isncricoesAtuais[index] !== undefined" style="text-align: center; margin-bottom: 35px;">
                    <h5>Turnos atualmente inscritos: </h5>
                    <p v-for="(inscricao) in this.isncricoesAtuais[index]" :key="inscricao">{{inscricao["nome"] + (inscricao["ano"] ? " (" + inscricao["ano"] + "º ano): " : "")}}
                      <span v-for="(ins) in inscricao['turnos']" :key="ins"> {{ins.tipo + (ins.numero == 0 ? "" : ins.numero) + "    "}}</span>
                    </p>
                    <span  style="text-align: center;">Componentes de UC's com apenas 1 turno são inscritos automaticamente!</span>
                  </div>
                </div>
                 <div v-if="showTurnosRejeitados == true && !(this.buttonArray.length > 0 && hasButtonSelected)" style="color: red">
                  <hr>
                  <div>Turnos Rejeitados por falta de Vagas:
                    <div v-for="turnoRejeitado in turnosRejeitados" :key="turnoRejeitado">
                      <small>
                        Turno - {{ turnoRejeitado.tipo }} (UC: {{ turnoRejeitado.cadeira }} / Curso: {{ turnoRejeitado.curso }})
                      </small> 
                    </div>
                  </div>
                  <hr>
                </div>
                <div v-if="showTurnosCoicidem == true && !(this.buttonArray.length > 0 && hasButtonSelected)" style="color: red">
                  <hr>
                  <div>Turnos que coincidem:
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col-md-1">Números das Semanas</th>
                          <th scope="col-md-2">Dia da semana</th>
                          <th scope="col">Unidade curricular</th>
                          <th scope="col">Unidade curricular</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="turnoCoicide in turnosCoicidem" :key="turnoCoicide">
                          <td scope="col-md-1">{{turnoCoicide[0]}}</td>
                          <td scope="col-md-2">{{turnoCoicide[1]}}</td>
                          <td>{{turnoCoicide[2]}}</td>
                          <td>{{turnoCoicide[3]}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <hr>
                </div> 
                <div id="app" v-if="dataInicialHorariopessoal != null" >
                  <hr>
                  <h4 ref="horariopessoalref" style="text-align: center;">Horário pessoal</h4>
                  <p style="text-align: center;font-size: 0.8em;">*Este horário poderá conter algum erro ou sofrer alterações*</p>
                    <vue-cal  locale="pt-br" :selected-date="dataInicialHorariopessoal" hide-view-selector :time-cell-height="30" :time-from="8 * 60" :time-to="24 * 60" :time-step="30" :disable-views="['years', 'year', 'month','day']" :hide-weekdays="[7]" :events="horariopessoal">
                      <template v-slot:event="{ event }">
                        <div class="vuecal__event-title" style="color:#666666;!important" v-html="event.title" />
                        <div class="vuecal__event-content" style="color:#666666;!important" v-html="event.content" />
                      </template>
                    </vue-cal>
                  <hr>
                </div>
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
  name: "InscricaoTurnos",
  component: {defineComponent},
  setup() {
    const counterStore = useCounterStore()
    return { counterStore }
  },
  el: '#calendario',
  data() {
    return {
      cadeirasWithTurnosPorCurso: [],
      cadeirasWithTurnosPorCursoWebSocket: [],
      isncricoes: [],
      isncricoesAtuais: [],
      aberturas: [],
      arrayVmodel: [],
      allTurnosIds: [],
      showTurnosRejeitados: false,
      turnosRejeitados: [],
      showTurnosCoicidem: false,
      turnosCoicidem: [],
      showInscricaoForm: false,
      buttonArray: [],
      buttonBlockArray: [],
      noInscricoes: false,
      myUCsIds: [],
      noButtonSelectedMsgs: true,
      added: [],
      removed: [],
      dialogState: false,
      horario: [],
      dataInicialHorario: null,
      horariopessoal: [],
      dataInicialHorariopessoal: null,
      popUpConfirmation: false
    };
  },
  sockets: {
    newInscricao(response) {
      if (response.added) {
        this.added = response.added
      }
      if (response.removed) {
        this.removed = response.removed
      }
      this.updateVagasTurnos()
    }
  },
  computed: {
    hasButtonSelected(){
      for (let index = 0; index < this.buttonArray.length; index++) {
        if (this.buttonArray[index] == true) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    clearRadio(cadeiraIndex, index, turnotipoId){
      if (this.arrayVmodel[cadeiraIndex][index] == turnotipoId) {
        this.arrayVmodel[cadeiraIndex][index] = []
      }
    },
    clearRadios(){
      for (let i = 0; i < this.arrayVmodel.length; i++) {
        this.arrayVmodel[i] = []
      }
      //para ir buscar turnos ja inscritos
      //this.getCadeirasWithTurnos()
    },
    getCadeirasWithTurnos(){
      this.$axios.get("cadeirasaluno/utilizador")
        .then((response) => {
          if(response.data.horario.horario.length > 0){
            this.horario = response.data.horario.horario
            this.dataInicialHorario = response.data.horario.data
          }
          if(response.data.horariopessoal.horario.length > 0){
            this.horariopessoal = response.data.horariopessoal.horario
            this.dataInicialHorariopessoal = response.data.horariopessoal.data
          }else{
            this.horariopessoal = []
            this.dataInicialHorariopessoal = null
          }
          this.cadeirasWithTurnosPorCurso = response.data.cursos
          this.inscricoes = response.data.inscricoes
          this.isncricoesAtuais = response.data.inscricoesTurnosAtuais
          this.aberturas = response.data.aberturas
          Object.values(this.cadeirasWithTurnosPorCurso).forEach((inscricaoucs, index3) => {
            inscricaoucs.forEach((cadeira, cadeiraIndex) => {
              this.buttonArray[cadeira.idCurso] = false
              this.arrayVmodel.push([])
              this.myUCsIds.push(cadeira.id)
              Object.values(cadeira.cadeira.turnos).forEach((turno, index) => {
                turno.forEach((turnotipo, index2) => {
                  this.inscricoes.forEach((inscricao) => {
                    if (cadeira.id == inscricao.idCadeira && turnotipo.id == inscricao.id && turnotipo.tipo === inscricao.tipo ) {
                      this.arrayVmodel[cadeiraIndex][inscricao.tipo] = inscricao.id
                    }
                  })
                })
              })
            });
          })
          this.noInscricoes = true
        })
        .catch((error) => {
        });
    },
    getCadeirasWithTurnosWebSocket(){
      this.$axios.get("cadeirasaluno/utilizador")
        .then((response) => {
          this.cadeirasWithTurnosPorCursoWebSocket = response.data.cursos
          Object.values(this.cadeirasWithTurnosPorCurso).forEach((inscricaoucs) => {
            inscricaoucs.forEach((cadeira) => {
              Object.values(cadeira.cadeira.turnos).forEach((turno) => {
                turno.forEach((turnotipo, index) => {
                  Object.values(this.cadeirasWithTurnosPorCursoWebSocket).forEach((inscricaoucsNovo) => {
                    inscricaoucsNovo.forEach((cadeiraNovo) => {
                      Object.values(cadeiraNovo.cadeira.turnos).forEach((turnoNovo) => {
                        turnoNovo.forEach((turnotipoNovo, indexNovo) => {
                          if ((turnotipo.vagasocupadas != turnotipoNovo.vagasocupadas) && (index == indexNovo) && (turnotipo.id == turnotipoNovo.id)) {
                            turnotipo["vagasocupadas"] = turnotipoNovo.vagasocupadas
                          }
                        })
                      })
                    });
                  })
                })
              })
            });
          })
        })
        .catch((error) => {
        });
    },
    updateVagasTurnos(){
      Object.values(this.cadeirasWithTurnosPorCurso).forEach((inscricaoucs) => {
        inscricaoucs.forEach((cadeira) => {
          Object.values(cadeira.cadeira.turnos).forEach((turno) => {
            turno.forEach((turnotipo, index) => {
              this.added.forEach(turnoAdded => {
                if (turnotipo.id == turnoAdded) {
                  turnotipo["vagasocupadas"] += 1
                }
              });
              this.removed.forEach(turnoRemoved => {
                if (turnotipo.id == turnoRemoved) {
                  turnotipo["vagasocupadas"] -= 1
                }
              });
            })
          })
        });
      })
    },
    submitInscricao(){
      this.added = null
      this.removed = null
      this.turnosRejeitados = null
      this.showTurnosRejeitados = false
      this.turnosCoicidem = null
      this.showTurnosCoicidem = false
      this.arrayVmodel.forEach((cadeira) => {
        if (cadeira.TP != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.TP)
        }
        if (cadeira.PL != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.PL)
        }
        if (cadeira.T != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.T)  
        }
        if (cadeira.P != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.P)
        }
        if (cadeira.E != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.E)
        }
        if (cadeira.OT != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.OT)
        }   
      });
      this.popUpConfirmation = false
      this.$axios.post("cadeirasaluno/inscricao", {
            "idUtilizador": this.counterStore.utilizadorLogado.id,
            "turnosIds": this.allTurnosIds
          })
        .then((response) => {
            this.$toast.success("Inscrição feita com sucesso");
            console.log(response);
            if (response.data.rejeitados && response.data != 201) {
              this.showTurnosRejeitados = true
              this.turnosRejeitados = response.data.rejeitados
            }
            if(response.data.inscricoesTurnosAtuais){
              this.isncricoesAtuais = response.data.inscricoesTurnosAtuais
            }
            
            if (response.data.updatedTurnos.added) {
              this.added = response.data.updatedTurnos.added
            }
            if (response.data.updatedTurnos.removed) {
              this.removed = response.data.updatedTurnos.removed
            }
            if(response.data.horariopessoal.horario.length > 0){
              this.horariopessoal = response.data.horariopessoal.horario
              this.dataInicialHorariopessoal = response.data.horariopessoal.data
            }else{
              this.horariopessoal = []
              this.dataInicialHorariopessoal = null
            }
            if (response.data.coicidem.length > 0) {
              this.showTurnosCoicidem = true
              this.turnosCoicidem = response.data.coicidem
            }
            this.updateVagasTurnos()
            this.$socket.emit("newInscricao", response.data.updatedTurnos);
            this.allTurnosIds = []

            var element = this.$refs["horariopessoalref"];
            var top = element.offsetTop;
            window.scrollTo(0, top);
        })
        .catch((error) => {
          console.log(error)
          this.$toast.error("Não foi possível inscrever! " + error.response.data);
          this.allTurnosIds = []
        });
    },
    getSobreposicoes(){
      this.turnosCoicidem = null
      this.showTurnosCoicidem = false
      this.arrayVmodel.forEach((cadeira) => {
        if (cadeira.TP != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.TP)
        }
        if (cadeira.PL != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.PL)
        }
        if (cadeira.T != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.T)  
        }
        if (cadeira.P != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.P)
        }
        if (cadeira.E != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.E)
        }
        if (cadeira.OT != undefined) {
          this.allTurnosIds = this.allTurnosIds.concat(cadeira.OT)
        }   
      });
      this.$axios.post("cadeirasaluno/sobreposicoes", {
            "idUtilizador": this.counterStore.utilizadorLogado.id,
            "turnosIds": this.allTurnosIds
          })
        .then((response) => {
            if(response.data.horariopessoal.horario.length > 0){
              this.horariopessoal = response.data.horariopessoal.horario
              this.dataInicialHorariopessoal = response.data.horariopessoal.data
            }
            if (response.data.coicidem.length > 0) {
              this.showTurnosCoicidem = true
              this.turnosCoicidem = response.data.coicidem
            }
            this.allTurnosIds = []
        })
        .catch((error) => {
          this.allTurnosIds = []
        });
    }
  },
  mounted() {
    this.getCadeirasWithTurnos()
  }
}
</script>

<style>
.btn-secondary {
    color: #fff;
    background-color: #8b9196 !important;
    border-color: #8b9196 !important;
}
.redcolor {
  color:red;
}
.wrapper {
  color: #000;
}

.content {
  padding: 20px;
}

.title {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
.vuecal__event-title {
  font-size: 1em;
  font-weight: bold;
}
.vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}
.vuecal__event {background-color: rgba(228,238,247, 0.7) !important;border: .5px solid rgb(50,50,255);color: #fff; border-radius: 5px 5px 5px 5px;}
.vuecal__no-event {display: none;}
</style>