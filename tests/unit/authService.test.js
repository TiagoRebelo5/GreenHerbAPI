const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require('../../src/services/authService');

describe('Testes de Unidade authService', () => {

  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = 'secret123';
    process.env.JWT_REFRESH_SECRET = 'refresh_secret123';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // ------------------------------------------------------------------
  // 2.5.1 generateAccessToken
  // ------------------------------------------------------------------
  describe('generateAccessToken', () => {
    it('TU-01: CM T-T (!userId || !perfil) -> lança erro "userId and perfil are required"', () => {
      expect(() => authService.generateAccessToken(null, null)).toThrow('userId and perfil are required');
    });

    it('TU-02: CM T-F (!userId || !perfil) -> lança erro "userId and perfil are required"', () => {
      expect(() => authService.generateAccessToken(null, 'Técnico')).toThrow('userId and perfil are required');
    });

    it('TU-03: CM F-T (!userId || !perfil) -> lança erro "userId and perfil are required"', () => {
      expect(() => authService.generateAccessToken('u1', null)).toThrow('userId and perfil are required');
    });

    it('TU-04: CM F-F + PE válida -> Retorna JWT válido com payload', () => {
      const token = authService.generateAccessToken('u1', 'Técnico');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe('u1');
      expect(decoded.perfil).toBe('Técnico');
    });
  });

  // ------------------------------------------------------------------
  // 2.5.2 generateRefreshToken
  // ------------------------------------------------------------------
  describe('generateRefreshToken', () => {
    it('TU-05: CM T-T (!userId || !perfil) -> lança erro "userId and perfil are required"', () => {
      expect(() => authService.generateRefreshToken(null, null)).toThrow('userId and perfil are required');
    });

    it('TU-06: CM T-F (!userId || !perfil) -> lança erro "userId and perfil are required"', () => {
      expect(() => authService.generateRefreshToken(null, 'Técnico')).toThrow('userId and perfil are required');
    });

    it('TU-07: CM F-T (!userId || !perfil) -> lança erro "userId and perfil are required"', () => {
      expect(() => authService.generateRefreshToken('u1', null)).toThrow('userId and perfil are required');
    });

    it('TU-08: CM F-F + PE válida -> Retorna JWT assinado com JWT_REFRESH_SECRET', () => {
      const token = authService.generateRefreshToken('u1', 'Técnico');
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      expect(decoded.id).toBe('u1');
      expect(decoded.perfil).toBe('Técnico');
    });

    it('TU-09: PE fallback -> Usa JWT_SECRET quando JWT_REFRESH_SECRET ausente', () => {
      delete process.env.JWT_REFRESH_SECRET;
      const token = authService.generateRefreshToken('u1', 'Técnico');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe('u1');
    });
  });

  // ------------------------------------------------------------------
  // 2.5.3 verifyToken
  // ------------------------------------------------------------------
  describe('verifyToken', () => {
    it('TU-10: PE classe inválida (nulo) -> Lança "Token is required"', () => {
      expect(() => authService.verifyToken(null, 'secret123')).toThrow('Token is required');
    });

    it('TU-11: PE classe inválida (adulterado) -> Lança JsonWebTokenError', () => {
      expect(() => authService.verifyToken('token.invalido.aqui', 'secret123')).toThrow(jwt.JsonWebTokenError);
    });

    it('TU-12: PE classe inválida (expirado) -> Lança TokenExpiredError', () => {
      const expiredToken = jwt.sign({ id: 'u1' }, 'secret123', { expiresIn: '-1s' });
      expect(() => authService.verifyToken(expiredToken, 'secret123')).toThrow(jwt.TokenExpiredError);
    });

    it('TU-13: PE classe válida -> Retorna payload com id e perfil', () => {
      const token = jwt.sign({ id: 'u1', perfil: 'Admin' }, 'secret123');
      const decoded = authService.verifyToken(token, 'secret123');
      expect(decoded.id).toBe('u1');
      expect(decoded.perfil).toBe('Admin');
    });

    it('TU-14: PE fallback -> Usa JWT_SECRET do ambiente', () => {
      const token = jwt.sign({ id: 'u1' }, process.env.JWT_SECRET);
      const decoded = authService.verifyToken(token);
      expect(decoded.id).toBe('u1');
    });
  });

  // ------------------------------------------------------------------
  // 2.5.4 renewAccessToken
  // ------------------------------------------------------------------
  describe('renewAccessToken', () => {
    it('TU-15: PE classe válida -> Retorna novo access token com payload do refresh token', () => {
      const refreshToken = jwt.sign({ id: 'u1', perfil: 'Admin' }, process.env.JWT_REFRESH_SECRET);
      const newAccessToken = authService.renewAccessToken(refreshToken);
      const decoded = jwt.verify(newAccessToken, process.env.JWT_SECRET);
      expect(decoded.id).toBe('u1');
      expect(decoded.perfil).toBe('Admin');
    });

    it('TU-16: PE classe inválida -> Propaga erro de verifyToken', () => {
      expect(() => authService.renewAccessToken('token_invalido')).toThrow(jwt.JsonWebTokenError);
    });

    it('TU-17: PE fallback -> Usa JWT_SECRET quando JWT_REFRESH_SECRET ausente', () => {
      delete process.env.JWT_REFRESH_SECRET;
      const refreshToken = jwt.sign({ id: 'u1', perfil: 'Admin' }, process.env.JWT_SECRET);
      const newAccessToken = authService.renewAccessToken(refreshToken);
      const decoded = jwt.verify(newAccessToken, process.env.JWT_SECRET);
      expect(decoded.id).toBe('u1');
    });
  });

  // ------------------------------------------------------------------
  // 2.5.5 login
  // ------------------------------------------------------------------
  describe('login', () => {
    let hashedPassword;

    beforeAll(async () => {
      hashedPassword = await bcrypt.hash('senha123', 10);
    });

    it('TU-18: CM T-T (!username || !password) -> Lança erro "Username and password are required"', async () => {
      await expect(authService.login(null, null, jest.fn())).rejects.toThrow('Username and password are required');
    });

    it('TU-19: CM T-F (!username || !password) -> Lança erro "Username and password are required"', async () => {
      await expect(authService.login(null, 'senha123', jest.fn())).rejects.toThrow('Username and password are required');
    });

    it('TU-20: CM F-T (!username || !password) -> Lança erro "Username and password are required"', async () => {
      await expect(authService.login('alice', null, jest.fn())).rejects.toThrow('Username and password are required');
    });

    it('TU-21: PE utilizador inexistente -> Lança "Invalid credentials"', async () => {
      const findUser = jest.fn().mockResolvedValue(null);
      await expect(authService.login('desconhecido', 'senha123', findUser)).rejects.toThrow('Invalid credentials');
    });

    it('TU-22: PE password incorrecta -> Lança "Invalid credentials"', async () => {
      const findUser = jest.fn().mockResolvedValue({ _id: '1', password: hashedPassword });
      await expect(authService.login('alice', 'errada', findUser)).rejects.toThrow('Invalid credentials');
    });

    it('TU-23: CM F-F + PE válida -> Retorna accessToken, refreshToken e perfil', async () => {
      const findUser = jest.fn().mockResolvedValue({ _id: 'u1', perfil: 'Técnico', password: hashedPassword });
      const result = await authService.login('alice', 'senha123', findUser);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.perfil).toBe('Técnico');
    });

    it('TU-24: PE fallback user.id -> Retorna tokens com payload correto', async () => {
      const findUser = jest.fn().mockResolvedValue({ id: 'u1_sql', perfil: 'Admin', password: hashedPassword });
      const result = await authService.login('alice', 'senha123', findUser);
      const decodedAccess = jwt.verify(result.accessToken, process.env.JWT_SECRET);
      expect(decodedAccess.id).toBe('u1_sql');
    });
  });

  // ------------------------------------------------------------------
  // 2.5.6 hasProfile
  // ------------------------------------------------------------------
  describe('hasProfile', () => {
    it('TU-25: CM !userPerfil (T) -> Retorna false', () => {
      expect(authService.hasProfile(null, ['Admin'])).toBe(false);
    });

    it('TU-26: CM !allowedProfiles (T) -> Retorna false', () => {
      expect(authService.hasProfile('Admin', null)).toBe(false);
    });

    it('TU-27: CM !Array.isArray (T) -> Retorna false', () => {
      expect(authService.hasProfile('Admin', 'Admin')).toBe(false);
    });

    it('TU-28: PE perfil presente -> Retorna true', () => {
      expect(authService.hasProfile('Técnico', ['Admin', 'Técnico'])).toBe(true);
    });

    it('TU-29: PE perfil ausente -> Retorna false', () => {
      expect(authService.hasProfile('Técnico', ['Admin', 'Responsável'])).toBe(false);
    });
  });

});
