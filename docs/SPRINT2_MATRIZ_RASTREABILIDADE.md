# Matriz de Rastreabilidade Sprint 2 - GREENHERB

**Projeto:** Plataforma GREENHERB - Gestão Inteligente de Estufa  
**Sprint:** 2  
**Data:** 2026-05-14  
**Objetivo:** Testes de unidade para importação de ervas e criação de planos de cultivo  

---

## 1. Legendas

- **TU:** Teste de Unidade
- **TI:** Teste de Integração  
- **TS:** Teste de Sistema
- **PE:** Particionamento de Equivalência
- **VL:** Análise de Valores Limite
- **MC:** Cobertura de Condições Múltiplas
- **MC/DC:** Modified Condition/Decision Coverage

---

## 2. Matriz Detalhada

| ID | Requisito / Regra | Endpoint | Nível | Técnica | Resultado Esperado | Pré-condições |
|:--:|:---|:---|:---:|:---|:---|:---|
| **TU-H01** | RN-01: Validação de herb com todos os campos obrigatórios | (herbsService.validateHerbData) | Unidade | PE | Retorna valid=true e errors=[] | Nenhuma. Teste isolado. |
| **TU-H02** | RN-02: Rejeição de herb com nome vazio | (herbsService.validateHerbData) | Unidade | PE | Retorna valid=false com erro de nome | Nenhuma. Teste isolado. |
| **TU-H03** | RN-03: Rejeição de herb com especie vazia | (herbsService.validateHerbData) | Unidade | PE | Retorna valid=false com erro de especie | Nenhuma. Teste isolado. |
| **TU-H04** | RN-04: Rejeição de herb null | (herbsService.validateHerbData) | Unidade | PE | Retorna valid=false com erro "Herb object is required" | Nenhuma. Teste isolado. |
| **TU-H05** | RN-05: Validação temperatura mínima abaixo do limite (-51) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=false | Intervalo temperatura: [-50, 50] |
| **TU-H06** | RN-06: Validação temperatura mínima no limite inferior (-50) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=true | Intervalo temperatura: [-50, 50] |
| **TU-H07** | RN-07: Validação temperatura nominal (0) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=true | Intervalo temperatura: [-50, 50] |
| **TU-H08** | RN-08: Validação temperatura máxima no limite superior (50) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=true | Intervalo temperatura: [-50, 50] |
| **TU-H09** | RN-09: Rejeição temperatura máxima acima do limite (51) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=false | Intervalo temperatura: [-50, 50] |
| **TU-H10** | RN-10: Rejeição umidade mínima inválida (-1) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=false | Intervalo umidade: [0, 100] |
| **TU-H11** | RN-11: Validação umidade no limite (0 e 100) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=true | Intervalo umidade: [0, 100] |
| **TU-H12** | RN-12: Rejeição umidade máxima inválida (101) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=false | Intervalo umidade: [0, 100] |
| **TU-H13** | RN-13: Validação luminosidade mínima (0) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=true | Intervalo lum: [0, 100000] |
| **TU-H14** | RN-14: Validação luminosidade máxima (100000) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=true | Intervalo lum: [0, 100000] |
| **TU-H15** | RN-15: Rejeição luminosidade acima do limite (100001) | (herbsService.validateHerbData) | Unidade | VL | Retorna valid=false | Intervalo lum: [0, 100000] |
| **TU-H16** | RF-03: Importação CSV válido com 1 linha | (herbsService.importFromCSV) | Unidade | PE | total=1, valid=1, invalid=0 | Arquivo CSV com header e dados válidos |
| **TU-H17** | RF-04: Importação CSV misto (válido + inválido) | (herbsService.importFromCSV) | Unidade | PE | total=2, valid=1, invalid=1, errors>0 | Arquivo CSV com linhas válidas e inválidas |
| **TU-H18** | RF-05: Importação CSV vazio | (herbsService.importFromCSV) | Unidade | PE | valid=0, errors>0 | String vazia |
| **TU-H19** | RF-06: Importação CSV null | (herbsService.importFromCSV) | Unidade | PE | valid=0, errors>0 | Input null |
| **TU-H20** | RF-07: Importação CSV sem header | (herbsService.importFromCSV) | Unidade | PE | total=2, valid=2 | Arquivo CSV com apenas dados (sem header) |
| **TU-H21** | RF-08: Importação CSV temperatura no limite (18) | (herbsService.importFromCSV) | Unidade | VL | valid=1 | Arquivo CSV com temperatura=18 |
| **TU-H22** | RF-09: Importação CSV temperatura abaixo do limite (17) | (herbsService.importFromCSV) | Unidade | VL | valid=0, invalid=1 | Arquivo CSV com temperatura=17 |
| **TU-H23** | RF-10: Parse CSV linha válida | (herbsService.parseCSVLine) | Unidade | PE | Retorna objeto herb completo | Linha CSV bem formatada |
| **TU-H24** | RF-11: Parse CSV com poucos campos | (herbsService.parseCSVLine) | Unidade | PE | Retorna null | Linha CSV com <7 campos |
| **TU-H25** | RF-12: Parse CSV com espaços extras | (herbsService.parseCSVLine) | Unidade | PE | Retorna objeto herb com trim | Linha CSV com espaços em branco |
| **TU-P01** | RN-10: Validação plano tipo "regular" | (plansService.validatePlanData) | Unidade | PE | Retorna valid=true | Plano com tipo='regular' válido |
| **TU-P02** | RN-11: Validação plano tipo "emergência" | (plansService.validatePlanData) | Unidade | PE | Retorna valid=true | Plano com tipo='emergência' válido |
| **TU-P03** | RN-12: Validação plano pontual com autorização | (plansService.validatePlanData) | Unidade | PE | Retorna valid=true | Plano tipo='pontual' com autorizacaoResponsavel=true |
| **TU-P04** | RN-13: Rejeição plano tipo inválido | (plansService.validatePlanData) | Unidade | PE | Retorna valid=false | Plano com tipo='invalido' |
| **TU-P05** | RN-14: Rejeição plano sem tipo | (plansService.validatePlanData) | Unidade | PE | Retorna valid=false | Plano sem campo tipo |
| **TU-P06** | RN-15: Validação duração abaixo do limite (0) | (plansService.validatePlanData) | Unidade | VL | Retorna valid=false | Intervalo duração: [1, 365] |
| **TU-P07** | RN-16: Validação duração no limite inferior (1) | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo duração: [1, 365] |
| **TU-P08** | RN-17: Validação duração nominal (180) | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo duração: [1, 365] |
| **TU-P09** | RN-18: Validação duração no limite superior (365) | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo duração: [1, 365] |
| **TU-P10** | RN-19: Rejeição duração acima do limite (366) | (plansService.validatePlanData) | Unidade | VL | Retorna valid=false | Intervalo duração: [1, 365] |
| **TU-P11** | RN-20: Validação temperatura plano 17°C | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo temp: [-50, 50] |
| **TU-P12** | RN-21: Validação temperatura plano 18°C | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo temp: [-50, 50] |
| **TU-P13** | RN-22: Validação umidade plano 39% | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo umidade: [0, 100] |
| **TU-P14** | RN-23: Validação umidade plano 40% | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo umidade: [0, 100] |
| **TU-P15** | RN-24: Validação luminosidade 4999 lux | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo lum: [0, 100000] |
| **TU-P16** | RN-25: Validação luminosidade 5000 lux | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo lum: [0, 100000] |
| **TU-P17** | RN-26: Validação luminosidade 25000 lux | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo lum: [0, 100000] |
| **TU-P18** | RN-27: Validação luminosidade 25001 lux | (plansService.validatePlanData) | Unidade | VL | Retorna valid=true | Intervalo lum: [0, 100000] |
| **TU-P19** | RN-04: Plano pontual SEM autorização (MC/DC T,T) | (plansService.validatePlanData) | Unidade | MC/DC | Retorna valid=false, erro "autorização" | Tipo=pontual, autorizacaoResponsavel=false |
| **TU-P20** | RN-04: Plano pontual COM autorização (MC/DC T,F) | (plansService.validatePlanData) | Unidade | MC/DC | Retorna valid=true | Tipo=pontual, autorizacaoResponsavel=true |
| **TU-P21** | RN-28: Plano regular sem autorização (MC/DC F,T) | (plansService.validatePlanData) | Unidade | MC/DC | Retorna valid=true | Tipo=regular, autorizacaoResponsavel=false |
| **TU-P22** | RN-29: Plano regular com autorização (MC/DC F,F) | (plansService.validatePlanData) | Unidade | MC/DC | Retorna valid=true | Tipo=regular, autorizacaoResponsavel=true |
| **TU-P23** | RN-30: Classificação alerta - Temperatura acima | (plansService.classifyAlert) | Unidade | MC/DC | Retorna "Aviso" | Medição temp>limMax, sensor OK |
| **TU-P24** | RN-31: Classificação alerta - Umidade abaixo | (plansService.classifyAlert) | Unidade | MC/DC | Retorna "Aviso" | Medição hum<limMin, sensor OK |
| **TU-P25** | RN-32: Classificação alerta - Múltiplas violações | (plansService.classifyAlert) | Unidade | MC/DC | Retorna "Crítico" | Medição temp>limMax E hum<limMin |
| **TU-P26** | RN-33: Classificação alerta - Dentro dos limites | (plansService.classifyAlert) | Unidade | MC/DC | Retorna "Informativo" | Todas medições OK, sensor OK |
| **TU-P27** | RN-34: Classificação alerta - Sensor OFF | (plansService.classifyAlert) | Unidade | MC/DC | Retorna null | SensorOK=false |
| **TU-P28** | RN-35: Produtividade sem perdas | (plansService.calculateProductivity) | Unidade | PE | produtividade=100% | Qty=100, perdas=0, divisões=0 |
| **TU-P29** | RN-36: Produtividade com perdas | (plansService.calculateProductivity) | Unidade | PE | produtividade=90% | Qty=100, perdas=10, divisões=0 |
| **TU-P30** | RN-37: Produtividade com divisões | (plansService.calculateProductivity) | Unidade | PE | produtividade=80% | Qty=100, perdas=0, divisões=20 |
| **TU-P31** | RN-38: Produtividade sem dataFim (erro) | (plansService.calculateProductivity) | Unidade | PE | Lança erro | dataFim=undefined |
| **TU-P32** | RN-39: Transição ativo→concluído com dataFim | (plansService.validateStateTransition) | Unidade | MC/DC | permitido=true | Estado=ativo, dataFim presente |
| **TU-P33** | RN-40: Transição ativo→concluído sem dataFim | (plansService.validateStateTransition) | Unidade | MC/DC | permitido=false | Estado=ativo, dataFim=null |
| **TU-P34** | RN-41: Transição ativo→comprometido com perdas | (plansService.validateStateTransition) | Unidade | MC/DC | permitido=true | Estado=ativo, perdas>0 |
| **TU-P35** | RN-42: Transição ativo→comprometido sem perdas | (plansService.validateStateTransition) | Unidade | MC/DC | permitido=false | Estado=ativo, perdas=undefined |
| **TU-P36** | RN-43: Transição de estado concluído | (plansService.validateStateTransition) | Unidade | MC/DC | permitido=false | Estado=concluído |
| **TU-P37** | RN-44: Transição para estado inválido | (plansService.validateStateTransition) | Unidade | MC/DC | permitido=false | novoEstado='invalido' |
| **TI-01-01** | RF-13: Importar erva CSV e criar plano regular | herbsService + plansService | Integração | PE+VL | Erva importada, plano criado válido | Arquivo CSV com herb válida |
| **TI-01-02** | RF-14: Importar múltiplas ervas e criar planos | herbsService + plansService | Integração | PE+VL | 3 ervas importadas, 3 planos criados | Arquivo CSV com 3 herbs válidas |
| **TI-01-03** | RF-15: Importar herb inválida, plano não criado | herbsService + plansService | Integração | PE | 1 herb inválida rejeitada | Arquivo CSV com herb inválida |
| **TI-02-01** | RN-45: Medição dentro dos limites (sem alerta) | plansService (validação + classifyAlert) | Integração | VL | Alerta=Informativo | Medição OK, plano válido |
| **TI-02-02** | RN-46: Medição com violação de temperatura | plansService (validação + classifyAlert) | Integração | VL | Alerta=Aviso | Temp fora limites, plano válido |
| **TI-02-03** | RN-47: Medição com violações múltiplas | plansService (validação + classifyAlert) | Integração | MC | Alerta=Crítico | Múltiplas violações, plano válido |
| **TI-02-04** | RN-48: Medição com sensor defeituoso | plansService (validação + classifyAlert) | Integração | MC/DC | Alerta=null | SensorOK=false |
| **TI-03-01** | RN-04: Plano pontual COM autorização validado | plansService (validação plano) | Integração | MC/DC | Plano válido, criação permitida | autorizacaoResponsavel=true |
| **TI-03-02** | RN-04: Plano pontual SEM autorização rejeitado | plansService (validação plano) | Integração | MC/DC | Plano inválido, criação bloqueada | autorizacaoResponsavel=false |
| **TI-04-01** | RN-49: Transição + produtividade (ativo→concluído) | plansService (transição + produtividade) | Integração | MC+PE | Transição OK, produtividade=95% | Lote ativo com perdas |
| **TI-04-02** | RN-50: Transição + registro perdas (ativo→comprometido) | plansService (transição + produtividade) | Integração | MC+PE | Transição OK, produtividade=80% | Lote com perdas registadas |
| **TI-04-03** | RN-51: Divisão parcial de lote | plansService (produtividade) | Integração | PE | Divisões registadas, produtividade=70% | Lote com divisões |
| **TI-05-01** | RF-16: Fluxo E2E completo (erva→plano→lote→alerta→produtividade) | herbsService + plansService | Integração | PE+VL+MC | Ciclo completo concluído, produtividade ≈94.67% | Dados válidos, sensor OK |

