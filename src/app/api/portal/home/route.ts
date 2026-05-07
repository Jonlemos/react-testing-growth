import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getFeatureFlagsForSegment } from "@/lib/feature-flags";

export const GET = async () => {
  const headersList = await headers();
  const segment = (headersList.get('x-user-segment') as any) || 'VAREJO';
  
  const flags = getFeatureFlagsForSegment(segment);

  return NextResponse.json({
    flags
  });
}