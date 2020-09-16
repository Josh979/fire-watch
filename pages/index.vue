<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-red-800 p-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight">California Fire Watch</span>
      </div>
      <div class="block lg:hidden">
        <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
          </svg>
        </button>
      </div>
    </nav>

    <div class="container mx-auto mt-5 ">
      <div
        v-for="(fire,index) in fires"
        v-if="fire.AcresBurned > 0"
        :key="index"
        class=" flex rounded overflow-hidden shadow-md my-5 bg-white"
      >
        <div class="px-6 py-4">
          <div class="font-bold text-lg pb-0 mb-0">{{ fire.Name }}</div>
          <div class="mb-2 text-gray-600">
            <small>Last Updated {{ fire.Updated }}</small>
          </div>
          <p>Acres Burned: {{ numberWithCommas(fire.AcresBurned) }}</p>
          <p>County: {{ fire.County }}</p>
          <p>Containment: {{ fire.PercentContained }}%</p>
<!--          <p>{{fire}}</p>-->
          <p>
            <a class="text-red-800" :href="fire.Url" target="_blank">More Information</a>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data: function () {
    return {
      fires: null
    }
  },
  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async fetchFires() {
      try {
        const resp = await axios.get('/api/List?inactive=false');
        this.fires = resp.data;
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
    },
  },
  async created() {
    this.fetchFires();
  }

}
</script>

<style>

</style>
