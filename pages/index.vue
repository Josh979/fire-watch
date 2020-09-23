<template>
  <div>

    <client-only>
      <pull-to :topConfig="topConfig" :top-load-method="reloadFires">
        <nav class="flex items-center justify-center md:justify-between flex-wrap nav-color p-4 md:p-6 shadow-lg">
          <div class="flex items-center flex-shrink-0 text-white mr-6">
            <span class="font-semibold text-xl tracking-tight"><font-awesome-icon icon="fire" class=""/> California Fire Watch</span>
          </div>
        </nav>
      </pull-to>
    </client-only>


    <div class="container mx-auto mt-5 " v-if="filteredFires">
      <div class="flex justify-center sm:justify-end justify">
        <div class=" gap-2 flex flex-col sm:flex-row w-full sm:w-auto">
          <div class="px-5 sm:px-0">
            <label class="block text-sm">Sort By</label>
            <select class="px-3 py-2 rounded shadow-sm text-gray-900 bg-white border-solid border-2 border-gray-300 w-full" v-model="filter">
              <option value="IncidentName">Name</option>
              <option value="TotalAcres">Acres Burned</option>
              <option value="PercentContained">Percent Contained</option>
            </select>
          </div>
          <div class="px-5 sm:px-0">
            <label class="block text-sm">Order</label>
            <select class="px-3 py-2 rounded shadow-sm text-gray-900 bg-white border-solid border-2 border-gray-300 w-full" v-model="ascending">
              <option :value="1">Ascending</option>
              <option :value="0">Descending</option>
            </select>
          </div>

        </div>
      </div>

      <div
        v-for="(fire,index) in filteredFires"
        v-if="fire.TotalAcres > 1 && fire.PercentPerimeterToBeContained === 100"
        :key="index"
      >
        <FireListItem :fire="fire"></FireListItem>
      </div>

    </div>
    <nav class="flex items-center md:justify-start justify-center flex-wrap nav-color py-3 px-6 ">
      <div class="text-white mr-6 text-center">
        <small>&copy; Josh Mielke</small>
      </div>
    </nav>


  </div>
</template>

<script>
import FireListItem from "@/components/FireListItem";

export default {
  name: 'Home',
  components: {
    FireListItem,
    PullTo: () => import('vue-pull-to')
  },
  data: function () {
    return {
      fires: null,
      filter: 'IncidentName',
      ascending: 1,
      topConfig: {
        pullText: 'Pull Down To Refresh', // The text is displayed when you pull down
        triggerText: 'Release To Refresh', // The text that appears when the trigger distance is pulled down
        loadingText: 'Updating Data...', // The text in the load
        doneText: 'Complete!', // Load the finished text
        failText: 'Failed to Update', // Load failed text
        loadedStayTime: 750, // Time to stay after loading ms
        stayDistance: 50, // Trigger the distance after the refresh
        triggerDistance: 70 // Pull down the trigger to trigger the distance
      }
    }
  },
  methods: {
    async reloadFires(loaded) {
      await this.fetchFires();
      loaded('done');
    },
    async fetchFires() {
      try {
        const resp = await this.$axios.get('/api/');
        this.fires = resp.data.features;
      } catch (err) {
        // Handle Error Here
      }
    },
  },
  async created() {
    await this.fetchFires();
  },
  computed: {
    filteredFires() {
      if (this.fires !== null) {
        let fireData = [];
        this.fires.forEach((fire) => {
          fire.attributes.Geometry = fire.geometry;
          fire.attributes.TotalAcres = fire.attributes.DailyAcres || fire.attributes.CalculatedAcres || 0;
          fireData.push(fire.attributes)
        })
        return fireData.sort((a, b) => {
          let order = 1;
          if (a[this.filter] > b[this.filter]) {
            order = 1;
          } else if (a[this.filter] < b[this.filter]) {
            order = -1;
          }
          return order * ((this.ascending) ? 1 : -1);
        })
      }
      return null;
    }
  }

}
</script>

<style>
.nav-color {
  background: #9B1D1D;
}
</style>
