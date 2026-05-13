const herbsService = require('../../src/services/herbsService');

describe('Testes de Unidade - Herbs Service', () => {

  // =====================================================
  // 3.1 PARTICIONAMENTO DE EQUIVALÊNCIA
  // =====================================================
  
  describe('validateHerbData - Particionamento de Equivalência', () => {
    
    // PE-01: Herb válida com todos os campos
    it('TU-H01: PE - Herb válida com todas as propriedades', () => {
      const validHerb = {
        nome: 'Hortelã',
        especie: 'Mentha piperita',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(validHerb);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    // PE-02: Herb inválida - sem nome
    it('TU-H02: PE - Herb inválida (nome vazio)', () => {
      const invalidHerb = {
        nome: '',
        especie: 'Mentha',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(invalidHerb);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    // PE-03: Herb inválida - sem especie
    it('TU-H03: PE - Herb inválida (especie vazia)', () => {
      const invalidHerb = {
        nome: 'Hortelã',
        especie: null,
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(invalidHerb);
      expect(result.valid).toBe(false);
    });

    // PE-04: Herb inválida - null
    it('TU-H04: PE - Herb inválida (null)', () => {
      const result = herbsService.validateHerbData(null);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBe('Herb object is required');
    });
  });

  // =====================================================
  // 3.2 ANÁLISE DE VALORES LIMITE
  // =====================================================

  describe('validateHerbData - Análise de Valores Limite', () => {

    // VL-01: Temperatura mínima - valores limite
    // Intervalo aceitável: [-50, 50]
    // Valores a testar: -51, -50, 0, 50, 51
    it('TU-H05: VL - Temperatura mínima abaixo do limite (-51)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: -51,
        tempMax: 25,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Temperatura mínima'))).toBe(true);
    });

    it('TU-H06: VL - Temperatura mínima no limite inferior (-50)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: -50,
        tempMax: 25,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(true);
    });

    it('TU-H07: VL - Temperatura mínima nominal (0)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 0,
        tempMax: 25,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(true);
    });

    it('TU-H08: VL - Temperatura mínima no limite superior (50)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 20,
        tempMax: 50,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(true);
    });

    it('TU-H09: VL - Temperatura mínima acima do limite (51)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 51,
        tempMax: 60,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(false);
    });

    // VL-02: Umidade - Intervalo [0, 100]
    it('TU-H10: VL - Umidade mínima inválida (-1)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: -1,
        umidadeMax: 70,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(false);
    });

    it('TU-H11: VL - Umidade no limite (0)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 0,
        umidadeMax: 100,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(true);
    });

    it('TU-H12: VL - Umidade inválida (101)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 101,
        luminosidadeMin: 3000,
        luminosidadeMax: 8000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(false);
    });

    // VL-03: Luminosidade - Intervalo [0, 100000]
    it('TU-H13: VL - Luminosidade mínima (0)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 0,
        luminosidadeMax: 50000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(true);
    });

    it('TU-H14: VL - Luminosidade máxima (100000)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 100000
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(true);
    });

    it('TU-H15: VL - Luminosidade acima do limite (100001)', () => {
      const herb = {
        nome: 'Hortelã',
        especie: 'Mentha',
        tempMin: 15,
        tempMax: 28,
        umidadeMin: 40,
        umidadeMax: 70,
        luminosidadeMin: 5000,
        luminosidadeMax: 100001
      };

      const result = herbsService.validateHerbData(herb);
      expect(result.valid).toBe(false);
    });
  });

  // =====================================================
  // 3.3 IMPORTAÇÃO CSV
  // =====================================================

  describe('importFromCSV - Particionamento e Valores Limite', () => {

    // PE-05: CSV válido
    it('TU-H16: PE - Importação CSV válido com 1 linha', () => {
      const csv = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,15,28,40,70,3000,8000`;

      const result = herbsService.importFromCSV(csv);
      expect(result.total).toBe(1);
      expect(result.valid).toBe(1);
      expect(result.invalid).toBe(0);
      expect(result.data).toHaveLength(1);
    });

    // PE-06: CSV com linhas válidas e inválidas
    it('TU-H17: PE - Importação CSV misto (válido + inválido)', () => {
      const csv = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,15,28,40,70,3000,8000
Manjericão,,20,30,50,75,4000,9000`;

      const result = herbsService.importFromCSV(csv);
      expect(result.total).toBe(2);
      expect(result.valid).toBe(1);
      expect(result.invalid).toBe(1);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    // PE-07: CSV vazio
    it('TU-H18: PE - Importação CSV vazio', () => {
      const result = herbsService.importFromCSV('');
      expect(result.valid).toBe(0);
      expect(result.invalid).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    // PE-08: CSV null
    it('TU-H19: PE - Importação CSV null', () => {
      const result = herbsService.importFromCSV(null);
      expect(result.valid).toBe(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    // PE-09: CSV sem header
    it('TU-H20: PE - Importação CSV sem header (apenas dados)', () => {
      const csv = `Hortelã,Mentha piperita,15,28,40,70,3000,8000
Manjericão,Ocimum basilicum,18,30,45,75,4000,9000`;

      const result = herbsService.importFromCSV(csv);
      expect(result.total).toBe(2);
      expect(result.valid).toBe(2);
    });

    // VL-04: CSV com valores limite de temperatura
    it('TU-H21: VL - Importação CSV temperatura valor limite inferior (18)', () => {
      const csv = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,18,28,40,70,3000,8000`;

      const result = herbsService.importFromCSV(csv);
      expect(result.valid).toBe(1);
      expect(result.data[0].tempMin).toBe('18');
    });

    it('TU-H22: VL - Importação CSV temperatura abaixo do limite (-51)', () => {
      const csv = `nome,especie,tempMin,tempMax,umidadeMin,umidadeMax,luminosidadeMin,luminosidadeMax
Hortelã,Mentha piperita,-51,28,40,70,3000,8000`;

      const result = herbsService.importFromCSV(csv);
      expect(result.valid).toBe(0);
      expect(result.invalid).toBe(1);
    });
  });

  // =====================================================
  // 3.4 PARSE CSV
  // =====================================================

  describe('parseCSVLine', () => {

    it('TU-H23: Parse de linha CSV válida', () => {
      const line = 'Hortelã,Mentha piperita,15,28,40,70,3000,8000';
      const result = herbsService.parseCSVLine(line);

      expect(result).not.toBeNull();
      expect(result.nome).toBe('Hortelã');
      expect(result.especie).toBe('Mentha piperita');
      expect(result.tempMin).toBe('15');
    });

    it('TU-H24: Parse de linha CSV com poucos campos', () => {
      const line = 'Hortelã,Mentha';
      const result = herbsService.parseCSVLine(line);

      expect(result).toBeNull();
    });

    it('TU-H25: Parse de linha CSV com espaços extras', () => {
      const line = '  Hortelã  ,  Mentha piperita  ,  15  ,  28  ,  40  ,  70  ,  3000  ,  8000  ';
      const result = herbsService.parseCSVLine(line);

      expect(result.nome).toBe('Hortelã');
      expect(result.especie).toBe('Mentha piperita');
    });
  });

});
