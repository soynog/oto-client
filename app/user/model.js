import DS from 'ember-data';
import { hasMany } from 'ember-data/relationships';

export default DS.Model.extend({
  email: DS.attr('string'),
  // trips: hasMany('trip'),
});
