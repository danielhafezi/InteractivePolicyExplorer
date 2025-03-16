import { NextRequest, NextResponse } from 'next/server';
import { initGemini, simulatePolicy, type Policy, type SocioEconomicGroup } from '@/app/lib/gemini';

// Handler for POST requests to /api/gemini
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();
    const { policy, group, apiKey } = body;

    // Validate required fields
    if (!policy || !group || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: policy, group, and apiKey' },
        { status: 400 }
      );
    }

    // Initialize Gemini with the provided API key
    initGemini(apiKey);

    // Simulate policy impact
    const result = await simulatePolicy(
      policy as Policy,
      group as SocioEconomicGroup
    );

    // Return the simulation result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    
    // Return appropriate error response
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 