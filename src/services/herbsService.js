/**
 * Serviço de Herbs (Ervas Aromáticas)
 * Valida importação e manipulação de ervas
 */

/**
 * Valida dados de uma erva individual
 * @param {Object} herb - Objeto com dados da erva (nome, especie, tempMin, tempMax, etc)
 * @returns {Object} { valid: boolean, errors: [] }
 */
exports.validateHerbData = (herb) => {
  const errors = [];

  if (!herb) {
    return { valid: false, errors: ['Herb object is required'] };
  }

  // Validação de campos obrigatórios
  if (!herb.nome || typeof herb.nome !== 'string' || herb.nome.trim().length === 0) {
    errors.push('Nome é obrigatório e deve ser uma string não vazia');
  }

  if (!herb.especie || typeof herb.especie !== 'string' || herb.especie.trim().length === 0) {
    errors.push('Espécie é obrigatória e deve ser uma string não vazia');
  }

  // Validação de intervalos de temperatura
  if (herb.tempMin === undefined || herb.tempMax === undefined) {
    errors.push('Temperatura mínima e máxima são obrigatórias');
  } else {
    const tempMin = parseFloat(herb.tempMin);
    const tempMax = parseFloat(herb.tempMax);

    if (isNaN(tempMin) || isNaN(tempMax)) {
      errors.push('Temperatura deve ser um número');
    } else if (tempMin < -50 || tempMin > 50) {
      errors.push('Temperatura mínima deve estar entre -50 e 50°C');
    } else if (tempMax < -50 || tempMax > 50) {
      errors.push('Temperatura máxima deve estar entre -50 e 50°C');
    } else if (tempMin >= tempMax) {
      errors.push('Temperatura mínima deve ser menor que a máxima');
    }
  }

  // Validação de umidade relativa
  if (herb.umidadeMin === undefined || herb.umidadeMax === undefined) {
    errors.push('Umidade mínima e máxima são obrigatórias');
  } else {
    const umidadeMin = parseFloat(herb.umidadeMin);
    const umidadeMax = parseFloat(herb.umidadeMax);

    if (isNaN(umidadeMin) || isNaN(umidadeMax)) {
      errors.push('Umidade deve ser um número');
    } else if (umidadeMin < 0 || umidadeMin > 100) {
      errors.push('Umidade mínima deve estar entre 0 e 100%');
    } else if (umidadeMax < 0 || umidadeMax > 100) {
      errors.push('Umidade máxima deve estar entre 0 e 100%');
    } else if (umidadeMin >= umidadeMax) {
      errors.push('Umidade mínima deve ser menor que a máxima');
    }
  }

  // Validação de luminosidade
  if (herb.luminosidadeMin === undefined || herb.luminosidadeMax === undefined) {
    errors.push('Luminosidade mínima e máxima são obrigatórias');
  } else {
    const lumMin = parseFloat(herb.luminosidadeMin);
    const lumMax = parseFloat(herb.luminosidadeMax);

    if (isNaN(lumMin) || isNaN(lumMax)) {
      errors.push('Luminosidade deve ser um número');
    } else if (lumMin < 0 || lumMin > 100000) {
      errors.push('Luminosidade mínima deve estar entre 0 e 100000 lux');
    } else if (lumMax < 0 || lumMax > 100000) {
      errors.push('Luminosidade máxima deve estar entre 0 e 100000 lux');
    } else if (lumMin >= lumMax) {
      errors.push('Luminosidade mínima deve ser menor que a máxima');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
};

/**
 * Processa linha CSV e retorna objeto herb
 * @param {string} line - Linha do CSV
 * @returns {Object} Objeto herb parseado
 */
exports.parseCSVLine = (line) => {
  const parts = line.split(',').map(p => p.trim());
  
  if (parts.length < 7) {
    return null;
  }

  return {
    nome: parts[0],
    especie: parts[1],
    tempMin: parts[2],
    tempMax: parts[3],
    umidadeMin: parts[4],
    umidadeMax: parts[5],
    luminosidadeMin: parts[6],
    luminosidadeMax: parts[7] || parts[6]
  };
};

/**
 * Importa ervas a partir de conteúdo CSV
 * @param {string} csvContent - Conteúdo do arquivo CSV
 * @returns {Object} { total, valid, invalid, errors, data: [] }
 */
exports.importFromCSV = (csvContent) => {
  if (!csvContent || typeof csvContent !== 'string') {
    return {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: ['CSV content must be a non-empty string'],
      data: []
    };
  }

  const lines = csvContent.split('\n').filter(line => line.trim().length > 0);

  if (lines.length === 0) {
    return {
      total: 0,
      valid: 0,
      invalid: 0,
      errors: ['CSV file is empty'],
      data: []
    };
  }

  // Remove header se existir (primeira linha)
  const dataLines = lines[0].toLowerCase().includes('nome') ? lines.slice(1) : lines;

  const result = {
    total: dataLines.length,
    valid: 0,
    invalid: 0,
    errors: [],
    data: []
  };

  dataLines.forEach((line, index) => {
    const herb = exports.parseCSVLine(line);

    if (!herb) {
      result.invalid++;
      result.errors.push(`Linha ${index + 2}: Formato inválido (esperado 7+ colunas)`);
      return;
    }

    const validation = exports.validateHerbData(herb);

    if (validation.valid) {
      result.valid++;
      result.data.push({
        id: `herb_${Date.now()}_${index}`,
        ...herb,
        criacao: new Date().toISOString()
      });
    } else {
      result.invalid++;
      result.errors.push(`Linha ${index + 2} (${herb.nome}): ${validation.errors.join('; ')}`);
    }
  });

  return result;
};
