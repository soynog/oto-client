import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),

  user: Ember.computed.alias('auth.credentials.email'),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),


  actions: {
    signOut () {
      this.sendAction('signOut');
    },
    signIn (credentials) {
      this.sendAction('signIn', credentials);
    },
    signUp (credentials) {
      this.sendAction('signUp', credentials);
    },
    home () {
      this.sendAction('home');
    },
    changePW (passwords) {
      this.sendAction('changePW', passwords);
    }
  },
});
