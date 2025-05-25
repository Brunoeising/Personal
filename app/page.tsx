import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DumbbellIcon as DumbellIcon, ArrowRight, Check, Star, Users, Target, Zap, Shield, Smartphone, Award, Play, Sparkles, TrendingUp, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-xl shadow-sm border-b border-border/50 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <DumbellIcon size={32} className="text-primary relative z-10 transform group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full group-hover:bg-primary/40 transition-colors duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              FitPro
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Funcionalidades
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Preços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group">
              Depoimentos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-all duration-300 relative group">
              Entrar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Button asChild className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group">
              <Link href="/register" className="relative z-10">
                Começar Grátis
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl animate-pulse opacity-50" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-primary/15 to-transparent rounded-full blur-3xl animate-pulse delay-1000 opacity-60" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-primary/10 to-primary/20 rounded-full blur-3xl animate-pulse delay-500 opacity-40" />
          
          {/* Floating Elements */}
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary/30 rounded-full animate-bounce delay-300" />
          <div className="absolute top-3/4 left-1/4 w-6 h-6 bg-primary/20 rounded-full animate-bounce delay-700" />
          <div className="absolute top-1/3 left-1/6 w-3 h-3 bg-primary/40 rounded-full animate-bounce delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              {/* Animated Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                🚀 Nova Era: IA Revolucionária para Fitness
              </div>
              
              {/* Main Heading with Animation */}
              <div className="space-y-4 mb-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none">
                  <span className="block transform hover:scale-105 transition-transform duration-300">
                    Transforme
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300 delay-100">
                    seu Negócio
                  </span>
                  <span className="block bg-gradient-to-r from-primary/80 via-primary to-primary/90 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-300 delay-200">
                    Fitness
                  </span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A plataforma que combina{" "}
                <span className="text-primary font-semibold">gestão inteligente</span>,{" "}
                <span className="text-primary font-semibold">IA avançada</span> e{" "}
                <span className="text-primary font-semibold">resultados excepcionais</span>{" "}
                para personal trainers visionários.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 text-lg px-8 py-4 relative overflow-hidden group" asChild>
                  <Link href="/register" className="flex items-center relative z-10">
                    <span className="mr-3">Começar Gratuitamente</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 group relative overflow-hidden">
                  <Play className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform duration-300" />
                  Ver Demo Interativa
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </div>
              
              {/* Enhanced Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm">
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground font-medium">14 dias grátis</span>
                </div>
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground font-medium">Sem cartão</span>
                </div>
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground font-medium">Suporte 24/7</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Image Section */}
            <div className="lg:w-1/2 relative">
              <div className="relative group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-3xl blur-3xl transform rotate-6 group-hover:rotate-12 transition-transform duration-700" />
                
                {/* Main Image */}
                <img 
                  src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg" 
                  alt="Personal trainer revolucionário" 
                  className="relative rounded-3xl shadow-2xl w-full h-auto max-w-lg mx-auto transform group-hover:scale-105 transition-all duration-700 border border-border/20"
                />
                
                {/* Enhanced Floating Cards */}
                <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-border/50 transform hover:scale-110 transition-all duration-500 hover:shadow-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-green-600">+287% ROI</p>
                      <p className="text-sm text-muted-foreground">em 6 meses médios</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-8 -right-8 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-border/50 transform hover:scale-110 transition-all duration-500 hover:shadow-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-primary">12.5K+</p>
                      <p className="text-sm text-muted-foreground">clientes ativos</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-1/2 -right-16 bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-border/50 transform hover:scale-110 transition-all duration-500 hover:shadow-3xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-purple-600">AI Smart</p>
                      <p className="text-xs text-muted-foreground">Insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/20" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-8 transform hover:scale-105 transition-all duration-300">
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              💪 Funcionalidades de Última Geração
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-tight">
              <span className="block">Tudo que você precisa para</span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                dominar o mercado fitness
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Tecnologia de ponta, design intuitivo e resultados comprovados.{" "}
              <span className="text-primary font-semibold">Seja o personal trainer do futuro.</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enhanced Feature Cards */}
            {[
              {
                icon: Users,
                title: "Gestão Completa de Clientes",
                description: "Centralize histórico médico, objetivos, evolução e comunicação. Dashboard intuitivo com insights em tempo real.",
                gradient: "from-blue-500 to-blue-600",
                hoverGradient: "from-blue-400 to-blue-500"
              },
              {
                icon: Target,
                title: "Constructor Visual Inteligente",
                description: "Builder drag-and-drop com IA integrada. Biblioteca com 1000+ exercícios e templates personalizáveis.",
                gradient: "from-emerald-500 to-emerald-600",
                hoverGradient: "from-emerald-400 to-emerald-500"
              },
              {
                icon: Zap,
                title: "IA Revolucionária & Insights",
                description: "Algoritmos que aprendem, sugerem e otimizam. Prevenção de lesões e maximização de resultados.",
                gradient: "from-purple-500 to-purple-600",
                hoverGradient: "from-purple-400 to-purple-500"
              },
              {
                icon: Award,
                title: "Tracking de Performance Elite",
                description: "Dashboards cinematográficos com métricas avançadas. Relatórios profissionais automáticos.",
                gradient: "from-orange-500 to-orange-600",
                hoverGradient: "from-orange-400 to-orange-500"
              },
              {
                icon: Smartphone,
                title: "App Mobile Premiado",
                description: "Interface que seus clientes vão amar. Gamificação, progresso visual e engajamento máximo.",
                gradient: "from-pink-500 to-pink-600",
                hoverGradient: "from-pink-400 to-pink-500"
              },
              {
                icon: Shield,
                title: "Segurança & Automação",
                description: "Pagamentos seguros, dados criptografados e automações que economizam 10+ horas por semana.",
                gradient: "from-red-500 to-red-600",
                hoverGradient: "from-red-400 to-red-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-all duration-500`} />
                <div className="relative bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-border/50 hover:shadow-3xl hover:border-primary/30 transition-all duration-500 h-full transform group-hover:scale-105 group-hover:-translate-y-2">
                  <div className={`bg-gradient-to-br ${feature.gradient} group-hover:bg-gradient-to-br group-hover:${feature.hoverGradient} w-16 h-16 rounded-3xl flex items-center justify-center mb-6 shadow-xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing section */}
      <section id="pricing" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              💰 Investimento Inteligente
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              <span className="block">Planos que multiplicam</span>
              <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                seus resultados
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Escolha seu nível de impacto. <span className="text-primary font-semibold">ROI médio de 287% em 6 meses.</span>
            </p>
          </div>
          
          {/* Rest of pricing section with enhanced styling */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Free Plan Enhanced */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
              <div className="relative bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">Starter</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-black">R$0</span>
                      <span className="text-muted-foreground text-lg">/mês</span>
                    </div>
                    <p className="text-muted-foreground">
                      Ideal para descobrir o potencial
                    </p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "1 aluno ativo",
                      "50 exercícios premium",
                      "10 templates profissionais",
                      "100MB armazenamento",
                      "Dashboard essencial"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-3 h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full transform hover:scale-105 transition-all duration-300" variant="outline" asChild>
                    <Link href="/register">
                      Começar Grátis
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Pro Plan Enhanced */}
            <div className="group relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-3xl blur-3xl opacity-75 group-hover:opacity-100 transition-all duration-700 animate-pulse" />
              <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 border-2 border-primary rounded-3xl overflow-hidden shadow-3xl transform group-hover:scale-105 transition-all duration-500">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/80 text-white text-sm font-bold px-6 py-3 rounded-bl-3xl">
                  🔥 MAIS ESCOLHIDO
                </div>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">Professional</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-black bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">R$49,90</span>
                      <span className="text-muted-foreground text-lg">/mês</span>
                    </div>
                    <p className="text-muted-foreground">
                      Para trainers ambiciosos
                    </p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "100 alunos simultâneos",
                      "Biblioteca completa + IA",
                      "Templates ilimitados",
                      "5GB armazenamento",
                      "IA avançada + predições",
                      "Chat & automações"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-3 h-5 w-5 text-green-500" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl transform hover:scale-105 transition-all duration-300" asChild>
                    <Link href="/register?plan=pro">
                      Revolucionar Agora
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Enterprise Plan Enhanced */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-purple-300 dark:from-purple-700 dark:to-purple-800 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700" />
              <div className="relative bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-black">R$149,90</span>
                      <span className="text-muted-foreground text-lg">/mês</span>
                    </div>
                    <p className="text-muted-foreground">
                      Para impérios fitness
                    </p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "1000+ alunos",
                      "5 trainers simultâneos",
                      "Biblioteca colaborativa",
                      "50GB armazenamento",
                      "IA biomecânica completa",
                      "White label + API"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-3 h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full transform hover:scale-105 transition-all duration-300" variant="outline" asChild>
                    <Link href="/register?plan=enterprise">
                      Falar com Especialista
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-8">
              <Star className="w-4 h-4 mr-2 animate-pulse fill-current" />
              ⭐ Transformações Reais
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              <span className="block">Histórias que</span>
              <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                inspiram e comprovam
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: "Alexandre Silva",
                role: "Personal Trainer, Rio de Janeiro",
                image: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg",
                testimonial: "Quadrupliquei minha base de clientes em 6 meses. A IA do FitPro não apenas funciona, ela TRANSFORMA. Meus resultados nunca foram tão consistentes.",
                result: "+400% clientes"
              },
              {
                name: "Camila Rodrigues", 
                role: "Studio de Pilates, São Paulo",
                image: "https://images.pexels.com/photos/3765114/pexels-photo-3765114.jpeg",
                testimonial: "Nossa equipe trabalha como um organismo único. Os insights de IA revolucionaram nossa abordagem. Nunca vimos resultados tão rápidos nos alunos.",
                result: "5x mais eficiência"
              },
              {
                name: "Rafael Costa",
                role: "Coach Online, Brasília", 
                image: "https://images.pexels.com/photos/6456300/pexels-photo-6456300.jpeg",
                testimonial: "De 15 para 87 alunos mantendo qualidade premium. A automação me devolveu 20 horas por semana. Isso não é tecnologia, é magia pura.",
                result: "+480% escala"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-border/50 hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2">
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed text-lg italic">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-14 h-14 rounded-full object-cover mr-4 ring-2 ring-primary/20"
                      />
                      <div>
                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-500">{testimonial.result}</div>
                      <div className="text-xs text-muted-foreground">resultado</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra Enhanced CTA section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 text-white leading-tight">
              <span className="block">Pronto para liderar</span>
              <span className="block">a revolução fitness?</span>
            </h2>
            <p className="max-w-4xl mx-auto mb-12 text-xl md:text-2xl text-white/90 leading-relaxed">
              Mais de <span className="font-bold text-white">12.500 profissionais</span> já descobriram o poder de unir{" "}
              <span className="font-bold text-white">expertise</span> com{" "}
              <span className="font-bold text-white">tecnologia de ponta</span>.{" "}
              Sua vez de dominar o mercado.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 text-xl px-10 py-6 group relative overflow-hidden" asChild>
                <Link href="/register" className="flex items-center relative z-10">
                  <span className="mr-4">Começar Revolução Grátis</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300 text-xl px-10 py-6">
                <Play className="w-6 h-6 mr-4" />
                Demo Exclusiva
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-12 text-white/90 text-lg">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6" />
                <span className="font-semibold">14 dias grátis</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6" />
                <span className="font-semibold">Setup gratuito</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6" />
                <span className="font-semibold">Suporte white-glove</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-muted/50 to-muted/30 py-20 border-t border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <DumbellIcon size={32} className="text-primary relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full group-hover:bg-primary/40 transition-colors duration-300" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  FitPro
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A plataforma que está redefinindo o futuro do fitness com inteligência artificial, design excepcional e resultados comprovados.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
                  { icon: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" },
                  { icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                  { icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" }
                ].map((social, index) => (
                  <a key={index} href="#" className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-110">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            
            {[
              { title: "Plataforma", links: ["Funcionalidades", "Preços", "Depoimentos", "Blog", "Roadmap"] },
              { title: "Empresa", links: ["Sobre", "Carreiras", "Imprensa", "Parceiros", "Contato"] },
              { title: "Recursos", links: ["Central de Ajuda", "API", "Status", "Comunidade", "Webinars"] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-bold mb-6 text-lg">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group">
                        {link}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} FitPro. Revolucionando o fitness com IA.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors duration-300">Termos</a>
              <a href="#" className="hover:text-primary transition-colors duration-300">Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors duration-300">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}