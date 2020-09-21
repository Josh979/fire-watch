<template>
  <div>
    <nav class="flex items-center justify-center md:justify-between flex-wrap bg-red-800 p-4 md:p-6 shadow-md">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <span class="font-semibold text-xl tracking-tight"><font-awesome-icon icon="fire" class="" /> California Fire Watch</span>
      </div>
    </nav>

    <div class="container mx-auto mt-5 " v-if="filteredFires">
      <div class="flex justify-center sm:justify-end justify">
        <div class=" gap-2 flex flex-col sm:flex-row w-full sm:w-auto">
          <div class="px-5 sm:px-0">
            <label class="block text-sm">Sort By</label>
            <select class="px-3 py-2 rounded shadow-sm text-gray-900 bg-white border-solid border-2 border-gray-300 w-full" v-model="filter">
              <option value="Name">Name</option>
              <option value="AcresBurned">Acres Burned</option>
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
        v-if="fire.AcresBurned > 0"
        :key="index"
      >
        <FireListItem :fire="fire" ></FireListItem>
      </div>

    </div>
    <nav class="flex items-center md:justify-start justify-center flex-wrap bg-red-800 py-3 px-6 shadow-md">
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
  components:{
    FireListItem
  },
  data: function () {
    return {
      fires: null,
      filter: 'Name',
      ascending: 1
    }
  },
  methods: {
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
