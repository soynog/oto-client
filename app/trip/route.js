import Ember from 'ember';

export default Ember.Route.extend({
  auth: Ember.inject.service(),
  user: Ember.computed.alias('auth.credentials.email'),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

  flashMessages: Ember.inject.service(),

  model (params) {
    return this.get('store').findRecord('trip', params.trip_id);
  },
  actions: {
    updateTrip (data) {
      console.log("Authenticated?",this.get('isAuthenticated'));
      let id = this.context.get('id');
      let store = this.get('store');
      console.log("Update Trip Action Fired!", data, id);
      store.findRecord('trip', id)
      .then(function(trip) {
        console.log(data);
        console.log(trip.get('name'), trip.get('description'));
        trip.set('name', data.name);
        trip.set('location', data.location);
        trip.set('description', data.description);
        return trip;
      })
      .then((trip) => trip.save())
      .catch(() => {
        this.get('flashMessages')
        .danger('Please sign in to edit a trip.');
      });
    },

    deleteTrip (trip) {
      console.log("Delete Trip Action Fired", trip);
      trip.destroyRecord()
      .then(this.transitionTo('trips'));
    }
  }
});
