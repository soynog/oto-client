import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    submit () {
      console.log(this);
      let trip = {};
      trip.name = this.$('span.trip-name').text();
      trip.location = this.$('span.trip-location').text();
      trip.description = this.$('span.trip-description').text();
      console.log("Trip Update Form Submitted", trip);

      this.sendAction('submit', trip);
    },

    deleteTrip () {
      console.log("Delete Trip Clicked");
      let trip = this.get('trip');
      this.sendAction('deleteTrip', trip);
    }
  },
});
