import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('trip', params.trip_id);
  },
  actions: {
    updateTrip (data) {
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
      .then((trip) => trip.save());
    }
  }
});
