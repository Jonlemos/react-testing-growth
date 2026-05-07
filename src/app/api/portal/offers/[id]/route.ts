import { NextResponse } from 'next/server';
import { MOCK_OFFERS } from '@/lib/constants';
import { getFeatureFlagsForSegment } from '@/lib/feature-flags';
import { headers } from 'next/headers';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  const { id } = await params;
  const headersList = await headers();
  const segment = (headersList.get('x-user-segment') as any) || 'VAREJO';
  const offer = MOCK_OFFERS.find(o => o.id === id);

  if (!offer) {
    return NextResponse.json({ error: 'Oferta não encontrada' }, { status: 404 });
  }

  const flags = getFeatureFlagsForSegment(segment);

  return NextResponse.json({
    ...offer,
    flags: {
      canSimulate: flags['offers-simulation-enabled'],
      canContract: flags['offers-contract-enabled']
    }
  });
}
