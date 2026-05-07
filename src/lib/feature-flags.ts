import { ClientSegment } from './constants';

export interface FeatureFlags {
  'offers-simulation-enabled': boolean;
  'offers-contract-enabled': boolean;
}

export const getFeatureFlagsForSegment = (segment: ClientSegment): FeatureFlags => {
  switch (segment) {
    case 'CORPORATE':
      return {
        'offers-simulation-enabled': true,
        'offers-contract-enabled': true,
      };
    case 'PRIVATE':
      return {
        'offers-simulation-enabled': true,
        'offers-contract-enabled': false, // Private only simulates, contract is via manager
      };
    case 'VAREJO':
    default:
      return {
        'offers-simulation-enabled': true,
        'offers-contract-enabled': true,
      };
  }
}
