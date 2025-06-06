export interface StateConfig {
  stateCode: string;
  stateName: string;
  emblemUrl: string;
  emblemAlt: string;
  nodalOfficer?: string;
  helplineNumber?: string;
  email?: string;
}

export interface HeaderProps {
  stateConfig?: StateConfig;
}

export interface FooterProps {
  stateConfig?: StateConfig;
}