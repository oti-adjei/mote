/**
 * Vue 3 binding for Mote. Written as a render function rather than an SFC so
 * the package needs no Vue compiler at build time and stays a plain .ts
 * dependency for consumers.
 *
 * Mirrors @usemote/react exactly: same prop names, same SSR-renders-frame-0
 * approach, same structural-vs-live prop split. One engine, one mental model.
 */
import {
  createField,
  renderFieldHTML,
  type FieldHandle,
  type FieldOptions,
} from '@usemote/core';
import {
  computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch,
  type PropType,
} from 'vue';

export const FloatingField = defineComponent({
  name: 'FloatingField',

  props: {
    mode: { type: [String, Object] as PropType<FieldOptions['mode']>, default: undefined },
    set: { type: String as PropType<FieldOptions['set']>, default: undefined },
    shapes: { type: [String, Array] as PropType<FieldOptions['shapes']>, default: undefined },
    packs: { type: Array as PropType<FieldOptions['packs']>, default: undefined },
    count: { type: Number, default: undefined },
    size: { type: Number, default: undefined },
    seed: { type: [Number, String] as PropType<FieldOptions['seed']>, default: undefined },
    theme: { type: [String, Array] as PropType<FieldOptions['theme']>, default: undefined },
    depth: { type: Boolean, default: undefined },
    avoid: { type: [String, Object] as PropType<FieldOptions['avoid']>, default: undefined },
    speed: { type: Number, default: undefined },
    interactive: { type: Boolean, default: undefined },
    direction: { type: String as PropType<FieldOptions['direction']>, default: undefined },
    paused: { type: Boolean, default: undefined },
    ssrWidth: { type: Number, default: 1200 },
    ssrHeight: { type: Number, default: 600 },
  },

  setup(props) {
    const el = ref<HTMLDivElement | null>(null);
    let handle: FieldHandle | null = null;

    /** Only the keys the user actually set, so core's defaults still apply. */
    const options = (): FieldOptions => {
      const o: FieldOptions = {};
      if (props.mode !== undefined) o.mode = props.mode;
      if (props.set !== undefined) o.set = props.set;
      if (props.shapes !== undefined) o.shapes = props.shapes;
      if (props.packs !== undefined) o.packs = props.packs;
      if (props.count !== undefined) o.count = props.count;
      if (props.size !== undefined) o.size = props.size;
      if (props.seed !== undefined) o.seed = props.seed;
      if (props.theme !== undefined) o.theme = props.theme;
      if (props.depth !== undefined) o.depth = props.depth;
      if (props.avoid !== undefined) o.avoid = props.avoid;
      if (props.speed !== undefined) o.speed = props.speed;
      if (props.interactive !== undefined) o.interactive = props.interactive;
      if (props.direction !== undefined) o.direction = props.direction;
      if (props.paused !== undefined) o.paused = props.paused;
      return o;
    };

    // Content-keyed, not identity-keyed: an inline packs/shapes/theme literal
    // is a new object every render and would otherwise rebuild the field.
    const poolKey = computed(() =>
      JSON.stringify([
        props.packs?.map((p) => `${p.id}@${p.version}`) ?? null,
        props.shapes ?? null,
        props.theme ?? null,
      ]),
    );

    const ssrHTML = computed(() =>
      renderFieldHTML({ ...options(), width: props.ssrWidth, height: props.ssrHeight }),
    );

    const rebuild = (): void => {
      if (!el.value) return;
      handle?.destroy();
      handle = createField(el.value, options());
    };

    onMounted(rebuild);
    onBeforeUnmount(() => {
      handle?.destroy();
      handle = null;
    });

    watch(
      () => [
        poolKey.value, props.seed, props.count, props.size,
        props.set, props.depth, props.direction,
        typeof props.mode === 'object' ? 'custom' : props.mode,
      ],
      rebuild,
    );

    watch(
      () => [props.speed, props.interactive, props.avoid, props.paused],
      () => {
        const live: Partial<FieldOptions> = {};
        if (props.speed !== undefined) live.speed = props.speed;
        if (props.interactive !== undefined) live.interactive = props.interactive;
        if (props.avoid !== undefined) live.avoid = props.avoid;
        if (props.paused !== undefined) live.paused = props.paused;
        handle?.update(live);
      },
    );

    return () =>
      h('div', {
        ref: el,
        'aria-hidden': 'true',
        style: {
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        },
        innerHTML: ssrHTML.value,
      });
  },
});

export default FloatingField;
