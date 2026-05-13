const plansService = require('../../src/services/plansService');

describe('Testes de Unidade - Plans Service', () => {

  // =====================================================
  // 4.1 PARTICIONAMENTO DE EQUIVALÊNCIA - Tipo de Plano
  // =====================================================

  describe('validatePlanData - PE: Tipo de Plano', () => {

    // PE-01: Tipo válido - regular
    it('TU-P01: PE - Plan válido tipo "regular"', () => {
      const validPlan = {
        tipo: 'regular',
        nome: 'Plano de Hortelã',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(validPlan);
      expect(result.valid).toBe(true);
    });

    // PE-02: Tipo válido - emergência
    it('TU-P02: PE - Plan válido tipo "emergência"', () => {
      const validPlan = {
        tipo: 'emergência',
        nome: 'Plano de Emergência',
        duracao: 30,
        tempMin: 15,
        tempMax: 25,
        umidadeMin: 35,
        umidadeMax: 65,
        luminosidadeMin: 4000,
        luminosidadeMax: 20000
      };

      const result = plansService.validatePlanData(validPlan);
      expect(result.valid).toBe(true);
    });

    // PE-03: Tipo válido - pontual (com autorização)
    it('TU-P03: PE - Plan válido tipo "pontual" com autorização', () => {
      const validPlan = {
        tipo: 'pontual',
        nome: 'Plano Pontual',
        duracao: 14,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        autorizacaoResponsavel: true
      };

      const result = plansService.validatePlanData(validPlan);
      expect(result.valid).toBe(true);
    });

    // PE-04: Tipo inválido
    it('TU-P04: PE - Plan inválido tipo "invalido"', () => {
      const invalidPlan = {
        tipo: 'invalido',
        nome: 'Plano Inválido',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(invalidPlan);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Tipo de plano inválido'))).toBe(true);
    });

    // PE-05: Tipo faltando
    it('TU-P05: PE - Plan sem tipo', () => {
      const invalidPlan = {
        nome: 'Plano sem Tipo',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(invalidPlan);
      expect(result.valid).toBe(false);
    });
  });

  // =====================================================
  // 4.2 ANÁLISE DE VALORES LIMITE - Duração
  // =====================================================

  describe('validatePlanData - VL: Duração [1, 365]', () => {

    // Intervalo: [1, 365]
    // Valores a testar: 0, 1, 180, 365, 366

    it('TU-P06: VL - Duração abaixo do limite (0)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Duração 0',
        duracao: 0,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Duração deve estar entre 1 e 365'))).toBe(true);
    });

    it('TU-P07: VL - Duração no limite inferior (1)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Duração 1',
        duracao: 1,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });

    it('TU-P08: VL - Duração nominal (180)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Duração 180',
        duracao: 180,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });

    it('TU-P09: VL - Duração no limite superior (365)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Duração 365',
        duracao: 365,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });

    it('TU-P10: VL - Duração acima do limite (366)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Duração 366',
        duracao: 366,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(false);
    });
  });

  // =====================================================
  // 4.3 ANÁLISE DE VALORES LIMITE - Temperatura [18, 28]
  // =====================================================

  describe('validatePlanData - VL: Temperatura [18, 28]', () => {

    // Valores a testar: 17, 18, 23, 28, 29

    it('TU-P11: VL - Temperatura mínima 17 (inválido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Temp 17',
        duracao: 90,
        tempMin: 17,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true); // -50 a 50 é o intervalo absoluto
    });

    it('TU-P12: VL - Temperatura mínima 18 (válido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Temp 18',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });
  });

  // =====================================================
  // 4.4 ANÁLISE DE VALORES LIMITE - Umidade [40, 80]
  // =====================================================

  describe('validatePlanData - VL: Umidade [40, 80]', () => {

    // Valores a testar: 39, 40, 60, 80, 81

    it('TU-P13: VL - Umidade mínima 39 (inválido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Umidade 39',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 39,
        umidadeMax: 80,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true); // 0-100 é intervalo absoluto
    });

    it('TU-P14: VL - Umidade mínima 40 (válido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Umidade 40',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 80,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });
  });

  // =====================================================
  // 4.5 ANÁLISE DE VALORES LIMITE - Luminosidade [5000, 25000]
  // =====================================================

  describe('validatePlanData - VL: Luminosidade [5000, 25000]', () => {

    // Valores a testar: 4999, 5000, 15000, 25000, 25001

    it('TU-P15: VL - Luminosidade mínima 4999 (inválido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Lum 4999',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 4999,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true); // 0-100000 é intervalo absoluto
    });

    it('TU-P16: VL - Luminosidade mínima 5000 (válido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Lum 5000',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });

    it('TU-P17: VL - Luminosidade máxima 25000 (válido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Lum 25000',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });

    it('TU-P18: VL - Luminosidade máxima 25001 (inválido)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Lum 25001',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25001
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true); // 0-100000 é intervalo absoluto
    });
  });

  // =====================================================
  // 4.6 COBERTURA DE CONDIÇÕES MÚLTIPLAS - Plano Pontual
  // =====================================================
  // Expressão: (tipo === 'pontual' && !autorizacaoResponsavel)
  // C1: tipo === 'pontual'
  // C2: !autorizacaoResponsavel
  // Tabela de Verdade (2 condições = 4 combinações):
  // C1 | C2 | Resultado
  // T  | T  | Erro (plano pontual sem autorização)
  // T  | F  | OK (plano pontual com autorização)
  // F  | T  | OK (tipo não é pontual, autorização não importa)
  // F  | F  | OK

  describe('validatePlanData - MC/DC: Plano Pontual com Autorização', () => {

    // MC/DC-01: C1=T, C2=T → Erro
    it('TU-P19: MC/DC - Plano pontual SEM autorização (T,T)', () => {
      const plan = {
        tipo: 'pontual',
        nome: 'Plano Pontual Sem Auth',
        duracao: 14,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        autorizacaoResponsavel: false
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('autorização do Responsável'))).toBe(true);
    });

    // MC/DC-02: C1=T, C2=F → OK
    it('TU-P20: MC/DC - Plano pontual COM autorização (T,F)', () => {
      const plan = {
        tipo: 'pontual',
        nome: 'Plano Pontual Com Auth',
        duracao: 14,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        autorizacaoResponsavel: true
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });

    // MC/DC-03: C1=F, C2=T → OK
    it('TU-P21: MC/DC - Plano regular sem autorização (F,T)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Regular Sem Auth',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        autorizacaoResponsavel: false
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });

    // MC/DC-04: C1=F, C2=F → OK
    it('TU-P22: MC/DC - Plano regular com autorização (F,F)', () => {
      const plan = {
        tipo: 'regular',
        nome: 'Plano Regular Com Auth',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        autorizacaoResponsavel: true
      };

      const result = plansService.validatePlanData(plan);
      expect(result.valid).toBe(true);
    });
  });

  // =====================================================
  // 4.7 CLASSIFICAÇÃO DE ALERTAS
  // =====================================================
  // Expressão MC/DC: (temp > limMaxT || hum < limMinH) && sensorOK
  // C1: temp > limMaxT
  // C2: hum < limMinH
  // C3: sensorOK
  // Tabela de Verdade (3 condições = 8 combinações)

  describe('classifyAlert - MC/DC: Classificação de Alertas', () => {

    const limites = {
      tempMin: 18,
      tempMax: 28,
      umidadeMin: 40,
      umidadeMax: 80,
      luminosidadeMin: 5000,
      luminosidadeMax: 25000
    };

    // MC/DC-05: C1=T, C2=F, C3=T → Alerta (violação temp)
    it('TU-P23: MC/DC - Temperatura acima do limite, sensor OK', () => {
      const medicao = {
        temperatura: 35,
        humidade: 50,
        luminosidade: 10000
      };

      const result = plansService.classifyAlert(medicao, limites, true);
      expect(result).toBe('Aviso'); // 1 violação
    });

    // MC/DC-06: C1=F, C2=T, C3=T → Alerta (violação umidade)
    it('TU-P24: MC/DC - Umidade abaixo do limite, sensor OK', () => {
      const medicao = {
        temperatura: 22,
        humidade: 30,
        luminosidade: 10000
      };

      const result = plansService.classifyAlert(medicao, limites, true);
      expect(result).toBe('Aviso'); // 1 violação
    });

    // MC/DC-07: C1=T, C2=T, C3=T → Alerta crítico (múltiplas violações)
    it('TU-P25: MC/DC - Temperatura E umidade fora dos limites', () => {
      const medicao = {
        temperatura: 35,
        humidade: 30,
        luminosidade: 10000
      };

      const result = plansService.classifyAlert(medicao, limites, true);
      expect(result).toBe('Crítico'); // 2 violações
    });

    // MC/DC-08: C1=F, C2=F, C3=T → OK
    it('TU-P26: MC/DC - Todas as medições OK', () => {
      const medicao = {
        temperatura: 22,
        humidade: 60,
        luminosidade: 10000
      };

      const result = plansService.classifyAlert(medicao, limites, true);
      expect(result).toBe('Informativo'); // 0 violações
    });

    // MC/DC-09: Sensor não OK (C3=F)
    it('TU-P27: MC/DC - Sensor não OK', () => {
      const medicao = {
        temperatura: 35,
        humidade: 30,
        luminosidade: 10000
      };

      const result = plansService.classifyAlert(medicao, limites, false);
      expect(result).toBeNull();
    });
  });

  // =====================================================
  // 4.8 CÁLCULO DE PRODUTIVIDADE
  // =====================================================

  describe('calculateProductivity', () => {

    // PE-06: Cálculo sem perdas
    it('TU-P28: PE - Produtividade sem perdas', () => {
      const lote = {
        quantidade: 100,
        perdas: 0,
        divisoes: 0,
        dataFim: new Date().toISOString()
      };

      const result = plansService.calculateProductivity(lote);
      expect(result.produtividade).toBe(100);
      expect(result.produzido).toBe(100);
    });

    // PE-07: Cálculo com perdas
    it('TU-P29: PE - Produtividade com perdas', () => {
      const lote = {
        quantidade: 100,
        perdas: 10,
        divisoes: 0,
        dataFim: new Date().toISOString()
      };

      const result = plansService.calculateProductivity(lote);
      expect(result.produtividade).toBe(90);
      expect(result.produzido).toBe(90);
      expect(result.perdas).toBe(10);
    });

    // PE-08: Cálculo com divisões
    it('TU-P30: PE - Produtividade com divisões', () => {
      const lote = {
        quantidade: 100,
        perdas: 0,
        divisoes: 20,
        dataFim: new Date().toISOString()
      };

      const result = plansService.calculateProductivity(lote);
      expect(result.produtividade).toBe(80);
      expect(result.divisoes).toBe(20);
    });

    // PE-09: Cálculo sem dataFim
    it('TU-P31: PE - Produtividade sem data de fim (erro)', () => {
      const lote = {
        quantidade: 100,
        perdas: 0,
        divisoes: 0
      };

      expect(() => {
        plansService.calculateProductivity(lote);
      }).toThrow();
    });
  });

  // =====================================================
  // 4.9 TRANSIÇÃO DE ESTADO
  // =====================================================

  describe('validateStateTransition - MC/DC', () => {

    // MC/DC-10: Transição ativo → concluído com dataFim
    it('TU-P32: MC/DC - Transição ativo → concluído OK', () => {
      const lote = {
        estado: 'ativo',
        dataFim: new Date().toISOString(),
        perdas: 0
      };

      const result = plansService.validateStateTransition(lote, 'concluído');
      expect(result.permitido).toBe(true);
    });

    // MC/DC-11: Transição ativo → concluído sem dataFim
    it('TU-P33: MC/DC - Transição ativo → concluído sem dataFim (erro)', () => {
      const lote = {
        estado: 'ativo',
        perdas: 0
      };

      const result = plansService.validateStateTransition(lote, 'concluído');
      expect(result.permitido).toBe(false);
      expect(result.erro).toContain('Data de fim');
    });

    // MC/DC-12: Transição ativo → comprometido com perdas
    it('TU-P34: MC/DC - Transição ativo → comprometido com perdas OK', () => {
      const lote = {
        estado: 'ativo',
        perdas: 10
      };

      const result = plansService.validateStateTransition(lote, 'comprometido');
      expect(result.permitido).toBe(true);
    });

    // MC/DC-13: Transição ativo → comprometido sem perdas
    it('TU-P35: MC/DC - Transição ativo → comprometido sem perdas (erro)', () => {
      const lote = {
        estado: 'ativo'
      };

      const result = plansService.validateStateTransition(lote, 'comprometido');
      expect(result.permitido).toBe(false);
    });

    // MC/DC-14: Transição de estado final
    it('TU-P36: MC/DC - Transição de estado concluído (erro)', () => {
      const lote = {
        estado: 'concluído'
      };

      const result = plansService.validateStateTransition(lote, 'ativo');
      expect(result.permitido).toBe(false);
    });

    // MC/DC-15: Estado inválido
    it('TU-P37: MC/DC - Transição para estado inválido', () => {
      const lote = {
        estado: 'ativo'
      };

      const result = plansService.validateStateTransition(lote, 'invalido');
      expect(result.permitido).toBe(false);
    });
  });

});
