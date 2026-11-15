import { RateQueryInput, StandardizedRate, StandardizedTrackingResult } from '../shipping.types.js';

export interface IShippingRateProvider {
  readonly providerName: 'RAJAONGKIR_V2' | 'BINDERBYTE';
  calculateRates(input: RateQueryInput, apiKey: string): Promise<StandardizedRate[]>;
}

export interface IWaybillProvider {
  readonly providerName: 'BINDERBYTE';
  trackWaybill(courier: string, waybillNumber: string, apiKey: string): Promise<StandardizedTrackingResult>;
}

