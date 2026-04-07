import { describe, it, expectTypeOf } from 'vitest';
import { DeepReadonly, PickedByType, EventHandlers } from './main';

describe('Lab 6: Type Testing', () => {

  it('DeepReadonly should make nested properties readonly', () => {
    type Simple = { a: number; b: { c: string } };
    type Expected = { readonly a: number; readonly b: { readonly c: string } };

    expectTypeOf<DeepReadonly<Simple>>().toEqualTypeOf<Expected>();
    
    // Проверка на невозможность записи (на уровне типов)
    type ReadonlyObj = DeepReadonly<{ x: { y: number } }>;
    expectTypeOf<ReadonlyObj['x']>().branded.toEqualTypeOf<{ readonly y: number }>();
  });

  it('PickedByType should filter properties by their value type', () => {
    interface User {
      id: number;
      name: string;
      age: number;
      isAdmin: boolean;
    }

    type OnlyNumbers = PickedByType<User, number>;
    expectTypeOf<OnlyNumbers>().toEqualTypeOf<{ id: number; age: number }>();

    type OnlyStrings = PickedByType<User, string>;
    expectTypeOf<OnlyStrings>().toEqualTypeOf<{ name: string }>();
  });

  it('EventHandlers should transform keys to onEventName format', () => {
    interface Events {
      click: (e: MouseEvent) => void;
      focus: (e: FocusEvent) => void;
      change: (e: Event) => void;
    }

    type Handlers = EventHandlers<Events>;

    expectTypeOf<Handlers>().toEqualTypeOf<{
      onClick: (e: MouseEvent) => void;
      onFocus: (e: FocusEvent) => void;
      onChange: (e: Event) => void;
    }>();
  });

});