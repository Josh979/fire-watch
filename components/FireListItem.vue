<template>
  <div class="flex rounded overflow-hidden shadow-md my-5 bg-white">
    <div class="px-6 py-4 flex-1">
      <div class="font-bold text-xl pb-0 mb-0">{{ fire.Name }}</div>
      <div class="mb-2 text-gray-700">
        <small><font-awesome-icon icon="map-marker-alt" /> {{ fire.County }} | Last Updated {{ $moment(fire.Updated).format('LT on MM/DD/YYYY') }} | <a rel="noopener" :title="`More information on the ${fire.Name}` " class="text-red-900 text-sm underline" :href="fire.Url" target="_blank">More Info</a></small>
      </div>
      <div class="grid grid-cols-4 sm:grid-cols-6">
        <div class="col-span-4 sm:col-span-2">
          <div class="flex justify-start sm:justify-center ">
            <div class="text-5xl">
              <font-awesome-icon size="sm" class="text-green-700" fixed-width icon="tree" />
            </div>
            <div class="text-left ml-2 align-center flex flex-col justify-center">
              <div class="block text-gray-600">Acres Burned</div>
              <div class="font-semibold">{{numberWithCommas(fire.AcresBurned)}}</div>
            </div>
          </div>
        </div>
        <div class="col-span-4 sm:col-span-2">
          <div class="flex justify-start sm:justify-center ">
            <div class="text-5xl">
              <font-awesome-icon size="sm" class="text-red-700" fixed-width icon="fire-extinguisher" />
            </div>
            <div class="text-left ml-2 align-center flex flex-col justify-center">
              <div class="block text-gray-600">Contained</div>
              <div class="font-semibold">{{ fire.PercentContained }}%</div>
            </div>
          </div>
        </div>
        <div class="col-span-4 sm:col-span-2">
          <div class="flex justify-start sm:justify-center ">
            <div class="text-5xl">
              <font-awesome-icon size="sm" class="text-orange-600" fixed-width icon="calendar-alt" />
            </div>
            <div class="text-left ml-2 align-center flex flex-col justify-center">
              <div class="block text-gray-600">Time Active</div>
              <div class="font-semibold">{{ this.daysActive }} Days</div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FireListItem',
  data: function () {
    return {}
  },
  props:{
    fire: {
      type: Object,
      required: true
    }
  },
  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed:{
    daysActive(){
      const end = this.$props.fire.ExtinguishedDateOnly ? this.$moment(this.$props.fire.ExtinguishedDateOnly) : this.$moment();
      const start = this.$moment(this.$props.fire.StartedDateOnly);

      return end.diff(start, 'days')

    }
  },
  async created() {},

}

</script>
