import HeroCarousel from './HeroCarousel';

export default function CategoriesView({
  filteredCategories = [],
  setSelectedCategoryId,
  setSelectedCategoryName,
  setView,
  setSearchQuery,
  discountSettings
}) {
  const handleSelectCategory = (cat) => {
    setSelectedCategoryId(cat.id);
    setSelectedCategoryName(cat.name);
    if (setSearchQuery) setSearchQuery('');

    if (cat.name && cat.name.toLowerCase().includes('personalizada')) {
      setView('custom-cake');
    } else {
      setView('products');
    }
  };

  return (
    <main className="flex-1 p-4 max-w-2xl mx-auto w-full pb-24 animate-fadeIn">
      <HeroCarousel discountSettings={discountSettings} />

      <div id="seccion-categorias" className="scroll-mt-24 pt-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E91E63] text-center tracking-wide">
          Categorías
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelectCategory(cat)}
            className="group w-full h-32 sm:h-36 rounded-2xl overflow-hidden relative flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-all duration-200 border border-pink-100"
          >
            <img
              src={cat.image || cat.image_url}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover blur-[1.5px] scale-105 group-hover:scale-115 transition-transform duration-500 ease-out"
            />

            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute inset-0 bg-[#E91E63]/25 mix-blend-multiply" />

            <span className=" categ-nombre relative z-10 text-xl sm:text-2xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] px-3 text-center transition-transform duration-300 group-hover:scale-105">
              {cat.name}
            </span>
          </button>
        ))}

        {filteredCategories.length === 0 && (
          <p className="text-gray-400 text-xs text-center col-span-full py-8">
            No se encontraron categorías disponibles.
          </p>
        )}
      </div>
    </main>
  );
}