import type { apartmentsItem } from "../types";
import { getApartments } from "../api";

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "square_asc"
  | "square_desc"
  | "floor_asc"
  | "floor_desc"
  | "default";

export interface FilterState {
  rooms: number[];
  priceRange: [number, number];
  squareRange: [number, number];
}

export const useApartmentsStore = defineStore("apartments", () => {
  const allApartments = ref<apartmentsItem[]>([]);
  const displayedApartments = ref<apartmentsItem[]>([]);
  const sortedApartments = ref<apartmentsItem[]>([]);
  const filteredApartments = ref<apartmentsItem[]>([]);
  const currentPage = ref(1);
  const itemsPerPage = ref(5);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const sortBy = ref<SortOption>("default");
  const hasInitialized = ref(false);

  const rooms = reactive([
    {
      name: "1к",
      value: 1,
      active: false,
      disabled: false,
    },
    {
      name: "2к",
      value: 2,
      active: true,
      disabled: false,
    },
    {
      name: "3к",
      value: 3,
      active: false,
      disabled: false,
    },
    {
      name: "4к",
      value: 4,
      active: false,
      disabled: true,
    },
  ]);

  const filters = ref<FilterState>({
    rooms: [],
    priceRange: [5500000, 18900000],
    squareRange: [33, 123],
  });

const initPersistedState = () => {
  const saved = localStorage.getItem("apartments-filters");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      filters.value = parsed.filters ?? filters.value;
      sortBy.value = parsed.sortBy ?? "default";

      rooms.forEach((r) => {
        r.active = filters.value.rooms.includes(r.value);
      });
    } catch (e) {
      console.warn("Ошибка восстановления фильтров:", e);
    }
  }
};


  const hasMoreItems = computed(() => {
    return displayedApartments.value.length < filteredApartments.value.length;
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredApartments.value.length / itemsPerPage.value);
  });

  const isEmpty = computed(() => {
    return (
      hasInitialized.value &&
      !isLoading.value &&
      allApartments.value.length > 0 &&
      filteredApartments.value.length === 0
    );
  });

  const hasNoData = computed(() => {
    return !isLoading.value && allApartments.value.length === 0;
  });

  // Автосохранение фильтров при изменении
  const saveFilters = () => {
    localStorage.setItem(
      "apartments-filters",
      JSON.stringify({ filters: filters.value, sortBy: sortBy.value })
    );
  };

  const sortMapper: Record<
    SortOption,
    (a: apartmentsItem, b: apartmentsItem) => number
  > = {
    default: () => 0,
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    square_asc: (a, b) => a.square - b.square,
    square_desc: (a, b) => b.square - a.square,
    floor_asc: (a, b) => a.floor - b.floor,
    floor_desc: (a, b) => b.floor - a.floor,
  };

  const filterApartments = (apartments: apartmentsItem[]): apartmentsItem[] => {
    return apartments.filter((apartment) => {
      if (filters.value.rooms.length > 0) {
        const roomsCount = parseInt(
          apartment.title.match(/(\d+)-комнатная/)?.[1] || "0"
        );
        if (!filters.value.rooms.includes(roomsCount)) {
          return false;
        }
      }

      if (
        apartment.price < filters.value.priceRange[0] ||
        apartment.price > filters.value.priceRange[1]
      ) {
        return false;
      }

      if (
        apartment.square < filters.value.squareRange[0] ||
        apartment.square > filters.value.squareRange[1]
      ) {
        return false;
      }

      return true;
    });
  };

  const sortApartments = (
    apartments: apartmentsItem[],
    sortOption: SortOption
  ): apartmentsItem[] => {
    if (sortOption === "default") return [...apartments];

    const sortFn = sortMapper[sortOption];
    return [...apartments].sort(sortFn);
  };

  const applyFiltersAndSort = () => {
    if (allApartments.value.length === 0) return;

    const filtered = filterApartments(allApartments.value);
    const sorted = sortApartments(filtered, sortBy.value);

    filteredApartments.value = sorted;
    currentPage.value = 1;
    displayedApartments.value = filteredApartments.value.slice(
      0,
      itemsPerPage.value
    );
  };

  const fetchApartments = async () => {
    if (allApartments.value.length > 0) return;

    isLoading.value = true;
    error.value = null;

    try {
      const data = await getApartments();
      allApartments.value = data;
      hasInitialized.value = true;
      initPersistedState();
      applyFiltersAndSort();
    } catch (err) {
      error.value = err as Error;
      console.error("Error fetching apartments:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMoreItems.value || isLoading.value) return;

    isLoading.value = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    currentPage.value++;
    const startIndex = 0;
    const endIndex = currentPage.value * itemsPerPage.value;

    displayedApartments.value = filteredApartments.value.slice(
      startIndex,
      endIndex
    );
    isLoading.value = false;
  };

  const setSortBy = (newSortBy: SortOption) => {
    sortBy.value = newSortBy;
    applyFiltersAndSort();
    saveFilters();
  };

  const setRoomsFilter = (rooms: number[]) => {
    filters.value.rooms = rooms;
    applyFiltersAndSort();
    saveFilters();
  };

  const resetRomms = () => {
    rooms.forEach((room) => (room.active = false));
  };

  const setPriceRange = (range: [number, number]) => {
    filters.value.priceRange = range;
    applyFiltersAndSort();
    saveFilters();
  };

  const setSquareRange = (range: [number, number]) => {
    filters.value.squareRange = range;
    applyFiltersAndSort();
    saveFilters();
  };

  const resetFilters = () => {
    filters.value = {
      rooms: [],
      priceRange: [5500000, 18900000],
      squareRange: [33, 123],
    };
    sortBy.value = "default";
    applyFiltersAndSort();
    saveFilters();
  };

  const reset = () => {
    allApartments.value = [];
    displayedApartments.value = [];
    sortedApartments.value = [];
    filteredApartments.value = [];
    currentPage.value = 1;
    isLoading.value = false;
    error.value = null;
    sortBy.value = "default";
    hasInitialized.value = false;
    filters.value = {
      rooms: [],
      priceRange: [5500000, 18900000],
      squareRange: [33, 123],
    };
    saveFilters();
  };

  return {
    allApartments,
    displayedApartments,
    sortedApartments,
    filteredApartments,
    currentPage,
    itemsPerPage,
    isLoading,
    error,
    rooms,
    sortBy,
    filters,
    hasInitialized,
    hasMoreItems,
    totalPages,
    isEmpty,
    hasNoData,
    fetchApartments,
    resetRomms,
    loadMore,
    setSortBy,
    setRoomsFilter,
    setPriceRange,
    setSquareRange,
    resetFilters,
    reset,
  };
});
