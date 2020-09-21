<template>
  <div class="flex rounded overflow-hidden shadow-md my-5 bg-white">
    <div class="px-6 py-4 flex-1">
      <div class="font-bold text-xl pb-0 mb-0">{{ fire.Name }}</div>
      <div class="mb-2 text-gray-700">
        <small><font-awesome-icon icon="map-marker-alt" /> {{ fire.County }} | Last Updated {{ $moment(fire.Updated).format('LT on MM/DD/YYYY') }} | <a rel="noopener" :title="`More information on the ${fire.Name}` " class="text-red-900 text-sm underline" :href="fire.Url" target="_blank">More Info</a></small>
      </div>
      <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
        <div class="col-span-2 sm:col-span-2">
          <div class="mb-2 text-center">
            <span class="block font-bold">Acres Burned:</span>
            <span class="text-2xl">
              <font-awesome-icon class="text-green-700" icon="tree" /> <span class="font-semibold">{{ numberWithCommas(fire.AcresBurned) }}</span>
            </span>
          </div>
        </div>
        <div class="col-span-2 sm:col-span-2">
          <div class="mb-2 text-center">
            <span class="block font-bold">Containment:</span>
            <span class="text-2xl">
              <font-awesome-icon class="text-red-700" icon="fire-extinguisher" /> <span class="font-semibold">{{ fire.PercentContained }}%</span>
            </span>
          </div>
        </div>
        <div class="col-span-4 md:col-span-2">
          <div class="mb-2 text-center">
            <span class="block font-bold">Time Active:</span>
            <span class="text-2xl">
              <font-awesome-icon class="text-red-700" icon="calendar-alt" /> <span class="font-semibold">{{ this.daysActive }} Days</span>
            </span>
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
