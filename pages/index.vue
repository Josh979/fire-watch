<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap nav-color p-4 md:p-6 shadow-lg">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight"><font-awesome-icon icon="fire" class=""/> California Fire Watch</span>
      </div>
      <div @click="reloadFires">
        <font-awesome-icon :icon="reloadIcon" class="text-white"/>
      </div>
    </nav>

    <div v-if="updateAvailable" class="fixed bottom-0 w-full mx-auto">
      <div class="flex justify-between rounded overflow-hidden px-5 py-2 bg-gray-200 shadow-inner">
        <div class="self-center font-semibold py-3 text-gray-700 text-lg">
          <span>Update Available</span>
        </div>
        <div class="self-center">
          <button @click="updateApp" class="bg-red-800 hover:bg-red-700 focus:bg-red-700 px-4 py-2 rounded text-white shadow-md border-red-900">Refresh</button>
        </div>
      </div>
    </div>

    <div class="container mx-auto mt-4">
      <div class="flex justify-center sm:justify-end justify">
        <div class=" gap-2 flex flex-col sm:flex-row w-full sm:w-auto">
          <div class="px-5 sm:px-0">
            <label for="filter" class="block text-sm">Sort By</label>
            <select id="filter" class="px-3 py-2 rounded shadow-sm text-gray-900 bg-white border-solid border-2 border-gray-300 w-full" v-model="filter">
              <option value="IncidentName">Name</option>
              <option value="TotalAcres">Acres Burned</option>
              <option value="PercentContained">Percent Contained</option>
              <option value="ModifiedOnDateTime">Last Updated</option>
              <option value="FireDiscoveryDateTime">Start Date</option>
            </select>
          </div>
          <div class="px-5 sm:px-0">
            <label for="order" class="block text-sm">Order</label>
            <select id="order" class="px-3 py-2 rounded shadow-sm text-gray-900 bg-white border-solid border-2 border-gray-300 w-full" v-model="ascending">
              <option :value="1">Ascending</option>
              <option :value="0">Descending</option>
            </select>
          </div>

        </div>
      </div>
      <template v-if="filteredFires" >
        <div
          v-for="(fire,index) in filteredFires"
          v-if="fire.TotalAcres > 1 && fire.PercentPerimeterToBeContained === 100"
          :key="index"
        >
          <FireListItem :fire="fire"></FireListItem>
        </div>
      </template>
      <template v-else>
        <div class="p-5 text-center">Loading Fire Data...</div>
      </template>

    </div>
    <div v-if="updateTime" class="text-gray-700 text-center text-sm mb-1">Data retrieved on {{updateTime}}</div>



    <nav class="flex items-center justify-center flex-wrap nav-color py-3 px-6 ">
      <div class="text-white mr-6 text-center">
        <small>&copy; Josh Mielke | v{{appVersion}}</small>
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
  },
  data: function () {
    return {
      fires: null,
      reloadIcon: 'sync',
      filter: 'IncidentName',
      ascending: 1,
      updateTime: null,
      updateAvailable: false,
    }
  },
  methods: {
    async checkForUpdate(){
      if (process.browser){
        const workbox = await window.$workbox;
        if (workbox) {
          workbox.addEventListener('installed', (event) => {
            if (event.isUpdate) {
              this.updateAvailable = true;
              // whatever you want to do to let the user know there's an update available
            }
          });
        }
      }
    },
    updateApp(){
      window.location.reload();
    },
    async reloadFires() {
      await this.fetchFires();
    },
    async fetchFires() {
      try {
        // this.reloadIcon = 'tree';
        const resp = await this.$axios.get('/api/');
        this.fires = resp.data.features;
        this.updateTime = this.$moment().format('MM/DD/YY \\at LT');
        // this.reloadIcon = 'sync';

      } catch (err) {
        // Handle Error Here
      }
    },
  },
  async created() {
    await this.fetchFires();
    await this.checkForUpdate();
  },
  computed: {
    appVersion(){
      return process.env.APP_VERSION;
    },
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
