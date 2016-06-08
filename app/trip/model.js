import Model from 'ember-data/model';
import Ember from 'ember';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { belongsTo } from 'ember-data/relationships';
// const moment = require('moment');

export default Model.extend({
  name: attr('string'),
  description: attr('string'),
  startDate: attr('date'),
  endDate: attr('date'),
  location: attr('string'),
  invitations: hasMany('invitation'),
  // prettyStartDate: Ember.computed('startDate', function() {
  //   return moment(this.get('startDate')).format("LL");
  // }),
  // prettyEndDate: Ember.computed('startDate', function() {
  //   return moment(this.get('startDate')).format("LL");
  // }),
  tripLength: Ember.computed('startDate', 'endDate', function() {
    return Math.round((this.get('endDate') - this.get('startDate'))/(1000 * 60 * 60 * 24));
  }),
  // invitations: attr(),
  // users: hasMany('user')
});
