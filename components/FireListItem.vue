<template>
  <div class="flex rounded overflow-hidden shadow-md my-5 bg-white">
    <div class="px-6 py-4 flex-1">
      <div class="font-bold text-xl pb-0 mb-0">{{ fire.IncidentName }}</div>
      <div class="mb-2 text-gray-700">
        <small><font-awesome-icon icon="map-marker-alt" /> {{ fire.POOCounty }} | Updated {{ $moment(fire.ModifiedOnDateTime).format('LT on MM/DD/YYYY') }}</small>
      </div>
      <div class="grid grid-cols-8 sm:grid-cols-6 md:grid-cols-8 gap-4">
        <div class="col-span-4 sm:col-span-2">
          <div class="flex justify-start sm:justify-center ">
            <div class="text-5xl">
              <font-awesome-icon size="sm" class="text-green-700" fixed-width icon="tree" />
            </div>
            <div class="text-left ml-2 align-center flex flex-col justify-center">
              <div class="block text-gray-700">Acres Burned</div>
              <div class="font-semibold">{{numberWithCommas(fire.TotalAcres.toFixed(0)) || 0}}</div>
            </div>
          </div>
        </div>
        <div class="col-span-4 sm:col-span-2">
          <div class="flex justify-start sm:justify-center ">
            <div class="text-5xl">
              <font-awesome-icon size="sm" class="text-red-700" fixed-width icon="fire-extinguisher" />
            </div>
            <div class="text-left ml-2 align-center flex flex-col justify-center">
              <div class="block text-gray-700">Contained</div>
              <div class="font-semibold">{{ fire.PercentContained || 0 }}%</div>
            </div>
          </div>
        </div>
        <div v-if="fire.TotalIncidentPersonnel" class="col-span-4 sm:col-span-2">
          <div class="flex justify-start sm:justify-center ">
            <div class="text-5xl">
              <font-awesome-icon size="sm" class="text-orange-700" fixed-width icon="users" />
            </div>
            <div class="text-left ml-2 align-center flex flex-col justify-center">
              <div class="block text-gray-700">Personnel</div>
              <div class="font-semibold">{{ numberWithCommas(fire.TotalIncidentPersonnel) }}</div>
            </div>
          </div>
        </div>
        <div class="col-span-4 sm:col-span-2">
          <div class="flex justify-start sm:justify-center ">
            <div class="text-5xl">
              <font-awesome-icon size="sm" class="text-gray-700" fixed-width icon="calendar-alt" />
            </div>
            <div class="text-left ml-2 align-center flex flex-col justify-center">
              <div class="block text-gray-700">Time Active</div>
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
    numberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed:{
    daysActive(){
      const end = this.$props.fire.FireOutDateTime ? this.$moment(this.$props.fire.FireOutDateTime) : this.$moment();
      const start = this.$moment(this.$props.fire.CreatedOnDateTime);

      return end.diff(start, 'days')

    }
  },
  async created() {},

}

</script>
