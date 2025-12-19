
import React, { useState, useEffect } from 'react';
import { getSystemConfig, updateSystemConfig } from '../firebase';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    getSystemConfig().then(data => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaveStatus('שומר...');
    await updateSystemConfig(config);
    setSaveStatus('נשמר בהצלחה!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const updateMetric = (index: number, label: string) => {
    const newMetrics = [...config.metrics];
    newMetrics[index].label = label;
    setConfig({ ...config, metrics: newMetrics });
  };

  if (loading) return <div className="text-center py-20 text-white">טוען הגדרות...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20 text-right">
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-black text-white italic">ניהול הגדרות מערכת</h2>
        <button onClick={onBack} className="text-slate-500 hover:text-white font-bold">חזרה ←</button>
      </div>

      <div className="glass-card p-10 rounded-[3rem] border-white/10 space-y-10">
        <div className="space-y-4">
          <label className="text-amber-500 font-black uppercase tracking-widest text-xs">קוד גישה כללי למערכת (Master Code)</label>
          <input 
            type="text" 
            value={config.masterCode} 
            onChange={e => setConfig({...config, masterCode: e.target.value.toUpperCase()})}
            className="w-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-2xl text-white font-black text-center"
          />
        </div>

        <div className="space-y-6">
          <label className="text-cyan-brand font-black uppercase tracking-widest text-xs">עריכת קריטריונים לדופק צוותי (Team Pulse)</label>
          <div className="grid gap-4">
            {config.metrics.map((m: any, i: number) => (
              <div key={i} className="flex gap-4 items-center">
                <span className="text-2xl">{m.icon}</span>
                <input 
                  type="text" 
                  value={m.label} 
                  onChange={e => updateMetric(i, e.target.value)}
                  className="flex-1 bg-slate-950 border border-white/5 rounded-xl p-4 text-white font-bold"
                />
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full py-6 bg-white text-slate-950 rounded-3xl font-black text-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-2xl"
        >
          {saveStatus || "עדכן הגדרות מערכת"}
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
