import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  status: attr('string'),
  user: belongsTo('user'),
  trip: belongsTo('trip'),
  userInit: Ember.computed('user.initial', function() {
    return this.get('user.initial');
  }),
});
