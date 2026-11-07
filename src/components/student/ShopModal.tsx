import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShopCategory, StudentUser, ShopItem } from '../../types';
import { playClickSound, playCoinSound } from '../../utils/audio';
import { fireCoinShower } from '../../utils/confetti';
import { ShoppingBag, Check, Sparkles, AlertCircle } from 'lucide-react';

export const ShopModal: React.FC = () => {
  const { currentUser, shopItems, buyShopItem, equipShopItem } = useApp();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const student = currentUser?.role === 'student' ? (currentUser as StudentUser) : null;

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'Barchasi', icon: '🎁' },
    { id: 'avatar', label: 'Avatarlar', icon: '🧑‍🚀' },
    { id: 'frame', label: 'Ramkalar', icon: '🖼️' },
    { id: 'theme', label: 'Mavzular', icon: '🎨' },
    { id: 'badge', label: 'Nishonlar', icon: '⭐' },
  ];

  const filteredItems = shopItems.filter(
    (item) => item.available && (selectedCat === 'all' || item.category === selectedCat)
  );

  const handleBuy = (item: ShopItem) => {
    playClickSound();
    const res = buyShopItem(item.id);
    if (res.success) {
      setNotice({ type: 'success', msg: res.message });
      fireCoinShower();
    } else {
      setNotice({ type: 'error', msg: res.message });
    }
    setTimeout(() => setNotice(null), 3000);
  };

  const handleEquip = (item: ShopItem) => {
    playClickSound();
    equipShopItem(item.id);
    setNotice({ type: 'success', msg: `"${item.name}" profilingizga o'rnatildi!` });
    setTimeout(() => setNotice(null), 3000);
  };

  const isEquipped = (item: ShopItem) => {
    if (!student) return false;
    if (item.category === 'avatar') return student.avatar === item.cssValue;
    if (item.category === 'frame') return student.frame === item.cssValue;
    if (item.category === 'theme') return student.theme === item.cssValue;
    if (item.category === 'badge') return student.badge === item.cssValue;
    return false;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              BilimLand Do'koni 🛍️
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Fredoka']">
              Sehrli Sovg'alar va Liboslar
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-lg font-medium">
              Darslarda to'plagan tangalaringizga yangi qahramon avatarlari, yarqiroq ramkalar va a'lochi nishonlarini xarid qiling!
            </p>
          </div>

          {/* Student Balance Card */}
          {student && (
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-3xl p-5 text-center shadow-lg min-w-56">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                Sizning hisobingiz:
              </span>
              <div className="text-4xl font-black text-amber-300 font-['Fredoka'] flex items-center justify-center gap-2 mt-1">
                <span>{student.coins}</span>
                <span className="text-3xl animate-bounce">🪙</span>
              </div>
              <p className="text-[11px] text-white/80 font-bold mt-1">
                Har bir dars va test yangi tanga keltiradi!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notice Alert */}
      {notice && (
        <div className={`p-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 animate-in slide-in-from-top-2 ${
          notice.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-rose-100 text-rose-800 border-2 border-rose-300'
        }`}>
          {notice.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notice.msg}</span>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              playClickSound();
              setSelectedCat(c.id);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              selectedCat === c.id
                ? 'bg-pink-600 text-white shadow-md shadow-pink-200'
                : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map((item) => {
          const owned = student?.inventory.includes(item.id);
          const equipped = isEquipped(item);
          const canAfford = student ? student.coins >= item.price : false;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 border-2 transition duration-200 flex flex-col justify-between hover:shadow-lg ${
                equipped
                  ? 'border-emerald-500 ring-2 ring-emerald-300'
                  : owned
                  ? 'border-indigo-200'
                  : 'border-slate-200 hover:border-pink-300'
              }`}
            >
              <div>
                {/* Category Badge & Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {item.category === 'avatar' ? 'Avatar' : item.category === 'frame' ? 'Ramka' : item.category === 'theme' ? 'Mavzu' : 'Nishon'}
                  </span>
                  
                  <div className="flex items-center gap-1 font-black text-amber-700 text-sm bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <span>🪙 {item.price}</span>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="h-28 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-pink-50/60 flex items-center justify-center text-5xl mb-3 shadow-inner">
                  {item.category === 'frame' ? (
                    <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl ${item.cssValue}`}>
                      🦉
                    </div>
                  ) : (
                    <span>{item.preview}</span>
                  )}
                </div>

                {/* Title & Description */}
                <h4 className="font-black text-slate-800 text-base font-['Fredoka']">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-2 border-t border-slate-100">
                {equipped ? (
                  <div className="py-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black text-center flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    O'rnatilgan (Faol)
                  </div>
                ) : owned ? (
                  <button
                    onClick={() => handleEquip(item)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition cursor-pointer shadow-sm"
                  >
                    Taqish (Faollashtirish)
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      canAfford
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md shadow-pink-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Sotib olish ({item.price} tanga)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
