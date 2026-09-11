import React, { useState } from 'react';
import { 
  Monitor, 
  X, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Bookmark, 
  ShieldCheck, 
  Copy,
  Check,
  Globe
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DesktopGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopGuideModal: React.FC<DesktopGuideModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'chrome' | 'edge' | 'shortcut'>('chrome');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback if clipboard API is restricted
      prompt("Copie o link abaixo para abrir no seu navegador do PC:", currentUrl);
    });
  };

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const handleOpenNewWindow = () => {
    window.open(currentUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Como Usar no Computador (Desktop)
              </h2>
              <p className="text-xs text-slate-300">
                Instale como um aplicativo independente para acesso rápido na sua rotina
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Direct Address Box with Copy */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-600" />
                Link Direto para abrir no seu Computador:
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
            <p className="text-xs text-amber-900/80 mb-2 leading-relaxed">
              Basta copiar o endereço abaixo e colar diretamente na barra de pesquisa de qualquer navegador no seu computador (Chrome, Edge, Firefox, Safari):
            </p>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-amber-300 font-mono text-[11px] text-slate-700 overflow-x-auto select-all">
              <span className="truncate">{currentUrl}</span>
            </div>
          </div>

          {/* Quick Install Banner (if browser supports direct prompt) */}
          {isInstallable && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Seu navegador suporta instalação direta!</h4>
                  <p className="text-xs text-emerald-700">Clique para instalar o app nativo na sua Área de Trabalho agora.</p>
                </div>
              </div>
              <button
                onClick={handleNativeInstall}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
              >
                Instalar Agora
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs font-medium text-emerald-900">
                O aplicativo já está instalado no seu dispositivo no modo standalone (App)!
              </p>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('chrome')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'chrome'
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Google Chrome
            </button>
            <button
              onClick={() => setActiveTab('edge')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'edge'
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Microsoft Edge
            </button>
            <button
              onClick={() => setActiveTab('shortcut')}
              className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'shortcut'
                  ? 'border-amber-500 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Atalho no Navegador
            </button>
          </div>

          {/* Tab 1: Chrome */}
          {activeTab === 'chrome' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Abra o app em uma aba completa</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Se estiver visualizando dentro do painel do AI Studio, clique no ícone de <strong>"Abrir em nova aba"</strong> (canto superior direito da tela de preview).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Clique no ícone de instalação na barra de endereços</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No topo direito da barra de endereço do Chrome, procure o ícone de <strong>computador com uma seta para baixo</strong> ("Instalar Controle de Comissões").
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    <em>Ou:</em> Clique nos <strong>3 pontinhos do Chrome</strong> &gt; <strong>"Salvar e compartilhar"</strong> &gt; <strong>"Instalar Controle de Comissões..."</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Pronto! Janela exclusiva e ícone na Área de Trabalho</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    O aplicativo abrirá numa janela própria limpa, sem barra de abas nem de endereços, exatamente como um software instalado. Você pode fixá-lo na barra de tarefas do Windows ou no Dock do Mac.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Edge */}
          {activeTab === 'edge' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Abra no Microsoft Edge</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Abra a página do app numa aba normal no navegador Edge.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Menu de Aplicativos do Edge</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Clique no ícone de <strong>3 pontinhos (...)</strong> no canto superior do Edge &gt; vá em <strong>"Aplicativos"</strong> &gt; clique em <strong>"Instalar este site como aplicativo"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Confirmar e fixar</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    O Edge perguntará se deseja fixar na Barra de Tarefas ou criar atalho na Área de Trabalho. Marque "Sim" para ter acesso com 1 clique.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Bookmark / Direct shortcut */}
          {activeTab === 'shortcut' && (
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Salvar nos Favoritos do Navegador</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pressione <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[10px]">Ctrl + D</kbd> (Windows) ou <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 font-mono text-[10px]">Cmd + D</kbd> (Mac) para fixar na sua barra de favoritos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">Criar atalho com janela dedicada</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No Chrome: Menu (...) &gt; <em>Salvar e compartilhar</em> &gt; <em>Criar atalho...</em> &gt; Marque a caixa <strong>"Abrir como janela"</strong>. Assim ele abre sem abas como um aplicativo!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security & Backup info */}
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Como seus dados ficam salvos?</strong>
              <p className="mt-0.5">
                Todas as suas vendas e comissões ficam salvas automaticamente no navegador do seu computador (armazenamento local seguro). Use o botão <strong>"Backup"</strong> no topo para baixar um arquivo JSON de segurança ou <strong>"Exportar Planilha"</strong> para Excel sempre que quiser.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleOpenNewWindow}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>Abrir em Nova Aba do Navegador</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition cursor-pointer"
          >
            Entendi, fechar
          </button>
        </div>

      </div>
    </div>
  );
};
