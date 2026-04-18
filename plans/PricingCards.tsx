import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

const plans = [
  {
    name: 'Basic',
    price: '$9.99',
    period: 'One-time purchase',
    description: 'YAAA',
    features: [
      'Access to upcoming songs',
      'Supporter access (have a badge om your profile!)',
      
    ],
    buttonText: 'Get Started',
    popular: false,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20'
  },
  {
    name: 'SUPPORTER!!',
    price: '$19.99',
    period: 'One-time purchase',
    description: 'BECOME THE ULTIMATE SUPPORTER!',
    features: [
      'Everything in previous plan!',
      'Random beats every month',
      'Access to help code on GitHub',
      'Early access to new beats'
      'We will add even more soon!'
    ],
    buttonText: 'Go Pro',
    popular: true,
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/50'
  },
  {
    

interface ApiResponse {
  success: boolean;
  message?: string;
}

export default function PricingCards() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const captchaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSubmit = async (planName: string, planPrice: string) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Get hCaptcha response token
      const captchaElement = captchaRefs.current[planName];
      if (!captchaElement) {
        throw new Error('Captcha failed. Please try again.');
      }

      const token = window.hcaptcha.getResponse(captchaElement.id);
      
      if (!token) {
        setMessage({ type: 'error', text: 'Please complete the captcha verification' });
        setIsSubmitting(false);
        return;
      }

      // Submit to backend
      const response = await fetch(`${baseUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: planName,
          price: planPrice,
          captchaToken: token,
        }),
      });

      const data = await response.json() as ApiResponse;

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: `Successfully subscribed to ${planName} plan!` });
        // Reset captcha
        window.hcaptcha.reset(captchaElement.id);
        setSelectedPlan(null);
      } else {
        setMessage({ type: 'error', text: data.message || 'Subscription failed. Please try again.' });
        // Reset captcha on error
        window.hcaptcha.reset(captchaElement.id);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again. If this does not work, contact us at help@xrenbeats.com. If you have already paid for a plan, and you dont have it yet, we will be sure to add the plan to your account.' });
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanClick = (planName: string) => {
    setSelectedPlan(selectedPlan === planName ? null : planName);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            XrenBeats Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan to elevate your music production
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-700 dark:text-green-400' : 'bg-red-500/10 border border-red-500/50 text-red-700 dark:text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative flex flex-col bg-gradient-to-br ${plan.gradient} backdrop-blur-sm border-2 ${plan.borderColor} transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-xl scale-105 md:scale-110' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-6">
                <CardTitle className="text-3xl font-heading mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold font-heading">{plan.price}</span>
                  <span className="text-muted-foreground text-lg">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-6 flex flex-col gap-4">
                <Button
                  onClick={() => handlePlanClick(plan.name)}
                  className={`w-full text-lg py-6 font-button ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                      : ''
                  }`}
                  size="lg"
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={isSubmitting}
                >
                  {plan.buttonText}
                </Button>

                {/* hCaptcha Widget */}
                {selectedPlan === plan.name && (
                  <div className="w-full">
                    <div
                      ref={(el) => {
                        captchaRefs.current[plan.name] = el;
                      }}
                      id={`hcaptcha-${plan.name}`}
                      className="h-captcha mx-auto"
                      data-sitekey="78a61300-27a0-4e92-8a8e-97ecc0567854"
                      data-callback={() => handleSubmit(plan.name, plan.price)}
                    ></div>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left mt-8">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, all plans are just one-time purchases but you don't have to get these, we are commited to making free and open-source resources for everybody! :D
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and various payment methods.
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-muted-foreground">
                Absolutely! You can change your plan at any time. Upgrades take effect immediately while downgrades do not. If you would like to downgrade, you can email us! downgrading@xrenbeats.com! :)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
