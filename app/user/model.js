import Ember from 'ember';
import DS from 'ember-data';
import { hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  email: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  // trips: hasMany('trip'),
  invitations: hasMany('invitation'),
  initial: Ember.computed('firstName', function() {
    let name = this.get('firstName');
    if (name) {
      return name.charAt(0);
    } else {
      return 'X';
    }
  }),
});
