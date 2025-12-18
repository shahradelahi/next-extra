import { describe, expect, it } from 'vitest';

import { createAction } from '@/action';

describe('Action', () => {
  describe('Errors', () => {
    it('should throw on error', async () => {
      const action = createAction((name: string) => {
        if (name === 'foo') {
          throw new Error('foo');
        }
        return name;
      });
      try {
        expect(await action('bar')).property('data', 'bar');
        await action('foo');
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(Error);
        expect(e).have.property('name', 'Error');
        expect(e).have.property('message', 'foo');
      }
    });

    it('should use reject and resolve', async () => {
      const action = createAction(function (name: string) {
        if (name === 'foo') {
          this.reject({ code: 'foo', message: 'foo' });
        }
        if (name === 'poo') {
          throw new Error('NOt tHe PoO!');
        }
        this.resolve(name);
      });
      try {
        expect(await action('bar')).property('data', 'bar');
        expect(await action('foo'))
          .property('error')
          .deep.eq({ code: 'foo', message: 'foo' });
        await action('poo');
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(Error);
        expect(e).have.property('name', 'Error');
        expect(e).have.property('message', 'NOt tHe PoO!');
      }
    });
  });
});
