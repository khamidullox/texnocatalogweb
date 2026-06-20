// Статичные промо-баннеры — пока нет источника акций в Smartup,
// редактируются прямо здесь (текст/цвета/ссылка на фильтр каталога).
const BANNERS = [
  {
    title: 'Климатическая техника',
    subtitle: 'Кондиционеры, обогреватели и вентиляторы в одном каталоге',
    href: '/catalog?q=кондиционер',
    from: 'from-blue-500',
    to: 'to-cyan-400',
    emoji: '❄️',
  },
  {
    title: 'Крупная бытовая техника',
    subtitle: 'Холодильники, морозильники, стиральные машины',
    href: '/catalog?q=morozilnik',
    from: 'from-violet-500',
    to: 'to-purple-400',
    emoji: '🧊',
  },
  {
    title: 'Вся техника со склада',
    subtitle: 'Актуальные остатки по всем филиалам — каждый день',
    href: '/catalog',
    from: 'from-amber-500',
    to: 'to-orange-400',
    emoji: '🚚',
  },
];

export default function PromoBanner() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
      {BANNERS.map((b) => (
        <a
          key={b.title}
          href={b.href}
          className={`snap-start shrink-0 w-72 sm:w-80 h-32 rounded-2xl bg-gradient-to-br ${b.from} ${b.to}
                      text-white p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow`}
        >
          <span className="text-3xl">{b.emoji}</span>
          <div>
            <div className="font-bold text-sm leading-tight">{b.title}</div>
            <div className="text-[11px] opacity-90 leading-tight mt-0.5">{b.subtitle}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
