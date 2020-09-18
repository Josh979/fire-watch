<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-red-800 p-6 shadow-md">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight"><font-awesome-icon icon="fire" /> California Fire Watch</span>
      </div>
    </nav>

    <div class="container mx-auto mt-5 " v-if="filteredFires">
      <div class="flex justify-center  md:justify-end justify">
        <div class="ml-2">
          <label class="block text-sm">Sort By</label>
          <select class="px-3 py-2 rounded shadow-sm text-gray-900 bg-white border-solid border-2 border-gray-300" v-model="filter">
            <option value="Name">Name</option>
            <option value="AcresBurned">Acres Burned</option>
            <option value="PercentContained">Percent Contained</option>
          </select>
        </div>
        <div class="ml-2">
          <label class="block text-sm">Order</label>
          <select class="px-3 py-2 rounded shadow-sm text-gray-900 bg-white border-solid border-2 border-gray-300" v-model="ascending">
            <option :value="1">Ascending</option>
            <option :value="0">Descending</option>
          </select>
        </div>
      </div>


      <div
        v-for="(fire,index) in filteredFires"
        v-if="fire.AcresBurned > 0"
        :key="index"
        class=" flex rounded overflow-hidden shadow-md my-5 bg-white"
      >
        <div class="px-6 py-4 flex-1">
          <div class="font-bold text-lg pb-0 mb-0">{{ fire.Name }}</div>
          <div class="mb-2 text-gray-700">
            <small>Last Updated {{ $moment(fire.Updated).format('LT on MM/DD/YYYY') }} | <a rel="noopener" :title="`More information on the ${fire.Name}` " class="text-red-900 text-sm underline" :href="fire.Url" target="_blank">More Info</a></small>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="mb-2">
                <span class="block font-bold">Acres Burned:</span>
                <font-awesome-icon icon="tree" /> {{ numberWithCommas(fire.AcresBurned) }}
              </div>
              <div class="mb-2">
                <span class="block font-bold">County:</span>
                <font-awesome-icon icon="map-marker-alt" /> {{ fire.County }}
              </div>
            </div>
            <div class="col-span-2">
              <div class="relative pt-1">
                <div class="flex mb-0 items-center justify-end">
                  <div class="text-right">
                <span class="text-sm inline-block">
                  {{ fire.PercentContained }}% Containment
                </span>
                  </div>
                </div>
                <div class="overflow-hidden h-3 mb-0 text-xs flex rounded bg-red-700">
                  <div :style="'width:'+fire.PercentContained+'%'" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
              </div>

            </div>
          </div>
          <!--          <p>{{fire}}</p>-->


          <div class="my-2">

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: function () {
    return {
      fires: null,
      filter: 'Name',
      ascending: 1
    }
  },
  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    async fetchFires() {
      try {
        const resp = await this.$axios.get('/api/');
        this.fires = resp.data;
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
      if (this.fires !== null){
        return this.fires.sort((a,b) => {
          let order = 1;
          if (a[this.filter] > b[this.filter]){
            order = 1;
          } else if (a[this.filter] < b[this.filter]){
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
</style>
