// Analytics utility — centralized funnel event tracking.
// Currently logs to console; ready to plug in GTM, Mixpanel, or Amplitude.

type EventProperties = Record<string, string | number | boolean | undefined>

export function trackEvent(name: string, properties?: EventProperties): void {
  // TODO: replace console.log with real analytics integration (e.g. window.dataLayer.push)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] ${name}`, properties ?? {})
  }
  // Future: window.dataLayer?.push({ event: name, ...properties })
}

// ── Funnel events ──────────────────────────────────────────────────────────

export const Analytics = {
  offerListViewed: (count: number) =>
    trackEvent('offer_list_viewed', { count }),

  offerFiltered: (category: string) =>
    trackEvent('offer_filtered', { category }),

  offerDetailViewed: (offerId: string) =>
    trackEvent('offer_detail_viewed', { offerId }),

  simulationStarted: (offerId: string) =>
    trackEvent('simulation_started', { offerId }),

  simulationStepCompleted: (offerId: string, step: number) =>
    trackEvent('simulation_step_completed', { offerId, step }),

  contractCompleted: (offerId: string, contractId: string) =>
    trackEvent('contract_completed', { offerId, contractId }),

  errorOccurred: (context: string, message: string) =>
    trackEvent('error_occurred', { context, message }),
}
