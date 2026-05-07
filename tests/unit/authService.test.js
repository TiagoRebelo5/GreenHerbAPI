/**
 * Testes de Unidade — função login (authService)
 * Técnica: Particionamento de Equivalência (PE)
 *
 * Partições definidas
 * ───────────────────────────────────────────────────────────
 * username
 *   P-U1 (inválida) — ausente: null ou string vazia
 *   P-U2 (inválida) — string não vazia mas utilizador inexistente
 *   P-U3  (válida)  — utilizador existente na BD
 *
 * password
 *   P-P1 (inválida) — ausente: null ou string vazia
 *   P-P2 (inválida) — string fornecida mas incorrecta
 *   P-P3  (válida)  — password correcta para o utilizador
 * ───────────────────────────────────────────────────────────
 */

process.env.JWT_SECRET         = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

const bcrypt      = require('bcryptjs');
const authService = require('../../src/services/authService');

describe('login — Particionamento de Equivalência de username e password', () => {
  let hashedPassword;

  beforeAll(async () => {
    hashedPassword = await bcrypt.hash('senha123', 10);
  });

  // ------------------------------------------------------------------
  // TU-01  P-U1 (null)  ×  P-P3  → campo obrigatório
  // ------------------------------------------------------------------
  it('TU-01 — username null (P-U1): lança erro de campo obrigatório', async () => {
    await expect(authService.login(null, 'senha123', jest.fn()))
      .rejects.toThrow('Username and password are required');
  });

  // ------------------------------------------------------------------
  // TU-02  P-U1 (vazio) ×  P-P3  → campo obrigatório
  // ------------------------------------------------------------------
  it('TU-02 — username vazio (P-U1): lança erro de campo obrigatório', async () => {
    await expect(authService.login('', 'senha123', jest.fn()))
      .rejects.toThrow('Username and password are required');
  });

  // ------------------------------------------------------------------
  // TU-03  P-U2  ×  P-P3  → credenciais inválidas
  // ------------------------------------------------------------------
  it('TU-03 — username inexistente (P-U2): lança erro de credenciais inválidas', async () => {
    const findUser = jest.fn().mockResolvedValue(null);
    await expect(authService.login('desconhecido', 'senha123', findUser))
      .rejects.toThrow('Invalid credentials');
    expect(findUser).toHaveBeenCalledWith('desconhecido');
  });

  // ------------------------------------------------------------------
  // TU-04  P-U3  ×  P-P1 (null)  → campo obrigatório
  // ------------------------------------------------------------------
  it('TU-04 — password null (P-P1): lança erro de campo obrigatório', async () => {
    await expect(authService.login('alice', null, jest.fn()))
      .rejects.toThrow('Username and password are required');
  });

  // ------------------------------------------------------------------
  // TU-05  P-U3  ×  P-P1 (vazia) → campo obrigatório
  // ------------------------------------------------------------------
  it('TU-05 — password vazia (P-P1): lança erro de campo obrigatório', async () => {
    await expect(authService.login('alice', '', jest.fn()))
      .rejects.toThrow('Username and password are required');
  });

  // ------------------------------------------------------------------
  // TU-06  P-U3  ×  P-P2  → credenciais inválidas
  // ------------------------------------------------------------------
  it('TU-06 — password incorrecta (P-P2): lança erro de credenciais inválidas', async () => {
    const findUser = jest.fn().mockResolvedValue({
      _id: '1', perfil: 'Técnico', password: hashedPassword,
    });
    await expect(authService.login('alice', 'errada', findUser))
      .rejects.toThrow('Invalid credentials');
  });

  // ------------------------------------------------------------------
  // TU-07  P-U3  ×  P-P3  → sucesso
  // ------------------------------------------------------------------
  it('TU-07 — credenciais válidas (P-U3 × P-P3): retorna accessToken, refreshToken e perfil', async () => {
    const findUser = jest.fn().mockResolvedValue({
      _id: '1', perfil: 'Técnico', password: hashedPassword,
    });
    const result = await authService.login('alice', 'senha123', findUser);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.perfil).toBe('Técnico');
    expect(findUser).toHaveBeenCalledWith('alice');
  });
});
