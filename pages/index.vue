<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap nav-color p-4 md:p-6 shadow-lg">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight"><font-awesome-icon icon="fire" class=""/> California Fire Watch</span>
      </div>
      <div @click="reloadFires">
        <font-awesome-icon :icon="reloadIcon" class="text-white text-lg"/>
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
        <div class=" gap-2 flex flex-row  w-full sm:w-auto">
          <div class="px-5 sm:px-0 w-1/2">
            <label for="filter" class="block text-sm">Sort By</label>
            <div class="inline-block relative w-full">
              <select v-model="filter" id="filter" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-3 py-2 pr-8 rounded shadow leading-tight focus:border-red-800">
                <option value="IncidentName">Name</option>
                <option value="TotalAcres">Acres Burned</option>
                <option value="PercentContained">Percent Contained</option>
                <option value="ModifiedOnDateTime">Last Updated</option>
                <option value="FireDiscoveryDateTime">Start Date</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="px-5 sm:px-0 w-1/2">
            <label for="order" class="block text-sm">Order</label>
            <div class="inline-block relative w-full">
              <select id="order" v-model="ascending" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-3 py-2 pr-8 rounded shadow leading-tight focus:border-red-800">
                <option :value="1">Ascending</option>
                <option :value="0">Descending</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div class="md:text-left text-center pt-5 md:pt-auto" v-if="filteredFires">
          <h1 class="text-2xl font-semibold">{{filteredFires.length}} Active Fires</h1>
        </div>
      </transition>
      <transition-group name="fade" mode="out-in">
          <div
            v-if="filteredFires && !reloading"
            v-for="(fire,index) in filteredFires"
            :key="index"
          >
            <FireListItem :fire="fire"></FireListItem>
          </div>
      </transition-group>

      <div
        v-if="!filteredFires || reloading"
         class="flex rounded overflow-hidden shadow-md my-5 bg-white"
      >
        <div class="px-6 py-4 flex-1">
          <div class="p-5 text-center">
            <div class="mb-3 text-gray-800">Loading Fire Data...</div>
            <font-awesome-icon :class="reloading ? 'fa-spin' : ''" icon="circle-notch" class="text-gray-800 text-3xl"/>
          </div>
        </div>
      </div>

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
      reloading: false,
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
        this.reloading = true;

        // this.reloadIcon = 'tree';
        const resp = await this.$axios.get('/api/');
        this.fires = resp.data.features;
        this.updateTime = this.$moment().format('MM/DD/YY \\at LT');
        // this.reloadIcon = 'sync';
        this.reloading = false;


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
          if (fire.attributes.TotalAcres > 1 && fire.attributes.PercentPerimeterToBeContained === 100){
            fireData.push(fire.attributes)
          }
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
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.5s;
}
</style>