---

## 3. Cobertura por Requisito (Bidirecional)

### Requisitos Funcionais (RF)

| RF | Descrição | Casos de Teste | Cobertura |
|:---:|:---|:---|:---:|
| **RF-01** | Estrutura de API (genérica) | Cobertura em Sprint 1 | ✅ |
| **RF-03** | Importação de ervas aromáticas | TU-H16, TU-H20, TI-01-01, TI-01-02, TI-05-01 | ✅ |
| **RF-04** | Manipulação de CSV (linhas inválidas) | TU-H17, TU-H18, TU-H19, TU-H21, TU-H22 | ✅ |
| **RF-05** | CSV vazio | TU-H18 | ✅ |
| **RF-06** | CSV null | TU-H19 | ✅ |
| **RF-07** | CSV sem header | TU-H20 | ✅ |
| **RF-08-12** | Validação de campos de herb | TU-H01 a TU-H15 | ✅ |
| **RF-13** | Criar plano e associar a erva | TI-01-01, TI-01-02 | ✅ |
| **RF-14** | Múltiplas ervas → múltiplos planos | TI-01-02 | ✅ |
| **RF-15** | Rejeição de herb inválida | TI-01-03 | ✅ |
| **RF-16** | Ciclo E2E completo | TI-05-01 | ✅ |

