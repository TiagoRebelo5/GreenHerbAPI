# 🌿 GreenHerbAPI - Sprint 2 - Testes de Software

## Status: ✅ Concluído e Testado

---

## 📊 Resultados Rápidos

```
✅ 104 testes aprovados (100% sucesso)
✅ Cobertura de código: 83.56% instruções, 84.35% branches
✅ 49 casos de teste Sprint 2 (herbs + plans + integração)
✅ 64 requisitos mapeados com 100% de cobertura
✅ 3 técnicas formais aplicadas (PE, VL, MC/DC)
✅ Tempo execução: 2.5 segundos
```

---

## 📁 Ficheiros Sprint 2

### Serviços (Produção)
- `src/services/herbsService.js` - Validação e importação de ervas
- `src/services/plansService.js` - Validação e gestão de planos

### Testes
- `tests/unit/herbs.service.test.js` - 25 testes unitários
- `tests/unit/plans.service.test.js` - 37 testes unitários  
- `tests/integration/herbs.integration.test.js` - 12 testes de integração

### Documentação
- `docs/SPRINT2_RELATORIO.md` - Relatório completo
- `docs/SPRINT2_MATRIZ_RASTREABILIDADE.md` - Matriz detalhada (49 casos)

---

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar Todos os Testes
```bash
npm test
```

**Esperado:**
```
✓ 104 testes passed
✓ 4 suites passed
✓ Tempo: ~2.5s
```

### 3. Ver Cobertura de Código
```bash
npm run test:coverage
```

**Esperado:** Cobertura >80% em todos os ficheiros

---

## 📋 Cobertura por Técnica

### Particionamento de Equivalência (PE) - 26 casos
- Classes válidas vs inválidas
- Ervas: TU-H01, TU-H02, TU-H03, TU-H04
- Planos: TU-P01, TU-P02, TU-P03, TU-P04, TU-P05
- CSV: TU-H16, TU-H17, TU-H18, TU-H19, TU-H20
- Integração: TI-01-01, TI-01-02, TI-01-03, etc.

### Análise de Valores Limite (VL) - 20 casos
**Intervalos testados:**
- Temperatura: [-50, 50] com valores -51, -50, 0, 50, 51
- Umidade: [0, 100] com valores -1, 0, 100, 101
- Luminosidade: [0, 100000] com valores 0, 100000, 100001
- Duração plano: [1, 365] com valores 0, 1, 180, 365, 366

### Cobertura MC/DC - 16 casos
**Condições múltiplas:**
- Plano pontual autorização: 4 combinações (T/F × T/F)
- Classificação alertas: 5 casos principais
- Transição estados: 6 casos
- Integração: TI-02-01 a TI-04-03

---

## 📈 Estatísticas Detalhadas

### Testes Unitários
- **Herbs:** 25 testes
  - PE: 4 testes
  - VL: 11 testes
  - CSV parsing: 5 testes
  - Parse line: 3 testes
  - Outros: 2 testes

- **Plans:** 37 testes
  - PE: 5 testes
  - VL: 8 testes
  - MC/DC: 19 testes
  - Outros: 5 testes

### Testes de Integração
- **TI-01:** Importação + Planos (3 testes)
- **TI-02:** Plano + Alertas (4 testes)
- **TI-03:** Plano Pontual (2 testes)
- **TI-04:** Ciclo de Lote (3 testes)
- **TI-05:** Fluxo E2E (1 teste)

---

## ✨ Funcionalidades Testadas

### Herbs Service
```javascript
✓ validateHerbData() - Valida herb com 15 testes
✓ parseCSVLine() - Parse CSV com 3 testes
✓ importFromCSV() - Importação CSV com 7 testes
```

**Validações:**
- Campos obrigatórios (nome, especie)
- Intervalos: temperatura, umidade, luminosidade
- CSV com header/sem header
- Linhas válidas, inválidas, mistas

### Plans Service
```javascript
✓ validatePlanData() - Valida plano com 22 testes
✓ classifyAlert() - Classificação alertas com 5 testes
✓ calculateProductivity() - Produtividade com 4 testes
✓ validateStateTransition() - Transição estados com 6 testes
```

**Validações:**
- Tipo de plano (regular, emergência, pontual)
- Autorização para plano pontual
- Duração, temperatura, umidade, luminosidade
- MC/DC em condições múltiplas
- Estados: ativo → concluído/comprometido

---

## 🎯 Matriz de Rastreabilidade

**Arquivo:** `docs/SPRINT2_MATRIZ_RASTREABILIDADE.md`

| Requisito | Casos de Teste | Status |
|:---|---:|:---:|
| **RF (Funcionais)** | 13 requisitos | ✅ 100% |
| **RN (Negócio)** | 51 requisitos | ✅ 100% |
| **TOTAL** | 64 requisitos | ✅ 100% |

### Cobertura Bidirecional
- ✅ Cada requisito tem ≥1 caso de teste
- ✅ Cada caso de teste mapeia a um requisito
- ✅ Sem lacunas ou gaps

