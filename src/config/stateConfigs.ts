import { StateConfig } from '../types/state';

export const stateConfigs: Record<string, StateConfig> = {
  KA: {
    stateCode: 'KA',
    stateName: 'Karnataka',
    emblemUrl: '/src/assets/icons/karnataka_emblem.svg', // You'll need to add this asset
    emblemAlt: 'Karnataka State Emblem',
    nodalOfficer: 'Dr. Khanna, IAS (AMD-NHM)',
    helplineNumber: '+91-9999999999',
    email: 'HealthOfficials@karnataka.gov.in'
  },
  MH: {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    emblemUrl: '/src/assets/icons/maharashtra_emblem.svg', // You'll need to add this asset
    emblemAlt: 'Maharashtra State Emblem',
    nodalOfficer: 'Dr. Sharma, IAS (AMD-NHM)',
    helplineNumber: '+91-8888888888',
    email: 'HealthOfficials@maharashtra.gov.in'
  },
  RJ: {
    stateCode: 'RJ',
    stateName: 'Rajasthan',
    emblemUrl: '/src/assets/icons/rajasthan_emblem.svg', // You'll need to add this asset
    emblemAlt: 'Rajasthan State Emblem',
    nodalOfficer: 'Dr. Rajesh, IAS (AMD-NHM)',
    helplineNumber: '+91-7777777777',
    email: 'HealthOfficials@rajasthan.gov.in'
  },
  // Add more states as needed
};

export const getStateConfig = (stateCode: string): StateConfig => {
  return stateConfigs[stateCode.toUpperCase()] || stateConfigs.KA; // Default to Karnataka
};