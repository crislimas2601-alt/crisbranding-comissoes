import React, { useRef, useState } from 'react';
import { 
  Building2, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle2, 
  HelpCircle,
  FileSpreadsheet,
  Monitor,
  Trash2,
  AlertTriangle,
  X,
  Database,
  LayoutDashboard
} from 'lucide-react';
import { ContractDeal } from '../types';
import { DesktopGuideModal } from './DesktopGuideModal';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenNewDeal: () => void;
  deals: ContractDeal[];
  onImportDeals: (deals: ContractDeal[]) => void;
  onResetToSample: () => void;
  onClearAll: () => void;
  onExportCsv: () => void;
  activeTab: 'dashboard' | 'database';
  onTabChange: (tab: 'dashboard' | 'database') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewDeal,
  deals,
  onImportDeals,
  onResetToSample,
  onClearAll,
  onExportCsv,
  activeTab,
  onTabChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDesktopModalOpen, setIsDesktopModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deals, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `minhas-comissoes-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportDeals(json);
        } else {
          alert('Arquivo inválido: o formato precisa ser uma lista de contratos.');
        }
      } catch (err) {
        alert('Erro ao carregar o arquivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                  Gestão de Comissões
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                  Corretor de Imóveis
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200" title="Criado por CrisBranding">
                  por <strong className="font-semibold text-slate-900">CreatedByCris</strong>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Previsão de fluxo de caixa, comissões futuras, bônus e contratos fechados
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />

            {/* Export / Backup dropdown or buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs text-slate-600">
              <button
                id="btn-export-csv"
                onClick={onExportCsv}
                title="Exportar dados para planilha Excel / CSV"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-white hover:text-slate-900 transition-colors font-medium cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Exportar</span> Planilha
              </button>

              <button
                id="btn-export-json"
                onClick={handleExportJson}
                title="Salvar backup completo em arquivo JSON"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-white hover:text-slate-900 transition-colors font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Backup</span>
              </button>

              <button
                id="btn-import-json"
                onClick={() => fileInputRef.current?.click()}
                title="Restaurar backup de arquivo JSON"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-white hover:text-slate-900 transition-colors font-medium cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Restaurar</span>
              </button>

              <button
                id="btn-clear-all"
                onClick={() => setIsClearModalOpen(true)}
                title="Zerar todos os contratos e começar preenchimento em branco"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-red-50 text-slate-500 hover:text-red-700 transition-colors font-medium cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
                <span className="hidden sm:inline">Zerar Tudo</span>
              </button>

              <button
                id="btn-reset-sample"
                onClick={() => setIsResetModalOpen(true)}
                title="Recarregar exemplos de imóveis e comissões para demonstração"
                className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-amber-50 text-slate-500 hover:text-amber-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Exemplos</span>
              </button>
            </div>

            {/* Desktop / PWA Guide Button */}
            <button
              id="btn-desktop-guide"
              onClick={() => setIsDesktopModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all shadow-xs cursor-pointer"
              title="Como abrir ou instalar no Computador / Desktop"
            >
              <Monitor className="w-3.5 h-3.5 text-amber-400" />
              <span>Usar no PC</span>
            </button>

            {/* Add Deal Button */}
            <button
              id="btn-new-deal"
              onClick={onOpenNewDeal}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Venda / Contrato</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation (Painel Geral vs Banco de Dados) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 mt-3">
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              id="tab-btn-dashboard"
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Painel Financeiro & Fluxo</span>
            </button>

            <button
              id="tab-btn-database"
              onClick={() => onTabChange('database')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Database className={`w-4 h-4 ${activeTab === 'database' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Banco de Dados</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                activeTab === 'database' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {deals.length}
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Salvamento em tempo real ativo no computador</span>
          </div>
        </div>

      </div>

      {/* Clear Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Deseja zerar todos os dados?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Esta ação apagará todos os contratos atuais ({deals.length} contrato{deals.length === 1 ? '' : 's'}) para que você possa começar o preenchimento das suas próprias vendas do zero com a tela limpa.
                </p>
                <p className="text-[11px] text-slate-400 mt-2 italic">
                  *Se quiser ter os dados de exemplo de volta no futuro, basta clicar no botão "Exemplos".
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirm-clear"
                onClick={() => {
                  onClearAll();
                  setIsClearModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Zerar Tudo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset to Sample Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Recarregar exemplos de demonstração?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Isso irá carregar novamente os exemplos simulados de vendas de apartamentos, terrenos, salas comerciais e bônus.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirm-reset"
                onClick={() => {
                  onResetToSample();
                  setIsResetModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recarregar Exemplos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <DesktopGuideModal 
        isOpen={isDesktopModalOpen} 
        onClose={() => setIsDesktopModalOpen(false)} 
      />
    </header>
  );
};