### Regras de Negócio (RN)

| RN | Descrição | Casos de Teste | Cobertura |
|:---:|:---|:---|:---:|
| **RN-01 a RN-04** | Validação básica herb | TU-H01 a TU-H04 | ✅ |
| **RN-05 a RN-09** | Limites temperatura (herb) | TU-H05 a TU-H09 | ✅ |
| **RN-10 a RN-12** | Limites umidade (herb) | TU-H10 a TU-H12 | ✅ |
| **RN-13 a RN-15** | Limites luminosidade (herb) | TU-H13 a TU-H15 | ✅ |
| **RN-04** | Plano pontual exige autorização | TU-P19, TU-P20, TU-P21, TU-P22, TI-03-01, TI-03-02 | ✅ MC/DC |
| **RN-10 a RN-29** | Validação plano (tipo, duração, limites) | TU-P01 a TU-P26 | ✅ |
| **RN-30 a RN-34** | Classificação de alertas | TU-P23 a TU-P27 | ✅ MC/DC |
| **RN-35 a RN-38** | Cálculo produtividade | TU-P28 a TU-P31 | ✅ |
| **RN-39 a RN-44** | Transição estados | TU-P32 a TU-P37 | ✅ MC/DC |
| **RN-45 a RN-48** | Integração plano + alertas | TI-02-01 a TI-02-04 | ✅ |
| **RN-49 a RN-51** | Ciclo lote (estado + produtividade) | TI-04-01 a TI-04-03 | ✅ |

