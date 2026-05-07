import { NextResponse } from 'next/server';
import { MOCK_OFFERS } from '@/lib/constants';
import { getFeatureFlagsForSegment } from '@/lib/feature-flags';
import { headers } from 'next/headers';

export const GET = async (request: Request): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const headersList = await headers();
  const segment = (headersList.get('x-user-segment') as any) || 'VAREJO';

  let filteredOffers = MOCK_OFFERS;

  if (category) {
    filteredOffers = filteredOffers.filter(o => o.category === category);
  }

  // Adding flags to the header to facilitate frontend consumption
  const flags = getFeatureFlagsForSegment(segment);

  const response = filteredOffers.map(offer => ({
    id: offer.id,
    name: offer.name,
    summary: offer.summary,
    category: offer.category,
    minAmount: offer.minAmount,
    maxAmount: offer.maxAmount,
    eligibility: offer.eligibility,
    flags: {
       canSimulate: flags['offers-simulation-enabled'],
       canContract: flags['offers-contract-enabled']
    }
  }));

  return NextResponse.json({ offers: response });
}
