import { StateConfig } from '../types/state';

export interface StateApiResponse {
  success: boolean;
  data: StateConfig;
  message?: string;
}

export const stateApi = {
  // Get state config by user location or state code
  getStateConfig: async (stateCode?: string): Promise<StateConfig> => {
    try {
      const endpoint = stateCode 
        ? `/api/states/${stateCode}`
        : '/api/states/current'; // Backend determines from user session/IP
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // If auth required
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch state config: ${response.statusText}`);
      }

      const result: StateApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to get state configuration');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching state config:', error);
      // Fallback to Karnataka config
      const { getStateConfig } = await import('../config/stateConfigs');
      return getStateConfig('KA');
    }
  },

  // Get all available states
  getAllStates: async (): Promise<StateConfig[]> => {
    try {
      const response = await fetch('/api/states', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch states: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching all states:', error);
      return [];
    }
  }
};