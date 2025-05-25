import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateDocumentPayload {
  action: 'generateSourceDocument';
  userEmail: string;
  ctx: {
    person: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      birthDate?: string;
      pesel?: string;
      street?: string;
      city?: string;
      postalCode?: string;
      country?: string;
      bankAccount?: string;
    };
    contract: {
      templateId: string;
      startDate: string;
      endDate?: string;
      customFields: Record<string, string>;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: GenerateDocumentPayload = await req.json();
    const { action, userEmail, ctx } = payload;

    if (action !== 'generateSourceDocument') {
      throw new Error('Invalid action');
    }

    // Simulate document generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, this would:
    // 1. Fetch the template from storage
    // 2. Replace variables with actual values
    // 3. Generate the document
    // 4. Upload to storage and return URLs

    // For now, return mock data
    const response = {
      sourceDocumentUrl: 'https://example.com/documents/contract.pdf',
      files: [
        {
          name: 'Contract.pdf',
          url: 'https://example.com/documents/contract.pdf'
        }
      ]
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});