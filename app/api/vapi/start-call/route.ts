// File: app/api/vapi/start-call/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variables } = body;
    
    // Get workflow ID from server environment variable
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    
    if (!workflowId) {
      return NextResponse.json(
        { message: 'Missing workflow ID in server configuration' },
        { status: 500 }
      );
    }

    // Make the request to Vapi API
    const vapiResponse = await fetch('https://api.vapi.ai/call/web', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        variable_values: variables,
      }),
    });

    if (!vapiResponse.ok) {
      const errorText = await vapiResponse.text();
      console.error('Vapi API error:', errorText);
      
      return NextResponse.json(
        { message: `Vapi API error: ${vapiResponse.status}` },
        { status: vapiResponse.status }
      );
    }

    const data = await vapiResponse.json();
    
    return NextResponse.json({
      sessionId: data.session_id,
      token: data.token,
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}