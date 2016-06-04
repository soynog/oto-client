import Ember from 'ember';

export default Ember.Component.extend({
  form: {},

  actions: {
    submit () {
      let data = { trip: {} };
      data.trip.name = this.$('span.trip-name').text();
      data.trip.location = this.$('span.trip-location').text();
      data.trip.description = this.$('span.trip-description').text();
      console.log("Trip Update Form Submitted", data);
    }
  }
});
