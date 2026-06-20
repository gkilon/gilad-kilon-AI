
import React from 'react';
import { BrandLogo } from './Landing';
import html2canvas from 'html2canvas';

const DownloadBar: React.FC<{ elementId: string; fileName: string }> = ({ elementId, fileName }) => {
  const downloadImage = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Download failed', e);
      alert('חלה שגיאה ביצירת התמונה. נסה שוב או השתמש בצילום מסך.');
    }
  };

  const downloadPdf = () => {
    // Standard approach for clean PDF of specific assets is standard browser printing
    window.print();
  };

  return (
    <div className="flex gap-4 mt-6 border-t border-brand-dark/5 pt-4 no-print" dir="ltr">
      <button
        onClick={downloadImage}
        className="flex-1 bg-brand-dark text-white py-3 font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-2"
      >
        <span>PNG IMAGE</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
      </button>
      <button
        onClick={downloadPdf}
        className="flex-1 border-2 border-brand-dark text-brand-dark py-3 font-black text-[10px] uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2"
      >
        <span>PDF / PRINT</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
      </button>
    </div>
  );
};

const BrandAssets: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6 animate-fadeIn text-right" dir="rtl">

      <div className="flex justify-between items-center mb-16 border-b-4 border-brand-dark pb-8 no-print">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter">נכסי מותג.</h1>
          <p className="text-brand-muted font-bold italic">הורד והשתמש בגרסאות המדויקות לכל צורך מקצועי.</p>
        </div>
        <button onClick={onBack} className="text-brand-muted hover:text-brand-dark font-black text-xs uppercase tracking-widest border-b-2 border-brand-dark">חזרה לניהול ←</button>
      </div>

      <div className="grid gap-20">

        {/* LinkedIn Banner Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">1. באנר ללינקדאין (LinkedIn Banner)</h2>
          <div className="studio-card p-4 bg-white border-brand-dark shadow-[12px_12px_0px_#1a1a1a]">
            <div
              id="asset-linkedin-new"
              className="relative w-full aspect-[1584/396] bg-brand-dark flex flex-col items-center justify-center overflow-hidden"
              dir="ltr"
            >
              <div className="absolute inset-0 opacity-10 bg-grid"></div>
              <div className="z-10 scale-[1.6] md:scale-[2.4]">
                <BrandLogo size="md" dark={false} />
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="text-[10px] md:text-sm font-black text-brand-accent uppercase tracking-[0.5em] opacity-80">
                  SIMPLE • DEEP • REAL
                </span>
              </div>
            </div>
            <DownloadBar elementId="asset-linkedin-new" fileName="GiladKilon_LinkedIn_Banner" />
          </div>
        </section>

        {/* Presentation Logos */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">2. לוגו רשמי (Presentation Logos)</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="studio-card p-8 bg-white border-brand-dark shadow-md flex flex-col h-full">
              <div id="logo-dark-final" className="flex-1 flex flex-col items-center justify-center gap-8 py-20 bg-white">
                <BrandLogo size="md" dark={true} />
              </div>
              <DownloadBar elementId="logo-dark-final" fileName="GiladKilon_Logo_Dark" />
            </div>
            <div className="studio-card p-8 bg-white border-brand-dark shadow-md flex flex-col h-full">
              <div id="logo-light-final" className="flex-1 flex flex-col items-center justify-center gap-8 py-20 bg-brand-dark">
                <BrandLogo size="md" dark={false} />
              </div>
              <DownloadBar elementId="logo-light-final" fileName="GiladKilon_Logo_Light" />
            </div>
          </div>
        </section>

        {/* Email Signature */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">3. חתימה למייל (Email Signature)</h2>
          <div className="studio-card p-12 bg-white border-brand-dark shadow-[12px_12px_0px_#1a1a1a]">
            <div id="asset-sig-final" className="flex flex-col md:flex-row items-center gap-12 p-10 bg-white border border-brand-dark/5" dir="ltr">
              <BrandLogo size="md" />
              <div className="h-24 w-px bg-brand-dark/10 hidden md:block"></div>
              <div className="text-left font-medium text-brand-dark">
                <p className="text-2xl font-black tracking-tighter">GILAD KILON</p>
                <div className="space-y-1 text-sm font-bold opacity-70 mt-2">
                  <p>052-6417512 | gilad@kilon.org</p>
                  <p className="text-brand-accent font-black">www.kilon-consulting.com</p>
                </div>
              </div>
            </div>
            <DownloadBar elementId="asset-sig-final" fileName="GiladKilon_Email_Signature" />
          </div>
        </section>

        {/* Letterhead */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">4. לוגו למסמכים (Letterhead)</h2>
          <div className="studio-card p-12 bg-white border-brand-dark shadow-sm">
            <div id="asset-letterhead-final" className="p-10 bg-white border border-brand-dark/5">
              <div className="flex justify-start mb-24" dir="ltr">
                <BrandLogo size="sm" />
              </div>
              <div className="border-t-2 border-brand-dark/10 pt-10 space-y-4 opacity-5 no-print">
                <div className="h-4 w-3/4 bg-brand-dark"></div>
                <div className="h-4 w-1/2 bg-brand-dark"></div>
              </div>
            </div>
            <DownloadBar elementId="asset-letterhead-final" fileName="GiladKilon_Letterhead_Logo" />
          </div>
        </section>

        {/* Transparent Logos */}
        <section className="space-y-8">
          <h2 className="text-2xl font-black text-brand-accent uppercase tracking-widest border-r-4 border-brand-accent pr-4">5. לוגו שקוף (Transparent Logos)</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Transparent Black */}
            <div className="studio-card p-4 bg-white border-brand-dark shadow-md">
              <div className="bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWCEAvjyORQMqGQAFnAVd8Gf9MwAAAAASUVORK5CYII=')] bg-repeat border border-brand-dark/10 rounded-sm overflow-hidden">
                <div id="logo-transparent-dark" className="flex items-center justify-center p-20">
                  <BrandLogo size="md" dark={true} />
                </div>
              </div>
              <DownloadBar elementId="logo-transparent-dark" fileName="GiladKilon_Logo_Transparent_Black" />
            </div>

            {/* Transparent White */}
            <div className="studio-card p-4 bg-white border-brand-dark shadow-md">
              <div className="bg-brand-dark border border-brand-dark/10 rounded-sm overflow-hidden">
                <div id="logo-transparent-white" className="flex items-center justify-center p-20">
                  <BrandLogo size="md" dark={false} />
                </div>
              </div>
              <DownloadBar elementId="logo-transparent-white" fileName="GiladKilon_Logo_Transparent_White" />
            </div>
          </div>
        </section>

      </div>

      <div className="mt-32 p-16 border-4 border-brand-dark text-center space-y-4 bg-white no-print">
        <p className="text-xl font-black italic">"דיוק ויזואלי הוא חלק בלתי נפרד מדיוק אסטרטגי."</p>
        <div className="h-px w-20 bg-brand-accent mx-auto"></div>
        <p className="text-sm text-brand-muted font-bold uppercase tracking-widest">GK STRATEGIC ASSETS v2.1</p>
      </div>
    </div>
  );
};

export default BrandAssets;
