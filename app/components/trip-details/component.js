import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  user: Ember.computed.alias('auth.credentials.email'),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

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
    },

    joinTrip () {
      let trip = this.get('trip');
      let userId = this.get('auth.credentials.id');
      console.log("Join Trip", trip, userId);
      this.sendAction('joinTrip', trip, userId);
    }
  },
});
