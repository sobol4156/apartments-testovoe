<script setup lang="ts">
import Button from "~/shared/ui/button/Button.vue";
import Loading from "~/shared/ui/loading/Loading.vue";
import IconError from "~/shared/icons/IconError.vue";
import EmptyState from "~/shared/ui/empty-state/EmptyState.vue";
import ApartmentFilter from "~/features/apartment-filters/ui/ApartmentFilter.vue";
import { useApartmentsStore } from "~/entities/apartment/model/store";
import ApartmentsList from "~/widgets/apartments-list/ui/ApartmentsList.vue";
import ApartmentsTopFilter from "~/widgets/apartments-top-filter/ui/ApartmentsTopFilter.vue";

const apartmentsStore = useApartmentsStore();

const resetFilters = () => {
    apartmentsStore.resetFilters();
    apartmentsStore.resetRomms();
}

onMounted(() => {
    apartmentsStore.fetchApartments();
});
</script>

<template>
    <div class="home">
        <div class="home__container">
            <div class="home__content">
                <h1>Квартиры</h1>

                <ApartmentsTopFilter />

                <ApartmentsList v-if="
                    !apartmentsStore.isEmpty &&
                    !apartmentsStore.hasNoData &&
                    !apartmentsStore.error
                " :items="apartmentsStore.displayedApartments" />

                <div v-if="apartmentsStore.isLoading" class="home__loading">
                    <Loading />
                </div>

                <div v-if="apartmentsStore.error" class="home__error">
                    <IconError />
                    <p>Произошла ошибка при загрузке квартир</p>
                </div>

                <EmptyState v-if="apartmentsStore.isEmpty" title="Ничего не найдено"
                    description="По заданным фильтрам квартиры не найдены. Попробуйте изменить параметры поиска.">
                    <template #action>
                        <Button @click="resetFilters">
                            Сбросить фильтры
                        </Button>
                    </template>
                </EmptyState>

                <Button v-if="apartmentsStore.hasMoreItems && !apartmentsStore.isLoading" class="home__button"
                    :loading="apartmentsStore.isLoading" @click="apartmentsStore.loadMore">
                    Загрузить еще
                </Button>
            </div>

            <ApartmentFilter />
        </div>
    </div>
</template>

<style lang="scss">
.home {
    &__container {
        display: flex;
        max-width: $wrapper;
        padding: 96px 80px;
        margin: 0 auto;
        justify-content: space-between;
        gap: 28px;

        @media screen and ($media-tablet) {
            padding: 48px 54px;
        }
    }

    &__content {
        max-width: 801px;
        width: 100%;

        h1 {
            margin-bottom: 48px;

            @media screen and ($media-tablet) {
                margin-bottom: 32px;
            }
        }
    }

    &__button {
        margin-top: 48px;
    }

    &__loading {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 48px 0;
    }

    &__error {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 48px 0;
    }
}

h1 {
    font: $text-h1;
}
</style>
