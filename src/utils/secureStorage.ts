// Secure token storage utility
interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
  issuedAt: number;
}

class SecureStorage {
  private static readonly TOKEN_KEY = 'chipv2_auth_tokens';
  private static readonly ENCRYPTION_KEY = 'chipv2_secure_key';
  // Store tokens securely
  static setTokens(tokens: { token: string; refreshToken: string }): void {
    try {
      const tokenData: TokenData = {
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
        issuedAt: Date.now()
      };

      // In production, encrypt this data
      const encryptedData = this.encrypt(JSON.stringify(tokenData));
      localStorage.setItem(this.TOKEN_KEY, encryptedData);
      
      // Set secure flag
      sessionStorage.setItem('auth_session', 'active');
    } catch (error) {
      console.error('Failed to store tokens securely:', error);
    }
  }

  // Retrieve tokens securely
  static getTokens(): TokenData | null {
    try {
      const encryptedData = localStorage.getItem(this.TOKEN_KEY);
      if (!encryptedData) return null;

      const decryptedData = this.decrypt(encryptedData);
      const tokenData: TokenData = JSON.parse(decryptedData);

      // Check if token is expired
      if (Date.now() > tokenData.expiresAt) {
        this.clearTokens();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      this.clearTokens();
      return null;
    }
  }

  // Clear all tokens
  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem('auth_session');
    
    // Clear any other auth-related data
    localStorage.removeItem('chipv2_registration');
    
    console.log('All authentication data cleared');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const tokens = this.getTokens();
    return tokens !== null && sessionStorage.getItem('auth_session') === 'active';
  }

  // Simple encryption (use proper encryption in production)
  private static encrypt(data: string): string {
    // In development, just base64 encode
    // In production, use crypto-js or Web Crypto API
    return btoa(data);
  }

  // Simple decryption (use proper decryption in production)
  private static decrypt(encryptedData: string): string {
    // In development, just base64 decode
    // In production, use proper decryption
    return atob(encryptedData);
  }

  // Validate token format (basic JWT validation)
  static isValidTokenFormat(token: string): boolean {
    if (!token) return false;
    
    // JWT should have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Try to decode header and payload
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if it has required JWT fields
      return header.alg && payload.exp && payload.iat;
    } catch {
      return false;
    }
  }

  // Get token expiry time
  static getTokenExpiry(token: string): number | null {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return null;
    }
  }
}

export default SecureStorage;