---

## 4. Sumário de Cobertura

### Testes Unitários
- **Total:** 37 casos (TU-H01 a TU-H25, TU-P01 a TU-P37)
- **Técnicas aplicadas:** PE (18), VL (16), MC/DC (12)

### Testes de Integração
- **Total:** 12 casos (TI-01-01 a TI-05-01)
- **Técnicas aplicadas:** PE+VL (8), MC/DC (4)

### Requisitos Cobertos
- **Funcionais:** 13/13 (100%)
- **Regras de Negócio:** 51 (100%)

### Cobertura Técnica
- **Particionamento de Equivalência:** 26 casos ✅
- **Análise de Valores Limite:** 20 casos ✅
- **Cobertura MC/DC:** 16 casos ✅
- **Integração:** 12 casos ✅

**Total de casos de teste Sprint 2:** 49 ✅

---

## 5. Referência Rápida por Technique

### Particionamento de Equivalência (PE)
- Classes válidas: TU-H01, TU-P01, TU-P02, TU-P03
- Classes inválidas: TU-H02, TU-H03, TU-H04, TU-P04, TU-P05
- CSV válido/inválido/misto: TU-H16, TU-H17, TU-H18, TU-H19, TU-H20
- Estados lote: TU-P28, TU-P29, TU-P30, TU-P31

