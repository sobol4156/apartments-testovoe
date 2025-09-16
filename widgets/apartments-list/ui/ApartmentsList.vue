
<script setup lang="ts">
import { type apartmentsItem } from '~/entities/apartment/types';
import { getImage } from '~/shared/lib/get-image';

const props = defineProps<{
  items: apartmentsItem[];
}>();

const formatSquare = (square: number) => {
  return square.toLocaleString("ru-RU");
};

const formatPrice = (price: number) => {
  return price.toLocaleString("ru-RU");
};
</script>

<template>
  <div class="apartments-list">
    <div class="apartments-item" v-for="item in props.items" :key="item.id">
      <div class="apartments-item__image">
        <img :src="getImage(item.image)" alt="item.title" />
      </div>

      <div class="apartments-item__content">
        <h3 class="apartments-item__title">{{ item.title }}</h3>

        <p class="apartments-item__square">
          {{ formatSquare(item.square) }}

          <span>м²</span>
        </p>

        <p class="apartments-item__floor">
          {{ item.floor }}

          <span>
            из 17

            <sub>этаж</sub>
          </span>
        </p>

        <p class="apartments-item__price">
          {{ formatPrice(item.price) }}

          <span>₽</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.apartments-list {
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and ($media-tablet) {
    gap: 4px;
  }
}

.apartments-item {
  display: flex;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 16px 0 24px;
  gap: 20px;
  max-height: 120px;
  cursor: pointer;
  transition: $transition-base;

  &:hover {
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.6);
  }

  @media screen and ($media-tablet) {
    box-shadow: none;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    flex-direction: row-reverse;
    padding: 16px 24px;
    max-height: 112px;
  }

  &__image {
    width: 80px;
    min-width: 80px;
    height: 80px;
    user-select: none;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    display: flex;
    gap: 20px;
    font: $text-p;
    width: 100%;

    @media screen and ($media-tablet) {
      gap: 0 20px;
      flex-wrap: wrap;
      font-size: 14px;
    }
  }

  &__title {
    max-width: 281px;
    width: 100%;
    font: $text-p2-medium;

    @media screen and ($media-tablet) {
      max-width: 100%;
      font-size: 14px;
      line-height: 14px;
    }
  }

  &__square {
    width: 120px;
    display: flex;

    span {
      display: none;

      @media screen and ($media-tablet) {
        display: block;
      }
    }

    @media screen and ($media-tablet) {
      width: 43px;
    }
  }

  &__floor {
    width: 120px;
    display: flex;
    gap: 4px;

    span {
      color: $color-main-font-medium;
      display: flex;
      gap: 8px;

      sub {
        display: none;

        @media screen and ($media-tablet) {
          display: block;
        }
      }
    }

    @media screen and ($media-tablet) {
      width: auto;
    }
  }

  &__price {
    width: 120px;
    display: flex;
    margin-left: auto;
    gap: 4px;

    span {
      display: none;

      @media screen and ($media-tablet) {
        display: block;
      }
    }

    @media screen and ($media-tablet) {
      width: auto;
      margin-left: initial;
    }
  }
}
</style>
