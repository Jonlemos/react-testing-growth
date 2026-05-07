import { NextResponse } from 'next/server';
import { getFeatureFlagsForSegment } from '@/lib/feature-flags';
import { headers } from 'next/headers';

// NOTE: In production, IDEMPOTENCY_CACHE would be replaced by Redis (ex: via Upstash)
// to ensure persistence between deployments and multiple instances.
const IDEMPOTENCY_CACHE = new Set<string>();

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  const headersList = await headers();
  const segment = (headersList.get('x-user-segment') as any) || 'VAREJO';
  const idempotencyKey = headersList.get('idempotency-key');

  const flags = getFeatureFlagsForSegment(segment);

  if (!flags['offers-contract-enabled']) {
    return NextResponse.json({ error: 'Contratação desabilitada para seu perfil' }, { status: 403 });
  }

  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Idempotency-Key header is required' }, { status: 400 });
  }

  if (IDEMPOTENCY_CACHE.has(idempotencyKey)) {
    return NextResponse.json({ 
      error: 'Requisição duplicada', 
      message: 'Esta contratação já foi processada ou está em andamento.' 
    }, { status: 409 });
  }

  const body = await request.json();
  const { simulationId, acceptTerms } = body;

  if (!acceptTerms) {
    return NextResponse.json({ error: 'Você precisa aceitar os termos' }, { status: 400 });
  }

  // Simula o processamento
  IDEMPOTENCY_CACHE.add(idempotencyKey);

  return NextResponse.json({
    contractId: `ctr-${Math.random().toString(36).substr(2, 9)}`,
    status: "PENDING",
    flags: {
      canSimulateAgain: false
    }
  });
}
