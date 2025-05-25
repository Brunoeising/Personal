import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Get the signature from the headers
  const signature = req.headers.get('stripe-signature') as string;

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  // Get the raw body
  const body = await req.text();
  
  try {
    // Verify the webhook payload and signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSession = event.data.object;
        
        // Get customer data
        const customerId = checkoutSession.customer as string;
        const subscriptionId = checkoutSession.subscription as string;
        const trainerId = checkoutSession.client_reference_id;
        const tier = checkoutSession.metadata?.tier || 'pro';
        
        if (!trainerId) {
          throw new Error('Missing trainer ID in checkout session');
        }
        
        // Update subscription in database
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            trainer_id: trainerId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            tier: tier,
            status: 'active',
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          throw error;
        }
        
        // Also update the trainer's subscription tier
        await supabase
          .from('trainers')
          .update({
            subscription_tier: tier,
            subscription_status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', trainerId);
          
        break;
      case 'invoice.payment_succeeded':
        // Handle successful recurring payment
        const invoice = event.data.object;
        const subscriptionIdFromInvoice = invoice.subscription as string;
        
        // Update subscription status
        if (subscriptionIdFromInvoice) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_end: new Date(invoice.lines.data[0].period.end * 1000).toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscriptionIdFromInvoice);
        }
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const subscription = event.data.object;
        
        // Find the subscription in the database
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('trainer_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();
          
        if (subscriptionData) {
          // Update subscription status
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);
            
          // Update the trainer's subscription status
          await supabase
            .from('trainers')
            .update({
              subscription_tier: 'free',
              subscription_status: 'inactive',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscriptionData.trainer_id);
        }
        break;
      // Add other event types as needed
    }
    
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}