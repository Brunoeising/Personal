"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DumbbellIcon as DumbellIcon, CheckCircle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OnboardingLayout from "@/components/layouts/onboarding-layout";

// Plans information
const plans = {
  free: {
    name: "Free",
    price: "R$0/mês",
    features: [
      "1 aluno",
      "50 exercícios na biblioteca básica",
      "10 templates de treino",
      "100MB de armazenamento",
      "Insights básicos de IA",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: "R$49,90/mês",
    features: [
      "100 alunos",
      "Biblioteca completa + criação ilimitada",
      "Templates de treino ilimitados",
      "5GB de armazenamento",
      "Insights avançados + análise preditiva",
      "Email + Chat support",
      "Chat ilimitado com alunos",
      "Notificações push",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: "R$149,90/mês",
    features: [
      "1000 alunos",
      "5 personal trainers",
      "Biblioteca completa + colaborativa",
      "50GB de armazenamento",
      "IA completa + análise biomecânica",
      "Suporte prioritário + WhatsApp",
      "White label (logo próprio)",
      "Backup automático",
    ],
  },
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const initialPlan = searchParams.get("plan") || "free";
  
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);

      // Show success toast
      toast({
        title: "Subscription activated",
        description: selectedPlan === "free" 
          ? "You're on the Free plan. You can upgrade anytime." 
          : `Your ${selectedPlan.toUpperCase()} plan is now active`,
      });

      // Redirect to next step
      router.push("/onboarding/first-student");
    }, 1500);
  };

  const handleSkip = () => {
    setSelectedPlan("free");
    
    toast({
      title: "Free plan activated",
      description: "You can upgrade anytime from your account settings",
    });

    router.push("/onboarding/first-student");
  };

  return (
    <OnboardingLayout currentStep={3} totalSteps={5}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Select a subscription plan that fits your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Free Plan */}
          <Card className={`border-2 ${selectedPlan === "free" ? "border-primary" : "border-border"} cursor-pointer transition-all hover:shadow-md`}
            onClick={() => setSelectedPlan("free")}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Free
                {selectedPlan === "free" && (
                  <CheckCircle size={20} className="text-primary" />
                )}
              </CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">R$0</span>/mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plans.free.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`border-2 ${selectedPlan === "pro" ? "border-primary" : "border-border"} cursor-pointer transition-all hover:shadow-md relative`}
            onClick={() => setSelectedPlan("pro")}>
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Pro
                {selectedPlan === "pro" && (
                  <CheckCircle size={20} className="text-primary" />
                )}
              </CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">R$49,90</span>/mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plans.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className={`border-2 ${selectedPlan === "enterprise" ? "border-primary" : "border-border"} cursor-pointer transition-all hover:shadow-md`}
            onClick={() => setSelectedPlan("enterprise")}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Enterprise
                {selectedPlan === "enterprise" && (
                  <CheckCircle size={20} className="text-primary" />
                )}
              </CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold">R$149,90</span>/mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plans.enterprise.features.slice(0, 7).map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {selectedPlan !== "free" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Payment Method</CardTitle>
              <CardDescription>
                Choose how you want to pay for your subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit" onValueChange={setPaymentMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="credit">Credit Card</TabsTrigger>
                  <TabsTrigger value="pix">PIX</TabsTrigger>
                </TabsList>
                <TabsContent value="credit" className="pt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expMonth">Exp. Month</Label>
                        <Input id="expMonth" placeholder="MM" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expYear">Exp. Year</Label>
                        <Input id="expYear" placeholder="YYYY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="pix" className="pt-4">
                  <div className="text-center p-4">
                    <div className="bg-muted inline-flex p-4 rounded-lg mb-4">
                      <CreditCard size={48} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Pay with PIX</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Scan the QR code or copy the PIX code to complete your payment
                    </p>
                    <div className="bg-muted mx-auto w-48 h-48 flex items-center justify-center rounded-lg mb-4">
                      <span className="text-muted-foreground text-sm">QR Code</span>
                    </div>
                    <Button variant="outline" className="w-full mb-2">
                      Copy PIX Code
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Your subscription will be activated once payment is confirmed
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-4 gap-4">
          {selectedPlan !== "free" ? (
            <Button variant="outline\" onClick={handleSkip}>
              Skip for now (Use Free Plan)
            </Button>
          ) : (
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          )}
          <Button onClick={handleContinue} disabled={isLoading}>
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
}