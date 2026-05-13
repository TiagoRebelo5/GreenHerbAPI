const herbsService = require('../../src/services/herbsService');
const plansService = require('../../src/services/plansService');

describe('Testes de Integração - Herbs e Plans', () => {

  // =====================================================
  // 5.1 INTEGRAÇÃO: Importação de Ervas + Validação de Plano
  // =====================================================

  describe('TI-01: Criar plano para erva importada', () => {

    it('TI-01-01: Importar erva CSV e criar plano regular associado', () => {
      // Passo 1: Importar erva
      const csvContent = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,10,30,35,75,3000,10000`;

      const importResult = herbsService.importFromCSV(csvContent);
      expect(importResult.valid).toBe(1);
      expect(importResult.data).toHaveLength(1);

      const herbImportada = importResult.data[0];

      // Passo 2: Criar plano baseado nos limites da erva
      const planData = {
        tipo: 'regular',
        nome: `Plano para ${herbImportada.nome}`,
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000
      };

      const planValidation = plansService.validatePlanData(planData);
      expect(planValidation.valid).toBe(true);
    });

    it('TI-01-02: Importar múltiplas ervas e validar criação de planos', () => {
      const csvContent = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,10,30,35,75,3000,10000
Manjericão,Ocimum basilicum,15,32,40,80,4000,12000
Tomilho,Thymus vulgaris,8,28,30,70,2500,8000`;

      const importResult = herbsService.importFromCSV(csvContent);
      expect(importResult.valid).toBe(3);
      expect(importResult.data).toHaveLength(3);

      // Criar plano para cada erva
      importResult.data.forEach((herb) => {
        const planData = {
          tipo: 'regular',
          nome: `Plano para ${herb.nome}`,
          duracao: 60,
          tempMin: 15,
          tempMax: 30,
          umidadeMin: 35,
          umidadeMax: 75,
          luminosidadeMin: 4000,
          luminosidadeMax: 10000
        };

        const validation = plansService.validatePlanData(planData);
        expect(validation.valid).toBe(true);
      });
    });

    it('TI-01-03: Importar erva inválida e não criar plano', () => {
      const csvContent = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,10,30,35,75,3000,10000
Manjericão,,15,32,40,80,4000,12000`;

      const importResult = herbsService.importFromCSV(csvContent);
      expect(importResult.valid).toBe(1);
      expect(importResult.invalid).toBe(1);
      expect(importResult.data).toHaveLength(1);
    });
  });

  // =====================================================
  // 5.2 INTEGRAÇÃO: Validação de Plano + Classificação de Alertas
  // =====================================================

  describe('TI-02: Criar plano e gerar alertas baseado em medições', () => {

    it('TI-02-01: Medição dentro dos limites do plano (sem alerta)', () => {
      // Criar plano
      const planData = {
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

      const planValidation = plansService.validatePlanData(planData);
      expect(planValidation.valid).toBe(true);

      // Fazer medição dentro dos limites
      const medicao = {
        temperatura: 22,
        humidade: 55,
        luminosidade: 12000
      };

      const alerta = plansService.classifyAlert(medicao, planData, true);
      expect(alerta).toBe('Informativo'); // Sem violações
    });

    it('TI-02-02: Medição violando limite de temperatura (Aviso)', () => {
      const planData = {
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

      const medicao = {
        temperatura: 30, // Acima do máximo
        humidade: 55,
        luminosidade: 12000
      };

      const alerta = plansService.classifyAlert(medicao, planData, true);
      expect(alerta).toBe('Aviso'); // 1 violação
    });

    it('TI-02-03: Medição violando múltiplos limites (Crítico)', () => {
      const planData = {
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

      const medicao = {
        temperatura: 32, // Acima do máximo
        humidade: 25,    // Abaixo do mínimo
        luminosidade: 3000 // Abaixo do mínimo
      };

      const alerta = plansService.classifyAlert(medicao, planData, true);
      expect(alerta).toBe('Crítico'); // 3 violações
    });

    it('TI-02-04: Sensor defeituoso (sem alerta)', () => {
      const planData = {
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

      const medicao = {
        temperatura: 35,
        humidade: 20,
        luminosidade: 2000
      };

      const alerta = plansService.classifyAlert(medicao, planData, false);
      expect(alerta).toBeNull(); // Sensor não OK
    });
  });

  // =====================================================
  // 5.3 INTEGRAÇÃO: Plano Pontual com Autorização
  // =====================================================

  describe('TI-03: Criar plano pontual com validação de autorização', () => {

    it('TI-03-01: Criar plano pontual COM autorização do Responsável', () => {
      const planData = {
        tipo: 'pontual',
        nome: 'Intervenção Pontual',
        duracao: 7,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        autorizacaoResponsavel: true // Autorização presente
      };

      const validation = plansService.validatePlanData(planData);
      expect(validation.valid).toBe(true);
    });

    it('TI-03-02: Tentar criar plano pontual SEM autorização do Responsável (rejeitar)', () => {
      const planData = {
        tipo: 'pontual',
        nome: 'Intervenção Pontual Não Autorizada',
        duracao: 7,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        autorizacaoResponsavel: false // Autorização ausente
      };

      const validation = plansService.validatePlanData(planData);
      expect(validation.valid).toBe(false);
      expect(validation.errors.some(e => e.includes('autorização'))).toBe(true);
    });
  });

  // =====================================================
  // 5.4 INTEGRAÇÃO: Ciclo Completo de Lote (Estado + Produtividade)
  // =====================================================

  describe('TI-04: Ciclo completo de lote com transição de estado e produtividade', () => {

    it('TI-04-01: Lote ativo → concluído com cálculo de produtividade', () => {
      // Criar lote
      const lote = {
        id: 'lote_001',
        estado: 'ativo',
        quantidade: 100,
        perdas: 5,
        divisoes: 0,
        dataInicio: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        dataFim: null
      };

      expect(lote.estado).toBe('ativo');

      // Validar transição: ativo → concluído
      lote.dataFim = new Date().toISOString();
      const transicao = plansService.validateStateTransition(lote, 'concluído');
      expect(transicao.permitido).toBe(true);

      // Atualizar estado
      lote.estado = 'concluído';

      // Calcular produtividade
      const produtividade = plansService.calculateProductivity(lote);
      expect(produtividade.produtividade).toBe(95);
      expect(produtividade.produzido).toBe(95);
      expect(produtividade.perdas).toBe(5);
    });

    it('TI-04-02: Lote ativo → comprometido com registro de perdas', () => {
      const lote = {
        id: 'lote_002',
        estado: 'ativo',
        quantidade: 100,
        perdas: 0,
        divisoes: 0
      };

      // Registar perdas
      lote.perdas = 20;

      // Validar transição
      const transicao = plansService.validateStateTransition(lote, 'comprometido');
      expect(transicao.permitido).toBe(true);

      lote.estado = 'comprometido';

      // Calcular produtividade
      const produtividade = plansService.calculateProductivity({
        ...lote,
        dataFim: new Date().toISOString()
      });

      expect(produtividade.produtividade).toBe(80);
      expect(produtividade.perdas).toBe(20);
    });

    it('TI-04-03: Lote com divisão parcial', () => {
      const lote = {
        id: 'lote_003',
        estado: 'ativo',
        quantidade: 200,
        perdas: 10,
        divisoes: 50, // Dividiu em 2 partes
        dataFim: new Date().toISOString()
      };

      // Validar transição
      const transicao = plansService.validateStateTransition(lote, 'concluído');
      expect(transicao.permitido).toBe(true);

      // Calcular produtividade
      const produtividade = plansService.calculateProductivity(lote);
      expect(produtividade.total).toBe(200);
      expect(produtividade.perdas).toBe(10);
      expect(produtividade.divisoes).toBe(50);
      expect(produtividade.produzido).toBe(140);
      expect(produtividade.produtividade).toBe(70);
    });
  });

  // =====================================================
  // 5.5 INTEGRAÇÃO: Fluxo E2E Simplificado
  // =====================================================

  describe('TI-05: Fluxo E2E (Erva → Plano → Lote → Alerta → Produtividade)', () => {

    it('TI-05-01: Ciclo completo de cultivo', () => {
      // 1. Importar erva
      const csvContent = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,10,30,35,75,3000,10000`;

      const importResult = herbsService.importFromCSV(csvContent);
      expect(importResult.valid).toBe(1);
      const herbId = importResult.data[0].id;

      // 2. Criar plano regular
      const planData = {
        tipo: 'regular',
        nome: 'Plano Hortelã Sprint 2',
        duracao: 90,
        tempMin: 18,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 25000,
        herbId: herbId
      };

      const planValidation = plansService.validatePlanData(planData);
      expect(planValidation.valid).toBe(true);
      const planId = 'plan_001';

      // 3. Criar lote
      const lote = {
        id: 'lote_e2e_001',
        estado: 'ativo',
        herbId: herbId,
        planId: planId,
        quantidade: 150,
        perdas: 0,
        divisoes: 0,
        dataInicio: new Date().toISOString()
      };

      // 4. Registar medições
      const medicoes = [
        { temperatura: 22, humidade: 55, luminosidade: 12000 },
        { temperatura: 24, humidade: 60, luminosidade: 13000 },
        { temperatura: 20, humidade: 50, luminosidade: 11000 }
      ];

      const alertas = [];
      medicoes.forEach((med) => {
        const alerta = plansService.classifyAlert(med, planData, true);
        alertas.push(alerta);
      });

      expect(alertas).toContain('Informativo');

      // 5. Concluir lote
      lote.perdas = 8;
      lote.dataFim = new Date().toISOString();
      const transicao = plansService.validateStateTransition(lote, 'concluído');
      expect(transicao.permitido).toBe(true);

      // 6. Calcular produtividade
      const produtividade = plansService.calculateProductivity(lote);
      expect(produtividade.total).toBe(150);
      expect(produtividade.produzido).toBe(142);
      expect(produtividade.perdas).toBe(8);
      expect(produtividade.produtividade).toBeCloseTo(94.67, 1);
    });
  });

});
