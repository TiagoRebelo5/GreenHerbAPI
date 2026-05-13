/**
 * Serviço de Plans (Planos de Cultivo)
 * Valida criação e manipulação de planos
 */

const PLAN_TYPES = {
  REGULAR: 'regular',
  EMERGENCIA: 'emergência',
  PONTUAL: 'pontual'
};

const VALID_PLAN_TYPES = Object.values(PLAN_TYPES);

/**
 * Valida dados de um plano
 * @param {Object} plan - Objeto com dados do plano
 * @returns {Object} { valid: boolean, errors: [] }
 */
exports.validatePlanData = (plan) => {
  const errors = [];

  if (!plan) {
    return { valid: false, errors: ['Plan object is required'] };
  }

  // Validação de tipo de plano (Particionamento de Equivalência)
  if (!plan.tipo || !VALID_PLAN_TYPES.includes(plan.tipo.toLowerCase())) {
    errors.push(`Tipo de plano inválido. Deve ser um de: ${VALID_PLAN_TYPES.join(', ')}`);
  }

  // Validação de nome
  if (!plan.nome || typeof plan.nome !== 'string' || plan.nome.trim().length === 0) {
    errors.push('Nome do plano é obrigatório');
  }

  // Validação de duração (Análise de Valores Limite: [1, 365])
  if (plan.duracao === undefined) {
    errors.push('Duração é obrigatória');
  } else {
    const duracao = parseInt(plan.duracao);
    if (isNaN(duracao)) {
      errors.push('Duração deve ser um número inteiro');
    } else if (duracao < 1 || duracao > 365) {
      errors.push('Duração deve estar entre 1 e 365 dias');
    }
  }

  // Validação de intervalos de temperatura (Análise de Valores Limite: [18, 28])
  if (plan.tempMin === undefined || plan.tempMax === undefined) {
    errors.push('Temperatura mínima e máxima são obrigatórias');
  } else {
    const tempMin = parseFloat(plan.tempMin);
    const tempMax = parseFloat(plan.tempMax);

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

  // Validação de umidade (Análise de Valores Limite: [40, 80])
  if (plan.umidadeMin === undefined || plan.umidadeMax === undefined) {
    errors.push('Umidade mínima e máxima são obrigatórias');
  } else {
    const umidadeMin = parseFloat(plan.umidadeMin);
    const umidadeMax = parseFloat(plan.umidadeMax);

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

  // Validação de luminosidade (Análise de Valores Limite: [5000, 25000])
  if (plan.luminosidadeMin === undefined || plan.luminosidadeMax === undefined) {
    errors.push('Luminosidade mínima e máxima são obrigatórias');
  } else {
    const lumMin = parseFloat(plan.luminosidadeMin);
    const lumMax = parseFloat(plan.luminosidadeMax);

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

  // Validação especial para plano pontual: exige autorização do Responsável
  // Cobertura MC/DC: condição composta (tipo === 'pontual' && !autorizacao)
  if (plan.tipo && plan.tipo.toLowerCase() === PLAN_TYPES.PONTUAL) {
    if (!plan.autorizacaoResponsavel) {
      errors.push('Plano pontual requer autorização do Responsável Técnico');
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
};

/**
 * Classifica alertas com base em medições e limites do plano
 * Cobertura MC/DC: Condição composta com múltiplas cláusulas
 * (temperatura > limMaxT || humidade < limMinH) && sensorOK
 * 
 * @param {Object} medicao - { temperatura, humidade, luminosidade }
 * @param {Object} limites - { tempMax, tempMin, umidadeMax, umidadeMin, ... }
 * @param {boolean} sensorOK - Indicador de sensor funcional
 * @returns {string} Classificação: 'Informativo', 'Aviso', 'Crítico'
 */
exports.classifyAlert = (medicao, limites, sensorOK = true) => {
  // Se sensor não está OK, não classificamos
  if (!sensorOK) {
    return null;
  }

  let violations = 0;

  // Verifica se temperatura está fora dos limites
  if (medicao.temperatura !== undefined && limites.tempMin !== undefined && limites.tempMax !== undefined) {
    const temp = parseFloat(medicao.temperatura);
    const tempMin = parseFloat(limites.tempMin);
    const tempMax = parseFloat(limites.tempMax);

    if (temp < tempMin || temp > tempMax) {
      violations++;
    }
  }

  // Verifica se umidade está fora dos limites
  if (medicao.humidade !== undefined && limites.umidadeMin !== undefined && limites.umidadeMax !== undefined) {
    const hum = parseFloat(medicao.humidade);
    const humMin = parseFloat(limites.umidadeMin);
    const humMax = parseFloat(limites.umidadeMax);

    if (hum < humMin || hum > humMax) {
      violations++;
    }
  }

  // Verifica se luminosidade está fora dos limites
  if (medicao.luminosidade !== undefined && limites.luminosidadeMin !== undefined && limites.luminosidadeMax !== undefined) {
    const lum = parseFloat(medicao.luminosidade);
    const lumMin = parseFloat(limites.luminosidadeMin);
    const lumMax = parseFloat(limites.luminosidadeMax);

    if (lum < lumMin || lum > lumMax) {
      violations++;
    }
  }

  // Classificação baseada em número de violações
  if (violations === 0) {
    return 'Informativo';
  } else if (violations === 1) {
    return 'Aviso';
  } else {
    return 'Crítico';
  }
};

/**
 * Calcula produtividade de um lote
 * @param {Object} lote - { quantidade, perdas, divisoes, dataInicio, dataFim }
 * @returns {Object} { produtividade, detalhes }
 */
exports.calculateProductivity = (lote) => {
  if (!lote || lote.dataFim === undefined) {
    throw new Error('Lote e data de fim são obrigatórios');
  }

  const quantidade = parseFloat(lote.quantidade) || 0;
  const perdas = parseFloat(lote.perdas) || 0;
  const divisoes = parseFloat(lote.divisoes) || 0;

  const produzido = quantidade - perdas - divisoes;
  const taxa = quantidade > 0 ? (produzido / quantidade) * 100 : 0;

  return {
    produtividade: parseFloat(taxa.toFixed(2)),
    produzido: produzido,
    perdas: perdas,
    divisoes: divisoes,
    total: quantidade
  };
};

/**
 * Valida transição de estado de lote
 * Cobertura MC/DC: estado atual && existência de perdas && datas reais
 * @param {Object} lote - { estado, dataInicio, dataFim, perdas }
 * @param {string} novoEstado - Estado para transição
 * @returns {Object} { permitido: boolean, erro?: string }
 */
exports.validateStateTransition = (lote, novoEstado) => {
  const estadosValidos = ['ativo', 'concluído', 'comprometido'];

  if (!estadosValidos.includes(novoEstado)) {
    return { permitido: false, erro: 'Estado inválido' };
  }

  // Transição: ativo → concluído (requer dataFim e sem perdas não registadas)
  if (lote.estado === 'ativo' && novoEstado === 'concluído') {
    if (!lote.dataFim) {
      return { permitido: false, erro: 'Data de fim é obrigatória para conclusão' };
    }
    return { permitido: true };
  }

  // Transição: ativo → comprometido (pode ter perdas)
  if (lote.estado === 'ativo' && novoEstado === 'comprometido') {
    if (lote.perdas === undefined || lote.perdas === null) {
      return { permitido: false, erro: 'Deve registar perdas para comprometer o lote' };
    }
    return { permitido: true };
  }

  // Transições inválidas
  if (lote.estado === 'concluído' || lote.estado === 'comprometido') {
    return { permitido: false, erro: 'Lote em estado final não pode transitar' };
  }

  return { permitido: false, erro: 'Transição não permitida' };
};

exports.PLAN_TYPES = PLAN_TYPES;
exports.VALID_PLAN_TYPES = VALID_PLAN_TYPES;
