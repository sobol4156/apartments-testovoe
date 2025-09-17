<script setup lang="ts">
import IconClose from "~/shared/icons/IconClose.vue";
import VueSlider from "vue-3-slider-component";
import { useApartmentsStore } from "~/entities/apartment/model/store";
import { debounce } from "~/shared/lib/debounce";

const apartmentsStore = useApartmentsStore();
const { filters, rooms } = storeToRefs(apartmentsStore);

// Debounced функции для обновления фильтров
const debouncedPriceUpdate = debounce((newRange: number[]) => {
    apartmentsStore.setPriceRange([newRange[0], newRange[1]]);
}, 300);

const debouncedSquareUpdate = debounce((newRange: number[]) => {
    apartmentsStore.setSquareRange([newRange[0], newRange[1]]);
}, 300);

// Обработчики изменения слайдеров
const handlePriceChange = (newRange: [number, number]) => {
    filters.value.priceRange = newRange;
    debouncedPriceUpdate(newRange);
};

const handleSquareChange = (newRange: [number, number]) => {
    filters.value.squareRange = newRange;
    debouncedSquareUpdate(newRange);
};

const handleRoomClick = (room: any) => {
    if (room.disabled) return;

    room.active = !room.active;

    rooms.value.forEach((r) => {
        if (r.value !== room.value) {
            r.active = false;
        }
    });

    // Обновляем фильтр в store
    const activeRooms = rooms.value.filter((r) => r.active).map((r) => r.value);
    apartmentsStore.setRoomsFilter(activeRooms);
};

const handleReset = () => {
    // Сбрасываем комнаты
    apartmentsStore.resetRomms();
    // Сбрасываем все фильтры в store
    apartmentsStore.resetFilters();
};
</script>

<template>
    <div class="apartments-side-filter">
        <div class="apartments-side-filter__rooms">
            <div class="apartments-side-filter__room" :class="{ active: room.active, disabled: room.disabled }"
                v-for="room in rooms" :key="room.value" @click="handleRoomClick(room)">
                <span>{{ room.name }}</span>
            </div>
        </div>

        <div class="apartments-side-filter__price">
            <p class="title">Стоимость квартиры, ₽</p>

            <div class="description">
                <p>
                    от <b>{{ filters.priceRange[0].toLocaleString("ru-RU") }}</b>
                </p>
                <p>
                    до <b>{{ filters.priceRange[1].toLocaleString("ru-RU") }}</b>
                </p>
            </div>

            <div class="range">
                <VueSlider :model-value="filters.priceRange" @update:model-value="handlePriceChange" :min="5500000"
                    :max="18900000" :step="100000" />
            </div>
        </div>

        <div class="apartments-side-filter__square">
            <p class="title">Площадь квартиры, м²</p>

            <div class="description">
                <p>
                    от <b>{{ filters.squareRange[0] }}</b>
                </p>
                <p>
                    до <b>{{ filters.squareRange[1] }}</b>
                </p>
            </div>

            <div class="range">
                <VueSlider :model-value="filters.squareRange" @update:model-value="handleSquareChange" :min="33"
                    :max="123" :step="1" />
            </div>
        </div>

        <div class="apartments-side-filter__reset" @click="handleReset">
            Сбросить параметры

            <IconClose />
        </div>
    </div>
</template>

<style lang="scss">
.apartments-side-filter {
    min-width: 399px;
    height: 372px;
    background: $color-main-gradient;
    border-radius: 10px;
    overflow: hidden;
    padding: 40px;

    @media screen and ($media-tablet) {
        min-width: 318px;
        height: 318px;
        padding: 20px 19px;
    }

    &__reset {
        margin-top: 24px;
        cursor: pointer;
        transition: $transition-base;
        padding: 0 16px;
        font-size: 13px;
        display: flex;
        gap: 8px;
        align-items: center;
        font: $text-p2-regular;
        user-select: none;

        @media screen and ($media-tablet) {
            font-size: 13px;
        }

        &:hover {
            opacity: 0.6;
        }
    }

    &__rooms {
        display: flex;
        gap: 16px;
    }

    &__room {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: $transition-base;
        user-select: none;

        &:hover {
            opacity: 0.6;
            cursor: pointer;
        }

        &.active {
            box-shadow: 0px 6px 20px 0px rgba(149, 208, 161, 1);
            background-color: $color-main-dark;
            color: rgba(255, 255, 255, 1);
        }

        &.disabled {
            color: $color-main-font-medium;
            cursor: not-allowed;

            &:hover {
                opacity: 1;
            }
        }
    }

    &__square,
    &__price {
        margin-top: 24px;

        .title {
            font: $text-p3-regular;

            @media screen and ($media-tablet) {
                font-size: 13px;
                line-height: 18px;
            }
        }

        .description {
            display: flex;
            font: $text-p2-regular;
            margin-top: 8px;

            @media screen and ($media-tablet) {
                font-size: 12px;
                margin-top: 4px;
            }

            p {
                color: $color-main-font-medium;
                width: 50%;

                b {
                    color: $color-main-font;
                    font: $text-p2-medium;
                    margin-left: 8px;

                    @media screen and ($media-tablet) {
                        font-size: 14px;
                    }
                }
            }
        }

        .range {
            margin-top: 4px;
        }
    }

    .vue-slider {
        &-process {
            background-color: $color-main-dark;
        }

        &-dot-handle {
            background-color: $color-main-dark;
            box-shadow: none;
        }

        &-dot-tooltip-inner {
            display: none;
        }
    }
}
</style>
