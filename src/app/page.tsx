"use client";

import React, { useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Sparkles,
  HardDrive,
  Cpu,
  Layers,
  HelpCircle,
} from "lucide-react";
import { ActivationPlayer } from "./components/ActivationPlayer";
import { trackMetaEvent } from "../lib/meta-pixel";

export default function ActivationPage() {
  // Dispara o evento Purchase do Facebook Pixel no carregamento da página com desduplicação
  useEffect(() => {
    trackMetaEvent(
      "Purchase",
      {
        value: 97.0,
        currency: "BRL",
        content_name: "Google AI Pro 18 Meses",
        content_type: "product",
      },
      {
        deduplicateKey: "gemini_purchase_tracked_1369810175235012",
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* ─── BARRA DE TOPO DE STATUS ─── */}
      <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-sm leading-tight tracking-tight">
                Google AI Pro
              </span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                Portal de Ativação
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pagamento Confirmado (R$ 97)</span>
          </div>
        </div>
      </header>

      {/* ─── CONTAINER PRINCIPAL ─── */}
      <main className="w-full max-w-4xl px-4 py-8 md:py-12 flex flex-col items-center">
        {/* Pílula de Alerta */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Passo Obrigatório de Validação</span>
        </div>

        {/* HEADLINE PRINCIPAL */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 text-center tracking-tight leading-snug md:leading-tight max-w-3xl mb-4">
          Assista ao vídeo abaixo para ver como fazer a{" "}
          <span className="text-blue-600 underline decoration-blue-300 underline-offset-4">
            ativação de forma correta
          </span>
        </h1>

        {/* SUBHEADLINE */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 text-center max-w-2xl leading-relaxed mb-8">
          Siga o passo a passo simples de apenas 1 minuto demonstrado no vídeo para vincular seus{" "}
          <strong className="text-slate-900 font-bold">18 meses de Google Gemini Pro</strong> e os{" "}
          <strong className="text-slate-900 font-bold">5 TB de armazenamento Google One</strong> com
          segurança no seu Gmail.
        </p>

        {/* ─── PLAYER DE VÍDEO ─── */}
        <div className="w-full max-w-3xl mb-6">
          <ActivationPlayer />
        </div>

        {/* AVISO IMPORTANTE SOBRE O VÍDEO */}
        <div className="w-full max-w-3xl bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 md:p-5 flex items-start gap-3.5 mb-10 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <strong className="font-bold block mb-1">
              Atenção: Assista antes de abrir o link enviado no WhatsApp!
            </strong>
            O processo de ativação é instantâneo e vinculado diretamente à sua conta Google. Para evitar qualquer
            erro de vinculação em contas secundárias, assista ao vídeo até o final antes de abrir o link oficial enviado na conversa.
          </div>
        </div>

        {/* ─── PASSO A PASSO ILUSTRADO ─── */}
        <section className="w-full max-w-3xl mb-12">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Fluxo de Ativação
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Como funciona o resgate em 4 passos:
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="outcrowd-card p-5 flex flex-col">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                Assista ao Vídeo Tutorial
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Veja com atenção como aceitar o convite oficial no navegador sem sair da sua conta Google principal.
              </p>
            </div>

            <div className="outcrowd-card p-5 flex flex-col">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                Abra o Link da Conversa
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                O seu link oficial exclusivo de ativação foi enviado diretamente para você na nossa conversa do WhatsApp.
              </p>
            </div>

            <div className="outcrowd-card p-5 flex flex-col">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                Confirme em 1 Clique
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ao abrir o link no seu navegador pessoal, basta clicar em aceitar para vincular a licença ao seu Gmail.
              </p>
            </div>

            <div className="outcrowd-card p-5 flex flex-col">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                Aproveite os 18 Meses
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Os 5 TB são liberados na hora no Google One e o Gemini Pro fica ativo no seu ecossistema.
              </p>
            </div>
          </div>
        </section>

        {/* ─── TERMOS DE GARANTIA E ENTREGA DO LINK (ESPECIFICAÇÃO RIGOROSA DO USUÁRIO) ─── */}
        <section className="w-full max-w-3xl bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Termos de Garantia & Protocolo de Entrega
              </h2>
              <p className="text-xs text-slate-500">
                Leia com atenção antes de concluir o resgate do seu acesso
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                1. Garantia de 100% no Funcionamento da Entrega
              </h4>
              <p className="text-slate-600">
                Nós garantimos de forma intransigente a entrega de um link de ativação oficial, válido, ativo e
                rigorosamente funcional. Cada link passa por testes internos prévios antes de ser liberado no seu
                WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                2. Vínculo Direto e Intransferível
              </h4>
              <p className="text-slate-600">
                Por se tratar de uma licença digital com ativação imediata nos servidores da Google, a cota de 18 meses
                e 5 TB é consumida e atribuída no momento em que o link válido é gerado e disponibilizado ao cliente.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
              <h4 className="font-bold text-amber-950 flex items-center gap-2 mb-1.5 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                3. Limite da Garantia Pós-Entrega do Link
              </h4>
              <p className="text-amber-900">
                A nossa garantia de entrega é cumprida integralmente com a disponibilização do link funcional. Uma vez
                que o link funcional for entregue a você, é de sua responsabilidade seguir as instruções do vídeo
                acima para a ativação. Portanto, caso o usuário cometa algum erro operacional posterior (como
                vincular em uma conta errada ou deixar de seguir o passo a passo demonstrado no tutorial), não será
                possível a realização de estorno ou devolução do valor pago, visto que o produto funcional já foi
                entregue e consumido.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200">
              <h4 className="font-bold text-blue-950 flex items-center gap-2 mb-1.5 text-sm">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                4. Suporte Dedicado na Conversa
              </h4>
              <p className="text-blue-900">
                Caso você tenha qualquer dúvida, receio ou dificuldade técnica durante o processo, NÃO execute ações
                às cegas. Basta nos responder diretamente na nossa conversa do WhatsApp: nós o auxiliaremos em tempo
                real para garantir que sua ativação ocorra com 100% de sucesso.
              </p>
            </div>
          </div>
        </section>

        {/* ─── RECAPITULANDO O QUE VOCÊ ADQUIRIU ─── */}
        <section className="w-full max-w-3xl outcrowd-card p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Recapitulando tudo o que você liberou por R$ 97:
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Cpu className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                  18 Meses de Google Gemini 4.0 Pro
                </strong>
                <span className="text-xs text-slate-500">
                  Raciocínio avançado, Deep Research, limites estendidos de contexto e respostas ultra velozes.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <HardDrive className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                  5 Terabytes (5.000 GB) de Armazenamento
                </strong>
                <span className="text-xs text-slate-500">
                  Espaço unificado para fotos em qualidade original, backups pesados e arquivos no Google Drive.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Layers className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Google Flow com 1.050 Créditos Mensais
                </strong>
                <span className="text-xs text-slate-500">
                  Renovados todos os meses automaticamente para geração de mídias e automações.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <PlayCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm font-bold text-slate-900 block">
                  Motores Veo 3.1 & Nano Banana Pro
                </strong>
                <span className="text-xs text-slate-500">
                  Criação de vídeos cinematográficos e renderização de imagens fotorrealistas via inteligência artificial.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER LIMPO ─── */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-8 px-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-2">
          <p className="font-semibold text-slate-700">
            Google AI Pro • Ativações Oficiais
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Este site é um portal independente de facilitação e distribuição de cotas de licenças corporativas.
            Todas as marcas registradas pertencem aos seus respectivos proprietários.
          </p>
        </div>
      </footer>
    </div>
  );
}
