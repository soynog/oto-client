import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('trip-details/trip-header', 'Integration | Component | trip details/trip header', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{trip-details/trip-header}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#trip-details/trip-header}}
      template block text
    {{/trip-details/trip-header}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