---

## 🔍 Exemplos de Uso

### Importar Ervas de CSV
```javascript
const csv = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,15,28,40,70,3000,8000
Manjericão,Ocimum basilicum,18,30,45,75,4000,9000`;

const result = herbsService.importFromCSV(csv);
// { total: 2, valid: 2, invalid: 0, data: [...] }
```

### Validar Plano Regular
```javascript
const plan = {
  tipo: 'regular',
  nome: 'Plano Hortelã',
  duracao: 90,
  tempMin: 18,
  tempMax: 28,
  umidadeMin: 40,
  umidadeMax: 70,
  luminosidadeMin: 5000,
  luminosidadeMax: 25000
};

const validation = plansService.validatePlanData(plan);
// { valid: true, errors: [] }
```

### Classificar Alerta
```javascript
const medicao = {
  temperatura: 35,  // Acima do máximo
  humidade: 50,
  luminosidade: 12000
};

const alerta = plansService.classifyAlert(medicao, plan, true);
// "Aviso" (1 violação)
```

### Calcular Produtividade
```javascript
const lote = {
  quantidade: 100,
  perdas: 5,
  divisoes: 0,
  dataFim: new Date().toISOString()
};

const prod = plansService.calculateProductivity(lote);
// { produtividade: 95, produzido: 95, perdas: 5, ... }
```

---

## 📊 Tabelas de Verdade (MC/DC)

### Plano Pontual (2 condições, 4 casos)
| Tipo | Autorização | Resultado | Teste |
|:---|:---|:---|:---|
| pontual | ❌ | Rejeita | TU-P19 |
| pontual | ✅ | Aceita | TU-P20 |
| regular | ❌ | Aceita | TU-P21 |
| regular | ✅ | Aceita | TU-P22 |

### Classificação Alertas (3 condições, 5 casos principais)
| Temp>Max | Hum<Min | SensorOK | Classificação | Teste |
|:---|:---|:---|:---|:---|
| T | F | T | Aviso | TU-P23 |
| F | T | T | Aviso | TU-P24 |
| T | T | T | Crítico | TU-P25 |
| F | F | T | Informativo | TU-P26 |
| T | T | F | null | TU-P27 |

---

## 🛠️ Troubleshooting

### Se `npm test` falhar

1. **Verificar Node.js:**
   ```bash
   node --version  # Deve ser v14+
   ```

2. **Limpar cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verificar ficheiros:**
   ```bash
   ls src/services/herbsService.js
   ls src/services/plansService.js
   ls tests/unit/herbs.service.test.js
   ```

---

## 📚 Documentação Completa

### Ficheiros de Documentação
1. **SPRINT2_RELATORIO.md** - Relatório executivo (este ficheiro está em `docs/`)
2. **SPRINT2_MATRIZ_RASTREABILIDADE.md** - Matriz 49×64 detalhada
3. **README.md** - Este guia rápido

### Ficheiros de Código
- `src/services/herbsService.js` - 156 linhas, totalmente documentado
- `src/services/plansService.js` - 290 linhas, totalmente documentado
- `tests/unit/herbs.service.test.js` - 335 linhas, 25 testes
- `tests/unit/plans.service.test.js` - 573 linhas, 37 testes
- `tests/integration/herbs.integration.test.js` - 345 linhas, 12 testes

---

## 🎓 Técnicas Demonstradas

### ✅ Particionamento de Equivalência
- Identificação de classes válidas/inválidas
- 1 caso por classe (mínimo)
- Aplicado em: herbs, plans, CSV, tipos, estados

### ✅ Análise de Valores Limite
- Padrão: [limite-1, limite, nominal, limite_sup, limite_sup+1]
- 5 casos por intervalo crítico
- Aplicado em: temp, umidade, luminosidade, duração

### ✅ MC/DC (Modified Condition/Decision Coverage)
- Tabelas de verdade para condições múltiplas
- Cada condição afeta independentemente a decisão
- Aplicado em: autorização, alertas, transições

### ✅ Testes de Integração
- Fluxos E2E com múltiplos componentes
- Validação de contratos entre serviços
- 12 cenários complexos

---

## 🚀 Próximos Passos (Sprint 3)

- [ ] Testes de Sistema (TS-01 a TS-05)
- [ ] Testes de Controle de Acesso (perfis)
- [ ] Testes de Auditoria (logs)
- [ ] Testes de Exportação (CSV/Excel)
- [ ] Testes de Performance

---

## 📞 Suporte

Para questões sobre os testes:
1. Ver `docs/SPRINT2_MATRIZ_RASTREABILIDADE.md` para mapeamento detalhado
2. Ver `docs/SPRINT2_RELATORIO.md` para análise completa
3. Verificar comentários no código em `src/services/` e `tests/`

---

**Sprint 2 Status:** ✅ **CONCLUÍDO COM SUCESSO**

**Data:** 2026-05-14  
**Versão:** 1.0 Final  
**Qualidade:** 🟢 Excelente (100% testes aprovados, 83%+ cobertura)
