import { expect } from 'chai';

import { createAction } from '@/action';

describe('Action', () => {
  describe('Errors', () => {
    const action = createAction((name: string) => {
      if (name === 'foo') {
        throw new Error('foo');
      }
      return name;
    });

    it('should throw on error', async () => {
      try {
        await action('foo');
        expect(true).to.be.false;
      } catch (e) {
        expect(e).to.be.instanceOf(Error).property('message', 'foo');
      }
    });
  });
});
