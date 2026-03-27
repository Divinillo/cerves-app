import { useState } from 'react';
import { MapPin, Beer, Users, User, ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (nickname: string) => void;
  defaultNickname?: string;
}

const STEPS = [
  { id: 'welcome', icon: '🍺', title: 'Bienvenido a Cerves' },
  { id: 'nickname', icon: '🏷️', title: 'Tu Nickname' },
  { id: 'map', icon: '🗺️', title: 'El Mapa' },
  { id: 'beer', icon: '🍻', title: 'Tu Primera Cerveza' },
  { id: 'social', icon: '⚔️', title: 'La Taberna y tu Perfil' },
];

export default function OnboardingWizard({ onComplete, defaultNickname = '' }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState(defaultNickname);
  const [nicknameError, setNicknameError] = useState('');

  const canGoNext = () => {
    if (step === 1) {
      return nickname.trim().length >= 2;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && nickname.trim().length < 2) {
      setNicknameError('El nickname debe tener al menos 2 caracteres');
      return;
    }
    setNicknameError('');
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(nickname.trim());
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-8xl opacity-10 rotate-12">🍺</div>
        <div className="absolute bottom-20 right-10 text-7xl opacity-10 -rotate-12">🗺️</div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-10 rotate-6">⚔️</div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-amber-400' : i < step ? 'w-2 bg-amber-500' : 'w-2 bg-amber-700'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Step content */}
          <div className="p-8 min-h-[380px] flex flex-col">
            {step === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-7xl mb-6">🍻</div>
                <h1 className="text-3xl font-bold text-slate-800 mb-3">Bienvenido a Cerves</h1>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Tu diario cervecero personal. Registra las cervezas que pruebas,
                  descubre bares y comparte con otros cerveceros.
                </p>
                <p className="text-amber-600 font-semibold mt-6 text-sm">
                  Te guiamos en 4 pasos rápidos
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-6">🏷️</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Elige tu Nickname</h2>
                <p className="text-slate-500 mb-6">
                  Este nombre se mostrará públicamente cuando compartas tus cervezas en La Taberna.
                  No se verá tu correo.
                </p>
                <div className="w-full max-w-xs">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setNicknameError('');
                    }}
                    placeholder="Ej: CerveceroMadrid"
                    maxLength={20}
                    className={`w-full text-center text-xl font-semibold px-4 py-4 rounded-xl border-2 transition-colors outline-none ${
                      nicknameError
                        ? 'border-red-400 bg-red-50 focus:border-red-500'
                        : 'border-amber-300 bg-amber-50 focus:border-amber-500'
                    }`}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                  />
                  {nicknameError && (
                    <p className="text-red-500 text-sm mt-2">{nicknameError}</p>
                  )}
                  <p className="text-slate-400 text-xs mt-2">{nickname.length}/20 caracteres</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin size={40} className="text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">El Mapa</h2>
                <p className="text-slate-500 mb-4 leading-relaxed">
                  Explora bares cerveceros cerca de ti. El mapa marca tu ubicación en tiempo real.
                </p>
                <div className="bg-amber-50 rounded-xl p-4 text-left space-y-3 w-full">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 font-bold mt-0.5">📍</span>
                    <p className="text-slate-600 text-sm">Tu punto azul muestra dónde estás</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 font-bold mt-0.5">👆👆</span>
                    <p className="text-slate-600 text-sm">Doble tap en el mapa para añadir una cerveza en cualquier sitio</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 font-bold mt-0.5">🍺</span>
                    <p className="text-slate-600 text-sm">Pulsa "Cerveza aquí" para registrar donde estás ahora</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <Beer size={40} className="text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Registra tu Cerveza</h2>
                <p className="text-slate-500 mb-4 leading-relaxed">
                  Cada cerveza que pruebes, apúntala. Nombre, estilo, puntuación, precio, notas…
                </p>
                <div className="bg-amber-50 rounded-xl p-4 text-left space-y-3 w-full">
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 font-bold mt-0.5">⭐</span>
                    <p className="text-slate-600 text-sm">Puntúa de 1 a 5 estrellas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 font-bold mt-0.5">📝</span>
                    <p className="text-slate-600 text-sm">Añade notas, etiquetas y fotos</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-500 font-bold mt-0.5">🌍</span>
                    <p className="text-slate-600 text-sm">Elige si compartirla públicamente o guardarla solo para ti</p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="flex gap-4 mb-6">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Users size={32} className="text-amber-600" />
                  </div>
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <User size={32} className="text-orange-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">La Taberna & tu Perfil</h2>
                <p className="text-slate-500 mb-4 leading-relaxed">
                  Dos mundos cerveceros te esperan:
                </p>
                <div className="space-y-4 w-full">
                  <div className="bg-amber-50 rounded-xl p-4 text-left">
                    <p className="font-bold text-amber-700 mb-1">⚔️ La Taberna</p>
                    <p className="text-slate-600 text-sm">
                      El gran salón donde todos comparten. Ve las cervezas públicas de otros cerveceros,
                      sigue a los que más te molen y descubre nuevas birras.
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-left">
                    <p className="font-bold text-orange-700 mb-1">📖 Tu Perfil</p>
                    <p className="text-slate-600 text-sm">
                      Tu biblia cervecera personal. Todas tus cervezas, favoritas, logros y listas.
                      Tú decides qué es público y qué queda solo para ti.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="px-8 pb-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium transition-colors"
              >
                <ChevronLeft size={18} />
                Atrás
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                canGoNext()
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl'
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              {step === STEPS.length - 1 ? (
                <>
                  <Check size={20} />
                  ¡A por birras!
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
