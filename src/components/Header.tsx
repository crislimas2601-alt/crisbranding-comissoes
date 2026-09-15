import React, { useRef, useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Download, 
  Upload, 
  FileSpreadsheet,
  Trash2,
  AlertTriangle,
  Database,
  LayoutDashboard,
  ChevronDown,
  Settings
} from 'lucide-react';
import { ContractDeal } from '../types';
import { TorreSulLogo } from './TorreSulLogo';

interface HeaderProps {
  onOpenNewDeal: () => void;
  deals: ContractDeal[];
  onImportDeals: (deals: ContractDeal[]) => void;
  onClearAll: () => void;
  onExportCsv: () => void;
  activeTab: 'dashboard' | 'database';
  onTabChange: (tab: 'dashboard' | 'database') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewDeal,
  deals,
  onImportDeals,
  onClearAll,
  onExportCsv,
  activeTab,
  onTabChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deals, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `torre-sul-comissoes-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setIsActionsOpen(false);
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
    setIsActionsOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          
          {/* Logo & Title - Torre Sul Imobiliária */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 shrink-0 overflow-hidden">
              <TorreSulLogo size={36} className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-heading">
                  Gestão de Comissões & Vendas
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                  Torre Sul Imobiliária
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
                  por <strong className="font-semibold text-slate-800">CreatedByCris</strong>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Previsão de recebíveis futuros, fluxo de caixa e controle de fechamentos
              </p>
            </div>
          </div>

          {/* Actions & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
            />

            {/* Direct Excel Export Button */}
            <button
              id="btn-export-excel"
              onClick={onExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg shadow-xs transition-colors cursor-pointer"
              title="Exportar contratos para planilha Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Exportar Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>

            {/* Backup & JSON Actions Dropdown */}
            <div className="relative" ref={actionsMenuRef}>
              <button
                id="btn-actions-dropdown"
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Opções de Backup JSON e dados"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Backup JSON</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isActionsOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Backup e Restauração
                  </div>

                  <button
                    id="menu-btn-export-json"
                    onClick={handleExportJson}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-800">Exportar Backup JSON</div>
                      <div className="text-[10px] text-slate-400">Salvar cópia de segurança</div>
                    </div>
                  </button>

                  <button
                    id="menu-btn-import-json"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Restaurar Backup JSON</div>
                      <div className="text-[10px] text-slate-400">Carregar arquivo salvo</div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    id="menu-btn-clear-all"
                    onClick={() => {
                      setIsClearModalOpen(true);
                      setIsActionsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span>Zerar Planilha / Dados</span>
                  </button>
                </div>
              )}
            </div>

            {/* Highlighted Primary CTA: Red Torre Sul */}
            <button
              id="btn-new-deal"
              onClick={onOpenNewDeal}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Venda</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation (Painel Geral vs Banco de Dados) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 mt-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="tab-btn-dashboard"
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-red-600' : 'text-slate-400'}`} />
              <span>Painel Financeiro & Fluxo</span>
            </button>

            <button
              id="tab-btn-database"
              onClick={() => onTabChange('database')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Database className={`w-4 h-4 ${activeTab === 'database' ? 'text-red-600' : 'text-slate-400'}`} />
              <span>Banco de Dados</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                activeTab === 'database' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-200 text-slate-600'
              }`}>
                {deals.length}
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Salvamento em tempo real ativo no dispositivo</span>
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
                  Deseja zerar a planilha?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Esta ação apagará os contratos atuais ({deals.length} contrato{deals.length === 1 ? '' : 's'}) para que você possa iniciar novos lançamentos do zero com a tela limpa.
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
    </header>
  );
};
