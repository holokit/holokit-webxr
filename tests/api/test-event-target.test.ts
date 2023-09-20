// SPDX-FileCopyrightText: Copyright 2023 Holo Interactive <dev@holoi.com>
// SPDX-FileContributor: Botao Amber Hu <botao@holoi.com>
// SPDX-License-Identifier: MIT

class MockEventTarget extends EventTarget {}

class MockEvent extends Event {
  value: string = "";
  constructor() {
    super();
  }
}

describe('API - EventTarget', () => {

  test('binds events via addEventListener', () => {
    const c = new MockEventTarget();
    const events: string[] = [];

    c.addEventListener('click', ({ value }: MockEvent) => { events.push(`${value}-1`) } );
    c.addEventListener('click', ({ value }: MockEvent) => { events.push(`${value}-2`) } );
    c.addEventListener('scroll', ({ value }: MockEvent) => { events.push(value) } );

    c.dispatchEvent('click', { value: 'hello' }: MockEvent);
    assert.deepEqual(events, ['hello-1', 'hello-2']);

    c.dispatchEvent('scroll', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2', 'hello']);
  });

  it('removes events via removeEventListener', () => {
    const c = new ChildTarget();
    const events = [];
    const c1 = ({ value }) => events.push(`${value}-1`);
    const c2 = ({ value }) => events.push(`${value}-2`);
    c.addEventListener('click', c1);
    c.addEventListener('click', c2);

    c.dispatchEvent('click', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2']);

    c.removeEventListener('click', c2);
    c.dispatchEvent('click', { value: 'world' });
    assert.deepEqual(events, ['hello-1', 'hello-2', 'world-1']);

    c.removeEventListener('click', c1);
    c.dispatchEvent('click', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2', 'world-1']);
  });

  it('fires handlers stored as `on${type}` attributes', () => {
    const c = new ChildTarget();
    const events: string[] = [];
    const c1 = ({ value }) => { events.push(`${value}-1`) };
    const c2 = ({ value }) => { events.push(`${value}-2`) };
    c.addEventListener('click', c1);
    c.onclick = c2;
    c.dispatchEvent('click', { value: 'hello' });
    assert.deepEqual(events, ['hello-1', 'hello-2']);
  });

});
