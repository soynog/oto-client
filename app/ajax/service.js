import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  auth: Ember.inject.service(),
  host: 'https://oto-api.herokuapp.com',
  headers: Ember.computed('auth.credentials.token', {
    get() {
      let headers = {};
      const token = this.get('auth.credentials.token');
      if (token) {
        headers['Authorization'] = `Token token=${token}`;
      }
      return headers;
    }
  })
});