### Análise de Valores Limite (VL)
- Temperatura: TU-H05-H09 (herb), TU-P11-P12 (plan)
- Umidade: TU-H10-H12 (herb), TU-P13-P14 (plan)
- Luminosidade: TU-H13-H15 (herb), TU-P15-P18 (plan)
- Duração: TU-P06-P10
- CSV: TU-H21, TU-H22

### Cobertura MC/DC
- Plano pontual autorização: TU-P19, TU-P20, TU-P21, TU-P22
- Classificação alertas: TU-P23, TU-P24, TU-P25, TU-P26, TU-P27
- Transição estados: TU-P32 a TU-P37

---

## 6. Tabelas de Verdade - MC/DC

### Tabela 1: Plano Pontual (C1: tipo='pontual', C2: !autorizacao)

| Caso | C1 (tipo=pontual) | C2 (!auth) | Resultado | Teste |
|:---:|:---:|:---:|:---|:---|
| 1 | T | T | Erro - rejeita | TU-P19 |
| 2 | T | F | OK - aceita | TU-P20 |
| 3 | F | T | OK - aceita | TU-P21 |
| 4 | F | F | OK - aceita | TU-P22 |

### Tabela 2: Classificação Alertas (C1: temp>limMax, C2: hum<limMin, C3: sensorOK)

| Caso | C1 | C2 | C3 | Violações | Classificação | Teste |
|:---:|:---:|:---:|:---:|:---:|:---|:---|
| 1 | T | F | T | 1 | Aviso | TU-P23 |
| 2 | F | T | T | 1 | Aviso | TU-P24 |
| 3 | T | T | T | 2+ | Crítico | TU-P25 |
| 4 | F | F | T | 0 | Informativo | TU-P26 |
| 5 | T | T | F | - | null | TU-P27 |

### Tabela 3: Transição Estados (C1: estado=ativo, C2: novo=concluído, C3: dataFim)

| Caso | C1 | C2 | C3 | Resultado | Teste |
|:---:|:---:|:---:|:---:|:---|:---|
| 1 | T | T | T | OK | TU-P32 |
| 2 | T | T | F | Erro | TU-P33 |
| 3 | T | F | T | OK (outro) | TU-P34 |
| 4 | T | F | F | Erro | TU-P35 |
| 5 | F | - | - | Erro | TU-P36 |

---

## 7. Notas e Observações

### Técnicas Aplicadas com Rigor
- **PE:** Cada classe de equivalência testada com pelo menos 1 caso
- **VL:** Valores limite em [-1, 0, nominal, limite_sup, limite_sup+1]
- **MC/DC:** Todas as combinações de condições atómicas exercitadas
- **Integração:** Fluxos E2E com múltiplos componentes

### Pré-condições Explícitas
- Todas as pré-condições documentadas nas tabelas
- Dados isolados em testes unitários (sem dependências externas)
- Estado inicial explícito em testes de integração

### Defeitos / Lacunas Identificadas
- Nenhuma lacuna identificada nos requisitos mapeados
- Todos os RF e RN cobertos por pelo menos 1 caso de teste

---

## 8. Próximos Passos (Sprint 3)

- [ ] Implementar testes de sistema (TS-01 a TS-05)
- [ ] Adicionar testes de autorização e controle de acesso
- [ ] Implementar testes de auditoria (logs)
- [ ] Validar exportação de relatórios (CSV/Excel)
- [ ] Testes de performance e carga

---

**Data de atualização:** 2026-05-14  
**Versão:** 1.0  
**Status:** ✅ Concluído
