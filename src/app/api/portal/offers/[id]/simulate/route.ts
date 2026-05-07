import { NextResponse } from 'next/server';
import { SIMULATION_STORAGE } from '@/lib/constants';
import { getFeatureFlagsForSegment } from '@/lib/feature-flags';
import { headers } from 'next/headers';

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  const { id: offerId } = await params;
  const headersList = await headers();
  const segment = (headersList.get('x-user-segment') as any) || 'VAREJO';
  const userId = headersList.get('x-user-id');
  
  const flags = getFeatureFlagsForSegment(segment);

  if (!flags['offers-simulation-enabled']) {
    return NextResponse.json({ error: 'Simulação desabilitada para seu perfil' }, { status: 403 });
  }

  const body = await request.json();
  const { amount, termMonths } = body;

  // Resume logic (In-memory persistence)
  const simulationKey = `${userId}-${offerId}`;
  const existingSimulation = SIMULATION_STORAGE.get(simulationKey);

  const simulationId = existingSimulation?.simulationId || `sim-${Math.random().toString(36).substr(2, 9)}`;
  
  const monthlyPayment = (amount * 1.05) / termMonths; // Fictitious calculation
  const totalAmount = monthlyPayment * termMonths;

  const result = {
    simulationId,
    steps: ["data", "review", "confirmation"],
    currentStep: "review",
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    flags: {
      canContract: flags['offers-contract-enabled']
    }
  };

  // Save to simulate resume
  SIMULATION_STORAGE.set(simulationKey, result);

  return NextResponse.json(result);
}
