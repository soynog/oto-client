import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  status: attr('string'),
  // user: attr(),
  user: belongsTo('user'),
  trip: belongsTo('trip'),
});
